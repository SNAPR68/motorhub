"use client";

import { cn } from "@/lib/utils";
import { BuyerAppShell } from "@/components/BuyerAppShell";

interface BuyerPageLayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
  className?: string;
}

export function BuyerPageLayout({
  children,
  hideNav,
  className,
}: BuyerPageLayoutProps) {
  if (hideNav) {
    /* No shell — full-screen overlays (login, onboarding, etc.) */
    return (
      <div className={cn("dark-page min-h-dvh w-full", className)}>
        <div className="mx-auto max-w-lg md:max-w-none">{children}</div>
      </div>
    );
  }

  return (
    <BuyerAppShell>
      <div className={cn("dark-page min-h-dvh w-full", className)}>
        {children}
      </div>
    </BuyerAppShell>
  );
}
