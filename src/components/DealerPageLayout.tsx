"use client";

import { cn } from "@/lib/utils";
import { DealerBottomNav } from "@/components/DealerBottomNav";

interface DealerPageLayoutProps {
  children: React.ReactNode;
  showFAB?: boolean;
  hideNav?: boolean;
  className?: string;
}

export function DealerPageLayout({
  children,
  showFAB = true,
  hideNav,
  className,
}: DealerPageLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-dvh w-full bg-[#f6f6f8] text-slate-900",
        !hideNav && "pb-28",
        className
      )}
    >
      <div className="mx-auto max-w-lg">{children}</div>
      {!hideNav && <DealerBottomNav showFAB={showFAB} />}
    </div>
  );
}
