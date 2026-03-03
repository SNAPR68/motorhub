import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dealer Plans & Pricing",
  description:
    "Choose the right CaroBest dealer plan. Silver, Gold, and Platinum tiers with AI-powered tools, marketing automation, and lead management.",
  openGraph: {
    title: "Dealer Plans — CaroBest",
    description:
      "AI-powered dealer plans with marketing automation, lead management, and analytics.",
  },
};

export default function PlansLayout({ children }: { children: React.ReactNode }) {
  return children;
}
