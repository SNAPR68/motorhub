/* GET /api/stores — List store locations with vehicle counts
 * POST /api/stores — Create a new store location
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireDealerAuth } from "@/lib/auth-guard";
import { parseBody, createStoreSchema } from "@/lib/validation";

export async function GET() {
  const dealer = await requireDealerAuth();
  if (!dealer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
  const dealer = await requireDealerAuth();
  if (!dealer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await parseBody(request, createStoreSchema);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const validated = result.data!;
    const store = await db.storeLocation.create({
      data: {
        dealerProfileId: dealer.dealerProfileId,
        name: validated.name,
        address: validated.address,
        city: validated.city,
        phone: validated.phone || null,
        manager: validated.manager || null,
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
