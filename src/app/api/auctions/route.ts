/* GET  /api/auctions — List auctions (filterable by status)
 * POST /api/auctions — Create a new auction (dealer only)
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

const CreateSchema = z.object({
  vehicleId: z.string().min(1),
  startPrice: z.number().int().min(10000),
  bidIncrement: z.number().int().min(1000).optional(),
  durationHours: z.number().int().min(1).max(168), // 1h to 7 days
}).strict();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status");
    const dealerId = searchParams.get("dealerId");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (dealerId) where.dealerProfileId = dealerId;

    const auctions = await db.auction.findMany({
      where,
      include: {
        vehicle: { select: { id: true, name: true, priceDisplay: true, images: true, location: true, year: true, km: true, fuel: true } },
        dealerProfile: { select: { dealershipName: true, city: true } },
        _count: { select: { bids: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ auctions, total: auctions.length });
  } catch (error) {
    console.error("GET /api/auctions error:", error);
    return NextResponse.json({ error: "Failed to fetch auctions" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const dbUser = await db.user.findUnique({
      where: { authId: user.id },
      include: { dealerProfile: { select: { id: true } } },
    });

    if (!dbUser?.dealerProfile) {
      return NextResponse.json({ error: "Dealer account required" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = CreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.issues }, { status: 400 });
    }

    const vehicle = await db.vehicle.findFirst({
      where: {
        id: parsed.data.vehicleId,
        dealerProfileId: dbUser.dealerProfile.id,
        status: "AVAILABLE",
      },
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found or not available" }, { status: 400 });
    }

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + parsed.data.durationHours * 60 * 60 * 1000);

    const auction = await db.auction.create({
      data: {
        vehicleId: vehicle.id,
        dealerProfileId: dbUser.dealerProfile.id,
        startPrice: parsed.data.startPrice,
        currentPrice: parsed.data.startPrice,
        bidIncrement: parsed.data.bidIncrement ?? 5000,
        status: "LIVE",
        startTime,
        endTime,
      },
    });

    await db.platformEvent.create({
      data: {
        type: "AUCTION_CREATED",
        entityType: "Auction",
        entityId: auction.id,
        dealerProfileId: dbUser.dealerProfile.id,
        metadata: { vehicleId: vehicle.id, startPrice: parsed.data.startPrice, durationHours: parsed.data.durationHours },
      },
    });

    return NextResponse.json({ auction });
  } catch (error) {
    console.error("POST /api/auctions error:", error);
    return NextResponse.json({ error: "Failed to create auction" }, { status: 500 });
  }
}
