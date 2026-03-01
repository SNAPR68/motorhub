/* POST /api/inquiries — Public buyer inquiry endpoint (no auth required)
 *
 * Creates a Lead record linked to the vehicle's dealer.
 * Body: { vehicleId, buyerName, phone, email?, message?, type? }
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const InquirySchema = z.object({
  vehicleId: z.string().min(1, "Vehicle ID is required"),
  buyerName: z.string().min(2, "Name must be at least 2 characters").max(200),
  phone: z.string().min(10, "Phone number is required").max(20),
  email: z.string().email().optional(),
  message: z.string().max(2000).optional(),
  type: z.enum(["GENERAL", "TEST_DRIVE", "CALL_BACK"]).default("GENERAL"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = InquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { vehicleId, buyerName, phone, email, message, type } = parsed.data;

    // Look up the vehicle to find its dealer
    const vehicle = await db.vehicle.findUnique({
      where: { id: vehicleId },
      select: { id: true, dealerProfileId: true, name: true },
    });

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }

    if (!vehicle.dealerProfileId) {
      return NextResponse.json(
        { error: "This vehicle has no associated dealer" },
        { status: 400 }
      );
    }

    // Build lead message based on inquiry type
    const leadMessage =
      type === "TEST_DRIVE"
        ? `Test drive request${message ? `: ${message}` : ""}`
        : type === "CALL_BACK"
          ? `Callback request${message ? `: ${message}` : ""}`
          : message || `Inquiry about ${vehicle.name}`;

    // Create the lead
    const lead = await db.lead.create({
      data: {
        dealerProfileId: vehicle.dealerProfileId,
        vehicleId: vehicle.id,
        buyerName,
        phone,
        email: email || null,
        source: "WEBSITE",
        sentiment: 50,
        sentimentLabel: type === "TEST_DRIVE" ? "HOT" : "WARM",
        message: leadMessage,
        status: "NEW",
      },
    });

    return NextResponse.json(
      { success: true, inquiryId: lead.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/inquiries error:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
