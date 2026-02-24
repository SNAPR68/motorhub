"use client";

import { MaterialIcon } from "@/components/MaterialIcon";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
      <MaterialIcon name="warning" className="text-5xl text-amber-400 mb-4" />
      <h2 className="text-lg font-bold text-white mb-2">Failed to load dashboard</h2>
      <p className="text-sm text-slate-400 mb-6 max-w-xs">{error.message}</p>
      <button
        onClick={reset}
        className="bg-[#137fec] text-white px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
      >
        Try Again
      </button>
    </div>
  );
}
