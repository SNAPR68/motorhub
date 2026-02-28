"use client";

export default function VehicleLoading() {
  return (
    <div className="min-h-dvh" style={{ background: "#0a0c10" }}>
      <div className="max-w-md mx-auto">
        <div className="aspect-[4/3] animate-pulse bg-white/[0.03]" />
        <div className="p-4 space-y-4">
          <div className="h-6 w-3/4 animate-pulse rounded-lg bg-white/5" />
          <div className="h-4 w-1/2 animate-pulse rounded-lg bg-white/5" />
          <div className="h-10 w-40 animate-pulse rounded-lg bg-white/5" />
          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="h-16 animate-pulse rounded-xl bg-white/[0.03] border border-white/5" />
            <div className="h-16 animate-pulse rounded-xl bg-white/[0.03] border border-white/5" />
            <div className="h-16 animate-pulse rounded-xl bg-white/[0.03] border border-white/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
