"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";
import { useApi } from "@/lib/hooks/use-api";
import { fetchCarModels } from "@/lib/api";
import type { ApiCarModel } from "@/lib/api";
import { BLUR_DATA_URL } from "@/lib/car-images";

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

const FUEL_FILTERS = ["Petrol", "Diesel", "Electric", "CNG", "Hybrid"];
const TRANS_FILTERS = ["Manual", "Automatic", "CVT", "AMT"];

/** Map segment slug to API query params */
function segmentToParams(segment: string): Parameters<typeof fetchCarModels>[0] {
  // Category-based segments
  const categoryMap: Record<string, string> = {
    suv: "SUV",
    hatchback: "HATCHBACK",
    sedan: "SEDAN",
    mpv: "MPV",
    coupe: "COUPE",
    convertible: "CONVERTIBLE",
    luxury: "LUXURY",
    electric: "EV",
  };
  if (categoryMap[segment]) {
    return { category: categoryMap[segment], limit: 20 };
  }

  // Price-based segments
  const priceMatch = segment.match(/^under-(\d+)-lakh$/);
  if (priceMatch) {
    const maxPrice = parseInt(priceMatch[1], 10) * 100000;
    return { maxPrice, limit: 20 };
  }

  // Default: search by segment name
  return { q: segment, limit: 20 };
}

export default function NewCarsSegmentClient({ segment }: { segment: string }) {
  const [activeFuel, setActiveFuel] = useState("");
  const [activeTrans, setActiveTrans] = useState("");

  const title = SEGMENT_TITLES[segment] ?? segment
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const apiParams = segmentToParams(segment);
  const { data, isLoading } = useApi(
    () => fetchCarModels(apiParams),
    [segment]
  );
  const models: ApiCarModel[] = data?.models ?? [];

  // Client-side filtering on fuel/transmission
  const filtered = models.filter((m) => {
    if (activeFuel && !m.fuelTypes.some((f) => f.toLowerCase() === activeFuel.toLowerCase())) return false;
    if (activeTrans && !m.transmissions.some((t) => t.toLowerCase() === activeTrans.toLowerCase())) return false;
    return true;
  });

  return (
    <div
      className="min-h-dvh w-full pb-28"
      style={{ background: "#080a0f", color: "#e2e8f0" }}
    >
      {/* Header */}
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
                {isLoading ? "Loading..." : `${filtered.length} cars available`}
              </p>
            </div>
          </div>

          {/* Filter chips */}
          <div className="space-y-2 pb-1">
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

      {/* Loading skeleton */}
      {isLoading && (
        <main className="max-w-lg mx-auto px-4 pt-4">
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden border animate-pulse"
                style={{
                  background: "rgba(255,255,255,0.035)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                <div className="w-full aspect-[4/3] bg-white/5" />
                <div className="p-3 space-y-2">
                  <div className="h-4 w-24 bg-white/10 rounded" />
                  <div className="h-5 w-20 bg-white/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* Car grid */}
      {!isLoading && (
        <main className="max-w-lg mx-auto px-4 pt-4">
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((car) => (
              <Link
                key={car.id}
                href={`/${car.brand.slug}/${car.slug}`}
                className="rounded-2xl overflow-hidden border transition-all active:scale-[0.98] hover:border-white/12"
                style={{
                  background: "rgba(255,255,255,0.035)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                {/* Image */}
                <div
                  className="relative w-full aspect-[4/3] flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  {car.image ? (
                    <Image
                      src={car.image}
                      alt={car.fullName}
                      fill
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                      sizes="(max-width: 768px) 50vw, 200px"
                    />
                  ) : (
                    <MaterialIcon
                      name="directions_car"
                      className="text-[40px] text-slate-700"
                    />
                  )}
                  <span
                    className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ background: "rgba(17,82,212,0.9)" }}
                  >
                    New
                  </span>
                </div>

                <div className="p-3">
                  <h3 className="text-[13px] font-bold text-white leading-tight truncate">
                    {car.fullName}
                  </h3>
                  <p className="text-sm font-black text-white mt-1">
                    {car.startingPriceDisplay}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    {car.fuelTypes.slice(0, 1).map((f) => (
                      <span
                        key={f}
                        className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-slate-400 border"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          borderColor: "rgba(255,255,255,0.08)",
                        }}
                      >
                        {f}
                      </span>
                    ))}
                    {car.transmissions.slice(0, 1).map((t) => (
                      <span
                        key={t}
                        className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-slate-400 border"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          borderColor: "rgba(255,255,255,0.08)",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div
                    className="mt-3 flex items-center gap-1 text-[11px] font-semibold"
                    style={{ color: "#1152d4" }}
                  >
                    View Details
                    <MaterialIcon name="arrow_forward" className="text-[14px]" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <MaterialIcon name="directions_car" className="text-[48px] text-slate-600 mb-3" />
              <p className="text-slate-400 text-sm">
                {models.length === 0
                  ? "No cars found in this segment yet."
                  : "No cars match your filters. Try removing some filters."}
              </p>
              <Link href="/new-cars" className="text-blue-400 text-xs mt-2 inline-block">
                Browse all new cars
              </Link>
            </div>
          )}
        </main>
      )}

      <BuyerBottomNav />
    </div>
  );
}
