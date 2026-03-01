/* GET /api/admin/dealers — All dealer profiles with stats
 * PATCH /api/admin/dealers — Update a dealer (plan, status)
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminAuth } from "@/lib/admin-guard";

export async function GET(request: NextRequest) {
  const admin = await requireAdminAuth();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const search = searchParams.get("search") ?? "";
  const plan = searchParams.get("plan") ?? "";
  const city = searchParams.get("city") ?? "";

  try {
    const dealers = await db.dealerProfile.findMany({
      where: {
        ...(search && {
          OR: [
            { dealershipName: { contains: search, mode: "insensitive" as const } },
            { user: { email: { contains: search, mode: "insensitive" as const } } },
          ],
        }),
        ...(plan && { plan: plan as "STARTER" | "GROWTH" | "ENTERPRISE" }),
        ...(city && { city: { contains: city, mode: "insensitive" as const } }),
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        dealershipName: true,
        city: true,
        state: true,
        plan: true,
        createdAt: true,
        user: { select: { email: true, name: true } },
        _count: {
          select: {
            vehicles: true,
            leads: true,
          },
        },
      },
    });

    // Get closed-won counts per dealer
    const dealerIds = dealers.map((d) => d.id);
    const closedWonCounts = await db.lead.groupBy({
      by: ["dealerProfileId"],
      where: { dealerProfileId: { in: dealerIds }, status: "CLOSED_WON" },
      _count: true,
    });
    const closedWonMap = Object.fromEntries(
      closedWonCounts.map((c) => [c.dealerProfileId, c._count])
    );

    const result = dealers.map((d) => ({
      id: d.id,
      dealershipName: d.dealershipName,
      email: d.user.email,
      ownerName: d.user.name,
      city: d.city,
      state: d.state,
      plan: d.plan,
      vehicleCount: d._count.vehicles,
      leadCount: d._count.leads,
      closedWonCount: closedWonMap[d.id] ?? 0,
      createdAt: d.createdAt,
    }));

    return NextResponse.json({ dealers: result, total: result.length });
  } catch (error) {
    console.error("GET /api/admin/dealers error:", error);
    return NextResponse.json({ error: "Failed to fetch dealers" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const admin = await requireAdminAuth();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { dealerId, plan } = body;

    if (!dealerId) {
      return NextResponse.json({ error: "dealerId is required" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (plan && ["STARTER", "GROWTH", "ENTERPRISE"].includes(plan)) {
      updateData.plan = plan;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const updated = await db.dealerProfile.update({
      where: { id: dealerId },
      data: updateData,
      select: { id: true, dealershipName: true, plan: true },
    });

    return NextResponse.json({ dealer: updated });
  } catch (error) {
    console.error("PATCH /api/admin/dealers error:", error);
    return NextResponse.json({ error: "Failed to update dealer" }, { status: 500 });
  }
}
