/* POST /api/ai/photo/apply-mood — Apply mood/style to car photo via Replicate SD img2img */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Replicate from "replicate";
import { createClient } from "@/lib/supabase/server";

const MOOD_PROMPTS: Record<string, string> = {
  golden_hour:
    "luxury car photography, golden hour lighting, warm amber tones, long shadows, cinematic, professional automotive shot, soft warm glow",
  midnight:
    "luxury car photography, midnight blue lighting, city reflections, deep blue tones, night scene, dramatic shadows, glossy paint reflections",
  bloom:
    "luxury car photography, soft ethereal light, bloom effect, soft pink and white tones, dreamy atmosphere, premium automotive editorial",
  vivid:
    "luxury car photography, vivid saturated colors, punchy contrast, vibrant, high-impact automotive advertising",
  cinematic:
    "luxury car photography, cinematic color grading, film look, teal and orange, moody professional automotive",
  matte:
    "luxury car photography, matte finish, flat colors, minimal contrast, editorial style, sophisticated automotive",
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { image: imageUrl, mood } = body as { image?: string; mood?: string };

    if (!imageUrl || typeof imageUrl !== "string") {
      return NextResponse.json({ error: "image URL required" }, { status: 400 });
    }

    const moodKey = (mood || "golden_hour").toLowerCase().replace(/\s+/g, "_");
    const prompt = MOOD_PROMPTS[moodKey] ?? MOOD_PROMPTS.golden_hour;

    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: "Replicate not configured. Add REPLICATE_API_TOKEN to .env.local" },
        { status: 503 }
      );
    }

    const replicate = new Replicate({ auth: token });
    const output = await replicate.run("stability-ai/stable-diffusion-img2img", {
      input: {
        image: imageUrl,
        prompt,
        prompt_strength: 0.35, // Low = preserve car structure, add atmosphere
        num_inference_steps: 25,
        guidance_scale: 7.5,
      },
    });

    // SD img2img returns array of FileOutputs or URLs
    const first = Array.isArray(output) ? output[0] : output;
    let resultUrl: string;
    if (typeof first === "string") {
      resultUrl = first;
    } else if (first && typeof (first as { url?: () => URL }).url === "function") {
      const url = (first as { url: () => URL }).url();
      resultUrl = typeof url === "string" ? url : (url as URL).href;
    } else {
      resultUrl = String(first);
    }
    if (!resultUrl) {
      return NextResponse.json({ error: "No output from mood application" }, { status: 500 });
    }

    return NextResponse.json({ url: resultUrl });
  } catch (error) {
    console.error("POST /api/ai/photo/apply-mood error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Mood application failed" },
      { status: 500 }
    );
  }
}
