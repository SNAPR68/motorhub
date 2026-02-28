import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SwapDirect",
  description:
    "Exchange your current car for a different one instantly. AI-powered matching, fair valuations, and seamless swap experience.",
  openGraph: {
    title: "SwapDirect — Autovinci",
    description:
      "Instant car exchange with AI-powered matching and fair valuations.",
  },
};

export default function SwapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
