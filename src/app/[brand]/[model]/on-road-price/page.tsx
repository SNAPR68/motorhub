"use client";

import { use, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";
import { fetchCarModel } from "@/lib/api";
import type { ApiCarModelDetail } from "@/lib/api";
import { formatPrice } from "@/lib/car-catalog";

/* ─── Cities ─── */
const CITIES = [
  "Bengaluru",
  "Mumbai",
  "Delhi",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Kolkata",
  "Ahmedabad",
];

/* ─── Default variant fallbacks ─── */
const DEFAULT_VARIANTS = [
  { name: "Base", exShowroom: 0 },
  { name: "Mid", exShowroom: 0 },
  { name: "Top", exShowroom: 0 },
];

export default function OnRoadPricePage({
  params,
}: {
  params: Promise<{ brand: string; model: string }>;
}) {
  const { brand: brandSlug, model: modelSlug } = use(params);

  const [car, setCar] = useState<ApiCarModelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Bengaluru");
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [cityOpen, setCityOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchCarModel(brandSlug, modelSlug)
      .then((res) => {
        if (cancelled) return;
        setCar(res.model);
      })
      .catch(() => {
        if (cancelled) return;
        setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [brandSlug, modelSlug]);

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: "#080a0f" }}>
        <div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ── 404 state ── */
  if (notFound || !car) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: "#080a0f" }}>
        <div className="text-center px-6">
          <MaterialIcon name="search_off" className="text-[48px] text-slate-700 mb-3" />
          <p className="text-slate-400 font-semibold">Model not found</p>
          <Link href="/new-cars" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: "#1152d4" }}>
            <MaterialIcon name="arrow_back" className="text-[15px]" /> Browse New Cars
          </Link>
        </div>
      </div>
    );
  }

  const brand = car.brand;

  /* Build variants list — use API data or fallback */
  const variants = car.variants.length > 0
    ? car.variants.map((v) => ({ name: v.name, exShowroom: v.exShowroom }))
    : DEFAULT_VARIANTS.map((v, i) => ({
        name: v.name,
        exShowroom: car.startingPrice + i * 150000,
      }));

  const exShowroom = variants[selectedVariantIdx].exShowroom;

  /* ── Price breakdown computation ── */
  const breakdown = useMemo(() => {
    const rto = Math.round(exShowroom * 0.10);
    const insuranceBase = exShowroom < 1000000 ? 25000 : exShowroom < 1500000 ? 32000 : 45000;
    const insurance = insuranceBase;
    const tcs = Math.round(exShowroom * 0.01);
    const handling = 15000;
    const total = exShowroom + rto + insurance + tcs + handling;

    /* EMI: 8.75%, 60 months, 20% down */
    const principal = exShowroom * 0.80;
    const r = 0.0875 / 12;
    const n = 60;
    const emi = Math.round((principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));

    return { rto, insurance, tcs, handling, total, emi, downPayment: Math.round(exShowroom * 0.2), principal };
  }, [exShowroom]);

  return (
    <div className="min-h-dvh w-full pb-36" style={{ background: "#080a0f", color: "#e2e8f0" }}>

      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-40 border-b border-white/5" style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link href={`/${brandSlug}/${modelSlug}`} className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0" style={{ background: "rgba(255,255,255,0.05)" }}>
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{brand.name}</p>
            <h1 className="text-sm font-bold text-white truncate leading-tight">{car.name} On-Road Price</h1>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">

        {/* ─── CITY SELECTOR ─── */}
        <div className="relative">
          <button
            onClick={() => setCityOpen(!cityOpen)}
            className="w-full h-12 rounded-xl border border-white/5 px-4 flex items-center justify-between transition-all"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <div className="flex items-center gap-2">
              <MaterialIcon name="location_on" className="text-[18px]" style={{ color: "#60a5fa" }} />
              <span className="text-sm font-semibold text-white">{selectedCity}</span>
            </div>
            <MaterialIcon name={cityOpen ? "expand_less" : "expand_more"} className="text-[20px] text-slate-500" />
          </button>

          {cityOpen && (
            <div className="absolute top-14 inset-x-0 z-50 rounded-xl border border-white/10 shadow-2xl overflow-hidden" style={{ background: "#0f1218" }}>
              {CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => { setSelectedCity(city); setCityOpen(false); }}
                  className="w-full px-4 py-3 text-left text-sm flex items-center justify-between border-b border-white/5 transition-colors hover:bg-white/5"
                  style={{ color: selectedCity === city ? "#60a5fa" : "#94a3b8" }}
                >
                  {city}
                  {selectedCity === city && <MaterialIcon name="check" className="text-[16px]" style={{ color: "#60a5fa" }} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─── VARIANT SELECTOR ─── */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Select Variant</p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {variants.map((v, i) => (
              <button
                key={v.name}
                onClick={() => setSelectedVariantIdx(i)}
                className="shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all"
                style={{
                  background: selectedVariantIdx === i ? "rgba(17,82,212,0.12)" : "rgba(255,255,255,0.03)",
                  borderColor: selectedVariantIdx === i ? "rgba(17,82,212,0.4)" : "rgba(255,255,255,0.05)",
                  color: selectedVariantIdx === i ? "#60a5fa" : "#64748b",
                }}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>

        {/* ─── PRICE BREAKDOWN CARD ─── */}
        <div className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
          <div className="px-4 pt-4 pb-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
              Price Breakdown — {selectedCity}
            </p>
          </div>

          {/* Line items */}
          {[
            { label: "Ex-Showroom Price", value: exShowroom, bold: false },
            { label: "Registration (RTO)", value: breakdown.rto, bold: false },
            { label: "Insurance (1 Year)", value: breakdown.insurance, bold: false },
            { label: "TCS (1%)", value: breakdown.tcs, bold: false },
            { label: "Handling & Logistics", value: breakdown.handling, bold: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between px-4 py-2.5 border-t border-white/[0.03]">
              <span className="text-[11px] text-slate-400">{item.label}</span>
              <span className="text-[11px] font-semibold text-slate-200">{formatPrice(item.value)}</span>
            </div>
          ))}

          {/* Total */}
          <div className="flex items-center justify-between px-4 py-4 border-t border-white/10" style={{ background: "rgba(17,82,212,0.04)" }}>
            <span className="text-sm font-bold text-white">On-Road Price</span>
            <span className="text-xl font-black text-white">{formatPrice(breakdown.total)}</span>
          </div>
        </div>

        {/* ─── EMI QUICK PREVIEW ─── */}
        <div className="rounded-2xl border border-white/5 p-4" style={{ background: "rgba(255,255,255,0.03)" }}>
          <div className="flex items-center gap-2 mb-3">
            <MaterialIcon name="calculate" className="text-[18px]" style={{ color: "#60a5fa" }} />
            <p className="text-xs font-bold text-white">EMI Estimate</p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="text-center">
              <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-0.5">Interest</p>
              <p className="text-xs font-bold text-white">8.75%</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-0.5">Tenure</p>
              <p className="text-xs font-bold text-white">60 months</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-0.5">Down Payment</p>
              <p className="text-xs font-bold text-white">{formatPrice(breakdown.downPayment)}</p>
            </div>
          </div>

          <div className="rounded-xl p-3 text-center" style={{ background: "rgba(17,82,212,0.08)", border: "1px solid rgba(17,82,212,0.2)" }}>
            <p className="text-[10px] text-slate-500 mb-0.5">Estimated Monthly EMI</p>
            <p className="text-2xl font-black text-white">{formatPrice(breakdown.emi)}<span className="text-sm font-semibold text-slate-400">/mo</span></p>
          </div>
        </div>

        {/* ─── CTAs ─── */}
        <div className="space-y-2 pb-4">
          <button
            className="w-full h-12 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            style={{ background: "#1152d4" }}
          >
            <MaterialIcon name="directions_car" className="text-[18px]" />
            Book Test Drive
          </button>
          <Link
            href="/car-loan/eligibility"
            className="w-full h-12 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] border border-white/10"
            style={{ background: "rgba(255,255,255,0.03)", color: "#94a3b8" }}
          >
            <MaterialIcon name="account_balance" className="text-[18px]" />
            Apply for Loan
          </Link>
        </div>

      </div>

      <BuyerBottomNav />
    </div>
  );
}
