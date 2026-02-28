"use client";

export default function CompareLoading() {
  return (
    <div className="min-h-dvh p-6" style={{ background: "#0a0c10" }}>
      <div className="max-w-md mx-auto space-y-6">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-white/5" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-40 animate-pulse rounded-xl bg-white/[0.03] border border-white/5" />
          <div className="h-40 animate-pulse rounded-xl bg-white/[0.03] border border-white/5" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-white/[0.03] border border-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}
