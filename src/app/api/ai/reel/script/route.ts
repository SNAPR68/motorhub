/* POST /api/ai/reel/script — Generate video script from vehicle specs */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { vehicleId, vehicleName, specs, tone = "luxury" } = body as {
      vehicleId?: string;
      vehicleName?: string;
      specs?: string;
      tone?: string;
    };

    const openaiKey = process.env.OPENAI_API_KEY;

    const fallbackScript =
      "Introducing the 2023 Hyundai Creta SX(O) — where power meets elegance. With a 1.5L turbocharged engine delivering 138 BHP, this SUV redefines city driving. Premium features, panoramic sunroof, and cutting-edge safety make every journey memorable.";

    if (!openaiKey) {
      return NextResponse.json({ script: fallbackScript });
    }

    const context = [
      vehicleName && `Vehicle: ${vehicleName}`,
      specs && `Specs: ${specs}`,
    ]
      .filter(Boolean)
      .join("\n");

    const prompt = `You are a luxury automotive video narrator. Write a short, punchy 30-45 second video script (2-4 sentences) for a car showcase reel. 
Tone: ${tone}.
${context || "Generic premium SUV"}

The script should: hook viewers in the first line, highlight key selling points, end with a call to action. No filler words. Write ONLY the narrator script, no stage directions or brackets.`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${openaiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.8,
      }),
    });

    if (!res.ok) throw new Error("OpenAI request failed");
    const data = await res.json();
    const script = data.choices?.[0]?.message?.content?.trim() ?? fallbackScript;

    return NextResponse.json({ script });
  } catch (error) {
    console.error("POST /api/ai/reel/script error:", error);
    return NextResponse.json({ error: "Script generation failed" }, { status: 500 });
  }
}
