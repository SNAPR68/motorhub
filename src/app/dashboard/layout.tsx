import type { Metadata } from "next";
import DealerAppShell from "@/components/DealerAppShell";

export const metadata: Metadata = {
  title: "Dealer Dashboard",
  description: "Manage your dealership with AI-powered insights, inventory tracking, lead management, and performance analytics.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DealerAppShell>{children}</DealerAppShell>;
}
