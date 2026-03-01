/* Autovinci — Buyer Intent Signal Extraction
 * Rule-based keyword extraction from lead conversations.
 * Accumulated intelligence that deepens with each message.
 * No AI call needed — fast, deterministic, and always available.
 */

interface IntentSignal {
  category: string;
  keyword: string;
  count: number;
  urgency: "high" | "medium" | "low";
}

const SIGNAL_PATTERNS: Array<{ category: string; keywords: string[]; urgency: "high" | "medium" | "low" }> = [
  // Purchase readiness
  { category: "Ready to Buy", keywords: ["ready to buy", "want to buy", "finalize", "close the deal", "book now", "when can i pick up", "delivery date"], urgency: "high" },
  { category: "Price Negotiation", keywords: ["best price", "discount", "negotiate", "lower price", "final offer", "budget is", "can you do", "too expensive", "overpriced"], urgency: "high" },
  { category: "Finance Interest", keywords: ["emi", "loan", "finance", "monthly payment", "down payment", "interest rate", "credit"], urgency: "medium" },
  { category: "Comparison Shopping", keywords: ["cardekho", "cars24", "olx", "spinny", "other dealer", "comparing", "better deal", "cheaper elsewhere"], urgency: "medium" },
  { category: "Test Drive", keywords: ["test drive", "see the car", "inspect", "visit", "come to showroom", "viewing", "check the car"], urgency: "medium" },
  { category: "Documentation", keywords: ["rc transfer", "insurance", "registration", "documents", "noc", "rto", "challan"], urgency: "low" },
  { category: "Vehicle Concern", keywords: ["accident", "scratch", "dent", "service history", "repair", "problem", "issue", "defect", "damage"], urgency: "medium" },
  { category: "Urgency", keywords: ["urgent", "asap", "today", "tomorrow", "this week", "immediately", "quickly", "hurry"], urgency: "high" },
  { category: "Exchange Interest", keywords: ["exchange", "trade in", "swap", "my old car", "part exchange", "current car"], urgency: "medium" },
];

export function extractIntentSignals(messages: Array<{ text: string; role: string }>): {
  signals: IntentSignal[];
  buyerReadiness: "high" | "medium" | "low";
  summary: string;
} {
  const buyerMessages = messages
    .filter((m) => m.role === "USER" || m.role === "SYSTEM")
    .map((m) => m.text.toLowerCase());

  const allText = buyerMessages.join(" ");
  const signals: IntentSignal[] = [];

  for (const pattern of SIGNAL_PATTERNS) {
    let totalCount = 0;
    const matchedKeywords: string[] = [];

    for (const keyword of pattern.keywords) {
      const regex = new RegExp(keyword, "gi");
      const matches = allText.match(regex);
      if (matches) {
        totalCount += matches.length;
        if (!matchedKeywords.includes(keyword)) matchedKeywords.push(keyword);
      }
    }

    if (totalCount > 0) {
      signals.push({
        category: pattern.category,
        keyword: matchedKeywords.join(", "),
        count: totalCount,
        urgency: pattern.urgency,
      });
    }
  }

  // Sort by urgency then count
  const urgencyOrder = { high: 0, medium: 1, low: 2 };
  signals.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency] || b.count - a.count);

  // Determine overall buyer readiness
  const highSignals = signals.filter((s) => s.urgency === "high").reduce((sum, s) => sum + s.count, 0);
  const mediumSignals = signals.filter((s) => s.urgency === "medium").reduce((sum, s) => sum + s.count, 0);

  let buyerReadiness: "high" | "medium" | "low" = "low";
  if (highSignals >= 3 || (highSignals >= 1 && mediumSignals >= 3)) buyerReadiness = "high";
  else if (highSignals >= 1 || mediumSignals >= 2) buyerReadiness = "medium";

  // Generate summary
  const topSignals = signals.slice(0, 3).map((s) => s.category).join(", ");
  const summary = signals.length > 0
    ? `Buyer shows ${buyerReadiness} readiness. Key signals: ${topSignals}. ${buyerMessages.length} messages analyzed.`
    : `No intent signals detected from ${buyerMessages.length} messages.`;

  return { signals, buyerReadiness, summary };
}
