"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";

export default function VehicleNotFound() {
  return (
    <div
      className="min-h-dvh flex items-center justify-center px-8"
      style={{ background: "#0a0c10", fontFamily: "'Manrope', sans-serif" }}
    >
      <div className="text-center max-w-sm">
        <MaterialIcon name="directions_car" className="text-6xl text-slate-600 mb-4" />
        <h1 className="text-2xl font-bold text-slate-100 mb-2">Vehicle not found</h1>
        <p className="text-sm text-slate-400 mb-8 leading-relaxed">
          This vehicle may have been sold or is no longer available.
        </p>
        <Link
          href="/showroom"
          className="inline-block px-6 py-3 rounded-xl bg-[#137fec] text-white text-sm font-bold transition-all active:scale-95"
        >
          Browse Showroom
        </Link>
      </div>
    </div>
  );
}
