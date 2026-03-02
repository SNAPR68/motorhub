import type { Metadata } from "next";
import { seoMeta, capitalize } from "@/lib/seo";
import UsedCarsCityBrandClient from "./UsedCarsCityBrandClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; brand: string }>;
}): Promise<Metadata> {
  const { city, brand } = await params;
  const cityName = capitalize(city);
  const brandName = capitalize(brand);
  return seoMeta({
    title: `Used ${brandName} Cars in ${cityName}`,
    description: `Browse verified used ${brandName} cars in ${cityName}. Inspect, compare prices, and buy with confidence on Autovinci.`,
    path: `/used-cars/${city}/${brand}`,
    keywords: [`used ${brandName} ${cityName}`, `second hand ${brandName} ${cityName}`, `buy ${brandName} ${cityName}`],
  });
}

export default async function UsedCarsCityBrandPage({
  params,
}: {
  params: Promise<{ city: string; brand: string }>;
}) {
  const { city, brand } = await params;
  return <UsedCarsCityBrandClient city={city} brand={brand} />;
}
