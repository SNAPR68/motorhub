import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sell Your Car",
  description:
    "Get the best price for your used car. AI-powered instant valuation, doorstep pickup, and hassle-free paperwork. Sell in 3 simple steps.",
  openGraph: {
    title: "Sell Your Car — Autovinci",
    description:
      "AI-powered instant valuation and hassle-free car selling. Get the best price in 3 steps.",
  },
};

export default function SellCarLayout({ children }: { children: React.ReactNode }) {
  return children;
}
