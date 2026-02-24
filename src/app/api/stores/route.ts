/* GET /api/stores — List store locations with vehicle counts
 * POST /api/stores — Create a new store location
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const stores = await db.storeLocation.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        _count: { select: { vehicles: true } },
      },
    });

    // Map to include vehicleCount at top level for backward compat
    const storesWithCount = stores.map((s) => ({
      ...s,
      vehicleCount: s._count.vehicles,
    }));

    // Also fetch team members (stores page shows both)
    const team = await db.teamMember.findMany({
      orderBy: { joinedAt: "asc" },
    });

    return NextResponse.json({
      stores: storesWithCount,
      team,
      total: stores.length,
    });
  } catch (error) {
    console.error("GET /api/stores error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stores" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const store = await db.storeLocation.create({
      data: {
        dealerProfileId: body.dealerProfileId,
        name: body.name,
        address: body.address,
        city: body.city,
        phone: body.phone || null,
        manager: body.manager || null,
        status: body.status || "ACTIVE",
      },
    });

    return NextResponse.json({ store }, { status: 201 });
  } catch (error) {
    console.error("POST /api/stores error:", error);
    return NextResponse.json(
      { error: "Failed to create store" },
      { status: 500 }
    );
  }
}
