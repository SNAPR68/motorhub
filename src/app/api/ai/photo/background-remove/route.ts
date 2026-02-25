/* POST /api/ai/photo/background-remove — Remove image background via Replicate (cjwbw/rembg) */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Replicate from "replicate";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { image: imageUrl } = body as { image?: string };

    if (!imageUrl || typeof imageUrl !== "string") {
      return NextResponse.json({ error: "image URL required" }, { status: 400 });
    }

    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: "Replicate not configured. Add REPLICATE_API_TOKEN to .env.local" },
        { status: 503 }
      );
    }

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
    if (!resultUrl) {
      return NextResponse.json({ error: "No output from background removal" }, { status: 500 });
    }

    return NextResponse.json({ url: resultUrl });
  } catch (error) {
    console.error("POST /api/ai/photo/background-remove error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Background removal failed" },
      { status: 500 }
    );
  }
}
