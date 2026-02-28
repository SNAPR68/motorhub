import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CrossState Express",
  description:
    "Buy used cars from any state in India. Complete RC transfer, insurance, and logistics handled end-to-end.",
  openGraph: {
    title: "CrossState Express — Autovinci",
    description:
      "Buy used cars from any Indian state with end-to-end RC transfer and logistics.",
  },
};

export default function CrossStateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
