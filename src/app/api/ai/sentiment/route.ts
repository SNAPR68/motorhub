/* POST /api/ai/sentiment
 * AI-powered lead sentiment analysis using OpenAI.
 * Body: { leadId } — fetches lead + messages from DB and analyzes sentiment.
 * Returns: { sentiment, confidence, reasoning, suggestedAction }
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { emitEvent } from "@/lib/events";
import { handleApiError } from "@/lib/api-error";
import { aiRequest } from "@/lib/ai-router";
import { parseBody, aiSentimentSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = await parseBody(request, aiSentimentSchema);
    if (parsed.error) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    const { leadId } = parsed.data!;

    // Fetch lead + messages
    const lead = await db.lead.findUnique({
      where: { id: leadId },
      include: {
        messages: { orderBy: { createdAt: "asc" }, take: 20 },
        vehicle: { select: { name: true, priceDisplay: true } },
      },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const messageHistory = lead.messages
      .map((m) => `[${m.type === "AUTO" ? "AI" : "Dealer"}]: ${m.text}`)
      .join("\n");

    const prompt = `You are an expert automotive sales analyst. Analyze this lead conversation and determine buyer intent/sentiment.

Lead Info:
- Buyer: ${lead.buyerName}
- Source: ${lead.source}
- Vehicle Interest: ${lead.vehicle?.name || "General inquiry"}
- Price: ${lead.vehicle?.priceDisplay || "Not specified"}
- Budget: ${lead.budget || "Not specified"}
- Current Status: ${lead.status}
- Messages exchanged: ${lead.messages.length}

Conversation:
${messageHistory || "(No messages yet)"}

Analyze the sentiment and respond with ONLY a JSON object (no markdown):
{
  "sentiment": "HOT",
  "confidence": 85,
  "reasoning": "Brief 1-sentence explanation",
  "suggestedAction": "Brief 1-sentence next step recommendation"
}

Rules:
- "HOT" = Ready to buy within 7 days, high engagement, asking about test drive/price/availability
- "WARM" = Interested but exploring options, comparing cars, asking general questions
- "COOL" = Early research, not ready to buy, unresponsive, or price-sensitive
- confidence: 0-100 (how confident are you in this assessment)`;

    const msgCount = lead.messages.length;

    const result = await aiRequest({
      messages: [{ role: "user", content: prompt }],
      complexity: "MODERATE",
      responseFormat: "json_object",
      maxTokens: 200,
    });

    if (!result.content) {
      // Fallback when AI unavailable
      const sentiment = msgCount >= 5 ? "HOT" : msgCount >= 2 ? "WARM" : "COOL";
      return NextResponse.json({
        sentiment,
        confidence: 60,
        reasoning: `Based on ${msgCount} message(s) exchanged. AI analysis unavailable.`,
        suggestedAction: sentiment === "HOT" ? "Schedule a test drive immediately." : sentiment === "WARM" ? "Follow up with a personalized offer." : "Send an introductory message with top picks.",
        generated: false,
      });
    }

    try {
      const jsonStr = result.content.replace(/```json?\s*/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(jsonStr);

      // Auto-update the lead sentiment in DB
      const validSentiments = ["HOT", "WARM", "COOL"];
      if (validSentiments.includes(parsed.sentiment)) {
        await db.lead.update({
          where: { id: leadId },
          data: { sentimentLabel: parsed.sentiment },
        });

        emitEvent({
          type: "SENTIMENT_ANALYZED",
          entityType: "Lead",
          entityId: leadId,
          userId: user.id,
          metadata: { label: parsed.sentiment, confidence: parsed.confidence, source: "AI" },
        });
      }

      return NextResponse.json({ ...parsed, generated: true });
    } catch {
      return NextResponse.json({
        sentiment: "WARM",
        confidence: 50,
        reasoning: "Could not parse AI response. Default to WARM.",
        suggestedAction: "Follow up with a personalized message.",
        generated: false,
      });
    }
  } catch (error) {
    return handleApiError(error, "POST /api/ai/sentiment");
  }
}
