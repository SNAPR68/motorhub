/* GET/PUT /api/dealer/preferences
 * Read and update dealer automation/asset/notification preferences.
 * Replaces localStorage with DB persistence.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

async function getDealerProfileId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const dbUser = await db.user.findUnique({
    where: { authId: user.id },
    include: { dealerProfile: { select: { id: true } } },
  });
  return dbUser?.dealerProfile?.id ?? null;
}

export async function GET() {
  try {
    const dealerProfileId = await getDealerProfileId();
    if (!dealerProfileId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prefs = await db.dealerPreference.findUnique({
      where: { dealerProfileId },
    });

    return NextResponse.json({
      automation: (prefs?.automation as Record<string, boolean>) ?? {},
      assets: (prefs?.assets as Record<string, boolean>) ?? {},
      notifications: (prefs?.notifications as Record<string, boolean>) ?? {},
    });
  } catch (error) {
    console.error("GET /api/dealer/preferences error:", error);
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const dealerProfileId = await getDealerProfileId();
    if (!dealerProfileId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { automation, assets, notifications } = body;

    const data: Record<string, unknown> = {};
    if (automation !== undefined) data.automation = automation;
    if (assets !== undefined) data.assets = assets;
    if (notifications !== undefined) data.notifications = notifications;

    const prefs = await db.dealerPreference.upsert({
      where: { dealerProfileId },
      update: data,
      create: { dealerProfileId, ...data },
    });

    return NextResponse.json({
      automation: prefs.automation,
      assets: prefs.assets,
      notifications: prefs.notifications,
    });
  } catch (error) {
    console.error("PUT /api/dealer/preferences error:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 },
    );
  }
}
