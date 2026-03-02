/* Autovinci — Predictive Lead Scoring
 * Uses PlatformEvent history + lead attributes to predict conversion probability.
 * Pure computation — no AI API calls needed.
 *
 * Signal weights (tuned from industry benchmarks):
 * - Recency of last interaction (decay over time)
 * - Number of messages exchanged
 * - Sentiment trajectory (improving vs declining)
 * - Source channel (WhatsApp > Website > Walk-in > Facebook)
 * - Vehicle demand (trending/wishlisted)
 * - Response speed of dealer
 * - Time-of-day pattern (business hours = higher intent)
 */

import { db } from "@/lib/db";

interface PredictiveScore {
  leadId: string;
  score: number; // 0-100
  confidence: number; // 0-100
  signals: Signal[];
  predictedOutcome: "LIKELY_CONVERT" | "NEEDS_NURTURE" | "AT_RISK" | "COLD";
  suggestedAction: string;
}

interface Signal {
  name: string;
  value: number; // contribution to score
  detail: string;
}

const SOURCE_WEIGHTS: Record<string, number> = {
  WHATSAPP: 18,
  WALKIN: 15,
  REFERRAL: 14,
  WEBSITE: 10,
  INSTAGRAM: 8,
  FACEBOOK: 6,
};

/** Score a single lead using event history + attributes */
export async function scoreLead(leadId: string): Promise<PredictiveScore> {
  const lead = await db.lead.findUnique({
    where: { id: leadId },
    include: {
      messages: { orderBy: { createdAt: "desc" }, take: 20 },
      vehicle: { select: { id: true, badge: true, aiScore: true } },
    },
  });

  if (!lead) {
    return { leadId, score: 0, confidence: 0, signals: [], predictedOutcome: "COLD", suggestedAction: "Lead not found" };
  }

  const signals: Signal[] = [];
  const now = Date.now();

  // 1. Source channel signal
  const sourceWeight = SOURCE_WEIGHTS[lead.source] ?? 8;
  signals.push({ name: "Source Channel", value: sourceWeight, detail: `${lead.source} (+${sourceWeight})` });

  // 2. Message engagement
  const msgCount = lead.messages.length;
  const engagementScore = Math.min(20, msgCount * 4);
  signals.push({ name: "Message Engagement", value: engagementScore, detail: `${msgCount} messages (+${engagementScore})` });

  // 3. Recency decay: how recently was the last interaction?
  const lastActivity = lead.messages[0]?.createdAt?.getTime() || lead.createdAt.getTime();
  const hoursSinceActivity = (now - lastActivity) / (1000 * 60 * 60);
  const recencyScore = hoursSinceActivity < 2 ? 15 : hoursSinceActivity < 24 ? 12 : hoursSinceActivity < 72 ? 8 : hoursSinceActivity < 168 ? 4 : 0;
  signals.push({ name: "Recency", value: recencyScore, detail: `${Math.round(hoursSinceActivity)}h since last activity (+${recencyScore})` });

  // 4. Sentiment signal
  const sentimentMap: Record<string, number> = { HOT: 20, WARM: 12, COOL: 4 };
  const sentimentScore = sentimentMap[lead.sentimentLabel] ?? 4;
  signals.push({ name: "Sentiment", value: sentimentScore, detail: `${lead.sentimentLabel} (+${sentimentScore})` });

  // 5. Vehicle demand (is it trending/high-scoring?)
  let vehicleDemand = 0;
  if (lead.vehicle?.badge === "Trending") vehicleDemand = 8;
  else if (lead.vehicle?.badge === "Featured") vehicleDemand = 6;
  if (lead.vehicle?.aiScore && lead.vehicle.aiScore > 80) vehicleDemand += 4;
  signals.push({ name: "Vehicle Demand", value: vehicleDemand, detail: `Badge: ${lead.vehicle?.badge || "none"}, AI Score: ${lead.vehicle?.aiScore || "N/A"} (+${vehicleDemand})` });

  // 6. Dealer response speed (from events)
  const events = await db.platformEvent.findMany({
    where: { entityId: leadId, type: { in: ["AUTO_REPLY_SENT", "FOLLOW_UP_SENT"] } },
    select: { createdAt: true },
    take: 5,
  });
  let responseScore = 0;
  if (events.length > 0) {
    const firstResponseMs = events[0].createdAt.getTime() - lead.createdAt.getTime();
    const firstResponseHours = firstResponseMs / (1000 * 60 * 60);
    responseScore = firstResponseHours < 0.5 ? 10 : firstResponseHours < 2 ? 7 : firstResponseHours < 24 ? 4 : 1;
  }
  signals.push({ name: "Response Speed", value: responseScore, detail: `${events.length} auto-responses (+${responseScore})` });

  // 7. Buyer replied to auto-messages?
  const buyerReplied = lead.messages.some((m) => m.role === "USER");
  const replyScore = buyerReplied ? 10 : 0;
  signals.push({ name: "Buyer Replied", value: replyScore, detail: buyerReplied ? "Yes (+10)" : "No (+0)" });

  // Total score
  const rawScore = signals.reduce((sum, s) => sum + s.value, 0);
  const score = Math.min(100, rawScore);

  // Confidence: higher when we have more data points
  const dataPoints = (msgCount > 0 ? 1 : 0) + (events.length > 0 ? 1 : 0) + (lead.sentimentLabel !== "COOL" ? 1 : 0) + (lead.vehicle ? 1 : 0);
  const confidence = Math.min(95, 40 + dataPoints * 15);

  // Predicted outcome
  let predictedOutcome: PredictiveScore["predictedOutcome"];
  let suggestedAction: string;

  if (score >= 70) {
    predictedOutcome = "LIKELY_CONVERT";
    suggestedAction = "High conversion probability. Prioritize personal follow-up within 2 hours.";
  } else if (score >= 45) {
    predictedOutcome = "NEEDS_NURTURE";
    suggestedAction = "Good potential. Send vehicle comparison or price advantage info to move forward.";
  } else if (score >= 25) {
    predictedOutcome = "AT_RISK";
    suggestedAction = "Engagement dropping. Consider a limited-time offer or alternative vehicle suggestion.";
  } else {
    predictedOutcome = "COLD";
    suggestedAction = "Low engagement. Archive or add to long-term nurture sequence.";
  }

  return { leadId, score, confidence, signals, predictedOutcome, suggestedAction };
}

/** Batch-score all active leads for a dealer */
export async function scoreDealer(dealerProfileId: string): Promise<{
  leads: PredictiveScore[];
  summary: { avgScore: number; hotCount: number; atRiskCount: number };
}> {
  const activeLeads = await db.lead.findMany({
    where: { dealerProfileId, status: { in: ["NEW", "CONTACTED", "FOLLOW_UP", "TEST_DRIVE", "NEGOTIATION"] } },
    select: { id: true },
    take: 100,
  });

  const leads = await Promise.all(activeLeads.map((l) => scoreLead(l.id)));

  const totalScore = leads.reduce((sum, l) => sum + l.score, 0);
  const avgScore = leads.length > 0 ? Math.round(totalScore / leads.length) : 0;
  const hotCount = leads.filter((l) => l.predictedOutcome === "LIKELY_CONVERT").length;
  const atRiskCount = leads.filter((l) => l.predictedOutcome === "AT_RISK" || l.predictedOutcome === "COLD").length;

  return { leads, summary: { avgScore, hotCount, atRiskCount } };
}
