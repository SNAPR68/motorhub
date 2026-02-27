"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

const EV_MODELS = [
  {
    id: 1,
    name: "Tata Nexon EV",
    price: "₹14.74L",
    priceVal: 14.74,
    range: 465,
    zeroToHundred: "7.2s",
    tag: "Best Seller",
    tagColor: "#1152d4",
    tagBg: "rgba(17,82,212,0.15)",
    slug: "/tata/nexon-ev",
  },
  {
    id: 2,
    name: "MG ZS EV",
    price: "₹18.98L",
    priceVal: 18.98,
    range: 461,
    zeroToHundred: "8.5s",
    tag: null,
    slug: "/mg/zs-ev",
  },
  {
    id: 3,
    name: "Hyundai Kona Electric",
    price: "₹23.79L",
    priceVal: 23.79,
    range: 452,
    zeroToHundred: "9.7s",
    tag: null,
    slug: "/hyundai/kona-electric",
  },
  {
    id: 4,
    name: "BYD Atto 3",
    price: "₹33.99L",
    priceVal: 33.99,
    range: 521,
    zeroToHundred: "7.3s",
    tag: null,
    slug: "/byd/atto-3",
  },
  {
    id: 5,
    name: "Tata Tiago EV",
    price: "₹8.49L",
    priceVal: 8.49,
    range: 315,
    zeroToHundred: "11.5s",
    tag: "Most Affordable",
    tagColor: "#10b981",
    tagBg: "rgba(16,185,129,0.12)",
    slug: "/tata/tiago-ev",
  },
];

const BUDGET_PILLS = ["Under ₹15L", "₹15-25L", "₹25-40L", "₹40L+"];
const RANGE_PILLS = ["200km+", "300km+", "400km+"];

const EV_TIPS = [
  {
    icon: "route",
    title: "Calculate your range needs",
    desc: "Factor in daily commute + weekend trips. Add 20% buffer for real-world conditions.",
  },
  {
    icon: "ev_station",
    title: "Check charging infrastructure",
    desc: "Verify home charging feasibility and fast-charger density on your regular routes.",
  },
  {
    icon: "savings",
    title: "Understand total cost of ownership",
    desc: "EVs cost 60-70% less per km to run. Factor in FAME subsidy and state incentives.",
  },
];

export default function ElectricCarsPage() {
  const [activeBudget, setActiveBudget] = useState<string | null>(null);
  const [activeRange, setActiveRange] = useState<string | null>(null);
  const [compared, setCompared] = useState<number[]>([]);

  const toggleCompare = (id: number) => {
    setCompared((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const filteredModels = EV_MODELS.filter((car) => {
    let pass = true;
    if (activeBudget === "Under ₹15L") pass = pass && car.priceVal < 15;
    else if (activeBudget === "₹15-25L") pass = pass && car.priceVal >= 15 && car.priceVal < 25;
    else if (activeBudget === "₹25-40L") pass = pass && car.priceVal >= 25 && car.priceVal < 40;
    else if (activeBudget === "₹40L+") pass = pass && car.priceVal >= 40;
    if (activeRange === "200km+") pass = pass && car.range >= 200;
    else if (activeRange === "300km+") pass = pass && car.range >= 300;
    else if (activeRange === "400km+") pass = pass && car.range >= 400;
    return pass;
  });

  return (
    <div className="min-h-dvh w-full pb-32" style={{ background: "#080a0f", color: "#e2e8f0" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-white/5"
        style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-400" />
          </Link>
          <h1 className="text-base font-bold text-white flex-1">Electric Cars</h1>
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full"
            style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)" }}
          >
            <MaterialIcon name="bolt" className="text-[14px] text-emerald-400" />
            <span className="text-[11px] font-bold text-emerald-400">EV</span>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-5">
        {/* Hero */}
        <div
          className="rounded-2xl p-5 overflow-hidden relative"
          style={{
            background: "linear-gradient(135deg, rgba(5,150,105,0.25) 0%, rgba(16,185,129,0.1) 50%, rgba(6,95,70,0.2) 100%)",
            border: "1px solid rgba(16,185,129,0.2)",
          }}
        >
          <div
            className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #10b981, transparent)", transform: "translate(30%, -30%)" }}
          />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <MaterialIcon name="bolt" className="text-[18px] text-emerald-400" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">Zero Emissions</span>
            </div>
            <h2 className="text-xl font-black text-white mb-1">Drive Electric,<br />Drive Smart</h2>
            <p className="text-xs text-slate-400">Zero fuel costs · Tax benefits · Future-proof</p>
            <div className="flex gap-2 mt-3">
              {["₹0/km fuel", "FAME Subsidy", "No odd-even"].map((benefit) => (
                <span
                  key={benefit}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(16,185,129,0.2)" }}
                >
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Budget Filter */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Budget</p>
          <div className="flex gap-2 flex-wrap">
            {BUDGET_PILLS.map((pill) => {
              const active = activeBudget === pill;
              return (
                <button
                  key={pill}
                  onClick={() => setActiveBudget(active ? null : pill)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={{
                    background: active ? "#1152d4" : "rgba(255,255,255,0.05)",
                    color: active ? "#fff" : "#94a3b8",
                    border: active ? "1px solid #1152d4" : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {pill}
                </button>
              );
            })}
          </div>
        </div>

        {/* Range Filter */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Range</p>
          <div className="flex gap-2">
            {RANGE_PILLS.map((pill) => {
              const active = activeRange === pill;
              return (
                <button
                  key={pill}
                  onClick={() => setActiveRange(active ? null : pill)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={{
                    background: active ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.05)",
                    color: active ? "#34d399" : "#94a3b8",
                    border: active ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {pill}
                </button>
              );
            })}
          </div>
        </div>

        {/* EV Cards */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {filteredModels.length} Models
          </p>
          {filteredModels.map((car) => (
            <div
              key={car.id}
              className="rounded-2xl overflow-hidden border border-white/5"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              {/* Image placeholder */}
              <div
                className="h-36 relative flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(17,82,212,0.08) 100%)",
                }}
              >
                <MaterialIcon name="electric_car" className="text-[56px] text-slate-700" />
                {car.tag && (
                  <span
                    className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: car.tagBg, color: car.tagColor, border: `1px solid ${car.tagColor}30` }}
                  >
                    {car.tag}
                  </span>
                )}
                <span
                  className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(16,185,129,0.25)" }}
                >
                  <MaterialIcon name="bolt" className="text-[12px]" />
                  {car.range}km
                </span>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">{car.name}</h3>
                    <p className="text-lg font-black text-white mt-0.5">{car.price}</p>
                  </div>
                  <label className="flex items-center gap-1.5 cursor-pointer mt-1">
                    <div
                      className="w-4 h-4 rounded flex items-center justify-center border transition-all"
                      style={{
                        background: compared.includes(car.id) ? "#1152d4" : "transparent",
                        borderColor: compared.includes(car.id) ? "#1152d4" : "rgba(255,255,255,0.2)",
                      }}
                      onClick={() => toggleCompare(car.id)}
                    >
                      {compared.includes(car.id) && (
                        <MaterialIcon name="check" className="text-[11px] text-white" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500">Compare</span>
                  </label>
                </div>

                <div className="flex gap-3 mb-3">
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                    style={{ background: "rgba(255,255,255,0.04)" }}
                  >
                    <MaterialIcon name="speed" className="text-[13px] text-slate-500" />
                    <span className="text-[11px] text-slate-400">{car.zeroToHundred} 0-100</span>
                  </div>
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                    style={{ background: "rgba(16,185,129,0.06)" }}
                  >
                    <MaterialIcon name="bolt" className="text-[13px] text-emerald-500" />
                    <span className="text-[11px] text-emerald-400">{car.range}km range</span>
                  </div>
                </div>

                <Link
                  href={car.slug}
                  className="flex items-center justify-center gap-2 w-full h-10 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
                  style={{ background: "rgba(17,82,212,0.2)", border: "1px solid rgba(17,82,212,0.3)" }}
                >
                  View Details
                  <MaterialIcon name="arrow_forward" className="text-[16px]" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Compare bar */}
        {compared.length >= 2 && (
          <div
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl"
            style={{ background: "#1152d4", maxWidth: "calc(100% - 32px)" }}
          >
            <MaterialIcon name="compare_arrows" className="text-[20px] text-white" />
            <span className="text-sm font-bold text-white flex-1">Compare {compared.length} EVs</span>
            <Link
              href="/compare"
              className="px-4 py-1.5 rounded-lg text-xs font-bold"
              style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}
            >
              Compare
            </Link>
          </div>
        )}

        {/* EV Buying Guide */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">EV Buying Guide</p>
          <div className="space-y-2">
            {EV_TIPS.map((tip, i) => (
              <div
                key={i}
                className="flex gap-3 p-3.5 rounded-xl border border-white/5"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <div
                  className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(16,185,129,0.1)" }}
                >
                  <MaterialIcon name={tip.icon} className="text-[18px] text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white mb-0.5">{tip.title}</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charging Infra Banner */}
        <div
          className="flex items-center gap-3 p-4 rounded-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(6,95,70,0.15) 100%)",
            border: "1px solid rgba(16,185,129,0.2)",
          }}
        >
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(16,185,129,0.15)" }}
          >
            <MaterialIcon name="ev_station" className="text-[20px] text-emerald-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">Find charging stations near you</p>
            <p className="text-[11px] text-slate-400">3,200+ fast chargers across India</p>
          </div>
          <MaterialIcon name="chevron_right" className="text-[20px] text-emerald-500" />
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
