/* PATCH /api/vehicles/[id]/panorama
 * Sets (or clears) the panoramic image index for a vehicle.
 * Body: { panoramaImageIdx: number | null }
 * Auth required (dealer must own the vehicle).
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireDealerAuth } from "@/lib/auth-guard";

export async function PATCH(
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
    const idx = body.panoramaImageIdx;

    // Validate: must be null or a non-negative integer
    if (idx !== null && (typeof idx !== "number" || idx < 0 || !Number.isInteger(idx))) {
      return NextResponse.json(
        { error: "panoramaImageIdx must be a non-negative integer or null" },
        { status: 400 }
      );
    }

    const vehicle = await db.vehicle.update({
      where: { id },
      data: { panoramaImageIdx: idx },
      select: { id: true, panoramaImageIdx: true, images: true },
    });

    return NextResponse.json({ vehicle, panoramaImageIdx: idx });
  } catch (error) {
    console.error("PATCH /api/vehicles/[id]/panorama error:", error);
    return NextResponse.json(
      { error: "Failed to update panoramic image" },
      { status: 500 }
    );
  }
}
