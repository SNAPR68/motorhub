import type { Metadata } from "next";
import { seoMeta, capitalize } from "@/lib/seo";
import UsedCarsCityClient from "./UsedCarsCityClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const cityName = capitalize(city);
  return seoMeta({
    title: `Used Cars in ${cityName}`,
    description: `Browse verified used cars in ${cityName}. Compare prices, check vehicle history, and buy with confidence on Autovinci.`,
    path: `/used-cars/${city}`,
    keywords: [`used cars ${cityName}`, `second hand cars ${cityName}`, `buy used cars ${cityName}`],
  });
}

export default async function UsedCarsCityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  return <UsedCarsCityClient city={city} />;
}
