/* POST /api/ai/creative/suggestions — AI content suggestions for vehicle marketing */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { aiRequest } from "@/lib/ai-router";
import { parseBody, aiCreativeSuggestionsSchema } from "@/lib/validation";

const FALLBACK_SUGGESTIONS = [
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

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const parsed = await parseBody(request, aiCreativeSuggestionsSchema);
    if (parsed.error) return NextResponse.json({ error: parsed.error }, { status: 400 });
    const { vehicleName, vehicleType, price, specs } = parsed.data!;

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

Return ONLY a valid JSON object with a "suggestions" key containing an array of 3 objects with keys: title, desc, icon.`;

    const result = await aiRequest({
      messages: [{ role: "user", content: prompt }],
      complexity: "MODERATE",
      responseFormat: "json_object",
      maxTokens: 400,
    });

    if (!result.content) {
      return NextResponse.json({ suggestions: FALLBACK_SUGGESTIONS });
    }

    try {
      const parsed = JSON.parse(result.content);
      const suggestions = Array.isArray(parsed) ? parsed : (parsed.suggestions ?? []);
      if (!Array.isArray(suggestions) || suggestions.length < 3) {
        return NextResponse.json({ suggestions: FALLBACK_SUGGESTIONS });
      }

      return NextResponse.json({
        suggestions: suggestions.slice(0, 3).map((s: { title?: string; desc?: string; icon?: string }) => ({
          title: s.title || "Content Angle",
          desc: s.desc || "",
          icon: s.icon || "auto_awesome",
        })),
      });
    } catch {
      return NextResponse.json({ suggestions: FALLBACK_SUGGESTIONS });
    }
  } catch (error) {
    console.error("POST /api/ai/creative/suggestions error:", error);
    return NextResponse.json({ suggestions: [] }, { status: 500 });
  }
}
