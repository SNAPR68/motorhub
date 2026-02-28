/* POST /api/services/book
 * Unified service booking endpoint for RC Transfer, Inspection, Swap, Cross-State.
 * Body: { type, plan?, amount?, details, scheduledAt?, phone?, email?, city? }
 * Returns: created ServiceBooking record
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const body = await request.json();
    const { type, plan, amount, details, scheduledAt, phone, email, city } =
      body;

    if (!type || !details) {
      return NextResponse.json(
        { error: "type and details are required" },
        { status: 400 },
      );
    }

    const validTypes = ["RC_TRANSFER", "INSPECTION", "SWAP", "CROSS_STATE"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 },
      );
    }

    // Look up internal user ID if authenticated
    let userId: string | undefined;
    if (user) {
      const dbUser = await db.user.findUnique({
        where: { authId: user.id },
        select: { id: true },
      });
      userId = dbUser?.id;
    }

    const booking = await db.serviceBooking.create({
      data: {
        userId,
        type,
        plan: plan ?? null,
        amount: amount ? parseInt(amount) : null,
        details,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        phone: phone ?? null,
        email: email ?? null,
        city: city ?? null,
      },
    });

    return NextResponse.json({
      id: booking.id,
      type: booking.type,
      status: booking.status,
      plan: booking.plan,
      createdAt: booking.createdAt,
    });
  } catch (error) {
    console.error("POST /api/services/book error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 },
    );
  }
}
