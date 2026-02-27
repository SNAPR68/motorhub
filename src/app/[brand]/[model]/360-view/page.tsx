"use client";

import { use, useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

/* ─── 360-Degree View Page ─── */

type ViewMode = "exterior" | "interior";

const EXTERIOR_HOTSPOTS = [
  { x: 22, y: 38, label: "LED DRLs" },
  { x: 50, y: 20, label: "Roof Rails" },
  { x: 78, y: 42, label: "LED Tail Lamps" },
  { x: 35, y: 70, label: "16\" Alloy Wheels" },
  { x: 65, y: 72, label: "Rear Disc Brakes" },
];

const INTERIOR_HOTSPOTS = [
  { x: 30, y: 30, label: "Touchscreen Infotainment" },
  { x: 55, y: 45, label: "Steering Controls" },
  { x: 75, y: 30, label: "Digital Instrument Cluster" },
  { x: 42, y: 70, label: "Centre Console" },
];

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function ThreeSixtyViewPage({
  params,
}: {
  params: Promise<{ brand: string; model: string }>;
}) {
  const { brand, model } = use(params);
  const displayModel = capitalize(model);

  const [mode, setMode] = useState<ViewMode>("exterior");
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const hotspots = mode === "exterior" ? EXTERIOR_HOTSPOTS : INTERIOR_HOTSPOTS;

  return (
    <div className="min-h-dvh w-full pb-28" style={{ background: "#080a0f", color: "#e2e8f0" }}>
      {/* ─── HEADER ─── */}
      <header
        className="sticky top-0 z-40 border-b border-white/5"
        style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href={`/${brand}/${model}`}
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
          </Link>
          <h1 className="text-base font-bold text-white">{displayModel} 360 View</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-5 space-y-5">
        {/* ─── Toggle: Exterior / Interior ─── */}
        <div
          className="flex rounded-xl p-1 border border-white/5"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          {(["exterior", "interior"] as ViewMode[]).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setActiveHotspot(null);
              }}
              className="flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
              style={{
                background: mode === m ? "#1152d4" : "transparent",
                color: mode === m ? "#fff" : "#64748b",
              }}
            >
              {m === "exterior" ? "Exterior" : "Interior"}
            </button>
          ))}
        </div>

        {/* ─── 360 Viewer ─── */}
        <div
          className="relative rounded-2xl border border-white/5 overflow-hidden"
          style={{
            background: mode === "exterior"
              ? "linear-gradient(135deg, rgba(17,82,212,0.08) 0%, rgba(8,10,15,1) 50%, rgba(16,185,129,0.05) 100%)"
              : "linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(8,10,15,1) 50%, rgba(245,158,11,0.05) 100%)",
            aspectRatio: "4/3",
          }}
        >
          {/* Centre icon */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <MaterialIcon
              name="360"
              className="text-[64px] text-slate-700 mb-2"
            />
            <p className="text-sm font-semibold text-slate-500">
              {mode === "exterior" ? "Exterior View" : "Interior View"}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <MaterialIcon name="swipe" className="text-[16px] text-slate-600" />
              <p className="text-xs text-slate-600">Drag to rotate</p>
            </div>
          </div>

          {/* Hotspot markers */}
          {hotspots.map((spot) => (
            <button
              key={spot.label}
              onClick={() =>
                setActiveHotspot(activeHotspot === spot.label ? null : spot.label)
              }
              className="absolute group"
              style={{ left: `${spot.x}%`, top: `${spot.y}%`, transform: "translate(-50%, -50%)" }}
            >
              {/* Pulsing dot */}
              <span className="relative flex h-4 w-4">
                <span
                  className="absolute inset-0 rounded-full animate-ping opacity-40"
                  style={{ background: "#1152d4" }}
                />
                <span
                  className="relative inline-flex rounded-full h-4 w-4 border-2 border-white/30"
                  style={{ background: activeHotspot === spot.label ? "#1152d4" : "rgba(17,82,212,0.7)" }}
                />
              </span>

              {/* Label tooltip */}
              {activeHotspot === spot.label && (
                <div
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white"
                  style={{ background: "rgba(17,82,212,0.95)", backdropFilter: "blur(8px)" }}
                >
                  {spot.label}
                  <div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
                    style={{ background: "rgba(17,82,212,0.95)" }}
                  />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* ─── Hotspot Legend ─── */}
        <div
          className="rounded-2xl p-4 border border-white/5"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
            Key Features ({mode === "exterior" ? "Exterior" : "Interior"})
          </p>
          <div className="grid grid-cols-2 gap-2">
            {hotspots.map((spot) => (
              <button
                key={spot.label}
                onClick={() =>
                  setActiveHotspot(activeHotspot === spot.label ? null : spot.label)
                }
                className="flex items-center gap-2 p-2 rounded-lg transition-all"
                style={{
                  background:
                    activeHotspot === spot.label
                      ? "rgba(17,82,212,0.1)"
                      : "rgba(255,255,255,0.02)",
                  borderWidth: 1,
                  borderColor:
                    activeHotspot === spot.label
                      ? "rgba(17,82,212,0.3)"
                      : "rgba(255,255,255,0.05)",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: "#1152d4" }}
                />
                <span
                  className={`text-[11px] font-semibold ${
                    activeHotspot === spot.label ? "text-white" : "text-slate-400"
                  }`}
                >
                  {spot.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ─── Gallery Link ─── */}
        <Link
          href={`/${brand}/${model}/images`}
          className="flex items-center justify-center gap-2 w-full h-12 rounded-2xl text-sm font-bold text-white border border-white/10"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <MaterialIcon name="photo_library" className="text-[18px]" />
          View Image Gallery
        </Link>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
