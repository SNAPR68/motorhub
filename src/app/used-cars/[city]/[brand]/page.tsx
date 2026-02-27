"use client";

import { use } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

/* ─── Sample listings ─── */
const SAMPLE_LISTINGS = [
  { id: 1, name: "Swift VXi", price: "\u20B94.85 Lakh", km: "32,000 km", year: 2021, fuel: "Petrol", owner: "1st Owner", variant: "VXi" },
  { id: 2, name: "Swift ZXi+", price: "\u20B96.20 Lakh", km: "14,500 km", year: 2022, fuel: "Petrol", owner: "1st Owner", variant: "ZXi+" },
  { id: 3, name: "Swift LXi", price: "\u20B93.90 Lakh", km: "48,000 km", year: 2020, fuel: "Petrol", owner: "2nd Owner", variant: "LXi" },
  { id: 4, name: "Baleno Alpha", price: "\u20B97.10 Lakh", km: "12,000 km", year: 2023, fuel: "Petrol", owner: "1st Owner", variant: "Alpha" },
];

function capitalize(s: string) {
  return s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function UsedCarsCityBrandPage({
  params,
}: {
  params: Promise<{ city: string; brand: string }>;
}) {
  const { city, brand } = use(params);
  const cityName = capitalize(city);
  const brandName = capitalize(brand);

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
              href={`/used-cars/${city}`}
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
                {brandName} Used Cars in {cityName}
              </h1>
              <p className="text-[11px] text-slate-500">
                {SAMPLE_LISTINGS.length} listings found
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ─── BRAND HIGHLIGHT ─── */}
      <div className="max-w-lg mx-auto px-4 pt-4">
        <div
          className="rounded-2xl p-4 border flex items-center gap-4"
          style={{
            background: "rgba(17,82,212,0.06)",
            borderColor: "rgba(17,82,212,0.15)",
          }}
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(17,82,212,0.15)" }}
          >
            <MaterialIcon
              name="verified"
              className="text-[24px]"
              style={{ color: "#1152d4" }}
            />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{brandName}</p>
            <p className="text-[11px] text-slate-400">
              Verified listings in {cityName} &middot; Inspected &amp; certified
            </p>
          </div>
        </div>
      </div>

      {/* ─── LISTINGS ─── */}
      <main className="max-w-lg mx-auto px-4 pt-4">
        <div className="space-y-3">
          {SAMPLE_LISTINGS.map((car) => (
            <Link
              key={car.id}
              href={`/used-cars/details/${car.id}`}
              className="flex rounded-2xl overflow-hidden border transition-all active:scale-[0.99] hover:border-white/12"
              style={{
                background: "rgba(255,255,255,0.035)",
                borderColor: "rgba(255,255,255,0.07)",
              }}
            >
              {/* Image placeholder */}
              <div
                className="relative w-36 shrink-0 flex items-center justify-center"
                style={{
                  minHeight: "120px",
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                <MaterialIcon
                  name="directions_car"
                  className="text-[36px] text-slate-700"
                />
                <span
                  className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white"
                  style={{ background: "rgba(16,185,129,0.9)" }}
                >
                  {car.owner}
                </span>
              </div>

              {/* Details */}
              <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                <div>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                    {brandName}
                  </p>
                  <h3 className="text-[13px] font-bold text-white leading-tight truncate">
                    {car.name}
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {car.year} &middot; {car.km}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 my-2">
                  {[car.fuel, car.variant, car.km].map((val) => (
                    <span
                      key={val}
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-slate-400 border"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        borderColor: "rgba(255,255,255,0.08)",
                      }}
                    >
                      {val}
                    </span>
                  ))}
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-black text-white">
                    {car.price}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {cityName}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
