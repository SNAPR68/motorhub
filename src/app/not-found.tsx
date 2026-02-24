"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";

export default function NotFound() {
  return (
    <div
      className="min-h-dvh flex items-center justify-center px-8"
      style={{ background: "#0a0c10", fontFamily: "'Manrope', sans-serif" }}
    >
      <div className="text-center max-w-sm">
        <MaterialIcon name="explore_off" className="text-6xl text-slate-600 mb-4" />
        <h1 className="text-2xl font-bold text-slate-100 mb-2">Page not found</h1>
        <p className="text-sm text-slate-400 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-[#137fec] text-white text-sm font-bold transition-all active:scale-95"
          >
            Go Home
          </Link>
          <Link
            href="/showroom"
            className="px-6 py-3 rounded-xl border border-slate-600 text-slate-300 text-sm font-bold transition-all active:scale-95 hover:bg-white/5"
          >
            Browse Cars
          </Link>
        </div>
      </div>
    </div>
  );
}
