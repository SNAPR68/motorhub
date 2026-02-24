"use client";

import { cn } from "@/lib/utils";
import { MaterialIcon } from "@/components/MaterialIcon";

interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: "dark" | "light";
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = "dark",
  className,
}: EmptyStateProps) {
  const isDark = variant === "dark";

  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-6 text-center", className)}>
      <MaterialIcon
        name={icon}
        className={cn("text-5xl mb-4", isDark ? "text-slate-600" : "text-slate-300")}
      />
      <h3
        className={cn(
          "text-sm font-semibold mb-1",
          isDark ? "text-slate-400" : "text-slate-500"
        )}
      >
        {title}
      </h3>
      {description && (
        <p
          className={cn(
            "text-xs max-w-[240px] leading-relaxed",
            isDark ? "text-slate-500" : "text-slate-400"
          )}
        >
          {description}
        </p>
      )}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className={cn(
            "mt-4 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-95",
            isDark
              ? "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
              : "bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200"
          )}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
