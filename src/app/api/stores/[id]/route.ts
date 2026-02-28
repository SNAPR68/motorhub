/* GET /api/stores/[id] — Get single store with vehicles
 * PUT /api/stores/[id] — Update store
 * DELETE /api/stores/[id] — Delete store
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireDealerAuth } from "@/lib/auth-guard";
import { parseBody, updateStoreSchema } from "@/lib/validation";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const dealer = await requireDealerAuth();
  if (!dealer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const store = await db.storeLocation.findUnique({
      where: { id },
      include: {
        vehicles: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            year: true,
            priceDisplay: true,
            status: true,
            category: true,
            images: true,
          },
        },
        _count: { select: { vehicles: true } },
      },
    });

    if (!store) {
      return NextResponse.json(
        { error: "Store not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      store: { ...store, vehicleCount: store._count.vehicles },
    });
  } catch (error) {
    console.error("GET /api/stores/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch store" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const dealer = await requireDealerAuth();
  if (!dealer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const result = await parseBody(request, updateStoreSchema);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const store = await db.storeLocation.update({
      where: { id },
      data: result.data!,
    });

    return NextResponse.json({ store });
  } catch (error) {
    console.error("PUT /api/stores/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update store" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const dealer = await requireDealerAuth();
  if (!dealer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await db.storeLocation.delete({ where: { id } });
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("DELETE /api/stores/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete store" },
      { status: 500 }
    );
  }
}
