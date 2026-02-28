import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Concierge",
  description:
    "Your personal AI car-buying assistant. Get instant recommendations, financing advice, and expert guidance for buying used cars in India.",
  openGraph: {
    title: "AI Concierge — Autovinci",
    description:
      "Personal AI car-buying assistant with instant recommendations and expert guidance.",
  },
};

export default function ConciergeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
