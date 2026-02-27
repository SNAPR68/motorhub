"use client";

import { use } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

/* ─── Sample dealer data ─── */
const SAMPLE_DEALERS = [
  {
    id: 1,
    name: "AutoWorld Motors",
    brands: ["Maruti", "Hyundai"],
    rating: 4.5,
    reviews: 328,
    address: "Sector 18, Noida",
    phone: "+91 98765 43210",
    openNow: true,
  },
  {
    id: 2,
    name: "Prestige Cars",
    brands: ["Toyota", "Honda"],
    rating: 4.3,
    reviews: 215,
    address: "MG Road, Camp Area",
    phone: "+91 98765 43211",
    openNow: true,
  },
  {
    id: 3,
    name: "Royal Drive",
    brands: ["Tata", "Mahindra", "Kia"],
    rating: 4.7,
    reviews: 512,
    address: "Hinjewadi Phase 2",
    phone: "+91 98765 43212",
    openNow: false,
  },
  {
    id: 4,
    name: "Elite Auto Hub",
    brands: ["BMW", "Mercedes-Benz"],
    rating: 4.8,
    reviews: 189,
    address: "Koregaon Park",
    phone: "+91 98765 43213",
    openNow: true,
  },
];

function capitalize(s: string) {
  return s
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function DealersCityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = use(params);
  const cityName = capitalize(city);

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
              href="/dealers"
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
                Dealers in {cityName}
              </h1>
              <p className="text-[11px] text-slate-500">
                {SAMPLE_DEALERS.length} showrooms found
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        {/* ─── MAP PLACEHOLDER ─── */}
        <div
          className="rounded-2xl overflow-hidden border flex items-center justify-center"
          style={{
            height: "180px",
            background: "rgba(255,255,255,0.03)",
            borderColor: "rgba(255,255,255,0.07)",
          }}
        >
          <div className="text-center">
            <MaterialIcon
              name="map"
              className="text-[36px] text-slate-600 mb-2"
            />
            <p className="text-[11px] text-slate-500">
              Map view coming soon
            </p>
            <p className="text-[10px] text-slate-600">
              {cityName} dealer locations
            </p>
          </div>
        </div>

        {/* ─── DEALER CARDS ─── */}
        <div className="space-y-3">
          {SAMPLE_DEALERS.map((dealer) => (
            <div
              key={dealer.id}
              className="rounded-2xl overflow-hidden border p-4 transition-all hover:border-white/12"
              style={{
                background: "rgba(255,255,255,0.035)",
                borderColor: "rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl shrink-0"
                    style={{ background: "rgba(17,82,212,0.12)" }}
                  >
                    <MaterialIcon
                      name="storefront"
                      className="text-[22px]"
                      style={{ color: "#1152d4" }}
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[14px] font-bold text-white truncate">
                      {dealer.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="flex items-center gap-0.5">
                        <MaterialIcon
                          name="star"
                          fill
                          className="text-[13px]"
                          style={{ color: "#f59e0b" }}
                        />
                        <span
                          className="text-[11px] font-bold"
                          style={{ color: "#f59e0b" }}
                        >
                          {dealer.rating}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        ({dealer.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <span
                  className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0"
                  style={{
                    background: dealer.openNow
                      ? "rgba(16,185,129,0.15)"
                      : "rgba(239,68,68,0.12)",
                    color: dealer.openNow ? "#10b981" : "#ef4444",
                  }}
                >
                  {dealer.openNow ? "Open Now" : "Closed"}
                </span>
              </div>

              {/* Brands */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {dealer.brands.map((brand) => (
                  <span
                    key={brand}
                    className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-slate-400 border"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      borderColor: "rgba(255,255,255,0.08)",
                    }}
                  >
                    {brand}
                  </span>
                ))}
              </div>

              {/* Address */}
              <div className="flex items-center gap-1.5 mt-3">
                <MaterialIcon
                  name="location_on"
                  className="text-[14px] text-slate-500 shrink-0"
                />
                <p className="text-[11px] text-slate-400">
                  {dealer.address}, {cityName}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-3">
                <Link
                  href={`/dealers/profile/${dealer.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl text-[11px] font-semibold text-white"
                  style={{ background: "#1152d4" }}
                >
                  <MaterialIcon
                    name="visibility"
                    className="text-[15px]"
                  />
                  View
                </Link>
                <button
                  className="flex items-center justify-center gap-1.5 h-9 rounded-xl px-4 text-[11px] font-semibold border"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderColor: "rgba(255,255,255,0.1)",
                    color: "#94a3b8",
                  }}
                >
                  <MaterialIcon name="call" className="text-[15px]" />
                  Call
                </button>
                <button
                  className="flex items-center justify-center gap-1.5 h-9 rounded-xl px-4 text-[11px] font-semibold border"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderColor: "rgba(255,255,255,0.1)",
                    color: "#94a3b8",
                  }}
                >
                  <MaterialIcon
                    name="directions"
                    className="text-[15px]"
                  />
                  Map
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
