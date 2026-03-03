/* POST /api/escrow — Create escrow for vehicle purchase
 * GET  /api/escrow — List buyer's escrow accounts
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

const CreateSchema = z.object({
  vehicleId: z.string().min(1),
}).strict();

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const dbUser = await db.user.findUnique({ where: { authId: user.id }, select: { id: true } });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status");

    const where: Record<string, unknown> = { buyerId: dbUser.id };
    if (status) where.status = status;

    const escrows = await db.escrowAccount.findMany({
      where,
      include: {
        vehicle: { select: { id: true, name: true, priceDisplay: true, images: true, location: true } },
        dealerProfile: { select: { dealershipName: true, city: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ escrows, total: escrows.length });
  } catch (error) {
    console.error("GET /api/escrow error:", error);
    return NextResponse.json({ error: "Failed to fetch escrows" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const dbUser = await db.user.findUnique({ where: { authId: user.id }, select: { id: true } });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = CreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 },
      );
    }

    const vehicle = await db.vehicle.findUnique({
      where: { id: parsed.data.vehicleId },
      include: { dealerProfile: { select: { id: true } } },
    });

    if (!vehicle || vehicle.status !== "AVAILABLE") {
      return NextResponse.json({ error: "Vehicle not available for purchase" }, { status: 400 });
    }

    // Check for existing active escrow on same vehicle by same buyer
    const existing = await db.escrowAccount.findFirst({
      where: {
        vehicleId: vehicle.id,
        buyerId: dbUser.id,
        status: { in: ["INITIATED", "PAYMENT_PENDING", "HELD"] },
      },
    });

    if (existing) {
      return NextResponse.json({ error: "Active escrow already exists for this vehicle", escrowId: existing.id }, { status: 409 });
    }

    const platformFee = Math.round(vehicle.price * 0.02); // 2% platform fee
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48h payment window

    const escrow = await db.escrowAccount.create({
      data: {
        vehicleId: vehicle.id,
        buyerId: dbUser.id,
        dealerProfileId: vehicle.dealerProfile.id,
        amount: vehicle.price,
        platformFee,
        status: "INITIATED",
        expiresAt,
      },
    });

    // Reserve the vehicle
    await db.vehicle.update({
      where: { id: vehicle.id },
      data: { status: "RESERVED" },
    });

    // Log platform event
    await db.platformEvent.create({
      data: {
        type: "ESCROW_CREATED",
        entityType: "EscrowAccount",
        entityId: escrow.id,
        userId: dbUser.id,
        dealerProfileId: vehicle.dealerProfile.id,
        metadata: { vehicleId: vehicle.id, amount: vehicle.price, platformFee },
      },
    });

    return NextResponse.json({
      escrowId: escrow.id,
      amount: escrow.amount,
      platformFee: escrow.platformFee,
      expiresAt: escrow.expiresAt,
      status: escrow.status,
    });
  } catch (error) {
    console.error("POST /api/escrow error:", error);
    return NextResponse.json({ error: "Failed to create escrow" }, { status: 500 });
  }
}
