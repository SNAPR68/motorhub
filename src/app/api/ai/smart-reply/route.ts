/* POST /api/ai/smart-reply — Generate 3 AI reply suggestions for a lead message */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { leadMessage, vehicleName, vehiclePrice, buyerName } = body;

    if (!leadMessage) return NextResponse.json({ error: "leadMessage required" }, { status: 400 });

    const openaiKey = process.env.OPENAI_API_KEY;

    if (!openaiKey) {
      // Fallback hardcoded suggestions
      return NextResponse.json({
        suggestions: [
          { tone: "Professional", toneIcon: "business_center", toneColor: "#137fec", toneBg: "rgba(19,127,236,0.1)", text: `Hi ${buyerName || "there"}, thank you for your inquiry! ${vehicleName ? `The ${vehicleName} is still available.` : ""} I'd be happy to assist. When would you like to schedule a visit?` },
          { tone: "Friendly", toneIcon: "mood", toneColor: "#059669", toneBg: "rgba(16,185,129,0.1)", text: `Hi ${buyerName || "there"}! Great to hear from you. ${vehicleName ? `The ${vehicleName} is a fantastic choice and still available!` : ""} Let's find a time that works for you!` },
          { tone: "Urgency-driven", toneIcon: "bolt", toneColor: "#ea580c", toneBg: "rgba(234,88,12,0.1)", text: `Hi ${buyerName || "there"}, the ${vehicleName || "vehicle"} is getting a lot of interest right now! Let's lock in a visit time today before it's gone.` },
        ],
      });
    }

    const prompt = `You are an expert car sales assistant. Generate exactly 3 reply suggestions for a dealer responding to a buyer's inquiry.

Buyer: ${buyerName || "the buyer"}
Vehicle: ${vehicleName || "the vehicle"}${vehiclePrice ? ` priced at ${vehiclePrice}` : ""}
Buyer's message: "${leadMessage}"

Return ONLY a valid JSON array with exactly 3 objects, each with:
- tone: string (e.g. "Professional", "Friendly", "Urgency-driven")
- toneIcon: string (material icon name: "business_center", "mood", or "bolt")
- toneColor: string (hex: "#137fec", "#059669", or "#ea580c")
- toneBg: string (rgba)
- text: string (the reply message, 2-3 sentences max)

No extra text, just the JSON array.`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${openaiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
        temperature: 0.8,
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) throw new Error("OpenAI request failed");
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content);
    const suggestions = Array.isArray(parsed) ? parsed : (parsed.suggestions ?? []);

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("POST /api/ai/smart-reply error:", error);
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 });
  }
}
