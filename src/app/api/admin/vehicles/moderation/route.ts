/* Autovinci — Admin Vehicle Moderation API
 * GET: moderation queue, featured, low-quality vehicles
 * PATCH: approve/reject/feature/unfeature/flag actions
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-guard";
import { db } from "@/lib/db";

const VEHICLE_SELECT = {
  id: true, name: true, year: true,
  priceDisplay: true, aiScore: true, status: true, badge: true, images: true,
  createdAt: true,
  dealerProfile: { select: { dealershipName: true, city: true } },
} as const;

export async function GET(req: NextRequest) {
  const admin = await requireAdminAuth();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const tab = searchParams.get("tab") || "moderation";
  const search = searchParams.get("search") || "";

  try {
    const searchFilter = search
      ? { name: { contains: search, mode: "insensitive" as const } }
      : {};

    if (tab === "moderation") {
      const vehicles = await db.vehicle.findMany({
        where: { status: "IN_REVIEW", ...searchFilter },
        select: VEHICLE_SELECT,
        orderBy: { createdAt: "desc" },
        take: 50,
      });
      return NextResponse.json({ vehicles, tab });
    }

    if (tab === "featured") {
      const [featured, available] = await Promise.all([
        db.vehicle.findMany({
          where: { badge: "Featured" },
          select: VEHICLE_SELECT,
          orderBy: { createdAt: "desc" },
        }),
        search ? db.vehicle.findMany({
          where: { status: "AVAILABLE", badge: { not: "Featured" }, ...searchFilter },
          select: VEHICLE_SELECT,
          orderBy: { createdAt: "desc" },
          take: 20,
        }) : [],
      ]);
      return NextResponse.json({ featured, available, tab });
    }

    if (tab === "low-quality") {
      const vehicles = await db.vehicle.findMany({
        where: { aiScore: { lt: 40 }, status: { not: "ARCHIVED" }, ...searchFilter },
        select: VEHICLE_SELECT,
        orderBy: { aiScore: "asc" },
        take: 50,
      });
      return NextResponse.json({ vehicles, tab });
    }

    return NextResponse.json({ vehicles: [], tab });
  } catch (err) {
    console.error("Admin vehicle moderation error:", err);
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdminAuth();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { vehicleId, action } = await req.json();
    if (!vehicleId || !action) {
      return NextResponse.json({ error: "vehicleId and action required" }, { status: 400 });
    }

    const updates: Record<string, Record<string, unknown>> = {
      approve: { status: "AVAILABLE" },
      reject: { status: "ARCHIVED" },
      feature: { badge: "Featured" },
      unfeature: { badge: null },
      flag: { status: "IN_REVIEW" },
    };

    if (!updates[action]) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const vehicle = await db.vehicle.update({
      where: { id: vehicleId },
      data: updates[action],
      select: { id: true, name: true, status: true, badge: true },
    });

    return NextResponse.json({ vehicle, action });
  } catch (err) {
    console.error("Admin vehicle action error:", err);
    return NextResponse.json({ error: "Failed to update vehicle" }, { status: 500 });
  }
}
