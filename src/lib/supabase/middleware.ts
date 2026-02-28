/* Autovinci — Supabase Middleware Client (session refresh + route protection) */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Dealer-only routes — require authenticated dealer
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/leads",
  "/appointments",
  "/inventory",
  "/intelligence",
  "/performance",
  "/profit",
  "/reports",
  "/settings",
  "/studio",
  "/content-studio",
  "/reel-editor",
  "/marketing",
  "/social-hub",
  "/smart-reply",
  "/quick-draft",
  "/stores",
  "/onboarding",
  "/analytics",
  "/plans",
  "/notifications",
];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: DO NOT remove this getUser() call.
  // It refreshes the auth token and keeps the session alive.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Check if this is a protected route
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  if (isProtected && !user) {
    const loginUrl = new URL("/login/dealer", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}
