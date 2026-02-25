/* POST /api/ai/notification-enhance — AI rewrite for notification templates */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { message, voice = "Sophisticated", channel = "whatsapp" } = body as {
      message?: string;
      voice?: string;
      channel?: string;
    };

    if (!message?.trim()) {
      return NextResponse.json({ error: "message required" }, { status: 400 });
    }

    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      return NextResponse.json({ enhanced: message, note: "OpenAI not configured" });
    }

    const voicePrompt =
      voice === "Sophisticated"
        ? "Elegant, refined, luxury automotive tone"
        : voice === "Minimalist"
          ? "Clean, concise, no fluff"
          : "Bold, high-energy, action-driven";

    const channelNote = channel === "whatsapp" ? "Keep it under 500 chars for WhatsApp. No emojis unless requested." : "Suitable for email subject and body.";

    const prompt = `You are a luxury car dealership copywriter. Rewrite this notification message in a ${voicePrompt} style. ${channelNote}

Original message:
"${message}"

Return ONLY the rewritten message, no quotes or labels. Preserve placeholders like {name} if present.`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${openaiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!res.ok) throw new Error("OpenAI request failed");
    const data = await res.json();
    const enhanced = data.choices?.[0]?.message?.content?.trim() ?? message;

    return NextResponse.json({ enhanced });
  } catch (error) {
    console.error("POST /api/ai/notification-enhance error:", error);
    return NextResponse.json({ error: "Enhancement failed" }, { status: 500 });
  }
}
