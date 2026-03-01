/* GET /api/wishlist — Get user's wishlist
 * POST /api/wishlist — Add vehicle to wishlist
 * DELETE /api/wishlist — Remove vehicle from wishlist (requires ?vehicleId= param)
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { emitEvent } from "@/lib/events";
import { handleApiError } from "@/lib/api-error";

async function getUserId() {
  const supabase = await createClient();
  const { data: { user: supaUser } } = await supabase.auth.getUser();
  if (!supaUser) return null;

  const user = await db.user.findUnique({
    where: { authId: supaUser.id },
    select: { id: true },
  });

  return user?.id ?? null;
}

export async function GET() {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const wishlists = await db.wishlist.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        vehicle: {
          select: {
            id: true,
            name: true,
            year: true,
            price: true,
            priceDisplay: true,
            status: true,
            category: true,
            fuel: true,
            transmission: true,
            images: true,
            location: true,
            km: true,
            owner: true,
            badge: true,
            aiScore: true,
          },
        },
      },
    });

    return NextResponse.json({
      wishlists,
      vehicles: wishlists.map((w) => w.vehicle),
      total: wishlists.length,
    });
  } catch (error) {
    return handleApiError(error, "GET /api/wishlist");
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();

    const wishlist = await db.wishlist.create({
      data: {
        userId,
        vehicleId: body.vehicleId,
      },
      include: {
        vehicle: { select: { id: true, name: true, priceDisplay: true } },
      },
    });

    emitEvent({
      type: "VEHICLE_WISHLISTED",
      entityType: "Vehicle",
      entityId: body.vehicleId,
      userId,
    });

    return NextResponse.json({ wishlist }, { status: 201 });
  } catch (error) {
    return handleApiError(error, "POST /api/wishlist");
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const vehicleId = searchParams.get("vehicleId");

    if (!vehicleId) {
      return NextResponse.json(
        { error: "vehicleId required" },
        { status: 400 }
      );
    }

    await db.wishlist.delete({
      where: {
        userId_vehicleId: { userId, vehicleId },
      },
    });

    return NextResponse.json({ deleted: true });
  } catch (error) {
    return handleApiError(error, "DELETE /api/wishlist");
  }
}
