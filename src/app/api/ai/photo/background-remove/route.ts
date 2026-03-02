/* POST /api/ai/photo/background-remove — Remove image background via Replicate (cjwbw/rembg)
 * Wrapped in circuit breaker for Replicate service resilience.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Replicate from "replicate";
import { createClient } from "@/lib/supabase/server";
import { withCircuitBreaker } from "@/lib/ai-circuit-breaker";
import { parseBody, aiPhotoBgRemoveSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const parsed = await parseBody(request, aiPhotoBgRemoveSchema);
    if (parsed.error) return NextResponse.json({ error: parsed.error }, { status: 400 });
    const { image: imageUrl } = parsed.data!;

    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: "Replicate not configured. Add REPLICATE_API_TOKEN to .env.local" },
        { status: 503 }
      );
    }

    const result = await withCircuitBreaker("replicate", async () => {
      const replicate = new Replicate({ auth: token });
      const output = await replicate.run("cjwbw/rembg", {
        input: { image: imageUrl },
      });

      // rembg returns FileOutput with .url() method (returns URL), or raw URL string
      let resultUrl: string;
      if (typeof output === "string") {
        resultUrl = output;
      } else if (output && typeof (output as { url?: () => URL }).url === "function") {
        const url = (output as { url: () => URL }).url();
        resultUrl = typeof url === "string" ? url : (url as URL).href;
      } else {
        resultUrl = String(output);
      }

      if (!resultUrl) throw new Error("No output from background removal");
      return resultUrl;
    });

    if (result === null) {
      // Circuit breaker OPEN — return original image as fallback
      return NextResponse.json({
        url: imageUrl,
        fallback: true,
        message: "Background removal service temporarily unavailable. Original image returned.",
      });
    }

    return NextResponse.json({ url: result });
  } catch (error) {
    console.error("POST /api/ai/photo/background-remove error:", error);
    // On any error, return original image as graceful fallback
    const body = await request.clone().json().catch(() => ({}));
    if (body?.image) {
      return NextResponse.json({
        url: body.image,
        fallback: true,
        message: "Background removal failed. Original image returned.",
      });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Background removal failed" },
      { status: 500 }
    );
  }
}
