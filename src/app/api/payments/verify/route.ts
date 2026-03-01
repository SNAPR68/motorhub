/* POST /api/payments/verify — Verify Razorpay payment signature & activate subscription
 *
 * Body: {
 *   razorpay_order_id: string,
 *   razorpay_payment_id: string,
 *   razorpay_signature: string,
 *   plan: "GROWTH" | "ENTERPRISE",
 *   billing: "monthly" | "annual",
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { db as prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

const VerifySchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  plan: z.enum(["GROWTH", "ENTERPRISE"]),
  billing: z.enum(["monthly", "annual"]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = VerifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
      billing,
    } = parsed.data;

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Demo mode — accept without verification
    if (!keySecret || razorpay_order_id.startsWith("order_demo_")) {
      return NextResponse.json({
        verified: true,
        demo: true,
        plan,
      });
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Payment verification failed. Invalid signature." },
        { status: 400 }
      );
    }

    // Get authenticated user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const dbUser = await prisma.user.findUnique({
        where: { authId: user.id },
        include: { dealerProfile: true },
      });

      if (dbUser?.dealerProfile) {
        const periodStart = new Date();
        const periodEnd = new Date();
        periodEnd.setMonth(periodEnd.getMonth() + (billing === "annual" ? 12 : 1));

        // Update dealer plan
        await prisma.dealerProfile.update({
          where: { id: dbUser.dealerProfile.id },
          data: { plan: plan as "GROWTH" | "ENTERPRISE" },
        });

        // Create subscription record
        await prisma.subscription.create({
          data: {
            dealerProfileId: dbUser.dealerProfile.id,
            plan: plan as "GROWTH" | "ENTERPRISE",
            status: "ACTIVE",
            razorpaySubscriptionId: razorpay_payment_id,
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
          },
        });
      }
    }

    return NextResponse.json({
      verified: true,
      plan,
    });
  } catch (err) {
    console.error("POST /api/payments/verify error:", err);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
