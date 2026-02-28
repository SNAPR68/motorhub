import type { Metadata } from "next";
import DealerAppShell from "@/components/DealerAppShell";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Track dealership performance with AI-powered analytics. Revenue trends, lead conversion rates, and inventory health insights.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DealerAppShell>{children}</DealerAppShell>;
}
