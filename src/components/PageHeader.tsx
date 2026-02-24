"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { MaterialIcon } from "@/components/MaterialIcon";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  rightAction?: ReactNode;
  variant?: "dark" | "light";
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  backHref,
  rightAction,
  variant = "dark",
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex items-center justify-between px-6 py-4",
        variant === "dark"
          ? "bg-[#101622]/80 backdrop-blur-xl border-b border-white/5"
          : "bg-white/80 backdrop-blur-xl border-b border-slate-100",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {backHref && (
          <Link
            href={backHref}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
              variant === "dark"
                ? "glass-effect hover:bg-white/10"
                : "bg-slate-100 hover:bg-slate-200"
            )}
          >
            <MaterialIcon
              name="arrow_back_ios_new"
              className={cn(
                "text-[20px]",
                variant === "dark" ? "text-white" : "text-slate-700"
              )}
            />
          </Link>
        )}
        <div>
          <h1
            className={cn(
              "text-lg font-bold",
              variant === "dark" ? "text-white" : "text-slate-900"
            )}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={cn(
                "text-xs",
                variant === "dark" ? "text-slate-400" : "text-slate-500"
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {rightAction && <div>{rightAction}</div>}
    </header>
  );
}
