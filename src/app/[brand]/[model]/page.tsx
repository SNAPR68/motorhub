"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";
import {
  getModelBySlug,
  getBrandBySlug,
  getVariantsByModel,
  getModelsByBrand,
  formatEmi,
  formatPrice,
  type CarVariant,
} from "@/lib/car-catalog";

/* ─── New Car Model Overview Page ─── */

const TABS = ["Overview", "Variants", "Compare"] as const;

export default function ModelPage({
  params,
}: {
  params: Promise<{ brand: string; model: string }>;
}) {
  const { brand: brandSlug, model: modelSlug } = use(params);
  const car = getModelBySlug(brandSlug, modelSlug);
  const brand = getBrandBySlug(brandSlug);
  const variants = getVariantsByModel(modelSlug);
  const otherModels = getModelsByBrand(brandSlug).filter((m) => m.slug !== modelSlug).slice(0, 4);

  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("Overview");
  const [activeImg, setActiveImg] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

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
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{brand?.name ?? brandSlug}</p>
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
        <div className="max-w-lg mx-auto flex">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all"
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
            {otherModels.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                  More from {brand?.name ?? brandSlug}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {otherModels.map((m) => (
                    <Link
                      key={m.slug}
                      href={`/${m.brand}/${m.slug}`}
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
            {variants.length > 0 ? (
              variants.map((v: CarVariant) => (
                <VariantCard key={v.name + v.fuel} variant={v} />
              ))
            ) : (
              <div className="text-center py-12">
                <MaterialIcon name="list" className="text-[40px] text-slate-700 mb-3" />
                <p className="text-sm text-slate-500">Variant details coming soon</p>
              </div>
            )}
          </div>
        )}

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

function VariantCard({ variant }: { variant: CarVariant }) {
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
