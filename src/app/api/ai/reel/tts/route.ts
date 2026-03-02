/* POST /api/ai/reel/tts — Generate TTS narration (OpenAI)
 * Note: TTS uses the audio/speech endpoint (not chat completions),
 * so it wraps with circuit breaker directly instead of aiRequest().
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { withCircuitBreaker } from "@/lib/ai-circuit-breaker";
import { parseBody, aiReelTtsSchema } from "@/lib/validation";

const VOICES = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"] as const;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const parsed = await parseBody(request, aiReelTtsSchema);
    if (parsed.error) return NextResponse.json({ error: parsed.error }, { status: 400 });
    const { text, voice } = parsed.data!;

    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      return NextResponse.json(
        { error: "OpenAI not configured. Add OPENAI_API_KEY for TTS." },
        { status: 503 }
      );
    }

    const voiceId = VOICES.includes(voice as (typeof VOICES)[number]) ? voice : "onyx";

    const result = await withCircuitBreaker("openai", async () => {
      const res = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "tts-1-hd",
          input: text.slice(0, 4096),
          voice: voiceId,
          response_format: "mp3",
          speed: 1,
        }),
      });

      if (!res.ok) {
        throw new Error(`OpenAI TTS error: ${res.status}`);
      }

      return res;
    });

    if (!result) {
      return NextResponse.json({ error: "AI service temporarily unavailable. Please try again." }, { status: 503 });
    }

    const buffer = Buffer.from(await result.arrayBuffer());
    const base64 = buffer.toString("base64");

    return NextResponse.json({
      audio: `data:audio/mp3;base64,${base64}`,
      duration: Math.ceil(text.split(/\s+/).length / 2.5) * 1000,
    });
  } catch (error) {
    console.error("POST /api/ai/reel/tts error:", error);
    return NextResponse.json({ error: "TTS failed" }, { status: 500 });
  }
}
