/* GET /api/cars/brands — all car brands, ordered by display order */

import { NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";

export async function GET() {
  try {
    const brands = await prisma.carBrand.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: { select: { models: true } },
      },
    });

    return NextResponse.json({
      brands: brands.map((b) => ({
        id: b.id,
        slug: b.slug,
        name: b.name,
        logo: b.logo,
        color: b.color,
        popular: b.popular,
        modelCount: b._count.models,
      })),
    });
  } catch (err) {
    console.error("GET /api/cars/brands error:", err);
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 });
  }
}
