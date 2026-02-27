/**
 * POST /api/service/book
 * Buyer-side service booking — creates an Appointment record.
 * No dealer auth required; stores as a SCHEDULED appointment
 * linked to the vehicle and optionally to a buyer name/phone.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      vehicleId,
      buyerName,
      buyerPhone,
      scheduledAt,   // ISO string: e.g. "2026-02-24T11:30:00.000Z"
      packageName,   // e.g. "Performance Tuning"
      logistics,     // "valet" | "self"
      notes,
    } = body;

    if (!vehicleId || !scheduledAt) {
      return NextResponse.json(
        { error: "vehicleId and scheduledAt are required" },
        { status: 400 }
      );
    }

    // Resolve the dealer that owns this vehicle
    const vehicle = await db.vehicle.findUnique({
      where: { id: vehicleId },
      select: { dealerProfileId: true, name: true },
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    const appointment = await db.appointment.create({
      data: {
        dealerProfileId: vehicle.dealerProfileId,
        vehicleId,
        buyerName: buyerName || "Guest",
        buyerPhone: buyerPhone || null,
        scheduledAt: new Date(scheduledAt),
        duration: 60,
        status: "SCHEDULED",
        location: logistics === "valet" ? "Valet Pick-up" : "Self Drop-off",
        notes: [packageName, notes].filter(Boolean).join(" | ") || null,
      },
      select: {
        id: true,
        scheduledAt: true,
        status: true,
        vehicle: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (err) {
    console.error("[service/book]", err);
    return NextResponse.json({ error: "Failed to book service" }, { status: 500 });
  }
}
