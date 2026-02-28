"use client";

export default function PlansLoading() {
  return (
    <div className="min-h-dvh p-6" style={{ background: "#221e10" }}>
      <div className="max-w-md mx-auto space-y-6">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-white/5 mx-auto" />
        <div className="h-12 animate-pulse rounded-xl bg-white/5" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-xl bg-white/[0.03] border border-white/5" />
        ))}
      </div>
    </div>
  );
}
