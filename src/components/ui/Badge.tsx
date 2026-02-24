"use client";

import { cn } from "@/lib/utils";
import { MaterialIcon } from "@/components/MaterialIcon";

type BadgeVariant = "ai" | "status" | "source" | "pill";

interface BadgeProps {
  variant?: BadgeVariant;
  label: string;
  color?: string;
  dotColor?: string;
  className?: string;
}

export function Badge({
  variant = "pill",
  label,
  color,
  dotColor,
  className,
}: BadgeProps) {
  if (variant === "ai") {
    return (
      <span
        className={cn(
          "glass-panel inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#7C3AED] border border-[#7C3AED]/30",
          className
        )}
      >
        <MaterialIcon name="auto_awesome" className="text-[14px]" />
        {label}
      </span>
    );
  }

  if (variant === "status") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md",
          color,
          className
        )}
      >
        {dotColor && (
          <span className={cn("h-1.5 w-1.5 rounded-full", dotColor)} />
        )}
        {label}
      </span>
    );
  }

  if (variant === "source") {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
          color || "bg-primary text-white",
          className
        )}
      >
        {label}
      </span>
    );
  }

  // pill (default)
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        color || "bg-primary/10 text-primary",
        className
      )}
    >
      {label}
    </span>
  );
}
