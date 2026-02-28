/* GET /api/vehicles — List vehicles from database, optional filters
 * POST /api/vehicles — Create a new vehicle listing
 *
 * Query params: ?category=SUV&status=AVAILABLE&search=creta&sort=price_asc&limit=20&offset=0
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { parseBody, createVehicleSchema } from "@/lib/validation";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort");
  const limit = parseInt(searchParams.get("limit") ?? "50", 10);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  try {
    const where: Prisma.VehicleWhereInput = {};

    if (category && category !== "all") {
      where.category = category.toUpperCase() as Prisma.EnumVehicleCategoryFilter["equals"];
    }

    if (status && status !== "all") {
      where.status = status.toUpperCase() as Prisma.EnumVehicleStatusFilter["equals"];
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
        { engine: { contains: search, mode: "insensitive" } },
      ];
    }

    // Sorting
    let orderBy: Prisma.VehicleOrderByWithRelationInput = { createdAt: "desc" };
    if (sort === "price_asc") orderBy = { price: "asc" };
    else if (sort === "price_desc") orderBy = { price: "desc" };
    else if (sort === "year_desc") orderBy = { year: "desc" };
    else if (sort === "newest") orderBy = { createdAt: "desc" };

    const [vehicles, total] = await Promise.all([
      db.vehicle.findMany({
        where,
        orderBy,
        take: limit,
        skip: offset,
        include: {
          store: { select: { name: true, city: true } },
        },
      }),
      db.vehicle.count({ where }),
    ]);

    return NextResponse.json({ vehicles, total });
  } catch (error) {
    console.error("GET /api/vehicles error:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicles" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const result = await parseBody(request, createVehicleSchema);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const validated = result.data!;

    // Get authenticated user's dealer profile
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await db.user.findFirst({ where: { authId: user.id } });
    const dealerProfile = dbUser
      ? await db.dealerProfile.findFirst({ where: { userId: dbUser.id } })
      : null;

    if (!dealerProfile) {
      return NextResponse.json({ error: "Dealer profile not found" }, { status: 403 });
    }

    // Format price display
    const priceInLakhs = validated.price / 100000;
    const priceDisplay = priceInLakhs >= 100
      ? `₹${(priceInLakhs / 100).toFixed(2)} Cr`
      : `₹${priceInLakhs.toFixed(2)} L`;

    const vehicle = await db.vehicle.create({
      data: {
        dealerProfileId: dealerProfile.id,
        name: validated.name,
        year: validated.year,
        price: validated.price,
        priceDisplay,
        status: "AVAILABLE",
        category: validated.category,
        fuel: validated.fuel,
        transmission: validated.transmission,
        engine: validated.engine,
        power: validated.power,
        mileage: validated.mileage,
        km: validated.km,
        location: validated.location,
        owner: validated.owner,
        description: validated.description ?? undefined,
        images: validated.images,
      },
    });

    return NextResponse.json({ vehicle }, { status: 201 });
  } catch (error) {
    console.error("POST /api/vehicles error:", error);
    return NextResponse.json(
      { error: "Failed to create vehicle" },
      { status: 500 }
    );
  }
}
