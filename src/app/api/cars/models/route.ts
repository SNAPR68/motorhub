/* GET /api/cars/models — filterable new car model list
 *
 * Query params:
 *   ?brand=maruti         — filter by brand slug
 *   ?category=SUV         — filter by body type enum
 *   ?popular=true         — only popular models
 *   ?minPrice=500000      — minimum starting price
 *   ?maxPrice=2000000     — maximum starting price
 *   ?fuel=Petrol          — filter by fuel type (substring match in fuelTypes array)
 *   ?q=creta              — search name/fullName
 *   ?limit=20             — pagination limit (default 50)
 *   ?offset=0             — pagination offset
 */

import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import { CAR_MODELS, BRANDS, getVariantsByModel } from "@/lib/car-catalog";

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;
    const brand = sp.get("brand");
    const category = sp.get("category");
    const popular = sp.get("popular");
    const minPrice = sp.get("minPrice");
    const maxPrice = sp.get("maxPrice");
    const fuel = sp.get("fuel");
    const q = sp.get("q");
    const limit = Math.min(Number(sp.get("limit")) || 50, 100);
    const offset = Number(sp.get("offset")) || 0;

    const where: Prisma.NewCarModelWhereInput = {};

    if (brand) {
      where.brand = { slug: brand };
    }
    if (category) {
      where.category = category as Prisma.EnumBodyTypeFilter["equals"];
    }
    if (popular === "true") {
      where.popular = true;
    }
    if (minPrice) {
      where.startingPrice = { ...(where.startingPrice as object), gte: Number(minPrice) };
    }
    if (maxPrice) {
      where.startingPrice = { ...(where.startingPrice as object), lte: Number(maxPrice) };
    }
    if (fuel) {
      where.fuelTypes = { has: fuel };
    }
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { fullName: { contains: q, mode: "insensitive" } },
      ];
    }

    const [models, total] = await Promise.all([
      prisma.newCarModel.findMany({
        where,
        include: {
          brand: { select: { slug: true, name: true, logo: true, color: true } },
          _count: { select: { variants: true } },
        },
        orderBy: [{ popular: "desc" }, { startingPrice: "asc" }],
        take: limit,
        skip: offset,
      }),
      prisma.newCarModel.count({ where }),
    ]);

    // If DB returned nothing, fall through to static
    if (total === 0) {
      return staticFallback(sp);
    }

    return NextResponse.json({
      models: models.map((m) => ({
        id: m.id,
        slug: m.slug,
        brand: m.brand,
        name: m.name,
        fullName: m.fullName,
        category: m.category,
        image: m.image,
        startingPrice: m.startingPrice,
        startingPriceDisplay: m.startingPriceDisplay,
        rating: m.rating,
        reviewCount: m.reviewCount,
        year: m.year,
        fuelTypes: m.fuelTypes,
        transmissions: m.transmissions,
        mileage: m.mileage,
        engine: m.engine,
        power: m.power,
        seating: m.seating,
        bodyType: m.bodyType,
        popular: m.popular,
        tag: m.tag,
        variantCount: m._count.variants,
      })),
      total,
    });
  } catch (err) {
    console.error("GET /api/cars/models error:", err);
    return staticFallback(request.nextUrl.searchParams);
  }
}

function staticFallback(sp: URLSearchParams) {
  const brand = sp.get("brand");
  const category = sp.get("category");
  const popular = sp.get("popular");
  const q = sp.get("q");
  const limit = Math.min(Number(sp.get("limit")) || 50, 100);
  const offset = Number(sp.get("offset")) || 0;

  let filtered = [...CAR_MODELS];

  if (brand) filtered = filtered.filter((m) => m.brand === brand);
  if (category) filtered = filtered.filter((m) => m.category === category.toLowerCase());
  if (popular === "true") filtered = filtered.filter((m) => m.popular);
  if (q) {
    const ql = q.toLowerCase();
    filtered = filtered.filter((m) => m.name.toLowerCase().includes(ql) || m.fullName.toLowerCase().includes(ql));
  }

  const total = filtered.length;
  const paged = filtered.slice(offset, offset + limit);

  return NextResponse.json({
    models: paged.map((m) => {
      const brandObj = BRANDS.find((b) => b.slug === m.brand);
      return {
        id: m.slug,
        slug: m.slug,
        brand: brandObj ? { slug: brandObj.slug, name: brandObj.name, logo: brandObj.logo, color: brandObj.color } : null,
        name: m.name,
        fullName: m.fullName,
        category: m.category.toUpperCase(),
        image: m.image,
        startingPrice: m.startingPrice,
        startingPriceDisplay: m.startingPriceDisplay,
        rating: m.rating,
        reviewCount: m.reviewCount,
        year: m.year,
        fuelTypes: m.fuelTypes,
        transmissions: m.transmissions,
        mileage: m.mileage,
        engine: m.engine,
        power: m.power,
        seating: m.seating,
        bodyType: m.bodyType,
        popular: m.popular,
        tag: m.tag,
        variantCount: getVariantsByModel(m.slug).length,
      };
    }),
    total,
  });
}
