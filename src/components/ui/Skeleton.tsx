"use client";

import { cn } from "@/lib/utils";

/* ── Base Skeleton ── */

export function Skeleton({
  className,
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg",
        variant === "dark" ? "bg-white/5" : "bg-slate-200",
        className
      )}
    />
  );
}

/* ── Skeleton Card (vehicle / listing card) ── */

export function SkeletonCard({ variant = "dark" }: { variant?: "dark" | "light" }) {
  return (
    <div className="rounded-xl overflow-hidden">
      <Skeleton variant={variant} className="aspect-[4/5] sm:aspect-video w-full" />
      <div className="pt-4 space-y-2">
        <Skeleton variant={variant} className="h-4 w-3/4" />
        <Skeleton variant={variant} className="h-3 w-1/2" />
      </div>
    </div>
  );
}

/* ── Skeleton Row (list item) ── */

export function SkeletonRow({ variant = "dark" }: { variant?: "dark" | "light" }) {
  return (
    <div className="flex items-center gap-4 py-4">
      <Skeleton variant={variant} className="h-12 w-12 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton variant={variant} className="h-4 w-2/3" />
        <Skeleton variant={variant} className="h-3 w-1/3" />
      </div>
    </div>
  );
}

/* ── Skeleton List (multiple rows) ── */

export function SkeletonList({
  count = 3,
  variant = "dark",
}: {
  count?: number;
  variant?: "dark" | "light";
}) {
  return (
    <div className="space-y-1 px-4">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonRow key={i} variant={variant} />
      ))}
    </div>
  );
}

/* ── Skeleton Stat Card (dashboard metric) ── */

export function SkeletonStat({ variant = "dark" }: { variant?: "dark" | "light" }) {
  return (
    <div
      className={cn(
        "rounded-xl p-4 space-y-3",
        variant === "dark" ? "bg-white/[0.03] border border-white/5" : "bg-white border border-slate-200"
      )}
    >
      <Skeleton variant={variant} className="h-3 w-20" />
      <Skeleton variant={variant} className="h-7 w-24" />
      <Skeleton variant={variant} className="h-3 w-16" />
    </div>
  );
}
