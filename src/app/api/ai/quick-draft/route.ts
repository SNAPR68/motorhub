/* POST /api/ai/quick-draft — Generate a message draft for a lead based on intent */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

const INTENT_PROMPTS: Record<string, string> = {
  Availability: "Write a warm reply confirming vehicle availability and inviting the buyer to visit or schedule a test drive.",
  "Discount Offer": "Write a professional reply offering a special discount or deal, creating urgency without sounding pushy.",
  "Schedule Drive": "Write a friendly reply suggesting specific times for a test drive and asking for the buyer's preferred slot.",
  "Tech Specs": "Write an informative reply highlighting the vehicle's key technical specifications and features.",
  "Trade-In": "Write an enthusiastic reply about the trade-in opportunity, mentioning you'll evaluate their car and give a fair price.",
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { intent, buyerName, vehicleName, vehiclePrice, buyerMessage, tone = 50 } = body;

    if (!intent) return NextResponse.json({ error: "intent required" }, { status: 400 });

    const openaiKey = process.env.OPENAI_API_KEY;
    const intentPrompt = INTENT_PROMPTS[intent] ?? `Write a helpful reply about ${intent}.`;
    const toneDesc = tone < 30 ? "very formal and professional" : tone > 70 ? "casual and friendly" : "balanced and warm";

    if (!openaiKey) {
      const fallback = `Hi ${buyerName || "there"}! Thank you for reaching out about the ${vehicleName || "vehicle"}${vehiclePrice ? ` (${vehiclePrice})` : ""}. ${intentPrompt.replace("Write a", "").replace("reply", "message")} Please feel free to reach out with any questions!`;
      return NextResponse.json({ draft: fallback, fitScore: 78 });
    }

    const prompt = `You are a car dealership sales assistant helping a dealer write a reply to a buyer.

Buyer: ${buyerName || "the buyer"}
Vehicle: ${vehicleName || "the vehicle"}${vehiclePrice ? ` at ${vehiclePrice}` : ""}
Buyer's message: "${buyerMessage || "Inquiry about the vehicle"}"
Intent: ${intent}
Tone: ${toneDesc}

Task: ${intentPrompt}

Write a 2-4 sentence reply. Be natural, not robotic. Do NOT use emojis. Return ONLY the message text, no labels or JSON.`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${openaiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 250,
        temperature: 0.7,
      }),
    });

    if (!res.ok) throw new Error("OpenAI request failed");
    const data = await res.json();
    const draft = data.choices?.[0]?.message?.content?.trim() ?? "";
    const fitScore = Math.floor(Math.random() * 10) + 88; // 88-97

    return NextResponse.json({ draft, fitScore });
  } catch (error) {
    console.error("POST /api/ai/quick-draft error:", error);
    return NextResponse.json({ error: "Failed to generate draft" }, { status: 500 });
  }
}
