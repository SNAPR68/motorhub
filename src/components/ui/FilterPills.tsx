"use client";

import { cn } from "@/lib/utils";

interface FilterPillsProps {
  filters: string[];
  activeIndex: number;
  onSelect: (index: number) => void;
  variant?: "dark" | "light";
  className?: string;
}

export function FilterPills({
  filters,
  activeIndex,
  onSelect,
  variant = "dark",
  className,
}: FilterPillsProps) {
  return (
    <div
      className={cn(
        "flex gap-3 overflow-x-auto no-scrollbar",
        className
      )}
    >
      {filters.map((filter, i) => {
        const isActive = i === activeIndex;

        if (variant === "dark") {
          return (
            <button
              key={filter}
              onClick={() => onSelect(i)}
              className={cn(
                "flex h-10 shrink-0 items-center justify-center rounded-full px-6 text-sm font-semibold transition-all",
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "glass-panel text-slate-300 hover:bg-slate-800"
              )}
            >
              {filter}
            </button>
          );
        }

        // light variant
        return (
          <button
            key={filter}
            onClick={() => onSelect(i)}
            className={cn(
              "flex h-9 shrink-0 items-center justify-center rounded-full px-5 text-sm font-medium transition-all border",
              isActive
                ? "bg-primary text-white border-primary"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            )}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
