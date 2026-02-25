/* POST /api/ai/reel/tts — Generate TTS narration (OpenAI) */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

const VOICES = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"] as const;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { text, voice = "onyx" } = body as { text?: string; voice?: string };

    if (!text?.trim()) {
      return NextResponse.json({ error: "text required" }, { status: 400 });
    }

    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      return NextResponse.json(
        { error: "OpenAI not configured. Add OPENAI_API_KEY for TTS." },
        { status: 503 }
      );
    }

    const voiceId = VOICES.includes(voice as (typeof VOICES)[number]) ? voice : "onyx";

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
      const err = await res.text();
      console.error("OpenAI TTS error:", err);
      return NextResponse.json({ error: "TTS failed" }, { status: 500 });
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    const base64 = buffer.toString("base64");

    return NextResponse.json({
      audio: `data:audio/mp3;base64,${base64}`,
      duration: Math.ceil(text.split(/\s+/).length / 2.5) * 1000, // rough seconds estimate
    });
  } catch (error) {
    console.error("POST /api/ai/reel/tts error:", error);
    return NextResponse.json({ error: "TTS failed" }, { status: 500 });
  }
}
