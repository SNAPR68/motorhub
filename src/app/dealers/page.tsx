import type { Metadata } from "next";
import { seoMeta } from "@/lib/seo";
import DealersClient from "./DealersClient";

export function generateMetadata(): Metadata {
  return seoMeta({
    title: "Find Car Dealers Near You",
    description:
      "Browse verified car dealers across India. Compare ratings, view inventory, and contact dealerships directly on Autovinci.",
    path: "/dealers",
    keywords: ["car dealers", "used car dealers", "dealerships India", "buy used cars"],
  });
}

export default function DealersPage() {
  return <DealersClient />;
}
