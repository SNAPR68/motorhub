"use client";

import { use } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

/* ─── Sample upcoming cars ─── */
const SAMPLE_UPCOMING = [
  {
    id: 1,
    name: "Maruti eVX",
    brand: "Maruti",
    expectedLaunch: "Q2 2026",
    estimatedPrice: "\u20B915 \u2013 20 Lakh",
    segment: "SUV",
    fuel: "Electric",
    highlight: "First Maruti EV",
  },
  {
    id: 2,
    name: "Hyundai Creta N Line",
    brand: "Hyundai",
    expectedLaunch: "March 2026",
    estimatedPrice: "\u20B916 \u2013 20 Lakh",
    segment: "SUV",
    fuel: "Turbo Petrol",
    highlight: "Sporty variant",
  },
  {
    id: 3,
    name: "Tata Curvv",
    brand: "Tata",
    expectedLaunch: "April 2026",
    estimatedPrice: "\u20B912 \u2013 18 Lakh",
    segment: "SUV Coupe",
    fuel: "Petrol / Diesel",
    highlight: "Coupe-SUV design",
  },
  {
    id: 4,
    name: "Mahindra XUV.e8",
    brand: "Mahindra",
    expectedLaunch: "Q3 2026",
    estimatedPrice: "\u20B930 \u2013 35 Lakh",
    segment: "SUV",
    fuel: "Electric",
    highlight: "Born-electric platform",
  },
  {
    id: 5,
    name: "Kia EV6 Facelift",
    brand: "Kia",
    expectedLaunch: "May 2026",
    estimatedPrice: "\u20B960 \u2013 65 Lakh",
    segment: "Crossover",
    fuel: "Electric",
    highlight: "Updated design + range",
  },
  {
    id: 6,
    name: "Toyota Belta",
    brand: "Toyota",
    expectedLaunch: "Q4 2026",
    estimatedPrice: "\u20B910 \u2013 14 Lakh",
    segment: "Sedan",
    fuel: "Petrol / Hybrid",
    highlight: "Strong hybrid tech",
  },
];

export default function UpcomingCarsYearPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = use(params);

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
              href="/upcoming-cars"
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
                Upcoming Cars in {year}
              </h1>
              <p className="text-[11px] text-slate-500">
                {SAMPLE_UPCOMING.length} cars expected
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ─── TIMELINE HINT ─── */}
      <div className="max-w-lg mx-auto px-4 pt-4">
        <div
          className="rounded-2xl p-4 border flex items-center gap-3"
          style={{
            background: "rgba(245,158,11,0.06)",
            borderColor: "rgba(245,158,11,0.15)",
          }}
        >
          <MaterialIcon
            name="schedule"
            className="text-[22px] shrink-0"
            style={{ color: "#f59e0b" }}
          />
          <p className="text-[12px] text-slate-300">
            Estimated launch dates and prices are based on industry sources and
            may change closer to the official reveal.
          </p>
        </div>
      </div>

      {/* ─── UPCOMING CAR CARDS ─── */}
      <main className="max-w-lg mx-auto px-4 pt-4">
        <div className="space-y-3">
          {SAMPLE_UPCOMING.map((car) => (
            <div
              key={car.id}
              className="rounded-2xl overflow-hidden border transition-all hover:border-white/12"
              style={{
                background: "rgba(255,255,255,0.035)",
                borderColor: "rgba(255,255,255,0.07)",
              }}
            >
              {/* Image placeholder */}
              <div
                className="relative w-full aspect-[16/7] flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <MaterialIcon
                  name="directions_car"
                  className="text-[48px] text-slate-700"
                />
                <span
                  className="absolute top-3 left-3 text-[9px] font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ background: "rgba(245,158,11,0.9)" }}
                >
                  Upcoming
                </span>
                <span
                  className="absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    color: "#e2e8f0",
                  }}
                >
                  {car.segment}
                </span>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                      {car.brand}
                    </p>
                    <h3 className="text-[15px] font-bold text-white leading-tight">
                      {car.name}
                    </h3>
                  </div>
                  <span
                    className="text-[10px] font-bold px-2 py-1 rounded-lg shrink-0"
                    style={{
                      background: "rgba(17,82,212,0.12)",
                      color: "#1152d4",
                    }}
                  >
                    {car.highlight}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div
                    className="rounded-xl p-2.5 border"
                    style={{
                      background: "rgba(255,255,255,0.025)",
                      borderColor: "rgba(255,255,255,0.06)",
                    }}
                  >
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">
                      Expected Launch
                    </p>
                    <p className="text-[13px] font-bold text-white">
                      {car.expectedLaunch}
                    </p>
                  </div>
                  <div
                    className="rounded-xl p-2.5 border"
                    style={{
                      background: "rgba(255,255,255,0.025)",
                      borderColor: "rgba(255,255,255,0.06)",
                    }}
                  >
                    <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">
                      Est. Price
                    </p>
                    <p
                      className="text-[13px] font-bold"
                      style={{ color: "#10b981" }}
                    >
                      {car.estimatedPrice}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mt-3">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-slate-400 border"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      borderColor: "rgba(255,255,255,0.08)",
                    }}
                  >
                    {car.fuel}
                  </span>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-slate-400 border"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      borderColor: "rgba(255,255,255,0.08)",
                    }}
                  >
                    {car.segment}
                  </span>
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl text-[11px] font-semibold border"
                    style={{
                      background: "rgba(17,82,212,0.1)",
                      borderColor: "rgba(17,82,212,0.3)",
                      color: "#1152d4",
                    }}
                  >
                    <MaterialIcon
                      name="notifications"
                      className="text-[15px]"
                    />
                    Alert Me
                  </button>
                  <button
                    className="flex items-center justify-center gap-1.5 h-9 rounded-xl px-4 text-[11px] font-semibold border"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      borderColor: "rgba(255,255,255,0.1)",
                      color: "#94a3b8",
                    }}
                  >
                    <MaterialIcon name="share" className="text-[15px]" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
