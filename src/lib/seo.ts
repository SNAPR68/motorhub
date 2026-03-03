/* CaroBest -- Shared SEO Metadata Utilities */

import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://carobest.com";

/** Convert slug to Title Case: "used-cars" -> "Used Cars" */
export function capitalize(s: string): string {
  return s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Build consistent SEO metadata for any page */
export function seoMeta(opts: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords,
    alternates: { canonical: `${SITE_URL}${opts.path}` },
    openGraph: {
      title: `${opts.title} | CaroBest`,
      description: opts.description,
      url: `${SITE_URL}${opts.path}`,
      siteName: "CaroBest",
      locale: "en_IN",
      type: "website",
    },
  };
}
