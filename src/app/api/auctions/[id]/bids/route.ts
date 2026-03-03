/* POST /api/auctions/[id]/bids — Place a bid (dealer only) */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

const BidSchema = z.object({
  amount: z.number().int().min(1),
}).strict();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: auctionId } = await params;
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
      return NextResponse.json({ error: "Dealer account required to bid" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = BidSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.issues }, { status: 400 });
    }

    const auction = await db.auction.findUnique({ where: { id: auctionId } });
    if (!auction) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 });
    }

    if (auction.status !== "LIVE") {
      return NextResponse.json({ error: "Auction is not accepting bids" }, { status: 400 });
    }

    if (new Date() > auction.endTime) {
      return NextResponse.json({ error: "Auction has ended" }, { status: 400 });
    }

    // Cannot bid on own auction
    if (auction.dealerProfileId === dbUser.dealerProfile.id) {
      return NextResponse.json({ error: "Cannot bid on your own auction" }, { status: 400 });
    }

    // Bid must exceed current price + increment
    const minimumBid = auction.currentPrice + auction.bidIncrement;
    if (parsed.data.amount < minimumBid) {
      return NextResponse.json({ error: `Minimum bid is ${minimumBid}`, minimumBid }, { status: 400 });
    }

    const bid = await db.bid.create({
      data: {
        auctionId,
        dealerProfileId: dbUser.dealerProfile.id,
        amount: parsed.data.amount,
      },
    });

    // Update auction current price
    await db.auction.update({
      where: { id: auctionId },
      data: { currentPrice: parsed.data.amount },
    });

    await db.platformEvent.create({
      data: {
        type: "BID_PLACED",
        entityType: "Auction",
        entityId: auctionId,
        dealerProfileId: dbUser.dealerProfile.id,
        metadata: { bidId: bid.id, amount: parsed.data.amount },
      },
    });

    return NextResponse.json({ bid });
  } catch (error) {
    console.error("POST /api/auctions/[id]/bids error:", error);
    return NextResponse.json({ error: "Failed to place bid" }, { status: 500 });
  }
}
