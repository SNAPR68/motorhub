"use client";

import { Skeleton } from "@/components/ui/Skeleton";

export default function SettingsLoading() {
  return (
    <div className="min-h-dvh p-6" style={{ background: "#111621" }}>
      <div className="max-w-md mx-auto space-y-6">
        <Skeleton className="h-8 w-24" />
        <div className="space-y-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
