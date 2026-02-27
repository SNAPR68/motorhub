"use client";

import { use, useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

/* ─── Segment title mapping ─── */
const SEGMENT_TITLES: Record<string, string> = {
  suv: "SUVs",
  hatchback: "Hatchbacks",
  sedan: "Sedans",
  "under-10-lakh": "Cars Under \u20B910 Lakh",
  "under-5-lakh": "Cars Under \u20B95 Lakh",
  "under-15-lakh": "Cars Under \u20B915 Lakh",
  "under-20-lakh": "Cars Under \u20B920 Lakh",
  mpv: "MPVs",
  coupe: "Coupes",
  convertible: "Convertibles",
  luxury: "Luxury Cars",
  electric: "Electric Cars",
};

const PRICE_FILTERS = ["Under \u20B95L", "\u20B95L\u201310L", "\u20B910L\u201315L", "\u20B915L\u201320L", "\u20B920L+"];
const FUEL_FILTERS = ["Petrol", "Diesel", "Electric", "CNG", "Hybrid"];
const TRANS_FILTERS = ["Manual", "Automatic", "CVT", "AMT"];

/* ─── Sample car data ─── */
const SAMPLE_CARS = [
  { id: 1, name: "Maruti Brezza", price: "\u20B98.29 Lakh", fuel: "Petrol", transmission: "Automatic", image: "/cars/brezza.jpg" },
  { id: 2, name: "Tata Nexon", price: "\u20B98.10 Lakh", fuel: "Petrol", transmission: "Manual", image: "/cars/nexon.jpg" },
  { id: 3, name: "Hyundai Creta", price: "\u20B911.00 Lakh", fuel: "Diesel", transmission: "Automatic", image: "/cars/creta.jpg" },
  { id: 4, name: "Kia Seltos", price: "\u20B911.09 Lakh", fuel: "Petrol", transmission: "CVT", image: "/cars/seltos.jpg" },
  { id: 5, name: "Mahindra XUV700", price: "\u20B914.49 Lakh", fuel: "Diesel", transmission: "Automatic", image: "/cars/xuv700.jpg" },
  { id: 6, name: "Toyota Fortuner", price: "\u20B933.43 Lakh", fuel: "Diesel", transmission: "Automatic", image: "/cars/fortuner.jpg" },
];

export default function NewCarsBySegmentPage({
  params,
}: {
  params: Promise<{ segment: string }>;
}) {
  const { segment } = use(params);

  const [activePrice, setActivePrice] = useState("");
  const [activeFuel, setActiveFuel] = useState("");
  const [activeTrans, setActiveTrans] = useState("");

  const title =
    SEGMENT_TITLES[segment] ??
    segment
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

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
          <div className="flex items-center gap-3 mb-3">
            <Link
              href="/new-cars"
              className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <MaterialIcon
                name="arrow_back"
                className="text-[20px] text-slate-300"
              />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-white">{title}</h1>
              <p className="text-[11px] text-slate-500">
                {SAMPLE_CARS.length} cars available
              </p>
            </div>
          </div>

          {/* ─── FILTER CHIPS ─── */}
          <div className="space-y-2 pb-1">
            {/* Price range */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              {PRICE_FILTERS.map((p) => (
                <button
                  key={p}
                  onClick={() => setActivePrice(activePrice === p ? "" : p)}
                  className="flex h-7 shrink-0 items-center px-3 rounded-full text-[11px] font-semibold border transition-all"
                  style={{
                    background:
                      activePrice === p
                        ? "rgba(17,82,212,0.2)"
                        : "rgba(255,255,255,0.03)",
                    color: activePrice === p ? "#fff" : "#94a3b8",
                    borderColor:
                      activePrice === p ? "#1152d4" : "rgba(255,255,255,0.1)",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Fuel + Transmission */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              {FUEL_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFuel(activeFuel === f ? "" : f)}
                  className="flex h-7 shrink-0 items-center px-3 rounded-full text-[11px] font-semibold border transition-all"
                  style={{
                    background:
                      activeFuel === f
                        ? "rgba(16,185,129,0.2)"
                        : "rgba(255,255,255,0.03)",
                    color: activeFuel === f ? "#10b981" : "#94a3b8",
                    borderColor:
                      activeFuel === f ? "#10b981" : "rgba(255,255,255,0.1)",
                  }}
                >
                  {f}
                </button>
              ))}
              <span className="w-px h-5 my-auto shrink-0 bg-white/10" />
              {TRANS_FILTERS.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTrans(activeTrans === t ? "" : t)}
                  className="flex h-7 shrink-0 items-center px-3 rounded-full text-[11px] font-semibold border transition-all"
                  style={{
                    background:
                      activeTrans === t
                        ? "rgba(245,158,11,0.2)"
                        : "rgba(255,255,255,0.03)",
                    color: activeTrans === t ? "#f59e0b" : "#94a3b8",
                    borderColor:
                      activeTrans === t ? "#f59e0b" : "rgba(255,255,255,0.1)",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ─── CAR GRID ─── */}
      <main className="max-w-lg mx-auto px-4 pt-4">
        <div className="grid grid-cols-2 gap-3">
          {SAMPLE_CARS.map((car) => (
            <Link
              key={car.id}
              href={`/new-cars/${segment}/${car.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="rounded-2xl overflow-hidden border transition-all active:scale-[0.98] hover:border-white/12"
              style={{
                background: "rgba(255,255,255,0.035)",
                borderColor: "rgba(255,255,255,0.07)",
              }}
            >
              {/* Image placeholder */}
              <div
                className="relative w-full aspect-[4/3] flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <MaterialIcon
                  name="directions_car"
                  className="text-[40px] text-slate-700"
                />
                <span
                  className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ background: "rgba(17,82,212,0.9)" }}
                >
                  New
                </span>
              </div>

              <div className="p-3">
                <h3 className="text-[13px] font-bold text-white leading-tight truncate">
                  {car.name}
                </h3>
                <p className="text-sm font-black text-white mt-1">
                  {car.price}
                </p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-slate-400 border"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      borderColor: "rgba(255,255,255,0.08)",
                    }}
                  >
                    {car.fuel}
                  </span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-slate-400 border"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      borderColor: "rgba(255,255,255,0.08)",
                    }}
                  >
                    {car.transmission}
                  </span>
                </div>
                <Link
                  href={`/new-cars/${segment}/${car.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="mt-3 flex items-center gap-1 text-[11px] font-semibold"
                  style={{ color: "#1152d4" }}
                >
                  View Details
                  <MaterialIcon name="arrow_forward" className="text-[14px]" />
                </Link>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
