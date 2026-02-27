"use client";

import { use, useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

/* ─── Color Options Page ─── */

const COLORS = [
  { name: "Pearl White", hex: "#f5f5f0", tint: "brightness(1.15) saturate(0.3)" },
  { name: "Midnight Black", hex: "#1a1a1a", tint: "brightness(0.3) saturate(0.1)" },
  { name: "Blazing Red", hex: "#dc2626", tint: "brightness(0.7) saturate(1.6) hue-rotate(-10deg)" },
  { name: "Arctic Blue", hex: "#3b82f6", tint: "brightness(0.8) saturate(1.3) hue-rotate(190deg)" },
  { name: "Natural Beige", hex: "#d4a574", tint: "brightness(0.9) saturate(0.6) sepia(0.4)" },
  { name: "Titanium Grey", hex: "#6b7280", tint: "brightness(0.6) saturate(0.2)" },
];

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function ColoursPage({
  params,
}: {
  params: Promise<{ brand: string; model: string }>;
}) {
  const { brand, model } = use(params);
  const displayModel = capitalize(model);
  const [selected, setSelected] = useState(0);

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
          <h1 className="text-base font-bold text-white">{displayModel} Colors</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-5 space-y-6">
        {/* ─── Car Silhouette ─── */}
        <div
          className="relative rounded-2xl overflow-hidden border border-white/5"
          style={{ background: "rgba(255,255,255,0.03)", aspectRatio: "16/9" }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center transition-all duration-500"
            style={{ filter: COLORS[selected].tint }}
          >
            <div className="relative w-4/5 h-3/5">
              {/* Car silhouette SVG placeholder */}
              <svg viewBox="0 0 400 180" className="w-full h-full" fill="none">
                <path
                  d="M50 130 C50 130 70 80 120 70 L180 60 C200 55 220 45 260 45 L310 50 C340 55 360 70 370 90 L380 120 C380 128 375 130 370 130 L50 130Z"
                  fill={COLORS[selected].hex}
                  opacity="0.9"
                />
                <ellipse cx="110" cy="135" rx="22" ry="22" fill="#222" stroke="#444" strokeWidth="3" />
                <ellipse cx="110" cy="135" rx="10" ry="10" fill="#555" />
                <ellipse cx="310" cy="135" rx="22" ry="22" fill="#222" stroke="#444" strokeWidth="3" />
                <ellipse cx="310" cy="135" rx="10" ry="10" fill="#555" />
                <path
                  d="M140 70 L170 60 L250 52 L280 55 L260 70 Z"
                  fill="rgba(150,200,255,0.2)"
                  stroke="rgba(150,200,255,0.15)"
                />
              </svg>
            </div>
          </div>

          {/* Color name overlay */}
          <div className="absolute bottom-4 left-4">
            <p className="text-lg font-bold text-white">{COLORS[selected].name}</p>
            <p className="text-xs text-slate-400">Tap a color below to preview</p>
          </div>
        </div>

        {/* ─── Color Swatches ─── */}
        <div
          className="rounded-2xl p-5 border border-white/5"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">
            Available Colors
          </p>
          <div className="grid grid-cols-3 gap-4">
            {COLORS.map((color, i) => (
              <button
                key={color.name}
                onClick={() => setSelected(i)}
                className="flex flex-col items-center gap-2 transition-all"
              >
                <div
                  className="rounded-full transition-all duration-300 border-2"
                  style={{
                    width: selected === i ? "56px" : "44px",
                    height: selected === i ? "56px" : "44px",
                    background: color.hex,
                    borderColor: selected === i ? "#1152d4" : "rgba(255,255,255,0.1)",
                    boxShadow:
                      selected === i
                        ? `0 0 0 3px rgba(17,82,212,0.3), 0 4px 12px ${color.hex}40`
                        : "none",
                  }}
                />
                <span
                  className={`text-[11px] font-semibold text-center leading-tight ${
                    selected === i ? "text-white" : "text-slate-500"
                  }`}
                >
                  {color.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected color details */}
        <div
          className="rounded-2xl p-4 border border-white/5 flex items-center gap-4"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div
            className="h-12 w-12 rounded-xl shrink-0 border border-white/10"
            style={{ background: COLORS[selected].hex }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white">{COLORS[selected].name}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Solid paint finish -- no additional cost
            </p>
          </div>
          <MaterialIcon name="check_circle" className="text-[22px] text-emerald-500 shrink-0" />
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
