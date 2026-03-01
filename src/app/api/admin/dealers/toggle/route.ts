/* Autovinci — Admin Dealer Activation Toggle API */

import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-guard";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest) {
  const admin = await requireAdminAuth();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { dealerId, active } = await req.json();
    if (!dealerId || typeof active !== "boolean") {
      return NextResponse.json({ error: "dealerId and active (boolean) required" }, { status: 400 });
    }

    if (!active) {
      // Deactivate: set all AVAILABLE vehicles to ARCHIVED
      const result = await db.vehicle.updateMany({
        where: { dealerProfileId: dealerId, status: "AVAILABLE" },
        data: { status: "ARCHIVED" },
      });
      return NextResponse.json({ dealerId, active: false, vehiclesArchived: result.count });
    } else {
      // Activate: restore ARCHIVED vehicles to AVAILABLE
      const result = await db.vehicle.updateMany({
        where: { dealerProfileId: dealerId, status: "ARCHIVED" },
        data: { status: "AVAILABLE" },
      });
      return NextResponse.json({ dealerId, active: true, vehiclesRestored: result.count });
    }
  } catch (err) {
    console.error("Admin dealer toggle error:", err);
    return NextResponse.json({ error: "Failed to toggle dealer" }, { status: 500 });
  }
}
