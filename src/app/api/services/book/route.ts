/* GET /api/services/book — List user's service bookings
 * POST /api/services/book — Create a new service booking
 * Body: { type, plan?, amount?, details, scheduledAt?, phone?, email?, city? }
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

const BookingSchema = z.object({
  type: z.enum(["RC_TRANSFER", "INSPECTION", "SWAP", "CROSS_STATE"]),
  plan: z.string().max(50).nullable().optional(),
  amount: z.union([z.number().int().min(0), z.string().regex(/^\d+$/)]).nullable().optional(),
  details: z.string().min(1).max(5000),
  scheduledAt: z.string().datetime().nullable().optional(),
  phone: z.string().max(20).nullable().optional(),
  email: z.string().email().nullable().optional(),
  city: z.string().max(100).nullable().optional(),
}).strict();

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ bookings: [], total: 0 });
    }

    const dbUser = await db.user.findUnique({
      where: { authId: user.id },
      select: { id: true },
    });

    if (!dbUser) {
      return NextResponse.json({ bookings: [], total: 0 });
    }

    const { searchParams } = request.nextUrl;
    const type = searchParams.get("type");

    const where: Record<string, unknown> = { userId: dbUser.id };
    if (type) where.type = type;

    const [bookings, total] = await Promise.all([
      db.serviceBooking.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      db.serviceBooking.count({ where }),
    ]);

    return NextResponse.json({ bookings, total });
  } catch (error) {
    console.error("GET /api/services/book error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const body = await request.json();
    const parsed = BookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`) },
        { status: 400 },
      );
    }

    const { type, plan, amount, details, scheduledAt, phone, email, city } = parsed.data;

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
        amount: amount ? parseInt(String(amount)) : null,
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
