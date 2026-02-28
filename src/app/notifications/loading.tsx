"use client";

export default function NotificationsLoading() {
  return (
    <div className="min-h-dvh p-6" style={{ background: "#0a0c10" }}>
      <div className="max-w-md mx-auto space-y-4">
        <div className="h-8 w-36 animate-pulse rounded-lg bg-white/5" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-white/[0.03] border border-white/5" />
        ))}
      </div>
    </div>
  );
}
