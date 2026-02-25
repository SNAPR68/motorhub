/* POST /api/ai/creative/suggestions — AI content suggestions for vehicle marketing */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { vehicleName, vehicleType, price, specs } = body as {
      vehicleName?: string;
      vehicleType?: string;
      price?: string;
      specs?: string;
    };

    const openaiKey = process.env.OPENAI_API_KEY;

    const fallbackSuggestions = [
      {
        title: "Heritage Story",
        desc: "Highlight the vehicle's lineage and evolution through generations. Perfect for iconic models with rich history.",
        icon: "auto_stories",
      },
      {
        title: "Performance Focus",
        desc: "Emphasize power, speed, and driving dynamics with action shots. Ideal for sports and performance-oriented cars.",
        icon: "speed",
      },
      {
        title: "Lifestyle Integration",
        desc: "Show the vehicle in aspirational lifestyle contexts — weekend getaways, city drives, family adventures.",
        icon: "landscape",
      },
    ];

    if (!openaiKey) {
      return NextResponse.json({ suggestions: fallbackSuggestions });
    }

    const context = [
      vehicleName && `Vehicle: ${vehicleName}`,
      vehicleType && `Type: ${vehicleType}`,
      price && `Price: ${price}`,
      specs && `Key specs: ${specs}`,
    ]
      .filter(Boolean)
      .join("\n");

    const prompt = `You are a luxury automotive marketing creative director. Based on this vehicle:
${context || "Generic premium vehicle"}

Generate exactly 3 content angle suggestions for car dealership social media and ads. Each should have:
- title: Short catchy name (2-4 words)
- desc: One sentence explaining the angle and when to use it
- icon: Material icon name (choose from: auto_stories, speed, landscape, local_florist, wb_twilight, dark_mode, shield, eco, home, groups)

Return ONLY a valid JSON array of 3 objects with keys: title, desc, icon. No other text.`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${openaiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 400,
        temperature: 0.8,
      }),
    });

    if (!res.ok) throw new Error("OpenAI request failed");
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content?.trim() ?? "[]";
    let parsed: { title: string; desc: string; icon: string }[];
    try {
      parsed = JSON.parse(content);
      if (!Array.isArray(parsed) || parsed.length < 3) throw new Error("Invalid format");
    } catch {
      return NextResponse.json({ suggestions: fallbackSuggestions });
    }

    return NextResponse.json({
      suggestions: parsed.slice(0, 3).map((s) => ({
        title: s.title || "Content Angle",
        desc: s.desc || "",
        icon: s.icon || "auto_awesome",
      })),
    });
  } catch (error) {
    console.error("POST /api/ai/creative/suggestions error:", error);
    return NextResponse.json({ suggestions: [] }, { status: 500 });
  }
}
