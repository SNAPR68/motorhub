/* GET /api/appointments — List appointments (auth required)
 * POST /api/appointments — Create an appointment (auth required)
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireDealerAuth } from "@/lib/auth-guard";
import { parseBody, createAppointmentSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const dealer = await requireDealerAuth();
  if (!dealer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");
  const limit = parseInt(searchParams.get("limit") ?? "50", 10);

  try {
    const where: Record<string, unknown> = {
      dealerProfileId: dealer.dealerProfileId,
    };

    if (status && status !== "all") {
      where.status = status.toUpperCase();
    }

    const appointments = await db.appointment.findMany({
      where,
      orderBy: { scheduledAt: "asc" },
      take: limit,
      include: {
        lead: {
          select: { id: true, buyerName: true, phone: true, sentimentLabel: true },
        },
        vehicle: {
          select: { id: true, name: true, priceDisplay: true, images: true },
        },
      },
    });

    return NextResponse.json({
      appointments,
      total: appointments.length,
    });
  } catch (error) {
    console.error("GET /api/appointments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const dealer = await requireDealerAuth();
  if (!dealer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await parseBody(request, createAppointmentSchema);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const validated = result.data!;
    const appointment = await db.appointment.create({
      data: {
        dealerProfileId: dealer.dealerProfileId,
        leadId: validated.leadId || null,
        vehicleId: validated.vehicleId || null,
        buyerName: validated.buyerName,
        buyerPhone: validated.buyerPhone || null,
        scheduledAt: new Date(validated.scheduledAt),
        duration: validated.duration,
        location: validated.location || null,
        notes: validated.notes || null,
      },
      include: {
        vehicle: { select: { id: true, name: true } },
        lead: { select: { id: true, buyerName: true } },
      },
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    console.error("POST /api/appointments error:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 }
    );
  }
}
