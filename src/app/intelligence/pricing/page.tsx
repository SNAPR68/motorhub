"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicles, adaptVehicle } from "@/lib/api";

/* ── design tokens: intelligence pricing — #0dccf2 cyan, Manrope, #0a0a0a ── */

const FALLBACK_VEHICLES = [
  { id: "swift-vxi", label: "2019 Maruti Swift VXi", km: "38,000 km", city: "Jaipur" },
  { id: "venue-sx", label: "2021 Hyundai Venue SX", km: "22,000 km", city: "Jaipur" },
  { id: "nexon-xz", label: "2022 Tata Nexon XZ+", km: "15,000 km", city: "Jaipur" },
];

const COMPETITORS = [
  { dealer: "AutoMax Motors", price: "₹5,45,000", km: "41,200 km", age: "2019", days: 18, vs: "below" as const },
  { dealer: "City Cars Jaipur", price: "₹5,70,000", km: "35,800 km", age: "2019", days: 25, vs: "below" as const },
  { dealer: "Prime Wheels", price: "₹5,85,000", km: "39,500 km", age: "2019", days: 12, vs: "above" as const },
  { dealer: "Rajasthan Autos", price: "₹5,30,000", km: "44,000 km", age: "2018", days: 32, vs: "below" as const },
];

const PRICE_SENSITIVITY = [
  { price: "₹6.1L", days: 45, label: "Current", color: "#ef4444", width: 90 },
  { price: "₹5.8L", days: 28, label: "", color: "#f59e0b", width: 62 },
  { price: "₹5.6L", days: 18, label: "Recommended", color: "#10b981", width: 40 },
  { price: "₹5.3L", days: 8, label: "Aggressive", color: "#0dccf2", width: 18 },
];

const AGING_ALERTS = [
  { name: "Maruti Swift VXi", days: 42, status: "warning" as const, color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.15)" },
  { name: "Hyundai Venue SX", days: 28, status: "approaching" as const, color: "#f59e0b", bg: "rgba(245,158,11,0.05)", border: "rgba(245,158,11,0.1)" },
  { name: "Tata Nexon XZ+", days: 15, status: "healthy" as const, color: "#10b981", bg: "rgba(16,185,129,0.05)", border: "rgba(16,185,129,0.1)" },
];

export default function IntelligencePricingPage() {
  const { data } = useApi(() => fetchVehicles({ status: "AVAILABLE", limit: 50 }), []);
  const dbVehicles = (data?.vehicles ?? []).map(adaptVehicle);

  // Build vehicle options from real data, falling back to sample
  const VEHICLE_OPTIONS = dbVehicles.length > 0
    ? dbVehicles.map((v) => ({ id: v.id, label: `${v.year} ${v.name}`, km: v.km, city: v.location || "India" }))
    : FALLBACK_VEHICLES;

  // Build aging alerts from real inventory
  const AGING_ALERTS_DYNAMIC = dbVehicles.length > 0
    ? dbVehicles.slice(0, 3).map((v) => {
        const days = Math.round((Date.now() - new Date(v.id.slice(0, 8) || Date.now()).getTime()) / (1000 * 60 * 60 * 24)) || Math.floor(Math.random() * 40 + 5);
        const daysInStock = Math.min(60, Math.max(5, days));
        const status = daysInStock > 30 ? "warning" as const : daysInStock > 20 ? "approaching" as const : "healthy" as const;
        const color = status === "warning" ? "#f59e0b" : status === "approaching" ? "#f59e0b" : "#10b981";
        return {
          name: v.name,
          days: daysInStock,
          status,
          color,
          bg: status === "warning" ? "rgba(245,158,11,0.08)" : status === "approaching" ? "rgba(245,158,11,0.05)" : "rgba(16,185,129,0.05)",
          border: status === "warning" ? "rgba(245,158,11,0.15)" : status === "approaching" ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)",
        };
      })
    : AGING_ALERTS;

  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const effectiveSelected = selectedVehicle || VEHICLE_OPTIONS[0]?.id || "";
  const currentVehicle = VEHICLE_OPTIONS.find((v) => v.id === effectiveSelected) ?? VEHICLE_OPTIONS[0];

  return (
    <div
      className="min-h-dvh w-full flex flex-col max-w-md mx-auto text-slate-100 pb-24"
      style={{ fontFamily: "'Manrope', sans-serif", background: "#0a0a0a" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 px-4 py-4 flex items-center justify-between border-b"
        style={{
          background: "rgba(10,10,10,0.8)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(255,255,255,0.05)",
        }}
      >
        <div className="flex items-center gap-3">
          <Link href="/intelligence" className="p-1">
            <MaterialIcon name="arrow_back" className="text-slate-400" />
          </Link>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight">
              AI <span style={{ color: "#0dccf2" }}>Pricing</span> Assistant
            </h1>
            <p className="text-[10px] text-slate-500 tracking-wide">
              Data-backed pricing recommendations for your inventory
            </p>
          </div>
        </div>
        <div
          className="size-10 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-slate-700"
          style={{ border: "2px solid rgba(13,204,242,0.3)" }}
        >
          AV
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-8">
        {/* Vehicle Selector */}
        <section className="py-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">
            Select Vehicle
          </p>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full rounded-xl p-4 flex items-center justify-between text-left"
              style={{
                background: "linear-gradient(145deg, rgba(22,27,29,1) 0%, rgba(10,10,10,1) 100%)",
                border: "1px solid rgba(13,204,242,0.15)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(13,204,242,0.1)" }}
                >
                  <MaterialIcon name="directions_car" className="text-lg" style={{ color: "#0dccf2" }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{currentVehicle.label}</p>
                  <p className="text-[10px] text-slate-500">
                    {currentVehicle.km} — {currentVehicle.city}
                  </p>
                </div>
              </div>
              <MaterialIcon
                name={dropdownOpen ? "expand_less" : "expand_more"}
                className="text-slate-400"
              />
            </button>

            {dropdownOpen && (
              <div
                className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-40"
                style={{
                  background: "#161b1d",
                  border: "1px solid rgba(148,163,184,0.15)",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
                }}
              >
                {VEHICLE_OPTIONS.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVehicle(v.id);
                        setDropdownOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-white/5 transition-colors"
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      background: v.id === effectiveSelected ? "rgba(13,204,242,0.08)" : "transparent",
                    }}
                  >
                    <MaterialIcon
                      name={v.id === effectiveSelected ? "radio_button_checked" : "radio_button_unchecked"}
                      className="text-sm"
                      style={{ color: v.id === effectiveSelected ? "#0dccf2" : "#94a3b8" }}
                    />
                    <div>
                      <p className="text-sm font-semibold text-white">{v.label}</p>
                      <p className="text-[10px] text-slate-500">
                        {v.km} — {v.city}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* AI Recommendation Card */}
        <section className="mb-6">
          <div
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: "linear-gradient(145deg, rgba(22,27,29,1) 0%, rgba(10,10,10,1) 100%)",
              border: "1px solid rgba(13,204,242,0.2)",
            }}
          >
            {/* Glow accent */}
            <div
              className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, #0dccf2, transparent)" }}
            />

            <div className="flex items-center gap-2 mb-4">
              <MaterialIcon name="auto_awesome" className="text-lg" style={{ color: "#0dccf2" }} />
              <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: "#0dccf2" }}>
                AI Price Recommendation
              </h2>
            </div>

            {/* Recommended Price */}
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">
                Recommended Price
              </p>
              <p className="text-4xl font-extrabold text-emerald-400">
                ₹5,60,000
              </p>
            </div>

            {/* Market Range */}
            <div className="flex items-center gap-4 mb-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                  Market Range
                </p>
                <p className="text-sm font-bold text-white">₹5,20,000 — ₹5,80,000</p>
              </div>
            </div>

            {/* Current Price */}
            <div
              className="flex items-center justify-between rounded-xl p-3 mb-4"
              style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.12)" }}
            >
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                  Your Current Price
                </p>
                <p className="text-lg font-extrabold text-red-400">₹6,10,000</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-red-500/15 text-red-400">
                ₹50,000 above market
              </span>
            </div>

            {/* Confidence */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                  Confidence
                </p>
                <p className="text-sm font-extrabold" style={{ color: "#0dccf2" }}>
                  94%
                </p>
              </div>
              <div className="w-full h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: "94%",
                    background: "linear-gradient(90deg, #0dccf2, #10b981)",
                    boxShadow: "0 0 8px rgba(13,204,242,0.4)",
                  }}
                />
              </div>
            </div>

            {/* AI Reasoning */}
            <div
              className="flex items-start gap-2 rounded-lg p-3"
              style={{ background: "rgba(13,204,242,0.04)", border: "1px solid rgba(13,204,242,0.08)" }}
            >
              <MaterialIcon name="psychology" className="text-sm mt-0.5 shrink-0" style={{ color: "#0dccf2" }} />
              <p className="text-xs text-slate-400 leading-relaxed">
                Based on 847 similar transactions in Jaipur region over last 90 days
              </p>
            </div>
          </div>
        </section>

        {/* Market Comparison */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#94a3b8] mb-4 flex items-center gap-2">
            <MaterialIcon name="compare_arrows" className="text-sm" style={{ color: "#0dccf2" }} />
            Market Comparison
          </h2>

          <div
            className="rounded-xl overflow-hidden"
            style={{ border: "1px solid rgba(148,163,184,0.1)" }}
          >
            {COMPETITORS.map((c, i) => (
              <div
                key={c.dealer}
                className="flex items-center justify-between p-4"
                style={{
                  background: i % 2 === 0 ? "rgba(22,27,29,0.5)" : "rgba(10,10,10,1)",
                  borderBottom:
                    i < COMPETITORS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                }}
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{c.dealer}</h4>
                  <p className="text-[10px] text-slate-500">
                    {c.age} &bull; {c.km} &bull; {c.days} days listed
                  </p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="text-sm font-bold" style={{ color: "#0dccf2" }}>
                    {c.price}
                  </p>
                  <p
                    className="text-[10px] font-bold"
                    style={{ color: c.vs === "below" ? "#10b981" : "#f59e0b" }}
                  >
                    {c.vs === "below" ? "Below" : "Above"} market
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Price Sensitivity Analysis */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#94a3b8] mb-4 flex items-center gap-2">
            <MaterialIcon name="speed" className="text-sm" style={{ color: "#0dccf2" }} />
            Price Sensitivity Analysis
          </h2>

          <div
            className="rounded-2xl p-5"
            style={{
              background: "linear-gradient(145deg, rgba(22,27,29,1) 0%, rgba(10,10,10,1) 100%)",
              border: "1px solid rgba(148,163,184,0.1)",
            }}
          >
            <div className="space-y-4">
              {PRICE_SENSITIVITY.map((row) => (
                <div key={row.price}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{row.price}</span>
                      {row.label && (
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider"
                          style={{
                            color: row.color,
                            background: `${row.color}15`,
                            border: `1px solid ${row.color}25`,
                          }}
                        >
                          {row.label}
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold" style={{ color: row.color }}>
                      ~{row.days} days
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <div
                      className="h-3 rounded-full transition-all duration-700"
                      style={{
                        width: `${row.width}%`,
                        background: row.color,
                        opacity: 0.8,
                        boxShadow: `0 0 8px ${row.color}40`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-slate-500 mt-4 text-center">
              Estimated time to sell based on market velocity
            </p>
          </div>
        </section>

        {/* Depreciation Alert */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#94a3b8] mb-4 flex items-center gap-2">
            <MaterialIcon name="warning" className="text-sm text-amber-400" />
            Depreciation Alert
          </h2>

          <div
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: "linear-gradient(145deg, rgba(245,158,11,0.04) 0%, rgba(10,10,10,1) 100%)",
              border: "1px solid rgba(245,158,11,0.15)",
            }}
          >
            <div
              className="absolute top-0 left-0 w-full h-1"
              style={{ background: "linear-gradient(to right, transparent, rgba(245,158,11,0.5), transparent)" }}
            />

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "rgba(245,158,11,0.1)" }}
                >
                  <MaterialIcon name="trending_down" className="text-sm text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    This Swift is depreciating at{" "}
                    <span className="text-amber-400">₹850/day</span> at current stock age
                  </p>
                </div>
              </div>

              <div
                className="rounded-xl p-3 flex items-center gap-3"
                style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)" }}
              >
                <MaterialIcon name="calendar_today" className="text-sm text-red-400" />
                <p className="text-xs text-slate-400">
                  <span className="text-red-400 font-bold">42 days</span> in inventory. You&apos;ve lost{" "}
                  <span className="text-red-400 font-bold">₹35,700</span> in value
                </p>
              </div>

              <div
                className="rounded-xl p-3 flex items-center gap-3"
                style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.1)" }}
              >
                <MaterialIcon name="bolt" className="text-sm text-emerald-400" />
                <p className="text-xs text-slate-400">
                  Drop price by <span className="text-emerald-400 font-bold">₹50K</span> to move it in{" "}
                  <span className="text-emerald-400 font-bold">7-10 days</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Aging Alerts */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#94a3b8] mb-4 flex items-center gap-2">
            <MaterialIcon name="schedule" className="text-sm" style={{ color: "#0dccf2" }} />
            Inventory Aging Alerts
          </h2>

          <div className="space-y-3">
            {AGING_ALERTS_DYNAMIC.map((item) => (
              <div
                key={item.name}
                className="rounded-xl p-4 flex items-center justify-between"
                style={{
                  background: item.bg,
                  border: `1px solid ${item.border}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: `${item.color}15` }}
                  >
                    <MaterialIcon
                      name={
                        item.status === "warning"
                          ? "warning"
                          : item.status === "approaching"
                            ? "schedule"
                            : "check_circle"
                      }
                      className="text-base"
                      style={{ color: item.color }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{item.name}</p>
                    <p className="text-[10px] text-slate-500">
                      {item.status === "warning"
                        ? "Exceeds 30-day threshold"
                        : item.status === "approaching"
                          ? "Approaching threshold"
                          : "Healthy stock age"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-extrabold" style={{ color: item.color }}>
                    {item.days}
                  </p>
                  <p className="text-[10px] text-slate-500">days</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Revenue Impact */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#94a3b8] mb-4 flex items-center gap-2">
            <MaterialIcon name="payments" className="text-sm" style={{ color: "#0dccf2" }} />
            Revenue Impact
          </h2>

          <div
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: "linear-gradient(145deg, rgba(16,185,129,0.04) 0%, rgba(10,10,10,1) 100%)",
              border: "1px solid rgba(16,185,129,0.15)",
            }}
          >
            <div
              className="absolute top-0 left-0 w-full h-1"
              style={{ background: "linear-gradient(to right, transparent, rgba(16,185,129,0.5), transparent)" }}
            />

            <p className="text-xs text-slate-400 mb-4">
              If you adopt AI pricing for all <span className="text-white font-bold">{dbVehicles.length || 12} vehicles</span>:
            </p>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">
                  Days to Sell
                </p>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-sm font-bold text-red-400 line-through">45</span>
                  <MaterialIcon name="arrow_forward" className="text-[10px] text-slate-500" />
                  <span className="text-lg font-extrabold text-emerald-400">22</span>
                </div>
                <p className="text-[10px] text-slate-500">days avg</p>
              </div>

              <div className="text-center">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">
                  Turnover
                </p>
                <p className="text-lg font-extrabold text-emerald-400">+40%</p>
                <p className="text-[10px] text-slate-500">monthly</p>
              </div>

              <div className="text-center">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">
                  Revenue
                </p>
                <p className="text-lg font-extrabold text-emerald-400">₹2.4L</p>
                <p className="text-[10px] text-slate-500">extra/mo</p>
              </div>
            </div>

            <div
              className="rounded-xl p-3 flex items-center gap-2"
              style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.12)" }}
            >
              <MaterialIcon name="auto_awesome" className="text-sm text-emerald-400" />
              <p className="text-[10px] text-emerald-400 font-bold tracking-wide">
                AI-optimized pricing can increase your monthly revenue significantly
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom CTA Buttons */}
      <div
        className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 px-4 pb-8 pt-4 border-t md:hidden"
        style={{
          background: "rgba(10,10,10,0.95)",
          backdropFilter: "blur(16px)",
          borderColor: "rgba(255,255,255,0.05)",
        }}
      >
        <div className="flex gap-3">
          <button
            className="flex-1 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#94a3b8",
            }}
          >
            Adjust & Save
          </button>
          <button
            className="flex-1 py-3.5 rounded-xl text-sm font-bold tracking-wide flex items-center justify-center gap-2 transition-all"
            style={{
              background: "linear-gradient(135deg, #0dccf2 0%, #10b981 100%)",
              color: "#0a0a0a",
              boxShadow: "0 8px 24px rgba(13,204,242,0.3)",
            }}
          >
            <MaterialIcon name="auto_awesome" className="text-sm" />
            Apply AI Price
          </button>
        </div>
      </div>
    </div>
  );
}
