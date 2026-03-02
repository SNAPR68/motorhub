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
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { emitEvent } from "@/lib/events";

export async function GET(request: NextRequest) {
  // Rate limit public endpoint
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const rl = checkRateLimit(`vehicles:${ip}`);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: rateLimitHeaders(rl) }
    );
  }

  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort");
  const city = searchParams.get("city");
  const brand = searchParams.get("brand");
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

    // Filter by city (matches location field or dealer's city)
    if (city) {
      const cityClean = city.replace(/-/g, " ");
      where.OR = [
        ...(where.OR ?? []),
        { location: { contains: cityClean, mode: "insensitive" } },
        { dealerProfile: { city: { contains: cityClean, mode: "insensitive" } } },
      ];
    }

    // Filter by brand name
    if (brand) {
      const brandClean = brand.replace(/-/g, " ");
      where.name = { contains: brandClean, mode: "insensitive" };
    }

    if (search) {
      const searchConditions: Prisma.VehicleWhereInput[] = [
        { name: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
        { engine: { contains: search, mode: "insensitive" } },
      ];
      where.OR = [...(where.OR ?? []), ...searchConditions];
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

    emitEvent({
      type: "VEHICLE_CREATED",
      entityType: "Vehicle",
      entityId: vehicle.id,
      dealerProfileId: dealerProfile.id,
      metadata: { name: validated.name, category: validated.category },
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
