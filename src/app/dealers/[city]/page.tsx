import type { Metadata } from "next";
import { seoMeta, capitalize } from "@/lib/seo";
import DealersCityClient from "./DealersCityClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const cityName = capitalize(city);
  return seoMeta({
    title: `Car Dealers in ${cityName}`,
    description: `Find verified car dealers in ${cityName}. Browse showrooms, compare prices, and contact dealerships directly on CaroBest.`,
    path: `/dealers/${city}`,
    keywords: [`car dealers ${cityName}`, `used car dealers ${cityName}`, `buy cars ${cityName}`],
  });
}

export default async function DealersCityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  return <DealersCityClient city={city} />;
}
