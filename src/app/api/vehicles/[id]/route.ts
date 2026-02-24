/* GET /api/vehicles/[id] — Get single vehicle by ID (public)
 * PUT /api/vehicles/[id] — Update vehicle (auth required)
 * DELETE /api/vehicles/[id] — Delete (archive) vehicle (auth required)
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireDealerAuth } from "@/lib/auth-guard";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const vehicle = await db.vehicle.findUnique({
      where: { id },
      include: {
        store: { select: { id: true, name: true, city: true, address: true } },
        dealerProfile: {
          select: {
            dealershipName: true,
            dealershipId: true,
            city: true,
            phone: true,
            logoUrl: true,
          },
        },
      },
    });

    if (!vehicle) {
      return NextResponse.json(
        { error: "Vehicle not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ vehicle });
  } catch (error) {
    console.error("GET /api/vehicles/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicle" },
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
    const body = await request.json();

    const vehicle = await db.vehicle.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ vehicle });
  } catch (error) {
    console.error("PUT /api/vehicles/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update vehicle" },
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
    // Soft-delete: archive instead of hard delete
    const vehicle = await db.vehicle.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });

    return NextResponse.json({ vehicle, archived: true });
  } catch (error) {
    console.error("DELETE /api/vehicles/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to archive vehicle" },
      { status: 500 }
    );
  }
}
