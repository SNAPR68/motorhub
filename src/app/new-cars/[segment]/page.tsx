import type { Metadata } from "next";
import { seoMeta, capitalize } from "@/lib/seo";
import NewCarsSegmentClient from "./NewCarsSegmentClient";

const SEGMENT_TITLES: Record<string, string> = {
  suv: "SUVs",
  hatchback: "Hatchbacks",
  sedan: "Sedans",
  "under-10-lakh": "Cars Under \u20B910 Lakh",
  "under-5-lakh": "Cars Under \u20B95 Lakh",
  "under-15-lakh": "Cars Under \u20B915 Lakh",
  "under-20-lakh": "Cars Under \u20B920 Lakh",
  mpv: "MPVs",
  coupe: "Coupes",
  convertible: "Convertibles",
  luxury: "Luxury Cars",
  electric: "Electric Cars",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ segment: string }>;
}): Promise<Metadata> {
  const { segment } = await params;
  const title = SEGMENT_TITLES[segment] ?? capitalize(segment);
  return seoMeta({
    title: `New ${title} in India - Prices & Specs`,
    description: `Explore new ${title.toLowerCase()} in India. Compare prices, specifications, mileage, and features. Find your perfect car on Autovinci.`,
    path: `/new-cars/${segment}`,
    keywords: [`new ${title.toLowerCase()}`, `${title.toLowerCase()} prices India`, `best ${title.toLowerCase()} 2026`],
  });
}

export default async function NewCarsBySegmentPage({
  params,
}: {
  params: Promise<{ segment: string }>;
}) {
  const { segment } = await params;
  return <NewCarsSegmentClient segment={segment} />;
}
