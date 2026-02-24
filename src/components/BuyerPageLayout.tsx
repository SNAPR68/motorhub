"use client";

import { cn } from "@/lib/utils";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

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
  return (
    <div
      className={cn(
        "dark-page min-h-dvh w-full",
        !hideNav && "pb-28",
        className
      )}
    >
      <div className="mx-auto max-w-lg">{children}</div>
      {!hideNav && <BuyerBottomNav />}
    </div>
  );
}
