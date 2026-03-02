/* POST /api/ai/photo/apply-mood — Apply mood/style to car photo via Replicate SD img2img
 * Wrapped in circuit breaker for Replicate service resilience.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Replicate from "replicate";
import { createClient } from "@/lib/supabase/server";
import { withCircuitBreaker } from "@/lib/ai-circuit-breaker";
import { parseBody, aiPhotoMoodSchema } from "@/lib/validation";

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

    const parsed = await parseBody(request, aiPhotoMoodSchema);
    if (parsed.error) return NextResponse.json({ error: parsed.error }, { status: 400 });
    const { image: imageUrl, mood } = parsed.data!;

    const moodKey = (mood || "golden_hour").toLowerCase().replace(/\s+/g, "_");
    const prompt = MOOD_PROMPTS[moodKey] ?? MOOD_PROMPTS.golden_hour;

    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: "Replicate not configured. Add REPLICATE_API_TOKEN to .env.local" },
        { status: 503 }
      );
    }

    const result = await withCircuitBreaker("replicate", async () => {
      const replicate = new Replicate({ auth: token });
      const output = await replicate.run("stability-ai/stable-diffusion-img2img", {
        input: {
          image: imageUrl,
          prompt,
          prompt_strength: 0.35,
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

      if (!resultUrl) throw new Error("No output from mood application");
      return resultUrl;
    });

    if (result === null) {
      // Circuit breaker OPEN — return original image as fallback
      return NextResponse.json({
        url: imageUrl,
        fallback: true,
        message: "Mood application service temporarily unavailable. Original image returned.",
      });
    }

    return NextResponse.json({ url: result });
  } catch (error) {
    console.error("POST /api/ai/photo/apply-mood error:", error);
    // On any error, return original image as graceful fallback
    const body = await request.clone().json().catch(() => ({}));
    if (body?.image) {
      return NextResponse.json({
        url: body.image,
        fallback: true,
        message: "Mood application failed. Original image returned.",
      });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Mood application failed" },
      { status: 500 }
    );
  }
}
