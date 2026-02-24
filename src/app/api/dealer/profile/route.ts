/* GET /api/dealer/profile — Get current dealer's profile
 * PUT /api/dealer/profile — Update dealer profile
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user: supaUser } } = await supabase.auth.getUser();

    if (!supaUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { authId: supaUser.id },
      include: {
        dealerProfile: {
          include: {
            stores: {
              include: { _count: { select: { vehicles: true } } },
            },
            _count: {
              select: { vehicles: true, leads: true, teamMembers: true },
            },
            subscriptions: {
              where: { status: "ACTIVE" },
              take: 1,
              orderBy: { createdAt: "desc" },
            },
          },
        },
      },
    });

    if (!user?.dealerProfile) {
      return NextResponse.json(
        { error: "Dealer profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      profile: user.dealerProfile,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error("GET /api/dealer/profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dealer profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user: supaUser } } = await supabase.auth.getUser();

    if (!supaUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { authId: supaUser.id },
      select: { dealerProfile: { select: { id: true } } },
    });

    if (!user?.dealerProfile) {
      return NextResponse.json(
        { error: "Dealer profile not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const profile = await db.dealerProfile.update({
      where: { id: user.dealerProfile.id },
      data: {
        dealershipName: body.dealershipName,
        gstin: body.gstin,
        phone: body.phone,
        address: body.address,
        city: body.city,
        state: body.state,
        logoUrl: body.logoUrl,
      },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("PUT /api/dealer/profile error:", error);
    return NextResponse.json(
      { error: "Failed to update dealer profile" },
      { status: 500 }
    );
  }
}
