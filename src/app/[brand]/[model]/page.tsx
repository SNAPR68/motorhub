"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";
import { formatEmi, formatPrice } from "@/lib/car-catalog";
import { fetchCarModel, type ApiCarModelDetail, type ApiCarVariant } from "@/lib/api";
import { computeTrueCost, formatCost } from "@/lib/true-cost";

/* ─── New Car Model Overview Page ─── */

const TABS = ["Overview", "Variants", "True Cost", "Compare"] as const;

export default function ModelPage({
  params,
}: {
  params: Promise<{ brand: string; model: string }>;
}) {
  const { brand: brandSlug, model: modelSlug } = use(params);
  const [car, setCar] = useState<ApiCarModelDetail | null>(null);
  const [relatedModels, setRelatedModels] = useState<Array<{
    slug: string; name: string; fullName: string; image: string;
    startingPriceDisplay: string; rating: number;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("Overview");
  const [activeImg, setActiveImg] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    fetchCarModel(brandSlug, modelSlug)
      .then((data) => {
        setCar(data.model);
        setRelatedModels(data.relatedModels);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [brandSlug, modelSlug]);

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: "#080a0f" }}>
        <div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    );
  }

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

  const gallery = car.gallery?.length ? car.gallery : [car.image];

  return (
    <div className="min-h-dvh w-full pb-36" style={{ background: "#080a0f", color: "#e2e8f0" }}>

      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-40 border-b border-white/5" style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/new-cars" className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0" style={{ background: "rgba(255,255,255,0.05)" }}>
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{car.brand.name}</p>
            <h1 className="text-sm font-bold text-white truncate leading-tight">{car.fullName}</h1>
          </div>
          <button
            onClick={() => setWishlisted(!wishlisted)}
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon name={wishlisted ? "favorite" : "favorite_border"} className={`text-[20px] ${wishlisted ? "text-red-500" : "text-slate-400"}`} />
          </button>
        </div>
      </header>

      {/* ─── IMAGE GALLERY ─── */}
      <div className="relative max-w-lg mx-auto">
        <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
          <Image
            src={gallery[activeImg]}
            alt={car.fullName}
            fill
            sizes="(max-width: 512px) 100vw, 512px"
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,10,15,0.9) 0%, transparent 50%)" }} />

          {car.tag && (
            <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded-full text-white" style={{ background: "rgba(17,82,212,0.9)", backdropFilter: "blur(4px)" }}>
              {car.tag}
            </span>
          )}

          {/* Rating */}
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}>
            <span className="text-amber-400 text-[11px] font-bold">{car.rating}★</span>
            <span className="text-slate-400 text-[10px]">({(car.reviewCount / 1000).toFixed(1)}K)</span>
          </div>

          {/* Dot indicators */}
          {gallery.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {gallery.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  style={{ width: i === activeImg ? "20px" : "6px", height: "6px", borderRadius: "3px", background: i === activeImg ? "#fff" : "rgba(255,255,255,0.4)" }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {gallery.length > 1 && (
          <div className="flex gap-2 p-3 overflow-x-auto no-scrollbar" style={{ background: "rgba(255,255,255,0.02)" }}>
            {gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className="relative shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all"
                style={{ borderColor: i === activeImg ? "#1152d4" : "transparent" }}
              >
                <Image src={img} alt="" fill sizes="64px" className="object-cover" unoptimized />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── PRICE BANNER ─── */}
      <div className="max-w-lg mx-auto px-4 py-4 border-b border-white/5">
        <div className="flex items-end justify-between mb-3">
          <div>
            <h2 className="text-2xl font-black text-white">{car.startingPriceDisplay}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ex-showroom · EMI from <span className="text-slate-300 font-semibold">{formatEmi(car.startingPrice)}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-500 mb-0.5">Avg. On-Road</p>
            <p className="text-sm font-bold text-white">{formatPrice(Math.round(car.startingPrice * 1.14))}</p>
          </div>
        </div>

        {/* Quick specs grid */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: "speed", label: "Mileage", val: car.mileage },
            { icon: "bolt", label: "Power", val: car.power },
            { icon: "settings", label: "Gearbox", val: car.transmissions[0] },
            { icon: "airline_seat_recline_normal", label: "Seats", val: `${car.seating}` },
          ].map(({ icon, label, val }) => (
            <div key={label} className="rounded-xl p-2 text-center border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
              <MaterialIcon name={icon} className="text-[16px] text-slate-500 mb-1" />
              <p className="text-[9px] text-slate-600 uppercase tracking-wider">{label}</p>
              <p className="text-[10px] font-bold text-white">{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── TABS ─── */}
      <div className="sticky top-14 z-30 border-b border-white/5" style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-lg mx-auto flex overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="shrink-0 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap"
              style={{
                borderColor: activeTab === tab ? "#1152d4" : "transparent",
                color: activeTab === tab ? "#fff" : "#64748b",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ─── TAB CONTENT ─── */}
      <div className="max-w-lg mx-auto px-4 pt-4">

        {/* ── Overview ── */}
        {activeTab === "Overview" && (
          <div className="space-y-4">
            {/* Fuel & Transmission */}
            <div className="rounded-2xl p-4 border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Available In</p>
              <div className="flex flex-wrap gap-2">
                {car.fuelTypes.map((f) => (
                  <span key={f} className="px-3 py-1 rounded-full text-xs font-semibold border border-white/10" style={{ background: "rgba(255,255,255,0.04)", color: "#94a3b8" }}>
                    {f}
                  </span>
                ))}
                {car.transmissions.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full text-xs font-semibold border border-blue-500/20" style={{ background: "rgba(17,82,212,0.06)", color: "#60a5fa" }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Pros & Cons */}
            <div className="rounded-2xl p-4 border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Pros & Cons</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-bold text-emerald-400 mb-2">PROS</p>
                  {car.pros.map((p) => (
                    <div key={p} className="flex items-start gap-2 mb-1.5">
                      <MaterialIcon name="thumb_up" className="text-[12px] text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-[11px] text-slate-300">{p}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-red-400 mb-2">CONS</p>
                  {car.cons.map((c) => (
                    <div key={c} className="flex items-start gap-2 mb-1.5">
                      <MaterialIcon name="thumb_down" className="text-[12px] text-red-500 mt-0.5 shrink-0" />
                      <span className="text-[11px] text-slate-300">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Full specs */}
            <div className="rounded-2xl border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-4 pt-4 pb-3">Specifications</p>
              {[
                { label: "Engine", val: car.engine },
                { label: "Power", val: car.power },
                { label: "Mileage (ARAI)", val: car.mileage },
                { label: "Body Type", val: car.bodyType },
                { label: "Seating", val: `${car.seating} Persons` },
                { label: "Fuel Types", val: car.fuelTypes.join(", ") },
                { label: "Transmission", val: car.transmissions.join(", ") },
              ].map(({ label, val }) => (
                <div key={label} className="flex items-center justify-between px-4 py-2.5 border-t border-white/5">
                  <span className="text-xs text-slate-500">{label}</span>
                  <span className="text-xs font-semibold text-white text-right max-w-[55%]">{val}</span>
                </div>
              ))}
            </div>

            {/* Other models from this brand */}
            {relatedModels.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                  More from {car.brand.name}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {relatedModels.map((m) => (
                    <Link
                      key={m.slug}
                      href={`/${brandSlug}/${m.slug}`}
                      className="rounded-xl overflow-hidden border border-white/5 transition-all active:scale-95"
                      style={{ background: "rgba(255,255,255,0.03)" }}
                    >
                      <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
                        <Image src={m.image} alt={m.fullName} fill sizes="200px" className="object-cover" unoptimized />
                      </div>
                      <div className="p-2.5">
                        <p className="text-[11px] font-bold text-white">{m.name}</p>
                        <p className="text-[10px] text-slate-500">{m.startingPriceDisplay} onwards</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Variants ── */}
        {activeTab === "Variants" && (
          <div className="space-y-2">
            {car.variants.length > 0 ? (
              car.variants.map((v: ApiCarVariant) => (
                <VariantCard key={v.id} variant={v} />
              ))
            ) : (
              <div className="text-center py-12">
                <MaterialIcon name="list" className="text-[40px] text-slate-700 mb-3" />
                <p className="text-sm text-slate-500">Variant details coming soon</p>
              </div>
            )}
          </div>
        )}

        {/* ── True Cost ── */}
        {activeTab === "True Cost" && (() => {
          const tc = computeTrueCost({
            price: car.startingPrice,
            fuel: car.fuelTypes[0],
            category: car.category.toLowerCase() as "suv" | "sedan" | "hatchback" | "ev" | "luxury" | "mpv",
            modelSlug: car.slug,
            year: car.year,
          });
          return (
            <div className="space-y-4">
              <div className="rounded-2xl p-5 border border-amber-500/20" style={{ background: "rgba(245,158,11,0.05)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-1">3-Year Total Cost</p>
                <p className="text-3xl font-black text-white">{formatCost(tc.total3Year)}</p>
                <p className="text-xs text-slate-500 mt-1">
                  <span className="text-amber-400 font-semibold">{formatCost(tc.perMonth)}/mo</span> beyond your EMI
                </p>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="h-1.5 w-3 rounded-full"
                        style={{ background: i < Math.round(tc.reliabilityScore) ? "#10b981" : "rgba(255,255,255,0.1)" }} />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">Reliability <span className="text-white font-bold">{tc.reliabilityScore}/10</span></span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-4 pt-4 pb-2">Annual Breakdown</p>
                {[
                  { label: "Insurance (est.)", val: tc.insurance, icon: "shield", color: "#3b82f6" },
                  { label: "Fuel (15,000 km/yr)", val: tc.fuel, icon: "local_gas_station", color: "#f59e0b" },
                  { label: "Maintenance", val: tc.maintenance, icon: "build", color: "#8b5cf6" },
                  { label: "Depreciation (yr 1)", val: tc.depreciation, icon: "trending_down", color: "#ef4444" },
                ].map(({ label, val, icon, color }, i) => {
                  const annual = tc.insurance + tc.fuel + tc.maintenance + tc.depreciation;
                  const pct = Math.round((val / annual) * 100);
                  return (
                    <div key={label} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-white/5" : ""}`}>
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
                        <MaterialIcon name={icon} className="text-[16px]" style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-slate-300">{label}</span>
                          <span className="text-xs font-bold text-white">{formatCost(val)}/yr</span>
                        </div>
                        <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {tc.knownIssues.length > 0 && (
                <div className="rounded-2xl p-4 border border-amber-500/15" style={{ background: "rgba(245,158,11,0.04)" }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-3">Known Issues</p>
                  {tc.knownIssues.map((issue) => (
                    <div key={issue} className="flex items-start gap-2 mb-2">
                      <MaterialIcon name="warning" className="text-[13px] text-amber-500 mt-0.5 shrink-0" />
                      <span className="text-xs text-slate-300">{issue}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* ── Compare ── */}
        {activeTab === "Compare" && (
          <div className="py-8 text-center">
            <MaterialIcon name="compare_arrows" className="text-[48px] text-slate-700 mb-3" />
            <p className="text-sm font-semibold text-slate-400 mb-1">Compare {car.name}</p>
            <p className="text-xs text-slate-600 mb-6">Compare with similar models in its segment</p>
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white"
              style={{ background: "#1152d4" }}
            >
              <MaterialIcon name="compare_arrows" className="text-[18px]" />
              Go to Compare Tool
            </Link>
          </div>
        )}
      </div>

      {/* ─── STICKY CTA ─── */}
      <div className="fixed bottom-20 md:bottom-0 inset-x-0 z-40 max-w-lg mx-auto px-4 pb-3">
        <div className="flex gap-2">
          <Link
            href={`/car-loan/emi-calculator?price=${car.startingPrice}`}
            className="flex-1 h-12 rounded-2xl font-bold text-sm border border-white/10 flex items-center justify-center gap-2 transition-all"
            style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8" }}
          >
            <MaterialIcon name="calculate" className="text-[18px]" />
            EMI Calc
          </Link>
          <button
            className="flex-1 h-12 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all"
            style={{ background: "#1152d4" }}
          >
            <MaterialIcon name="directions_car" className="text-[18px]" />
            Test Drive
          </button>
        </div>
      </div>

      <BuyerBottomNav />
    </div>
  );
}

function VariantCard({ variant }: { variant: ApiCarVariant }) {
  return (
    <div className="rounded-2xl p-4 border border-white/5 flex items-center justify-between gap-3" style={{ background: "rgba(255,255,255,0.03)" }}>
      <div className="min-w-0">
        <p className="text-sm font-bold text-white">{variant.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-slate-500">{variant.fuel}</span>
          <span className="text-[10px] text-slate-700">·</span>
          <span className="text-[10px] text-slate-500">{variant.transmission}</span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-black text-white">{variant.exShowroomDisplay}</p>
        <p className="text-[10px] text-slate-500">{formatEmi(variant.exShowroom)}/mo</p>
      </div>
    </div>
  );
}
