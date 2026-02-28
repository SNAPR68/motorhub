/* GET /api/cars/[brand]/[model] — single new car model with all details + variants */

import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";
import {
  getBrandBySlug,
  getModelBySlug,
  getVariantsByModel,
  getModelsByBrand,
} from "@/lib/car-catalog";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ brand: string; model: string }> }
) {
  try {
    const { brand: brandSlug, model: modelSlug } = await params;

    const brand = await prisma.carBrand.findUnique({
      where: { slug: brandSlug },
    });

    if (!brand) {
      // Static fallback
      return staticFallback(brandSlug, modelSlug);
    }

    const model = await prisma.newCarModel.findUnique({
      where: { brandId_slug: { brandId: brand.id, slug: modelSlug } },
      include: {
        brand: { select: { slug: true, name: true, logo: true, color: true } },
        variants: { orderBy: { order: "asc" } },
      },
    });

    if (!model) {
      return staticFallback(brandSlug, modelSlug);
    }

    // Also fetch other models from the same brand for "More from [brand]"
    const relatedModels = await prisma.newCarModel.findMany({
      where: { brandId: brand.id, id: { not: model.id } },
      select: {
        slug: true,
        name: true,
        fullName: true,
        image: true,
        startingPriceDisplay: true,
        rating: true,
      },
      take: 4,
    });

    return NextResponse.json({
      model: {
        id: model.id,
        slug: model.slug,
        brand: model.brand,
        name: model.name,
        fullName: model.fullName,
        category: model.category,
        image: model.image,
        gallery: model.gallery,
        startingPrice: model.startingPrice,
        startingPriceDisplay: model.startingPriceDisplay,
        rating: model.rating,
        reviewCount: model.reviewCount,
        year: model.year,
        fuelTypes: model.fuelTypes,
        transmissions: model.transmissions,
        mileage: model.mileage,
        engine: model.engine,
        power: model.power,
        seating: model.seating,
        bodyType: model.bodyType,
        popular: model.popular,
        tag: model.tag,
        pros: model.pros,
        cons: model.cons,
        variants: model.variants.map((v) => ({
          id: v.id,
          name: v.name,
          fuel: v.fuel,
          transmission: v.transmission,
          exShowroom: v.exShowroom,
          exShowroomDisplay: v.exShowroomDisplay,
        })),
      },
      relatedModels,
    });
  } catch (err) {
    console.error("GET /api/cars/[brand]/[model] error:", err);
    return NextResponse.json({ error: "Failed to fetch model" }, { status: 500 });
  }
}

function staticFallback(brandSlug: string, modelSlug: string) {
  const brand = getBrandBySlug(brandSlug);
  if (!brand) {
    return NextResponse.json({ error: "Brand not found" }, { status: 404 });
  }

  const model = getModelBySlug(brandSlug, modelSlug);
  if (!model) {
    return NextResponse.json({ error: "Model not found" }, { status: 404 });
  }

  const variants = getVariantsByModel(modelSlug);
  const relatedModels = getModelsByBrand(brandSlug)
    .filter((m) => m.slug !== modelSlug)
    .slice(0, 4)
    .map((m) => ({
      slug: m.slug,
      name: m.name,
      fullName: m.fullName,
      image: m.image,
      startingPriceDisplay: m.startingPriceDisplay,
      rating: m.rating,
    }));

  return NextResponse.json({
    model: {
      id: `static-${modelSlug}`,
      slug: model.slug,
      brand: { slug: brand.slug, name: brand.name, logo: brand.logo, color: brand.color },
      name: model.name,
      fullName: model.fullName,
      category: model.category,
      image: model.image,
      gallery: model.gallery,
      startingPrice: model.startingPrice,
      startingPriceDisplay: model.startingPriceDisplay,
      rating: model.rating,
      reviewCount: model.reviewCount,
      year: model.year,
      fuelTypes: model.fuelTypes,
      transmissions: model.transmissions,
      mileage: model.mileage,
      engine: model.engine,
      power: model.power,
      seating: model.seating,
      bodyType: model.bodyType,
      popular: model.popular,
      tag: model.tag,
      pros: model.pros,
      cons: model.cons,
      variants: variants.map((v) => ({
        id: `static-${v.modelSlug}-${v.name}`,
        name: v.name,
        fuel: v.fuel,
        transmission: v.transmission,
        exShowroom: v.exShowroom,
        exShowroomDisplay: v.exShowroomDisplay,
      })),
    },
    relatedModels,
  });
}
