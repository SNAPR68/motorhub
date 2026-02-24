"use client";

import { SkeletonList } from "@/components/ui/Skeleton";

export default function LeadsLoading() {
  return (
    <div className="min-h-dvh max-w-md mx-auto p-4" style={{ background: "#f6f7f8" }}>
      <div className="h-8 w-32 animate-pulse rounded-lg bg-slate-200 mb-4" />
      <div className="h-11 animate-pulse rounded-xl bg-slate-200 mb-4" />
      <div className="flex gap-2 mb-4">
        {[80, 60, 90, 60].map((w, i) => (
          <div key={i} className="h-8 animate-pulse rounded-full bg-slate-200" style={{ width: w }} />
        ))}
      </div>
      <SkeletonList count={4} variant="light" />
    </div>
  );
}
