/* Autovinci — Agent Actions
 * Individual autonomous actions triggered by the event processor.
 * Each action is self-contained: reads state, makes decisions, writes results.
 */

import { db } from "@/lib/db";
import { emitEvent } from "@/lib/events";
import { withCircuitBreaker } from "@/lib/ai-circuit-breaker";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function chatCompletion(
  messages: Array<{ role: string; content: string }>,
  opts?: { responseFormat?: "json_object"; maxTokens?: number }
): Promise<string | null> {
  if (!OPENAI_API_KEY) return null;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      ...(opts?.responseFormat ? { response_format: { type: opts.responseFormat } } : {}),
      max_tokens: opts?.maxTokens ?? 150,
    }),
  });
  if (!res.ok) throw new Error(`OpenAI request failed: ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || null;
}

// ── Auto-Analyze Sentiment ──

export async function autoAnalyzeSentiment(leadId: string, dealerProfileId: string): Promise<void> {
  const lead = await db.lead.findUnique({
    where: { id: leadId },
    include: { messages: { orderBy: { createdAt: "desc" }, take: 10 }, vehicle: { select: { name: true, priceDisplay: true } } },
  });
  if (!lead) return;

  // Skip if already analyzed (has non-default sentiment)
  if (lead.sentimentLabel !== "COOL" || lead.sentiment > 0) return;

  let label: "HOT" | "WARM" | "COOL" = "COOL";
  let confidence = 60;

  const aiResult = OPENAI_API_KEY
    ? await withCircuitBreaker("openai", async () => {
        const content = await chatCompletion(
          [
            { role: "system", content: "Classify this car buyer lead as HOT, WARM, or COOL. HOT = ready to buy within a week. WARM = interested but comparing. COOL = browsing. Respond with JSON: {\"label\":\"HOT|WARM|COOL\",\"confidence\":60-99}" },
            { role: "user", content: `Buyer: ${lead.buyerName}\nVehicle: ${lead.vehicle?.name || "unknown"}\nMessage: ${lead.message || "none"}\nSource: ${lead.source}\nMessages: ${lead.messages.length}` },
          ],
          { responseFormat: "json_object", maxTokens: 50 }
        );
        return JSON.parse(content || "{}");
      })
    : null;

  if (aiResult) {
    label = (["HOT", "WARM", "COOL"].includes(aiResult.label) ? aiResult.label : "COOL") as typeof label;
    confidence = typeof aiResult.confidence === "number" ? aiResult.confidence : 60;
  } else {
    // Rule-based fallback
    if (lead.messages.length >= 3) label = "HOT";
    else if (lead.messages.length >= 1 || lead.message) label = "WARM";
  }

  await db.lead.update({
    where: { id: leadId },
    data: { sentimentLabel: label, sentiment: confidence },
  });

  emitEvent({
    type: "SENTIMENT_ANALYZED",
    entityType: "Lead",
    entityId: leadId,
    dealerProfileId,
    metadata: { label, confidence, source: aiResult ? "AI" : "RULE" },
  });
}

// ── Auto-Reply to New Lead ──

export async function autoReplyToLead(leadId: string, dealerProfileId: string): Promise<void> {
  // Check if dealer has auto-reply enabled
  const prefs = await db.dealerPreference.findUnique({
    where: { dealerProfileId },
  });
  const automation = (prefs?.automation as Record<string, boolean>) ?? {};
  if (!automation.autoReply) return; // opt-in only

  const lead = await db.lead.findUnique({
    where: { id: leadId },
    include: {
      vehicle: { select: { name: true, priceDisplay: true } },
      dealerProfile: { select: { dealershipName: true } },
      messages: { take: 1 },
    },
  });
  if (!lead || lead.messages.length > 0) return; // already has messages

  let replyText: string;

  const aiReply = OPENAI_API_KEY
    ? await withCircuitBreaker("openai", async () => {
        return chatCompletion(
          [
            { role: "system", content: `You are a helpful assistant for ${lead.dealerProfile?.dealershipName || "an auto dealer"}. Write a warm, professional first reply to a buyer inquiry about a used car. Keep it under 100 words. Be conversational, not salesy.` },
            { role: "user", content: `Buyer: ${lead.buyerName}\nVehicle interest: ${lead.vehicle?.name || "general"} (${lead.vehicle?.priceDisplay || ""})\nTheir message: ${lead.message || "No message, just an inquiry"}\nSource: ${lead.source}` },
          ],
          { maxTokens: 150 }
        );
      })
    : null;

  if (aiReply) {
    replyText = aiReply;
  } else {
    // Hardcoded fallback
    const vehicleName = lead.vehicle?.name || "your vehicle of interest";
    replyText = `Hi ${lead.buyerName}! Thank you for your interest in the ${vehicleName}. I'd be happy to share more details and arrange a viewing at your convenience. When would be a good time to connect?`;
  }

  await db.leadMessage.create({
    data: {
      leadId,
      role: "AI",
      text: replyText,
      type: "AUTO",
    },
  });

  emitEvent({
    type: "AUTO_REPLY_SENT",
    entityType: "Lead",
    entityId: leadId,
    dealerProfileId,
    metadata: { source: aiReply ? "AI" : "TEMPLATE" },
  });
}

// ── Notify Dealer on HOT Lead ──

export async function notifyHotLead(leadId: string, dealerProfileId: string): Promise<void> {
  const lead = await db.lead.findUnique({
    where: { id: leadId },
    include: { vehicle: { select: { name: true } }, dealerProfile: { select: { userId: true } } },
  });
  if (!lead?.dealerProfile) return;

  await db.notification.create({
    data: {
      userId: lead.dealerProfile.userId,
      title: "Hot Lead Alert",
      message: `${lead.buyerName} is a HOT lead${lead.vehicle ? ` for ${lead.vehicle.name}` : ""}. Respond quickly to close the deal.`,
      type: "LEAD",
    },
  });
}

// ── Check Trending Vehicle ──

export async function checkTrendingVehicle(vehicleId: string): Promise<void> {
  const wishlistCount = await db.wishlist.count({ where: { vehicleId } });

  if (wishlistCount >= 3) {
    const vehicle = await db.vehicle.findUnique({ where: { id: vehicleId }, select: { badge: true, dealerProfileId: true } });
    if (vehicle && vehicle.badge !== "Trending" && vehicle.badge !== "Featured") {
      await db.vehicle.update({
        where: { id: vehicleId },
        data: { badge: "Trending" },
      });

      emitEvent({
        type: "TRENDING_BADGE_SET",
        entityType: "Vehicle",
        entityId: vehicleId,
        dealerProfileId: vehicle.dealerProfileId,
        metadata: { wishlistCount },
      });
    }
  }
}

// ── Warn About Unresponsive Leads ──

export async function warnUnresponsiveLeads(dealerProfileId: string): Promise<void> {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const unresponsiveLeads = await db.lead.findMany({
    where: {
      dealerProfileId,
      status: "NEW",
      createdAt: { lt: oneDayAgo },
      messages: { none: {} },
    },
    select: { id: true },
  });

  if (unresponsiveLeads.length >= 5) {
    const dealer = await db.dealerProfile.findUnique({
      where: { id: dealerProfileId },
      select: { userId: true },
    });
    if (!dealer) return;

    await db.notification.create({
      data: {
        userId: dealer.userId,
        title: "Unresponsive Leads Warning",
        message: `You have ${unresponsiveLeads.length} leads with no response for over 24 hours. Quick responses increase conversion by 3x.`,
        type: "SYSTEM",
      },
    });
  }
}
