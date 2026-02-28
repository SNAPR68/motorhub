import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Cars",
  description:
    "Compare specifications, features, and prices of used cars side-by-side. Make informed buying decisions with AI-powered insights.",
  openGraph: {
    title: "Compare Cars — Autovinci",
    description:
      "Side-by-side comparison of used car specifications, features, and pricing.",
  },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
