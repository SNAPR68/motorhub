"use client";

import { use } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

/* ─── EV data keyed by brand-model slug ─── */
const EV_DATA: Record<
  string,
  {
    name: string;
    brand: string;
    range: string;
    battery: string;
    chargingTime: string;
    acceleration: string;
    price: string;
    variants: { name: string; range: string; price: string }[];
  }
> = {
  "tata-nexon-ev": {
    name: "Nexon EV",
    brand: "Tata",
    range: "465 km",
    battery: "40.5 kWh",
    chargingTime: "56 min (10-80%)",
    acceleration: "8.9s",
    price: "\u20B914.99 Lakh",
    variants: [
      { name: "Creative+", range: "325 km", price: "\u20B914.99 Lakh" },
      { name: "Fearless+", range: "325 km", price: "\u20B916.49 Lakh" },
      { name: "Empowered+ LR", range: "465 km", price: "\u20B918.49 Lakh" },
    ],
  },
  "tata-punch-ev": {
    name: "Punch EV",
    brand: "Tata",
    range: "421 km",
    battery: "35 kWh",
    chargingTime: "60 min (10-80%)",
    acceleration: "9.5s",
    price: "\u20B910.99 Lakh",
    variants: [
      { name: "Adventure", range: "315 km", price: "\u20B910.99 Lakh" },
      { name: "Empowered", range: "315 km", price: "\u20B912.49 Lakh" },
      { name: "Empowered+ LR", range: "421 km", price: "\u20B914.49 Lakh" },
    ],
  },
  "mg-zs-ev": {
    name: "ZS EV",
    brand: "MG",
    range: "461 km",
    battery: "50.3 kWh",
    chargingTime: "42 min (10-80%)",
    acceleration: "8.5s",
    price: "\u20B922.88 Lakh",
    variants: [
      { name: "Excite", range: "461 km", price: "\u20B922.88 Lakh" },
      { name: "Exclusive", range: "461 km", price: "\u20B925.88 Lakh" },
    ],
  },
  "hyundai-ioniq-5": {
    name: "Ioniq 5",
    brand: "Hyundai",
    range: "631 km",
    battery: "72.6 kWh",
    chargingTime: "18 min (10-80%)",
    acceleration: "5.2s",
    price: "\u20B944.95 Lakh",
    variants: [
      { name: "Standard Range RWD", range: "502 km", price: "\u20B944.95 Lakh" },
      { name: "Long Range RWD", range: "631 km", price: "\u20B948.95 Lakh" },
      { name: "Long Range AWD", range: "575 km", price: "\u20B951.95 Lakh" },
    ],
  },
};

const DEFAULT_EV = {
  name: "",
  brand: "",
  range: "400 km",
  battery: "40 kWh",
  chargingTime: "50 min (10-80%)",
  acceleration: "9.0s",
  price: "\u20B915.00 Lakh",
  variants: [
    { name: "Base", range: "320 km", price: "\u20B913.00 Lakh" },
    { name: "Mid", range: "400 km", price: "\u20B915.00 Lakh" },
    { name: "Top", range: "450 km", price: "\u20B918.00 Lakh" },
  ],
};

function capitalize(s: string) {
  return s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const EV_STATS_ICONS = [
  { label: "Range", icon: "route", key: "range" as const },
  { label: "Battery", icon: "battery_charging_full", key: "battery" as const },
  { label: "Fast Charge", icon: "bolt", key: "chargingTime" as const },
  { label: "0\u2013100 km/h", icon: "speed", key: "acceleration" as const },
];

export default function EvModelPage({
  params,
}: {
  params: Promise<{ brand: string; model: string }>;
}) {
  const { brand, model } = use(params);
  const brandName = capitalize(brand);
  const modelName = capitalize(model);
  const dataKey = `${brand}-${model}`;
  const ev = EV_DATA[dataKey] ?? {
    ...DEFAULT_EV,
    name: modelName,
    brand: brandName,
  };

  return (
    <div
      className="min-h-dvh w-full pb-28"
      style={{ background: "#080a0f", color: "#e2e8f0" }}
    >
      {/* ─── HEADER ─── */}
      <header
        className="sticky top-0 z-40 border-b border-white/5"
        style={{
          background: "rgba(8,10,15,0.97)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/electric-cars"
              className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <MaterialIcon
                name="arrow_back"
                className="text-[20px] text-slate-300"
              />
            </Link>
            <div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                {ev.brand || brandName}
              </p>
              <h1 className="text-lg font-bold text-white">
                {ev.name || modelName} Electric
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-5">
        {/* ─── HERO IMAGE PLACEHOLDER ─── */}
        <div
          className="rounded-2xl overflow-hidden border flex items-center justify-center"
          style={{
            height: "200px",
            background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(17,82,212,0.08))",
            borderColor: "rgba(16,185,129,0.15)",
          }}
        >
          <div className="text-center">
            <MaterialIcon
              name="electric_car"
              className="text-[56px]"
              style={{ color: "#10b981" }}
            />
            <p className="text-[11px] text-slate-500 mt-1">
              {ev.brand || brandName} {ev.name || modelName}
            </p>
          </div>
        </div>

        {/* ─── KEY EV STATS ─── */}
        <div className="grid grid-cols-2 gap-3">
          {EV_STATS_ICONS.map((stat) => (
            <div
              key={stat.key}
              className="rounded-2xl p-4 border"
              style={{
                background: "rgba(255,255,255,0.035)",
                borderColor: "rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ background: "rgba(16,185,129,0.12)" }}
                >
                  <MaterialIcon
                    name={stat.icon}
                    className="text-[18px]"
                    style={{ color: "#10b981" }}
                  />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {stat.label}
                </p>
              </div>
              <p className="text-lg font-black text-white">{ev[stat.key]}</p>
            </div>
          ))}
        </div>

        {/* ─── PRICE ─── */}
        <div
          className="rounded-2xl p-5 border text-center"
          style={{
            background: "rgba(17,82,212,0.06)",
            borderColor: "rgba(17,82,212,0.15)",
          }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
            Starting Price
          </p>
          <p className="text-2xl font-black text-white">{ev.price}</p>
          <p className="text-[11px] text-slate-400 mt-1">
            Ex-showroom price &middot; {ev.variants.length} variants available
          </p>
        </div>

        {/* ─── VARIANTS ─── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MaterialIcon
              name="tune"
              className="text-[18px]"
              style={{ color: "#f59e0b" }}
            />
            <h2 className="text-sm font-bold text-white">Variants</h2>
          </div>
          <div className="space-y-2">
            {ev.variants.map((variant, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl p-3 border"
                style={{
                  background: "rgba(255,255,255,0.035)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                <div>
                  <p className="text-[13px] font-semibold text-white">
                    {variant.name}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Range: {variant.range}
                  </p>
                </div>
                <p
                  className="text-[13px] font-bold shrink-0"
                  style={{ color: "#10b981" }}
                >
                  {variant.price}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── BOOK NOW CTA ─── */}
        <div className="flex gap-3">
          <button
            className="flex-1 flex items-center justify-center gap-2 h-12 rounded-2xl text-sm font-bold text-white"
            style={{ background: "#10b981" }}
          >
            <MaterialIcon name="electric_car" className="text-[20px]" />
            Book Now
          </button>
          <button
            className="flex items-center justify-center gap-2 h-12 rounded-2xl px-5 text-sm font-bold border"
            style={{
              background: "rgba(255,255,255,0.04)",
              borderColor: "rgba(255,255,255,0.1)",
              color: "#e2e8f0",
            }}
          >
            <MaterialIcon name="calculate" className="text-[20px]" />
            EMI
          </button>
        </div>

        {/* ─── CHARGING INFO ─── */}
        <div
          className="rounded-2xl p-4 border"
          style={{
            background: "rgba(255,255,255,0.035)",
            borderColor: "rgba(255,255,255,0.07)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <MaterialIcon
              name="ev_station"
              className="text-[18px]"
              style={{ color: "#1152d4" }}
            />
            <h2 className="text-sm font-bold text-white">Charging</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">
                DC Fast Charge
              </p>
              <p className="text-[13px] font-semibold text-white">
                {ev.chargingTime}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">
                Home Charging
              </p>
              <p className="text-[13px] font-semibold text-white">
                8-10 hours (AC)
              </p>
            </div>
          </div>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
