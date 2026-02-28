"use client";

export default function SellCarLoading() {
  return (
    <div className="min-h-dvh p-6" style={{ background: "#0a0c10" }}>
      <div className="max-w-md mx-auto space-y-6">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-white/5" />
        <div className="h-48 animate-pulse rounded-2xl bg-white/[0.03] border border-white/5" />
        <div className="space-y-4">
          <div className="h-14 animate-pulse rounded-xl bg-white/[0.03] border border-white/5" />
          <div className="h-14 animate-pulse rounded-xl bg-white/[0.03] border border-white/5" />
          <div className="h-14 animate-pulse rounded-xl bg-white/[0.03] border border-white/5" />
          <div className="h-14 animate-pulse rounded-xl bg-white/[0.03] border border-white/5" />
        </div>
      </div>
    </div>
  );
}
