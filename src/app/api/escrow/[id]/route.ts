/* GET    /api/escrow/[id] — Get escrow details
 * PATCH  /api/escrow/[id] — Update escrow status (pay, deliver, confirm, dispute, refund)
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

const ActionSchema = z.object({
  action: z.enum(["pay", "deliver", "confirm", "dispute", "refund"]),
  razorpayPaymentId: z.string().optional(),
  razorpayOrderId: z.string().optional(),
  disputeReason: z.string().max(500).optional(),
}).strict();

export async function GET(
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

    const escrow = await db.escrowAccount.findUnique({
      where: { id },
      include: {
        vehicle: { select: { id: true, name: true, priceDisplay: true, images: true, location: true, year: true, km: true, fuel: true } },
        dealerProfile: { select: { dealershipName: true, city: true, phone: true } },
        buyer: { select: { id: true, name: true, email: true } },
        transactions: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!escrow) {
      return NextResponse.json({ error: "Escrow not found" }, { status: 404 });
    }

    return NextResponse.json({ escrow });
  } catch (error) {
    console.error("GET /api/escrow/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch escrow" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "UNAUTHORIZED" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = ActionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.issues }, { status: 400 });
    }

    const escrow = await db.escrowAccount.findUnique({
      where: { id },
      include: { vehicle: true },
    });
    if (!escrow) {
      return NextResponse.json({ error: "Escrow not found" }, { status: 404 });
    }

    const { action } = parsed.data;

    switch (action) {
      case "pay": {
        if (escrow.status !== "INITIATED" && escrow.status !== "PAYMENT_PENDING") {
          return NextResponse.json({ error: "Escrow not in payable state" }, { status: 400 });
        }

        const updated = await db.escrowAccount.update({
          where: { id },
          data: {
            status: "HELD",
            razorpayPaymentId: parsed.data.razorpayPaymentId,
            razorpayOrderId: parsed.data.razorpayOrderId,
            paidAt: new Date(),
          },
        });

        // Record transaction: buyer -> escrow_hold
        await db.transaction.create({
          data: {
            escrowId: id,
            type: "DEBIT",
            debitAccount: "buyer_wallet",
            creditAccount: "escrow_hold",
            amount: escrow.amount,
            description: "Buyer payment received into escrow",
          },
        });

        await db.platformEvent.create({
          data: {
            type: "ESCROW_PAYMENT_RECEIVED",
            entityType: "EscrowAccount",
            entityId: id,
            metadata: { amount: escrow.amount },
          },
        });

        return NextResponse.json({ escrow: updated });
      }

      case "deliver": {
        if (escrow.status !== "HELD") {
          return NextResponse.json({ error: "Escrow must be in HELD state" }, { status: 400 });
        }

        const updated = await db.escrowAccount.update({
          where: { id },
          data: { status: "DELIVERED", deliveredAt: new Date() },
        });

        await db.platformEvent.create({
          data: {
            type: "ESCROW_DELIVERY_MARKED",
            entityType: "EscrowAccount",
            entityId: id,
            metadata: { vehicleId: escrow.vehicleId },
          },
        });

        return NextResponse.json({ escrow: updated });
      }

      case "confirm": {
        if (escrow.status !== "DELIVERED") {
          return NextResponse.json({ error: "Vehicle must be delivered first" }, { status: 400 });
        }

        const updated = await db.escrowAccount.update({
          where: { id },
          data: { status: "RELEASED", releasedAt: new Date() },
        });

        // Record transaction: escrow_hold -> dealer_payout + platform_revenue
        const dealerPayout = escrow.amount - escrow.platformFee;
        await db.transaction.createMany({
          data: [
            {
              escrowId: id,
              type: "CREDIT",
              debitAccount: "escrow_hold",
              creditAccount: "dealer_payout",
              amount: dealerPayout,
              description: "Funds released to dealer",
            },
            {
              escrowId: id,
              type: "CREDIT",
              debitAccount: "escrow_hold",
              creditAccount: "platform_revenue",
              amount: escrow.platformFee,
              description: "Platform commission",
            },
          ],
        });

        // Mark vehicle as sold
        await db.vehicle.update({
          where: { id: escrow.vehicleId },
          data: { status: "SOLD" },
        });

        await db.platformEvent.create({
          data: {
            type: "ESCROW_FUNDS_RELEASED",
            entityType: "EscrowAccount",
            entityId: id,
            metadata: { dealerPayout, platformFee: escrow.platformFee },
          },
        });

        return NextResponse.json({ escrow: updated });
      }

      case "dispute": {
        if (escrow.status !== "HELD" && escrow.status !== "DELIVERED") {
          return NextResponse.json({ error: "Cannot dispute in current state" }, { status: 400 });
        }

        const updated = await db.escrowAccount.update({
          where: { id },
          data: { status: "DISPUTED", disputeReason: parsed.data.disputeReason },
        });

        await db.platformEvent.create({
          data: {
            type: "ESCROW_DISPUTED",
            entityType: "EscrowAccount",
            entityId: id,
            metadata: { reason: parsed.data.disputeReason },
          },
        });

        return NextResponse.json({ escrow: updated });
      }

      case "refund": {
        if (escrow.status !== "DISPUTED" && escrow.status !== "HELD") {
          return NextResponse.json({ error: "Cannot refund in current state" }, { status: 400 });
        }

        const updated = await db.escrowAccount.update({
          where: { id },
          data: { status: "REFUNDED", refundedAt: new Date() },
        });

        // Record transaction: escrow_hold -> refund_pool
        await db.transaction.create({
          data: {
            escrowId: id,
            type: "DEBIT",
            debitAccount: "escrow_hold",
            creditAccount: "refund_pool",
            amount: escrow.amount,
            description: "Refund to buyer",
          },
        });

        // Restore vehicle availability
        await db.vehicle.update({
          where: { id: escrow.vehicleId },
          data: { status: "AVAILABLE" },
        });

        await db.platformEvent.create({
          data: {
            type: "ESCROW_REFUNDED",
            entityType: "EscrowAccount",
            entityId: id,
            metadata: { amount: escrow.amount },
          },
        });

        return NextResponse.json({ escrow: updated });
      }
    }
  } catch (error) {
    console.error("PATCH /api/escrow/[id] error:", error);
    return NextResponse.json({ error: "Failed to update escrow" }, { status: 500 });
  }
}
