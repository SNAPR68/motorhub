/* POST /api/auth/login — Sign in with Supabase Auth */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseBody, loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const result = await parseBody(request, loginSchema);
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    const { email, password } = result.data!;

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}
