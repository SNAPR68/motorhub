/* GET /api/auth/me — Return current user profile from Supabase Auth + DB */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";

export async function GET() {
  const supabase = await createClient();
  const { data: { user: supaUser } } = await supabase.auth.getUser();

  if (!supaUser) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  // Look up user profile + dealer profile in our database
  try {
    const user = await db.user.findUnique({
      where: { authId: supaUser.id },
      include: {
        dealerProfile: true,
      },
    });

    if (user) {
      return NextResponse.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role.toLowerCase(),
          avatar: user.avatarUrl,
          dealershipName: user.dealerProfile?.dealershipName,
          dealershipId: user.dealerProfile?.dealershipId,
        },
        dealerProfile: user.dealerProfile
          ? {
              dealershipName: user.dealerProfile.dealershipName,
              dealershipId: user.dealerProfile.dealershipId,
              gstin: user.dealerProfile.gstin,
              phone: user.dealerProfile.phone,
              address: user.dealerProfile.address,
              city: user.dealerProfile.city,
              state: user.dealerProfile.state,
              logoUrl: user.dealerProfile.logoUrl,
              plan: user.dealerProfile.plan.toLowerCase(),
            }
          : null,
      });
    }

    // User exists in Supabase Auth but not in our DB yet —
    // return basic info from Supabase user metadata
    return NextResponse.json({
      user: {
        id: supaUser.id,
        name: supaUser.user_metadata?.name ?? supaUser.email?.split("@")[0] ?? "User",
        email: supaUser.email,
        role: supaUser.user_metadata?.role ?? "buyer",
        avatar: supaUser.user_metadata?.avatar_url,
      },
      dealerProfile: null,
    });
  } catch {
    // DB error — fall back to Supabase data
    return NextResponse.json({
      user: {
        id: supaUser.id,
        name: supaUser.user_metadata?.name ?? supaUser.email?.split("@")[0] ?? "User",
        email: supaUser.email,
        role: supaUser.user_metadata?.role ?? "buyer",
        avatar: supaUser.user_metadata?.avatar_url,
      },
      dealerProfile: null,
    });
  }
}
