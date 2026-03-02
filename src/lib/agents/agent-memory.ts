/* Autovinci — Agent Memory System
 * Tracks which auto-reply templates got buyer responses per dealer.
 * Adapts future auto-replies based on what works best.
 * Implements Thompson Sampling (A/B testing) for template selection.
 */

import { db } from "@/lib/db";

const DEFAULT_TEMPLATES: Record<string, string[]> = {
  auto_reply: ["warm_greeting", "price_inquiry", "test_drive_offer", "availability_check"],
  follow_up_3day: ["gentle_reminder", "new_info_share", "comparison_help"],
  follow_up_7day: ["last_chance", "price_update", "alternative_suggest"],
};

/** Minimum sends before a template can be considered "proven" */
const MIN_SAMPLES = 8;
/** Exploration probability for under-tested templates */
const EXPLORATION_RATE = 0.15;

/**
 * Thompson Sampling: draw from Beta(successes+1, failures+1) for each template.
 * Returns the template whose sampled probability is highest.
 * This naturally balances exploration/exploitation without manual tuning.
 */
function thompsonSample(
  memories: Array<{ templateKey: string; sentCount: number; responseCount: number; responseRate: number }>
): string {
  let bestKey = memories[0].templateKey;
  let bestSample = -1;

  for (const m of memories) {
    const alpha = m.responseCount + 1; // successes + 1
    const beta = (m.sentCount - m.responseCount) + 1; // failures + 1
    // Approximate Beta distribution sample using Jitter method
    const sample = betaSample(alpha, beta);
    if (sample > bestSample) {
      bestSample = sample;
      bestKey = m.templateKey;
    }
  }

  return bestKey;
}

/** Approximate sample from Beta(a,b) using gamma variates */
function betaSample(alpha: number, beta: number): number {
  const x = gammaSample(alpha);
  const y = gammaSample(beta);
  return x / (x + y);
}

/** Approximate gamma(shape) sample via Marsaglia-Tsang method (shape >= 1) */
function gammaSample(shape: number): number {
  if (shape < 1) {
    return gammaSample(shape + 1) * Math.pow(Math.random(), 1 / shape);
  }
  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  // eslint-disable-next-line no-constant-condition
  while (true) {
    let x: number, v: number;
    do {
      x = normalSample();
      v = 1 + c * x;
    } while (v <= 0);
    v = v * v * v;
    const u = Math.random();
    if (u < 1 - 0.0331 * x * x * x * x) return d * v;
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
  }
}

/** Standard normal sample via Box-Muller */
function normalSample(): number {
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

/** Get the most effective template for a dealer in a category (A/B tested) */
export async function getEffectiveTemplate(
  dealerProfileId: string,
  category: string
): Promise<string | null> {
  const memories = await db.agentMemory.findMany({
    where: { dealerProfileId, category },
    orderBy: { responseRate: "desc" },
  });

  const templates = DEFAULT_TEMPLATES[category] ?? [];

  // If no memories yet, return first template to start gathering data
  if (memories.length === 0) return templates[0] || null;

  // Force-explore: if any template in the pool hasn't been tried, try it (15% chance)
  const usedKeys = new Set(memories.map((m) => m.templateKey));
  const unused = templates.filter((t) => !usedKeys.has(t));
  if (unused.length > 0 && Math.random() < EXPLORATION_RATE) {
    return unused[0];
  }

  // Force-explore: if any template has < MIN_SAMPLES, occasionally try it
  const underTested = memories.filter((m) => m.sentCount < MIN_SAMPLES);
  if (underTested.length > 0 && Math.random() < EXPLORATION_RATE) {
    return underTested[Math.floor(Math.random() * underTested.length)].templateKey;
  }

  // Thompson Sampling: statistically pick the best template
  return thompsonSample(memories);
}

/** Get A/B test report for a dealer showing all template performance */
export async function getABTestReport(
  dealerProfileId: string
): Promise<Record<string, Array<{ template: string; sent: number; responses: number; rate: number; isWinner: boolean }>>> {
  const memories = await db.agentMemory.findMany({
    where: { dealerProfileId },
    orderBy: [{ category: "asc" }, { responseRate: "desc" }],
  });

  const report: Record<string, Array<{ template: string; sent: number; responses: number; rate: number; isWinner: boolean }>> = {};

  for (const m of memories) {
    if (!report[m.category]) report[m.category] = [];
    report[m.category].push({
      template: m.templateKey,
      sent: m.sentCount,
      responses: m.responseCount,
      rate: Math.round(m.responseRate * 100),
      isWinner: false,
    });
  }

  // Mark winner per category (highest rate with enough samples)
  for (const cat of Object.keys(report)) {
    const proven = report[cat].filter((t) => t.sent >= MIN_SAMPLES);
    if (proven.length > 0) {
      proven.sort((a, b) => b.rate - a.rate);
      proven[0].isWinner = true;
    }
  }

  return report;
}

/** Record that a template was sent */
export async function recordSent(
  dealerProfileId: string,
  category: string,
  templateKey: string
): Promise<void> {
  await db.agentMemory.upsert({
    where: {
      dealerProfileId_category_templateKey: { dealerProfileId, category, templateKey },
    },
    create: {
      dealerProfileId,
      category,
      templateKey,
      sentCount: 1,
    },
    update: {
      sentCount: { increment: 1 },
      lastUsed: new Date(),
    },
  });
}

/** Record that a buyer responded to a template (called when USER message arrives) */
export async function recordResponse(
  dealerProfileId: string,
  leadId: string
): Promise<void> {
  // Find the most recent AUTO message for this lead to determine which template was used
  const lastAutoMessage = await db.leadMessage.findFirst({
    where: { leadId, type: "AUTO", role: "AI" },
    orderBy: { createdAt: "desc" },
  });
  if (!lastAutoMessage) return;

  // Check if the response was within 24h of the auto message
  const messages = await db.leadMessage.findMany({
    where: { leadId, role: "USER", createdAt: { gt: lastAutoMessage.createdAt } },
    take: 1,
  });
  if (messages.length === 0) return;

  const timeDiff = messages[0].createdAt.getTime() - lastAutoMessage.createdAt.getTime();
  if (timeDiff > 24 * 60 * 60 * 1000) return; // only count responses within 24h

  // Find the follow-up schedule to determine which template was used
  const followUp = await db.followUpSchedule.findFirst({
    where: { leadId, status: "SENT" },
    orderBy: { sentAt: "desc" },
  });

  const category = followUp
    ? followUp.step === "THREE_DAY" ? "follow_up_3day" : "follow_up_7day"
    : "auto_reply";

  // Find the memory record and increment response count
  const memories = await db.agentMemory.findMany({
    where: { dealerProfileId, category },
    orderBy: { lastUsed: "desc" },
    take: 1,
  });

  if (memories.length > 0) {
    const mem = memories[0];
    const newResponseCount = mem.responseCount + 1;
    const newRate = mem.sentCount > 0 ? newResponseCount / mem.sentCount : 0;
    await db.agentMemory.update({
      where: { id: mem.id },
      data: { responseCount: newResponseCount, responseRate: newRate },
    });
  }
}
