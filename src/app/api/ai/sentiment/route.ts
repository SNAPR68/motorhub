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

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { leadId } = body;

    if (!leadId) {
      return NextResponse.json({ error: "leadId is required" }, { status: 400 });
    }

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

    // Fallback when no OpenAI key
    if (!OPENAI_API_KEY) {
      const msgCount = lead.messages.length;
      const sentiment = msgCount >= 5 ? "HOT" : msgCount >= 2 ? "WARM" : "COOL";
      return NextResponse.json({
        sentiment,
        confidence: 60,
        reasoning: `Based on ${msgCount} message(s) exchanged. AI analysis unavailable.`,
        suggestedAction: sentiment === "HOT" ? "Schedule a test drive immediately." : sentiment === "WARM" ? "Follow up with a personalized offer." : "Send an introductory message with top picks.",
        generated: false,
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "AI analysis failed" }, { status: 502 });
    }

    const json = await response.json();
    const raw = json.choices?.[0]?.message?.content?.trim() ?? "";

    try {
      const jsonStr = raw.replace(/```json?\s*/g, "").replace(/```/g, "").trim();
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
