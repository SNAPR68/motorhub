/* Autovinci — robots.txt Configuration */

import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://autovinci.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/leads/",
          "/settings/",
          "/studio/",
          "/stores/",
          "/appointments/",
          "/notifications/",
          "/reports/",
          "/intelligence/",
          "/performance/",
          "/profit/",
          "/marketing/",
          "/social-hub/",
          "/smart-reply/",
          "/quick-draft/",
          "/reel-editor/",
          "/content-studio/",
          "/login/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
