/* CaroBest — Multi-Step Follow-Up Agent
 * Manages scheduled follow-up sequences: first reply -> 3-day -> 7-day.
 * Called by event processor and nightly cron.
 */

import { db } from "@/lib/db";
import { emitEvent } from "@/lib/events";
import { aiRequest } from "@/lib/ai-router";
import { getEffectiveTemplate } from "./agent-memory";

/** Schedule the full follow-up sequence for a new lead */
export async function scheduleFollowUps(leadId: string, dealerProfileId: string): Promise<void> {
  const prefs = await db.dealerPreference.findUnique({ where: { dealerProfileId } });
  const automation = (prefs?.automation as Record<string, boolean>) ?? {};
  if (!automation.autoFollowUp && !automation.autoReply) return;

  const now = new Date();
  const threeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const sevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Schedule 3-day and 7-day follow-ups (first reply handled by autoReplyToLead)
  await db.followUpSchedule.createMany({
    data: [
      { leadId, dealerProfileId, step: "THREE_DAY", scheduledAt: threeDays },
      { leadId, dealerProfileId, step: "SEVEN_DAY", scheduledAt: sevenDays },
    ],
    skipDuplicates: true,
  });
}

/** Execute all due follow-ups (called by nightly cron) */
export async function executeDueFollowUps(): Promise<{ sent: number; skipped: number; errors: number }> {
  const results = { sent: 0, skipped: 0, errors: 0 };
  const now = new Date();

  const dueFollowUps = await db.followUpSchedule.findMany({
    where: {
      status: "SCHEDULED",
      scheduledAt: { lte: now },
    },
    take: 50, // batch limit
  });

  for (const followUp of dueFollowUps) {
    try {
      const lead = await db.lead.findUnique({
        where: { id: followUp.leadId },
        include: {
          vehicle: { select: { name: true, priceDisplay: true } },
          dealerProfile: { select: { dealershipName: true } },
          messages: { orderBy: { createdAt: "desc" }, take: 5 },
        },
      });

      if (!lead) {
        await db.followUpSchedule.update({ where: { id: followUp.id }, data: { status: "CANCELLED" } });
        results.skipped++;
        continue;
      }

      // Skip if lead is already closed or buyer has responded recently
      if (lead.status === "CLOSED_WON" || lead.status === "CLOSED_LOST") {
        await db.followUpSchedule.update({ where: { id: followUp.id }, data: { status: "CANCELLED" } });
        results.skipped++;
        continue;
      }

      // Skip if buyer responded in the last message (conversation is active)
      const lastMessage = lead.messages[0];
      if (lastMessage?.role === "USER") {
        await db.followUpSchedule.update({ where: { id: followUp.id }, data: { status: "SKIPPED" } });
        results.skipped++;
        continue;
      }

      // Get effective template from agent memory
      const category = followUp.step === "THREE_DAY" ? "follow_up_3day" : "follow_up_7day";
      const template = await getEffectiveTemplate(followUp.dealerProfileId, category);

      // Generate follow-up message
      const vehicleName = lead.vehicle?.name || "the vehicle";
      const dealerName = lead.dealerProfile?.dealershipName || "our dealership";

      let messageText: string;

      const prompt = followUp.step === "THREE_DAY"
        ? `Write a friendly 3-day follow-up message from ${dealerName} to ${lead.buyerName} about ${vehicleName} (${lead.vehicle?.priceDisplay || ""}). They inquired earlier but haven't responded. Keep under 80 words, casual but professional. ${template ? `Use this style: ${template}` : ""}`
        : `Write a warm 7-day final follow-up from ${dealerName} to ${lead.buyerName} about ${vehicleName}. Mention you're still available and maybe offer a viewing. Last chance — keep under 80 words. ${template ? `Use this style: ${template}` : ""}`;
      const followUpResponse = await aiRequest({
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: `Previous messages: ${lead.messages.length}` },
        ],
        complexity: "MODERATE",
        maxTokens: 120,
      });
      const aiMessage = followUpResponse.content;

      if (aiMessage) {
        messageText = aiMessage;
      } else {
        // Fallback templates
        messageText = followUp.step === "THREE_DAY"
          ? `Hi ${lead.buyerName}! Just checking in about the ${vehicleName}. It's still available and we'd love to help you with any questions. Would you like to schedule a viewing?`
          : `Hi ${lead.buyerName}, this is a quick follow-up about the ${vehicleName}. We haven't heard back but the offer still stands. Feel free to reach out whenever you're ready — we're here to help!`;
      }

      // Send the message
      await db.leadMessage.create({
        data: {
          leadId: followUp.leadId,
          role: "AI",
          text: messageText,
          type: "AUTO",
        },
      });

      // Mark follow-up as sent
      await db.followUpSchedule.update({
        where: { id: followUp.id },
        data: { status: "SENT", sentAt: now },
      });

      // Track in agent memory
      const { recordSent } = await import("./agent-memory");
      await recordSent(followUp.dealerProfileId, category, template || "default");

      emitEvent({
        type: "AUTO_REPLY_SENT",
        entityType: "Lead",
        entityId: followUp.leadId,
        dealerProfileId: followUp.dealerProfileId,
        metadata: { step: followUp.step, source: aiMessage ? "AI" : "TEMPLATE" },
      });

      results.sent++;
    } catch {
      results.errors++;
      // Don't mark as failed — will retry next cron run
    }
  }

  return results;
}
