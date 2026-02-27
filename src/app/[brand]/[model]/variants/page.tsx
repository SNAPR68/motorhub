"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";
import { fetchCarModel, type ApiCarModelDetail, type ApiCarVariant } from "@/lib/api";
import { formatEmi } from "@/lib/car-catalog";

/* ─── Variant highlight data (keyed by position) ─── */
const VARIANT_HIGHLIGHTS: Record<string, string[]> = {
  default_base: ["Dual Airbags", "ABS + EBD", "AC", "Power Steering", "Rear Parking Sensors"],
  default_mid: ["6 Airbags", "Touchscreen Infotainment", "Android Auto / Apple CarPlay", "Alloy Wheels", "Rear Camera"],
  default_top: ["6 Airbags", "Sunroof", "Cruise Control", "LED Headlamps", "Wireless Charging", "360° Camera"],
  default_auto: ["Paddle Shifters", "Ventilated Seats", "ADAS Level 2", "Head-Up Display", "Connected Car Tech"],
};

function getHighlights(variant: ApiCarVariant, index: number, total: number): string[] {
  if (index === 0) return VARIANT_HIGHLIGHTS.default_base;
  if (index === total - 1 && total > 2)
    return variant.transmission === "Automatic" || variant.transmission === "DCT"
      ? VARIANT_HIGHLIGHTS.default_auto
      : VARIANT_HIGHLIGHTS.default_top;
  if (index >= total - 2) return VARIANT_HIGHLIGHTS.default_top;
  return VARIANT_HIGHLIGHTS.default_mid;
}

/* ─── Static specs for compare table ─── */
function getVariantSpec(_variant: ApiCarVariant, index: number, total: number) {
  const isBase = index === 0;
  const isTop = index >= total - 2;
  return {
    engine: isBase ? "1197 cc" : "1482 cc Turbo",
    power: isBase ? "89 bhp" : isTop ? "118 bhp" : "103 bhp",
    mileage: isBase ? "21.5 km/l" : isTop ? "18.2 km/l" : "19.8 km/l",
  };
}

export default function VariantsPage({
  params,
}: {
  params: Promise<{ brand: string; model: string }>;
}) {
  const { brand: brandSlug, model: modelSlug } = use(params);
  const [car, setCar] = useState<ApiCarModelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchCarModel(brandSlug, modelSlug)
      .then((res) => {
        if (!cancelled) setCar(res.model);
      })
      .catch(() => {
        if (!cancelled) setCar(null);
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
  if (!car) {
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
  const variants = car.variants;
  const hasVariants = variants.length > 0;

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
            <h1 className="text-sm font-bold text-white truncate leading-tight">{car.name} Variants</h1>
          </div>
          <span className="text-[10px] font-semibold text-slate-500">{variants.length} Variants</span>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-4">

        {/* ─── COMING SOON ─── */}
        {!hasVariants && (
          <div className="text-center py-20">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full mb-4" style={{ background: "rgba(17,82,212,0.08)" }}>
              <MaterialIcon name="format_list_bulleted" className="text-[36px]" style={{ color: "#1152d4" }} />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">Variants Coming Soon</h2>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">
              We are updating variant details for the {car.fullName}. Check back shortly.
            </p>
            <Link
              href={`/${brandSlug}/${modelSlug}`}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white"
              style={{ background: "#1152d4" }}
            >
              <MaterialIcon name="arrow_back" className="text-[16px]" />
              Back to {car.name}
            </Link>
          </div>
        )}

        {/* ─── VARIANT CARDS ─── */}
        {hasVariants && (
          <div className="space-y-3">
            {variants.map((v, i) => {
              const highlights = getHighlights(v, i, variants.length);
              const isSelected = selectedIdx === i;

              return (
                <div
                  key={v.name + v.fuel}
                  className="rounded-2xl border transition-all"
                  style={{
                    background: isSelected ? "rgba(17,82,212,0.06)" : "rgba(255,255,255,0.03)",
                    borderColor: isSelected ? "rgba(17,82,212,0.3)" : "rgba(255,255,255,0.05)",
                  }}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-white">{v.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                            <MaterialIcon name="local_gas_station" className="text-[12px]" />
                            {v.fuel}
                          </span>
                          <span className="text-[10px] text-slate-700">|</span>
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                            <MaterialIcon name="settings" className="text-[12px]" />
                            {v.transmission}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-base font-black text-white">{v.exShowroomDisplay}</p>
                        <p className="text-[10px] text-slate-500">{formatEmi(v.exShowroom)}/mo</p>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {highlights.map((h) => (
                        <span key={h} className="px-2 py-0.5 rounded-md text-[9px] font-medium border border-white/5" style={{ background: "rgba(255,255,255,0.04)", color: "#94a3b8" }}>
                          {h}
                        </span>
                      ))}
                    </div>

                    {/* Select button */}
                    <button
                      onClick={() => setSelectedIdx(isSelected ? null : i)}
                      className="mt-3 w-full h-10 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                      style={{
                        background: isSelected ? "#1152d4" : "rgba(17,82,212,0.1)",
                        color: isSelected ? "#fff" : "#60a5fa",
                      }}
                    >
                      <MaterialIcon name={isSelected ? "check_circle" : "add_circle_outline"} className="text-[16px]" />
                      {isSelected ? "Selected" : "Select"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── QUICK COMPARE TABLE ─── */}
        {hasVariants && variants.length > 1 && (
          <div className="mt-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
              Quick Compare — All Variants
            </h2>
            <div className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full min-w-[480px]">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left text-[10px] text-slate-600 font-bold uppercase tracking-wider px-4 py-3 sticky left-0" style={{ background: "rgba(8,10,15,0.98)" }}>
                        Spec
                      </th>
                      {variants.map((v) => (
                        <th key={v.name} className="text-center text-[10px] text-white font-bold px-3 py-3 whitespace-nowrap">
                          {v.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/5">
                      <td className="text-[11px] text-slate-400 px-4 py-2.5 font-medium sticky left-0" style={{ background: "rgba(8,10,15,0.98)" }}>Price</td>
                      {variants.map((v) => (
                        <td key={v.name + "price"} className="text-center text-[11px] font-bold text-white px-3 py-2.5">{v.exShowroomDisplay}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="text-[11px] text-slate-400 px-4 py-2.5 font-medium sticky left-0" style={{ background: "rgba(8,10,15,0.98)" }}>Engine</td>
                      {variants.map((v, i) => {
                        const spec = getVariantSpec(v, i, variants.length);
                        return <td key={v.name + "eng"} className="text-center text-[11px] text-slate-300 px-3 py-2.5">{spec.engine}</td>;
                      })}
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="text-[11px] text-slate-400 px-4 py-2.5 font-medium sticky left-0" style={{ background: "rgba(8,10,15,0.98)" }}>Power</td>
                      {variants.map((v, i) => {
                        const spec = getVariantSpec(v, i, variants.length);
                        return <td key={v.name + "pwr"} className="text-center text-[11px] text-slate-300 px-3 py-2.5">{spec.power}</td>;
                      })}
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="text-[11px] text-slate-400 px-4 py-2.5 font-medium sticky left-0" style={{ background: "rgba(8,10,15,0.98)" }}>Mileage</td>
                      {variants.map((v, i) => {
                        const spec = getVariantSpec(v, i, variants.length);
                        return <td key={v.name + "mil"} className="text-center text-[11px] text-slate-300 px-3 py-2.5">{spec.mileage}</td>;
                      })}
                    </tr>
                    <tr>
                      <td className="text-[11px] text-slate-400 px-4 py-2.5 font-medium sticky left-0" style={{ background: "rgba(8,10,15,0.98)" }}>Transmission</td>
                      {variants.map((v) => (
                        <td key={v.name + "trans"} className="text-center text-[11px] text-slate-300 px-3 py-2.5">{v.transmission}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── CONFIGURE CTA ─── */}
        {hasVariants && (
          <div className="mt-6 mb-4">
            <Link
              href={`/${brandSlug}/${modelSlug}/on-road-price`}
              className="w-full h-12 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              style={{ background: "#1152d4" }}
            >
              <MaterialIcon name="tune" className="text-[18px]" />
              Configure & Price
            </Link>
          </div>
        )}
      </div>

      <BuyerBottomNav />
    </div>
  );
}
