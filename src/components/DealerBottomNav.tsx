"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MaterialIcon } from "@/components/MaterialIcon";
import { DEALER_NAV_ITEMS } from "@/lib/constants";

interface DealerBottomNavProps {
  showFAB?: boolean;
  className?: string;
}

export function DealerBottomNav({
  showFAB = true,
  className,
}: DealerBottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 max-w-lg mx-auto border-t border-white/10 bg-[#101622]/95 ios-blur px-4 pb-8 pt-2",
        className
      )}
    >
      <div className="mx-auto flex max-w-md items-center justify-around relative">
        {DEALER_NAV_ITEMS.map((item, i) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          // Center FAB slot
          if (i === 2 && showFAB) {
            return (
              <div key={item.href} className="relative flex flex-col items-center">
                <Link
                  href={item.href}
                  className="absolute -top-8 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 transition-transform active:scale-90"
                >
                  <MaterialIcon name="add" className="text-[28px]" />
                </Link>
                <span className="mt-8 text-[9px] font-bold uppercase tracking-tight text-primary">
                  {item.label}
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-1 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-slate-400 hover:text-primary"
              )}
            >
              <MaterialIcon
                name={item.icon}
                fill={isActive}
                className="text-[24px]"
              />
              <span className="text-[9px] font-bold uppercase tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
