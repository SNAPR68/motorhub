"use client";

export default function ConciergeLoading() {
  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "#0a0c10" }}>
      <div className="max-w-md mx-auto w-full p-4 space-y-4">
        <div className="h-10 w-32 animate-pulse rounded-lg bg-white/5" />
        <div className="flex-1 space-y-4 py-8">
          <div className="w-3/4 h-16 animate-pulse rounded-2xl bg-white/[0.03] border border-white/5 ml-auto" />
          <div className="w-2/3 h-24 animate-pulse rounded-2xl bg-white/[0.03] border border-white/5" />
          <div className="w-3/4 h-16 animate-pulse rounded-2xl bg-white/[0.03] border border-white/5 ml-auto" />
        </div>
      </div>
    </div>
  );
}
