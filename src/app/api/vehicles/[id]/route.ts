/* GET /api/vehicles/[id] — Get single vehicle by ID (public)
 * PUT /api/vehicles/[id] — Update vehicle (auth required)
 * DELETE /api/vehicles/[id] — Delete (archive) vehicle (auth required)
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireDealerAuth } from "@/lib/auth-guard";
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limit";

const VehicleUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  price: z.number().positive().optional(),
  priceDisplay: z.string().max(50).optional(),
  year: z.number().int().min(1990).max(2030).optional(),
  km: z.number().int().min(0).optional(),
  fuel: z.string().max(30).optional(),
  transmission: z.string().max(30).optional(),
  owner: z.string().max(30).optional(),
  location: z.string().max(100).optional(),
  category: z.string().max(50).optional(),
  status: z.enum(["AVAILABLE", "SOLD", "RESERVED", "ARCHIVED"]).optional(),
  description: z.string().max(5000).optional(),
  badge: z.string().max(30).nullable().optional(),
  images: z.array(z.string().url()).optional(),
  storeId: z.string().cuid().nullable().optional(),
}).strict();

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Rate limit public endpoint
  const ip = _request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const rl = checkRateLimit(`vehicle-detail:${ip}`);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: rateLimitHeaders(rl) }
    );
  }

  const { id } = await params;

  try {
    const vehicle = await db.vehicle.findUnique({
      where: { id },
      include: {
        store: { select: { id: true, name: true, city: true, address: true } },
        dealerProfile: {
          select: {
            dealershipName: true,
            dealershipId: true,
            city: true,
            phone: true,
            logoUrl: true,
          },
        },
      },
    });

    if (!vehicle) {
      return NextResponse.json(
        { error: "Vehicle not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ vehicle });
  } catch (error) {
    console.error("GET /api/vehicles/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicle" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const dealer = await requireDealerAuth();
  if (!dealer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const parsed = VehicleUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`) },
        { status: 400 }
      );
    }

    // Extract storeId separately for Prisma relation handling
    const { storeId, ...updateData } = parsed.data;
    const prismaData: Record<string, unknown> = { ...updateData };
    if (storeId !== undefined) {
      prismaData.store = storeId ? { connect: { id: storeId } } : { disconnect: true };
    }

    const vehicle = await db.vehicle.update({
      where: { id },
      data: prismaData,
    });

    return NextResponse.json({ vehicle });
  } catch (error) {
    console.error("PUT /api/vehicles/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update vehicle" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const dealer = await requireDealerAuth();
  if (!dealer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    // Soft-delete: archive instead of hard delete
    const vehicle = await db.vehicle.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });

    return NextResponse.json({ vehicle, archived: true });
  } catch (error) {
    console.error("DELETE /api/vehicles/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to archive vehicle" },
      { status: 500 }
    );
  }
}
