"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicles, adaptVehicle } from "@/lib/api";
import { BLUR_DATA_URL } from "@/lib/car-images";

/* ─── Filter options ─── */
const BUDGET_OPTIONS = ["Under \u20B93L", "\u20B93L\u20136L", "\u20B96L\u201310L", "\u20B910L\u201315L", "\u20B915L+"];
const BRAND_OPTIONS = ["Maruti", "Hyundai", "Tata", "Honda", "Toyota", "Kia", "Mahindra"];
const FUEL_OPTIONS = ["Petrol", "Diesel", "CNG", "Electric"];
const YEAR_OPTIONS = ["2024", "2023", "2022", "2021", "2020 & older"];

function capitalize(s: string) {
  return s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function UsedCarsCityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = use(params);
  const cityName = capitalize(city);

  const [activeBudget, setActiveBudget] = useState("");
  const [activeBrand, setActiveBrand] = useState("");
  const [activeFuel, setActiveFuel] = useState("");
  const [activeYear, setActiveYear] = useState("");

  const { data, isLoading } = useApi(
    () => fetchVehicles({ status: "AVAILABLE", limit: 20 }),
    []
  );
  const vehicles = (data?.vehicles ?? []).map(adaptVehicle);

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
              href="/used-cars"
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
                Used Cars in {cityName}
              </h1>
              <p className="text-[11px] text-slate-500">
                {isLoading ? "Loading..." : `${vehicles.length} cars available`}
              </p>
            </div>
          </div>

          {/* ─── FILTER BAR ─── */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {/* Budget */}
            <div className="relative shrink-0">
              <select
                value={activeBudget}
                onChange={(e) => setActiveBudget(e.target.value)}
                className="h-8 pl-3 pr-7 rounded-full text-[11px] font-semibold border appearance-none outline-none"
                style={{
                  background: activeBudget
                    ? "rgba(17,82,212,0.2)"
                    : "rgba(255,255,255,0.05)",
                  color: activeBudget ? "#fff" : "#94a3b8",
                  borderColor: activeBudget
                    ? "#1152d4"
                    : "rgba(255,255,255,0.1)",
                }}
              >
                <option value="" style={{ background: "#080a0f" }}>
                  Budget
                </option>
                {BUDGET_OPTIONS.map((b) => (
                  <option key={b} value={b} style={{ background: "#080a0f" }}>
                    {b}
                  </option>
                ))}
              </select>
              <MaterialIcon
                name="expand_more"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[14px] text-slate-500 pointer-events-none"
              />
            </div>

            {/* Brand */}
            <div className="relative shrink-0">
              <select
                value={activeBrand}
                onChange={(e) => setActiveBrand(e.target.value)}
                className="h-8 pl-3 pr-7 rounded-full text-[11px] font-semibold border appearance-none outline-none"
                style={{
                  background: activeBrand
                    ? "rgba(16,185,129,0.2)"
                    : "rgba(255,255,255,0.05)",
                  color: activeBrand ? "#10b981" : "#94a3b8",
                  borderColor: activeBrand
                    ? "#10b981"
                    : "rgba(255,255,255,0.1)",
                }}
              >
                <option value="" style={{ background: "#080a0f" }}>
                  Brand
                </option>
                {BRAND_OPTIONS.map((b) => (
                  <option key={b} value={b} style={{ background: "#080a0f" }}>
                    {b}
                  </option>
                ))}
              </select>
              <MaterialIcon
                name="expand_more"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[14px] text-slate-500 pointer-events-none"
              />
            </div>

            {/* Fuel */}
            <div className="relative shrink-0">
              <select
                value={activeFuel}
                onChange={(e) => setActiveFuel(e.target.value)}
                className="h-8 pl-3 pr-7 rounded-full text-[11px] font-semibold border appearance-none outline-none"
                style={{
                  background: activeFuel
                    ? "rgba(245,158,11,0.2)"
                    : "rgba(255,255,255,0.05)",
                  color: activeFuel ? "#f59e0b" : "#94a3b8",
                  borderColor: activeFuel
                    ? "#f59e0b"
                    : "rgba(255,255,255,0.1)",
                }}
              >
                <option value="" style={{ background: "#080a0f" }}>
                  Fuel
                </option>
                {FUEL_OPTIONS.map((f) => (
                  <option key={f} value={f} style={{ background: "#080a0f" }}>
                    {f}
                  </option>
                ))}
              </select>
              <MaterialIcon
                name="expand_more"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[14px] text-slate-500 pointer-events-none"
              />
            </div>

            {/* Year */}
            <div className="relative shrink-0">
              <select
                value={activeYear}
                onChange={(e) => setActiveYear(e.target.value)}
                className="h-8 pl-3 pr-7 rounded-full text-[11px] font-semibold border appearance-none outline-none"
                style={{
                  background: activeYear
                    ? "rgba(17,82,212,0.2)"
                    : "rgba(255,255,255,0.05)",
                  color: activeYear ? "#fff" : "#94a3b8",
                  borderColor: activeYear
                    ? "#1152d4"
                    : "rgba(255,255,255,0.1)",
                }}
              >
                <option value="" style={{ background: "#080a0f" }}>
                  Year
                </option>
                {YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y} style={{ background: "#080a0f" }}>
                    {y}
                  </option>
                ))}
              </select>
              <MaterialIcon
                name="expand_more"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[14px] text-slate-500 pointer-events-none"
              />
            </div>
          </div>
        </div>
      </header>

      {/* ─── CAR LISTINGS ─── */}
      <main className="max-w-lg mx-auto px-4 pt-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex rounded-2xl overflow-hidden border animate-pulse"
                style={{
                  background: "rgba(255,255,255,0.035)",
                  borderColor: "rgba(255,255,255,0.07)",
                  height: "120px",
                }}
              />
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-16">
            <MaterialIcon name="directions_car" className="text-[48px] text-slate-600 mb-3" />
            <p className="text-sm text-slate-400">No cars available in {cityName} right now.</p>
            <Link href="/showroom" className="text-[#1152d4] text-sm font-semibold mt-2 inline-block">
              Browse All Cars
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {vehicles.map((car) => (
              <Link
                key={car.id}
                href={`/vehicle/${car.id}`}
                className="flex rounded-2xl overflow-hidden border transition-all active:scale-[0.99] hover:border-white/12"
                style={{
                  background: "rgba(255,255,255,0.035)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                {/* Image */}
                <div
                  className="relative w-36 shrink-0 flex items-center justify-center"
                  style={{
                    minHeight: "120px",
                    background: "rgba(255,255,255,0.04)",
                  }}
                >
                  {car.image ? (
                    <Image
                      src={car.image}
                      alt={car.name}
                      fill
                      className="object-cover"
                      sizes="144px"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                  ) : (
                    <MaterialIcon
                      name="directions_car"
                      className="text-[36px] text-slate-700"
                    />
                  )}
                  <span
                    className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white z-10"
                    style={{ background: "rgba(16,185,129,0.9)" }}
                  >
                    {car.owner || "1st Owner"}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                  <div>
                    <h3 className="text-[13px] font-bold text-white leading-tight truncate">
                      {car.name}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {car.year} &middot; {car.km}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 my-2">
                    {[car.fuel, car.transmission, car.km].filter(Boolean).map((val) => (
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
                      {car.location || cityName}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <BuyerBottomNav />
    </div>
  );
}
