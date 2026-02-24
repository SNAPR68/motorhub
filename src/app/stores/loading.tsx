"use client";

import { SkeletonList } from "@/components/ui/Skeleton";

export default function StoresLoading() {
  return (
    <div className="min-h-dvh p-6" style={{ background: "#0a0f0f" }}>
      <div className="max-w-md mx-auto space-y-6">
        <div className="h-8 w-36 animate-pulse rounded-lg bg-white/5" />
        <SkeletonList count={3} variant="dark" />
      </div>
    </div>
  );
}
