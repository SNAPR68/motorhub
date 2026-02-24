"use client";

import { SkeletonCard } from "@/components/ui/Skeleton";

export default function InventoryLoading() {
  return (
    <div className="min-h-dvh p-6" style={{ background: "#0a0c10" }}>
      <div className="max-w-md mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="h-8 w-32 animate-pulse rounded-lg bg-white/5" />
          <div className="flex gap-2">
            <div className="h-10 w-10 animate-pulse rounded-full bg-white/5" />
            <div className="h-10 w-10 animate-pulse rounded-full bg-white/5" />
          </div>
        </div>
        <div className="flex gap-3">
          {[90, 70, 70].map((w, i) => (
            <div key={i} className="h-10 animate-pulse rounded-full bg-white/5" style={{ width: w }} />
          ))}
        </div>
        <SkeletonCard variant="dark" />
        <SkeletonCard variant="dark" />
      </div>
    </div>
  );
}
