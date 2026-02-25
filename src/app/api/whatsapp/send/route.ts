/* POST /api/whatsapp/send — Send message via WhatsApp Business Cloud API */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

const GRAPH_API = "https://graph.facebook.com/v21.0";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { to, text } = body as { to?: string; text?: string };

    if (!to?.trim() || !text?.trim()) {
      return NextResponse.json({ error: "to and text required" }, { status: 400 });
    }

    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!token || !phoneId) {
      return NextResponse.json(
        {
          error: "WhatsApp not configured. Add WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID to .env.local",
        },
        { status: 503 }
      );
    }

    // Normalize phone: strip + and spaces, ensure country code (India = 91)
    const normalized = to.replace(/\D/g, "");
    const recipient = normalized.startsWith("91") ? normalized : `91${normalized}`;

    if (recipient.length < 12) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }

    const res = await fetch(`${GRAPH_API}/${phoneId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: recipient,
        type: "text",
        text: { body: text.slice(0, 4096) },
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("WhatsApp API error:", data);
      return NextResponse.json(
        { error: data.error?.message ?? "WhatsApp send failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: data.messages?.[0]?.id,
    });
  } catch (error) {
    console.error("POST /api/whatsapp/send error:", error);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}
