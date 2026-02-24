/* Autovinci — Dynamic Sitemap Generation */

import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://autovinci.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/inventory`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/showroom`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/concierge`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/plans`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/login/buyer`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/login/dealer`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  // Dynamic vehicle pages
  let vehiclePages: MetadataRoute.Sitemap = [];
  try {
    const vehicles = await db.vehicle.findMany({
      where: { status: { in: ["AVAILABLE", "RESERVED"] } },
      select: { id: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 500,
    });

    vehiclePages = vehicles.map((v) => ({
      url: `${SITE_URL}/showcase/${v.id}`,
      lastModified: v.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // DB unavailable during build — skip dynamic pages
  }

  return [...staticPages, ...vehiclePages];
}
