"use client";

import { SkeletonStat } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-dvh p-6" style={{ background: "#0a1114" }}>
      <div className="max-w-md mx-auto space-y-6">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-white/5" />
        <div className="grid grid-cols-2 gap-4">
          <SkeletonStat />
          <SkeletonStat />
          <SkeletonStat />
          <SkeletonStat />
        </div>
        <div className="h-48 animate-pulse rounded-xl bg-white/[0.03] border border-white/5" />
      </div>
    </div>
  );
}
