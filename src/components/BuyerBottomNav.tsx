"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BUYER_NAV_ITEMS } from "@/lib/constants";

interface BuyerBottomNavProps {
  className?: string;
}

export function BuyerBottomNav({ className }: BuyerBottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 max-w-lg mx-auto px-6 pb-8 pt-4",
        className
      )}
    >
      <div className="glass-effect mx-auto flex h-16 max-w-md items-center justify-around rounded-full px-4 shadow-2xl">
        {BUYER_NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-slate-400 hover:text-primary/80"
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
