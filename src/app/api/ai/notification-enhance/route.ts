/* POST /api/ai/notification-enhance — AI rewrite for notification templates */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { aiRequest } from "@/lib/ai-router";
import { parseBody, aiNotificationEnhanceSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const parsed = await parseBody(request, aiNotificationEnhanceSchema);
    if (parsed.error) return NextResponse.json({ error: parsed.error }, { status: 400 });
    const { message, voice, channel } = parsed.data!;

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

    const result = await aiRequest({
      messages: [{ role: "user", content: prompt }],
      complexity: "MODERATE",
      maxTokens: 300,
    });

    return NextResponse.json({ enhanced: result.content || message });
  } catch (error) {
    console.error("POST /api/ai/notification-enhance error:", error);
    return NextResponse.json({ error: "Enhancement failed" }, { status: 500 });
  }
}
