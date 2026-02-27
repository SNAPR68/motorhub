"use client";

import { use } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

/* ─── Features List Page ─── */

interface Feature {
  name: string;
  available: boolean;
}

const FEATURE_CATEGORIES: { title: string; icon: string; features: Feature[] }[] = [
  {
    title: "Safety",
    icon: "shield",
    features: [
      { name: "Dual Front Airbags", available: true },
      { name: "ABS with EBD", available: true },
      { name: "Electronic Stability Control", available: true },
      { name: "Rear Parking Sensors", available: true },
      { name: "ISOFIX Child Seat Mounts", available: true },
      { name: "360-Degree Camera", available: false },
    ],
  },
  {
    title: "Comfort",
    icon: "airline_seat_recline_extra",
    features: [
      { name: "Automatic Climate Control", available: true },
      { name: "Push Button Start", available: true },
      { name: "Height-Adjustable Driver Seat", available: true },
      { name: "Rear AC Vents", available: true },
      { name: "Cooled Glove Box", available: false },
      { name: "Ventilated Seats", available: false },
    ],
  },
  {
    title: "Entertainment",
    icon: "music_note",
    features: [
      { name: "7-inch Touchscreen Infotainment", available: true },
      { name: "Android Auto & Apple CarPlay", available: true },
      { name: "6-Speaker Sound System", available: true },
      { name: "Wireless Charging", available: false },
    ],
  },
  {
    title: "Exterior",
    icon: "directions_car",
    features: [
      { name: "LED Projector Headlamps", available: true },
      { name: "LED DRLs", available: true },
      { name: "16-inch Alloy Wheels", available: true },
      { name: "Roof Rails", available: false },
    ],
  },
];

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function FeaturesPage({
  params,
}: {
  params: Promise<{ brand: string; model: string }>;
}) {
  const { brand, model } = use(params);
  const displayModel = capitalize(model);

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
          <h1 className="text-base font-bold text-white">{displayModel} Features</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-5 space-y-5">
        {FEATURE_CATEGORIES.map((cat) => (
          <div
            key={cat.title}
            className="rounded-2xl border border-white/5 overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            {/* Category header */}
            <div className="flex items-center gap-3 px-4 pt-4 pb-3">
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(17,82,212,0.1)" }}
              >
                <MaterialIcon name={cat.icon} className="text-[18px]" style={{ color: "#1152d4" }} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{cat.title}</p>
                <p className="text-[10px] text-slate-500">
                  {cat.features.filter((f) => f.available).length} of {cat.features.length} available
                </p>
              </div>
            </div>

            {/* Feature list */}
            {cat.features.map((feat, i) => (
              <div
                key={feat.name}
                className={`flex items-center gap-3 px-4 py-3 ${i > 0 || true ? "border-t border-white/5" : ""}`}
              >
                <MaterialIcon
                  name={feat.available ? "check_circle" : "close"}
                  className={`text-[18px] shrink-0 ${
                    feat.available ? "text-emerald-500" : "text-red-500"
                  }`}
                />
                <span
                  className={`text-sm ${
                    feat.available ? "text-slate-200" : "text-slate-500 line-through"
                  }`}
                >
                  {feat.name}
                </span>
                {!feat.available && (
                  <span className="ml-auto text-[10px] text-red-400 font-semibold">Not Available</span>
                )}
              </div>
            ))}
          </div>
        ))}

        {/* Summary */}
        <div
          className="rounded-2xl p-4 border border-blue-500/20 text-center"
          style={{ background: "rgba(17,82,212,0.06)" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1">
            Total Features
          </p>
          <p className="text-2xl font-black text-white">
            {FEATURE_CATEGORIES.reduce((acc, c) => acc + c.features.filter((f) => f.available).length, 0)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            out of {FEATURE_CATEGORIES.reduce((acc, c) => acc + c.features.length, 0)} in top variant
          </p>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
