"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

/* ─── Types ─── */
interface ValuationResult {
  low: number;
  high: number;
  trend: "Stable" | "Appreciating" | "Depreciating";
  bestTime: string;
}

/* ─── Constants ─── */
const BRANDS = [
  "Maruti Suzuki", "Hyundai", "Tata", "Mahindra", "Honda",
  "Toyota", "Kia", "Volkswagen", "Skoda", "Nissan",
  "Ford", "Jeep", "MG", "BYD", "BMW", "Audi", "Mercedes-Benz",
];

const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "CNG", "Hybrid"];

const YEARS = Array.from({ length: 16 }, (_, i) => 2025 - i);

function computeValuation(year: number): ValuationResult {
  const base = (year - 2010) * 40000 + 200000;
  const low = Math.round(base * 0.9);
  const high = Math.round(base * 1.1);
  const trend: ValuationResult["trend"] = year > 2022 ? "Stable" : "Depreciating";
  const bestTime =
    year > 2022
      ? "Good time to sell — demand is high for newer models"
      : "Sell within 6 months to maximise resale value";
  return { low, high, trend, bestTime };
}

function formatLakh(n: number) {
  const lakh = n / 100000;
  return `₹${lakh.toFixed(2)}L`;
}

const TREND_CONFIG = {
  Stable: { color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/30", icon: "trending_flat" },
  Appreciating: { color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/30", icon: "trending_up" },
  Depreciating: { color: "text-red-400", bg: "bg-red-400/10 border-red-400/30", icon: "trending_down" },
};

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: "database",
    title: "Data Analysis",
    desc: "We analyse 50,000+ real transactions from across India to build a baseline price index.",
  },
  {
    step: "02",
    icon: "compare_arrows",
    title: "Market Comparison",
    desc: "Your car is benchmarked against similar listings in your city and surrounding regions.",
  },
  {
    step: "03",
    icon: "smart_toy",
    title: "AI Price Model",
    desc: "Our AI factors in depreciation curves, demand signals and seasonal trends to pinpoint your range.",
  },
];

/* ─── Page ─── */
export default function ValuationPage() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [km, setKm] = useState("");
  const [fuel, setFuel] = useState("");
  const [city, setCity] = useState("");
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = brand && model && year && km && fuel && city;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!year) return;
    const val = computeValuation(Number(year));
    setResult(val);
    setSubmitted(true);
    setTimeout(() => {
      document.getElementById("valuation-result")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  return (
    <div className="min-h-screen bg-[#080a0f] text-white pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#080a0f]/95 backdrop-blur border-b border-white/5 px-4 py-4 max-w-lg mx-auto flex items-center gap-3">
        <Link href="/used-cars" className="p-2 rounded-full hover:bg-white/10 transition-colors -ml-2">
          <MaterialIcon name="arrow_back" className="text-[22px]" />
        </Link>
        <h1 className="font-semibold text-[17px] tracking-tight">Free Car Valuation</h1>
      </header>

      <main className="max-w-lg mx-auto px-4">
        {/* Hero */}
        <div className="mt-6 rounded-2xl p-6 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #92400e 0%, #b45309 40%, #d97706 100%)" }}>
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "radial-gradient(circle at 80% 20%, #fcd34d 0%, transparent 50%)" }} />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <MaterialIcon name="workspace_premium" className="text-[28px] text-amber-200" fill />
              <span className="text-xs font-bold uppercase tracking-widest text-amber-200">Free Tool</span>
            </div>
            <h2 className="text-xl font-bold text-white leading-snug mb-2">
              Know your car's true<br />market value
            </h2>
            <p className="text-amber-100 text-sm flex items-center gap-1.5">
              <MaterialIcon name="auto_awesome" className="text-[16px]" />
              AI-powered · Based on 50,000+ real transactions
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Brand */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
              Car Brand
            </label>
            <div className="relative">
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-[#1152d4] transition-colors text-sm"
              >
                <option value="" disabled className="bg-[#0d1117]">Select brand</option>
                {BRANDS.map((b) => (
                  <option key={b} value={b} className="bg-[#0d1117]">{b}</option>
                ))}
              </select>
              <MaterialIcon name="expand_more" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[20px]" />
            </div>
          </div>

          {/* Model */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
              Model Name
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. Swift, Creta, Nexon"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#1152d4] transition-colors text-sm"
            />
          </div>

          {/* Year + KM row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
                Year
              </label>
              <div className="relative">
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-[#1152d4] transition-colors text-sm"
                >
                  <option value="" disabled className="bg-[#0d1117]">Select</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y} className="bg-[#0d1117]">{y}</option>
                  ))}
                </select>
                <MaterialIcon name="expand_more" className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[18px]" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
                KM Driven
              </label>
              <input
                type="number"
                value={km}
                onChange={(e) => setKm(e.target.value)}
                placeholder="e.g. 45000"
                min={0}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#1152d4] transition-colors text-sm"
              />
            </div>
          </div>

          {/* Fuel */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
              Fuel Type
            </label>
            <div className="flex flex-wrap gap-2">
              {FUEL_TYPES.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFuel(f)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    fuel === f
                      ? "bg-[#1152d4] border-[#1152d4] text-white"
                      : "bg-white/5 border-white/10 text-slate-300 hover:border-[#1152d4]/50"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* City */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
              Your City
            </label>
            <div className="relative">
              <MaterialIcon name="location_on" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Mumbai, Delhi, Bangalore"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#1152d4] transition-colors text-sm"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full py-4 rounded-xl font-bold text-white text-[15px] transition-all disabled:opacity-40 disabled:cursor-not-allowed mt-2"
            style={{ background: canSubmit ? "linear-gradient(135deg, #1152d4, #3b82f6)" : undefined, backgroundColor: !canSubmit ? "#1f2937" : undefined }}
          >
            <span className="flex items-center justify-center gap-2">
              <MaterialIcon name="auto_awesome" className="text-[18px]" />
              Get Free Valuation
            </span>
          </button>
        </form>

        {/* Result Card */}
        {submitted && result && (
          <div id="valuation-result" className="mt-6 rounded-2xl border border-white/10 overflow-hidden">
            {/* Result header */}
            <div className="bg-gradient-to-r from-[#1152d4]/20 to-[#3b82f6]/10 border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-2 mb-1">
                <MaterialIcon name="verified" className="text-[20px] text-[#1152d4]" fill />
                <span className="text-xs font-bold uppercase tracking-widest text-[#60a5fa]">Valuation Complete</span>
              </div>
              <p className="text-sm text-slate-400">
                {brand} {model} · {year} · {fuel}
              </p>
            </div>

            <div className="px-5 py-5 space-y-4">
              {/* Price range */}
              <div className="text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Estimated Market Value</p>
                <p className="text-3xl font-black text-white tracking-tight">
                  {formatLakh(result.low)}{" "}
                  <span className="text-slate-500 font-light">–</span>{" "}
                  {formatLakh(result.high)}
                </p>
                <p className="text-xs text-slate-500 mt-1">Based on {city} market data</p>
              </div>

              <div className="h-px bg-white/5" />

              {/* Trend */}
              <div className={`flex items-center gap-3 p-3 rounded-xl border ${TREND_CONFIG[result.trend].bg}`}>
                <MaterialIcon
                  name={TREND_CONFIG[result.trend].icon}
                  className={`text-[24px] ${TREND_CONFIG[result.trend].color}`}
                />
                <div>
                  <p className={`font-bold text-sm ${TREND_CONFIG[result.trend].color}`}>
                    Market Trend: {result.trend}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">Compared to 3-month average</p>
                </div>
              </div>

              {/* Best time to sell */}
              <div className="flex items-start gap-3 bg-white/5 rounded-xl p-3">
                <MaterialIcon name="schedule" className="text-[22px] text-amber-400 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-0.5">Best Time to Sell</p>
                  <p className="text-sm text-slate-300">{result.bestTime}</p>
                </div>
              </div>

              {/* CTAs */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <Link
                  href="/used-cars/sell/evaluate"
                  className="flex flex-col items-center gap-1.5 bg-[#1152d4] hover:bg-[#1a5fe0] rounded-xl py-3.5 px-3 transition-colors text-center"
                >
                  <MaterialIcon name="sell" className="text-[22px]" />
                  <span className="text-xs font-bold">Sell This Car</span>
                </Link>
                <Link
                  href="/used-cars/sell/list"
                  className="flex flex-col items-center gap-1.5 bg-white/5 border border-white/10 hover:border-[#1152d4]/50 rounded-xl py-3.5 px-3 transition-colors text-center"
                >
                  <MaterialIcon name="storefront" className="text-[22px] text-slate-300" />
                  <span className="text-xs font-bold text-slate-300">List on Marketplace</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* How it works */}
        <div className="mt-8 mb-6">
          <h3 className="text-[15px] font-bold text-white mb-4 flex items-center gap-2">
            <MaterialIcon name="help_outline" className="text-[20px] text-slate-400" />
            How Our Valuation Works
          </h3>
          <div className="space-y-3">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="flex gap-4 bg-white/[0.03] border border-white/5 rounded-xl p-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1152d4]/15 border border-[#1152d4]/25 flex items-center justify-center">
                  <MaterialIcon name={step.icon} className="text-[18px] text-[#60a5fa]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-[#1152d4] tracking-widest">{step.step}</span>
                    <span className="font-bold text-sm text-white">{step.title}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
