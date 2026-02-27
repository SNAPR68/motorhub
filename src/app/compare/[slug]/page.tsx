"use client";

import { use } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

/* ─── Specs data keyed by car name slug ─── */
const CAR_DATA: Record<
  string,
  {
    name: string;
    price: string;
    engine: string;
    power: string;
    torque: string;
    mileage: string;
    bootSpace: string;
    features: boolean[];
  }
> = {
  brezza: {
    name: "Maruti Brezza",
    price: "\u20B98.29 Lakh",
    engine: "1.5L Petrol",
    power: "103 bhp",
    torque: "137 Nm",
    mileage: "20.15 kmpl",
    bootSpace: "328 L",
    features: [true, true, true, false, true],
  },
  nexon: {
    name: "Tata Nexon",
    price: "\u20B98.10 Lakh",
    engine: "1.2L Turbo Petrol",
    power: "120 bhp",
    torque: "170 Nm",
    mileage: "17.4 kmpl",
    bootSpace: "350 L",
    features: [true, true, false, true, true],
  },
  creta: {
    name: "Hyundai Creta",
    price: "\u20B911.00 Lakh",
    engine: "1.5L Petrol",
    power: "115 bhp",
    torque: "144 Nm",
    mileage: "17.0 kmpl",
    bootSpace: "433 L",
    features: [true, true, true, true, true],
  },
  seltos: {
    name: "Kia Seltos",
    price: "\u20B911.09 Lakh",
    engine: "1.5L Petrol",
    power: "115 bhp",
    torque: "144 Nm",
    mileage: "17.7 kmpl",
    bootSpace: "433 L",
    features: [true, true, true, true, false],
  },
  xuv700: {
    name: "Mahindra XUV700",
    price: "\u20B914.49 Lakh",
    engine: "2.0L Turbo Petrol",
    power: "200 bhp",
    torque: "380 Nm",
    mileage: "15.5 kmpl",
    bootSpace: "445 L",
    features: [true, true, true, true, true],
  },
  fortuner: {
    name: "Toyota Fortuner",
    price: "\u20B933.43 Lakh",
    engine: "2.8L Diesel",
    power: "204 bhp",
    torque: "500 Nm",
    mileage: "10.0 kmpl",
    bootSpace: "296 L",
    features: [true, true, true, true, true],
  },
};

const DEFAULT_CAR = {
  name: "Unknown",
  price: "--",
  engine: "--",
  power: "--",
  torque: "--",
  mileage: "--",
  bootSpace: "--",
  features: [false, false, false, false, false],
};

const SPEC_ROWS = [
  { label: "Engine", key: "engine" as const },
  { label: "Power", key: "power" as const },
  { label: "Torque", key: "torque" as const },
  { label: "Mileage", key: "mileage" as const },
  { label: "Boot Space", key: "bootSpace" as const },
];

const FEATURE_LABELS = [
  "Sunroof",
  "Wireless Charging",
  "ADAS",
  "Ventilated Seats",
  "360\u00B0 Camera",
];

export default function CompareSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const parts = slug.split("-vs-");
  const car1Slug = parts[0] ?? "";
  const car2Slug = parts[1] ?? "";

  const car1 = CAR_DATA[car1Slug] ?? { ...DEFAULT_CAR, name: capitalize(car1Slug) };
  const car2 = CAR_DATA[car2Slug] ?? { ...DEFAULT_CAR, name: capitalize(car2Slug) };

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
              href="/compare"
              className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <MaterialIcon
                name="arrow_back"
                className="text-[20px] text-slate-300"
              />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-white">
                {car1.name} vs {car2.name}
              </h1>
              <p className="text-[11px] text-slate-500">
                Side-by-side comparison
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-5 space-y-6">
        {/* ─── SIDE-BY-SIDE CAR CARDS ─── */}
        <div className="grid grid-cols-2 gap-3">
          {[car1, car2].map((car, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden border"
              style={{
                background: "rgba(255,255,255,0.035)",
                borderColor:
                  i === 0
                    ? "rgba(17,82,212,0.3)"
                    : "rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="w-full aspect-[4/3] flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <MaterialIcon
                  name="directions_car"
                  className="text-[40px] text-slate-700"
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="text-[13px] font-bold text-white leading-tight">
                  {car.name}
                </h3>
                <p
                  className="text-sm font-black mt-1"
                  style={{ color: i === 0 ? "#1152d4" : "#10b981" }}
                >
                  {car.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ─── SPECS COMPARISON TABLE ─── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MaterialIcon
              name="analytics"
              className="text-[18px]"
              style={{ color: "#1152d4" }}
            />
            <h2 className="text-sm font-bold text-white">Specifications</h2>
          </div>
          <div
            className="rounded-2xl overflow-hidden border"
            style={{
              borderColor: "rgba(255,255,255,0.07)",
            }}
          >
            {SPEC_ROWS.map((spec, i) => (
              <div
                key={spec.key}
                className="grid grid-cols-[1fr_auto_1fr] items-center"
                style={{
                  background:
                    i % 2 === 0
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(255,255,255,0.015)",
                }}
              >
                <div className="p-3 text-center">
                  <p className="text-[12px] font-semibold text-white">
                    {car1[spec.key]}
                  </p>
                </div>
                <div className="px-3 py-3 border-x border-white/5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center whitespace-nowrap">
                    {spec.label}
                  </p>
                </div>
                <div className="p-3 text-center">
                  <p className="text-[12px] font-semibold text-white">
                    {car2[spec.key]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── FEATURE COMPARISON ─── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MaterialIcon
              name="checklist"
              className="text-[18px]"
              style={{ color: "#10b981" }}
            />
            <h2 className="text-sm font-bold text-white">Features</h2>
          </div>
          <div
            className="rounded-2xl overflow-hidden border"
            style={{
              borderColor: "rgba(255,255,255,0.07)",
            }}
          >
            {FEATURE_LABELS.map((label, i) => (
              <div
                key={label}
                className="grid grid-cols-[1fr_auto_1fr] items-center"
                style={{
                  background:
                    i % 2 === 0
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(255,255,255,0.015)",
                }}
              >
                <div className="p-3 flex justify-center">
                  <MaterialIcon
                    name={car1.features[i] ? "check_circle" : "cancel"}
                    fill={car1.features[i]}
                    className="text-[20px]"
                    style={{
                      color: car1.features[i] ? "#10b981" : "#334155",
                    }}
                  />
                </div>
                <div className="px-3 py-3 border-x border-white/5">
                  <p className="text-[11px] font-semibold text-slate-400 text-center whitespace-nowrap">
                    {label}
                  </p>
                </div>
                <div className="p-3 flex justify-center">
                  <MaterialIcon
                    name={car2.features[i] ? "check_circle" : "cancel"}
                    fill={car2.features[i]}
                    className="text-[20px]"
                    style={{
                      color: car2.features[i] ? "#10b981" : "#334155",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── EXPERT VERDICT ─── */}
        <div
          className="rounded-2xl p-5 border"
          style={{
            background: "rgba(17,82,212,0.06)",
            borderColor: "rgba(17,82,212,0.15)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <MaterialIcon
              name="auto_awesome"
              className="text-[20px]"
              style={{ color: "#f59e0b" }}
            />
            <h2 className="text-sm font-bold text-white">Expert Verdict</h2>
          </div>
          <p className="text-[13px] text-slate-300 leading-relaxed">
            Both the {car1.name} and {car2.name} are strong contenders in their
            segment. The {car1.name} offers a proven powertrain with great
            fuel efficiency, while the {car2.name} stands out with its
            feature-rich cabin and safety credentials. For city commutes, the{" "}
            {car1.name} edges ahead; for highway cruising and tech, the{" "}
            {car2.name} takes the lead.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <div
              className="flex-1 rounded-full h-2"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: "55%",
                  background:
                    "linear-gradient(90deg, #1152d4, #10b981)",
                }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-500">
              55% favour {car1.name}
            </span>
          </div>
        </div>

        {/* ─── COMPARE MORE ─── */}
        <Link
          href="/compare"
          className="flex items-center justify-center gap-2 rounded-2xl p-4 border transition-all hover:border-white/12"
          style={{
            background: "rgba(255,255,255,0.035)",
            borderColor: "rgba(255,255,255,0.07)",
          }}
        >
          <MaterialIcon
            name="compare_arrows"
            className="text-[20px]"
            style={{ color: "#1152d4" }}
          />
          <span className="text-sm font-semibold text-white">
            Compare More Cars
          </span>
        </Link>
      </main>

      <BuyerBottomNav />
    </div>
  );
}

function capitalize(s: string) {
  return s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
