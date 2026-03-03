import type { Metadata } from "next";
import { seoMeta, capitalize } from "@/lib/seo";
import DealersCityBrandClient from "./DealersCityBrandClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; brand: string }>;
}): Promise<Metadata> {
  const { city, brand } = await params;
  const cityName = capitalize(city);
  const brandName = capitalize(brand);
  return seoMeta({
    title: `${brandName} Dealers in ${cityName}`,
    description: `Find authorized ${brandName} dealers in ${cityName}. Browse showrooms, inventory, and contact dealerships on CaroBest.`,
    path: `/dealers/${city}/${brand}`,
    keywords: [`${brandName} dealers ${cityName}`, `${brandName} showroom ${cityName}`, `buy ${brandName} ${cityName}`],
  });
}

export default async function DealersCityBrandPage({
  params,
}: {
  params: Promise<{ city: string; brand: string }>;
}) {
  const { city, brand } = await params;
  return <DealersCityBrandClient city={city} brand={brand} />;
}
