/* POST /api/payments/create-order — Create a Razorpay order for plan upgrade
 *
 * Body: { plan: "GROWTH" | "ENTERPRISE", billing: "monthly" | "annual" }
 * Returns: { orderId, amount, currency, key }
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import Razorpay from "razorpay";

const BodySchema = z.object({
  plan: z.enum(["GROWTH", "ENTERPRISE"]),
  billing: z.enum(["monthly", "annual"]),
});

// Plan pricing in INR (paise)
const PLAN_PRICES: Record<string, Record<string, number>> = {
  GROWTH: {
    monthly: 3999900, // ₹39,999
    annual: 3999900 * 10, // 10 months (2 free)
  },
  ENTERPRISE: {
    monthly: 6999900, // ₹69,999
    annual: 6999900 * 10,
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = BodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { plan, billing } = parsed.data;
    const amount = PLAN_PRICES[plan][billing];

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      // Demo mode: return a mock order for testing without Razorpay keys
      return NextResponse.json({
        orderId: `order_demo_${Date.now()}`,
        amount,
        currency: "INR",
        key: "rzp_test_demo",
        demo: true,
        plan,
        billing,
      });
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `plan_${plan.toLowerCase()}_${billing}_${Date.now()}`,
      notes: {
        plan,
        billing,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: keyId,
      plan,
      billing,
    });
  } catch (err) {
    console.error("POST /api/payments/create-order error:", err);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
