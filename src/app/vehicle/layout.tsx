import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vehicle Details",
  description:
    "View detailed specifications, 360-degree virtual tour, AI condition report, and pricing for verified used cars on CaroBest.",
  openGraph: {
    title: "Vehicle Details — CaroBest",
    description:
      "Detailed specs, virtual tour, AI condition report, and pricing for verified used cars.",
  },
};

export default function VehicleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
