/* GET /api/cars/brands — all car brands, ordered by display order
 * Falls back to static catalog if DB is empty */

import { NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";
import { BRANDS, getModelsByBrand } from "@/lib/car-catalog";

export async function GET() {
  try {
    const brands = await prisma.carBrand.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: { select: { models: true } },
      },
    });

    // If DB has brands, return them
    if (brands.length > 0) {
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
    }

    // Fallback to static catalog
    return NextResponse.json({
      brands: BRANDS.map((b) => ({
        id: b.slug,
        slug: b.slug,
        name: b.name,
        logo: b.logo,
        color: b.color,
        popular: b.popular,
        modelCount: getModelsByBrand(b.slug).length,
      })),
    });
  } catch (err) {
    console.error("GET /api/cars/brands error:", err);
    // Fallback on DB error too
    return NextResponse.json({
      brands: BRANDS.map((b) => ({
        id: b.slug,
        slug: b.slug,
        name: b.name,
        logo: b.logo,
        color: b.color,
        popular: b.popular,
        modelCount: getModelsByBrand(b.slug).length,
      })),
    });
  }
}
