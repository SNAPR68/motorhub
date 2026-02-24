/* GET /api/auth/callback — Handle OAuth callback from Supabase Auth */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") || "/";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Ensure user exists in our database
      try {
        const existingUser = await db.user.findUnique({
          where: { authId: data.user.id },
        });

        if (!existingUser) {
          await db.user.create({
            data: {
              authId: data.user.id,
              email: data.user.email!,
              name: data.user.user_metadata?.name ?? data.user.email?.split("@")[0] ?? "User",
              role: (data.user.user_metadata?.role as string)?.toUpperCase() === "DEALER" ? "DEALER" : "BUYER",
              avatarUrl: data.user.user_metadata?.avatar_url,
            },
          });
        }
      } catch {
        // DB error — user can still proceed with auth
      }
    }
  }

  // Redirect to the intended page
  return NextResponse.redirect(new URL(redirect, request.url));
}
