/* GET /api/dealers/search -- Public dealer directory search
 *
 * Query params: ?city=bengaluru&brand=maruti&limit=20
 * Returns dealers with vehicle counts, no auth required.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const city = searchParams.get("city");
  const brand = searchParams.get("brand");
  const search = searchParams.get("search");
  const limit = parseInt(searchParams.get("limit") ?? "20", 10);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  try {
    const where: Prisma.DealerProfileWhereInput = {};

    // Filter by city (case-insensitive contains match on city field)
    if (city) {
      where.city = { contains: city.replace(/-/g, " "), mode: "insensitive" };
    }

    // Filter by brand: dealers who have at least one vehicle with brand in name
    if (brand) {
      where.vehicles = {
        some: { name: { contains: brand.replace(/-/g, " "), mode: "insensitive" } },
      };
    }

    // Text search across dealership name
    if (search) {
      where.OR = [
        { dealershipName: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ];
    }

    const [dealers, total] = await Promise.all([
      db.dealerProfile.findMany({
        where,
        take: Math.min(limit, 50),
        skip: offset,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          dealershipName: true,
          city: true,
          state: true,
          phone: true,
          logoUrl: true,
          plan: true,
          createdAt: true,
          user: {
            select: { name: true },
          },
          _count: {
            select: { vehicles: true },
          },
          stores: {
            take: 1,
            select: { address: true, city: true },
          },
        },
      }),
      db.dealerProfile.count({ where }),
    ]);

    const mapped = dealers.map((d) => ({
      id: d.id,
      dealershipName: d.dealershipName,
      ownerName: d.user?.name ?? "",
      city: d.city ?? d.stores[0]?.city ?? "",
      state: d.state ?? "",
      phone: d.phone,
      logo: d.logoUrl,
      plan: d.plan,
      vehicleCount: d._count.vehicles,
      address: d.stores[0]?.address ?? "",
    }));

    return NextResponse.json({ dealers: mapped, total });
  } catch (error) {
    console.error("GET /api/dealers/search error:", error);
    return NextResponse.json(
      { error: "Failed to search dealers" },
      { status: 500 }
    );
  }
}
