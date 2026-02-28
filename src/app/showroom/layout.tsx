import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Showroom — Browse Used Cars",
  description:
    "Browse AI-verified used cars across India. Filter by brand, price, and body type. Virtual tours, smart pricing, and verified listings.",
  openGraph: {
    title: "Autovinci Showroom — Browse Used Cars",
    description:
      "Browse AI-verified used cars across India. Smart pricing, virtual tours, and verified listings.",
  },
};

export default function ShowroomLayout({ children }: { children: React.ReactNode }) {
  return children;
}
