/* POST /api/ai/reel/script — Generate video script from vehicle specs */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { aiRequest } from "@/lib/ai-router";
import { parseBody, aiReelScriptSchema } from "@/lib/validation";

const FALLBACK_SCRIPT =
  "Introducing the 2023 Hyundai Creta SX(O) — where power meets elegance. With a 1.5L turbocharged engine delivering 138 BHP, this SUV redefines city driving. Premium features, panoramic sunroof, and cutting-edge safety make every journey memorable.";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const parsed = await parseBody(request, aiReelScriptSchema);
    if (parsed.error) return NextResponse.json({ error: parsed.error }, { status: 400 });
    const { vehicleName, specs, tone } = parsed.data!;

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

    const result = await aiRequest({
      messages: [{ role: "user", content: prompt }],
      complexity: "MODERATE",
      maxTokens: 300,
    });

    return NextResponse.json({ script: result.content || FALLBACK_SCRIPT });
  } catch (error) {
    console.error("POST /api/ai/reel/script error:", error);
    return NextResponse.json({ error: "Script generation failed" }, { status: 500 });
  }
}
