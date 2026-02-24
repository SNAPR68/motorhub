"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div
      className="min-h-dvh flex items-center justify-center px-8"
      style={{ background: "#0a0c10", fontFamily: "'Manrope', sans-serif" }}
    >
      <div className="text-center max-w-sm">
        <MaterialIcon name="error" className="text-6xl text-red-400 mb-4" />
        <h1 className="text-2xl font-bold text-slate-100 mb-2">Something went wrong</h1>
        <p className="text-sm text-slate-400 mb-8 leading-relaxed">
          We encountered an unexpected error. Our team has been notified.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-xl bg-[#137fec] text-white text-sm font-bold transition-all active:scale-95"
          >
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl border border-slate-600 text-slate-300 text-sm font-bold transition-all active:scale-95 hover:bg-white/5"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
