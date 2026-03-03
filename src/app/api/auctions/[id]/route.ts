/* GET   /api/auctions/[id] — Get auction details with bids
 * PATCH /api/auctions/[id] — Cancel auction (owner only)
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const auction = await db.auction.findUnique({
      where: { id },
      include: {
        vehicle: { select: { id: true, name: true, priceDisplay: true, images: true, location: true, year: true, km: true, fuel: true, transmission: true, engine: true } },
        dealerProfile: { select: { dealershipName: true, city: true } },
        bids: {
          include: { dealerProfile: { select: { dealershipName: true, city: true } } },
          orderBy: { amount: "desc" },
          take: 20,
        },
        _count: { select: { bids: true } },
      },
    });

    if (!auction) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 });
    }

    // Auto-close expired auctions
    if (auction.status === "LIVE" && new Date() > auction.endTime) {
      const winner = auction.bids[0]; // Highest bid
      const updatedAuction = await db.auction.update({
        where: { id },
        data: {
          status: winner ? "ENDED" : "NO_BIDS",
          winnerId: winner?.dealerProfileId ?? null,
        },
      });
      return NextResponse.json({ auction: { ...auction, ...updatedAuction } });
    }

    return NextResponse.json({ auction });
  } catch (error) {
    console.error("GET /api/auctions/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch auction" }, { status: 500 });
  }
}

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
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

    const auction = await db.auction.findUnique({ where: { id } });
    if (!auction) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 });
    }

    if (auction.dealerProfileId !== dbUser.dealerProfile.id) {
      return NextResponse.json({ error: "Only auction owner can cancel" }, { status: 403 });
    }

    if (auction.status !== "LIVE" && auction.status !== "DRAFT") {
      return NextResponse.json({ error: "Cannot cancel auction in current state" }, { status: 400 });
    }

    const updated = await db.auction.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({ auction: updated });
  } catch (error) {
    console.error("PATCH /api/auctions/[id] error:", error);
    return NextResponse.json({ error: "Failed to update auction" }, { status: 500 });
  }
}
