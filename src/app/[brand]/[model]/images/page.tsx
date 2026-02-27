"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";
import { fetchCarModel, type ApiCarModelDetail } from "@/lib/api";

/* ─── Gallery items ─── */
interface GalleryItem {
  label: string;
  category: "exterior" | "interior" | "colors";
  bg: string; // placeholder color
}

const GALLERY_ITEMS: GalleryItem[] = [
  { label: "Front View", category: "exterior", bg: "#1a2332" },
  { label: "Side Profile", category: "exterior", bg: "#1e2a3a" },
  { label: "Rear View", category: "exterior", bg: "#172230" },
  { label: "Front 3/4", category: "exterior", bg: "#1c2838" },
  { label: "Rear 3/4", category: "exterior", bg: "#192636" },
  { label: "Dashboard", category: "interior", bg: "#2a1f1f" },
  { label: "Steering Wheel", category: "interior", bg: "#2d2222" },
  { label: "Seats", category: "interior", bg: "#261d1d" },
  { label: "Center Console", category: "interior", bg: "#2b2020" },
  { label: "Infotainment", category: "interior", bg: "#281e1e" },
  { label: "Pearl White", category: "colors", bg: "#e8e4df" },
  { label: "Cosmic Black", category: "colors", bg: "#1a1a1f" },
];

const FILTERS = ["All", "Exterior", "Interior", "Colors"] as const;

export default function ImagesPage({
  params,
}: {
  params: Promise<{ brand: string; model: string }>;
}) {
  const { brand: brandSlug, model: modelSlug } = use(params);

  const [car, setCar] = useState<ApiCarModelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<typeof FILTERS[number]>("All");
  const [toast, setToast] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchCarModel(brandSlug, modelSlug)
      .then((res) => setCar(res.model))
      .catch(() => setCar(null))
      .finally(() => setLoading(false));
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

  const filtered =
    activeFilter === "All"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeFilter.toLowerCase());

  const show360Toast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  };

  return (
    <div className="min-h-dvh w-full pb-36" style={{ background: "#080a0f", color: "#e2e8f0" }}>

      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-40 border-b border-white/5" style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link href={`/${brandSlug}/${modelSlug}`} className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0" style={{ background: "rgba(255,255,255,0.05)" }}>
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{car.brand.name}</p>
            <h1 className="text-sm font-bold text-white truncate leading-tight">{car.name} Images</h1>
          </div>
        </div>
      </header>

      {/* ─── IMAGE COUNT BADGE ─── */}
      <div className="max-w-lg mx-auto px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "rgba(17,82,212,0.1)" }}>
            <MaterialIcon name="photo_library" className="text-[14px]" style={{ color: "#60a5fa" }} />
            <span className="text-[11px] font-semibold" style={{ color: "#60a5fa" }}>12 Photos</span>
          </div>
          <span className="text-[10px] text-slate-600">·</span>
          <span className="text-[11px] text-slate-500 font-medium">6 Colors</span>
        </div>
      </div>

      {/* ─── FILTER PILLS ─── */}
      <div className="max-w-lg mx-auto px-4 pb-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all"
              style={{
                background: activeFilter === f ? "#1152d4" : "rgba(255,255,255,0.05)",
                color: activeFilter === f ? "#fff" : "#64748b",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ─── IMAGE GRID ─── */}
      <div className="max-w-lg mx-auto px-4">
        <div className="grid grid-cols-3 gap-2">
          {filtered.map((item, i) => (
            <div
              key={item.label + i}
              className="relative rounded-xl overflow-hidden border border-white/5"
              style={{ aspectRatio: "1/1", background: item.bg }}
            >
              {/* Camera icon placeholder */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <MaterialIcon
                  name={item.category === "colors" ? "palette" : "photo_camera"}
                  className="text-[24px] mb-1"
                  style={{ color: item.category === "colors" && item.bg === "#e8e4df" ? "#333" : "rgba(255,255,255,0.2)" }}
                />
              </div>
              {/* Label */}
              <div className="absolute bottom-0 inset-x-0 px-2 py-1.5" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }}>
                <p
                  className="text-[9px] font-semibold truncate"
                  style={{ color: item.category === "colors" && item.bg === "#e8e4df" ? "#fff" : "#d1d5db" }}
                >
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 360 VIEW CTA ─── */}
      <div className="max-w-lg mx-auto px-4 mt-6">
        <button
          onClick={show360Toast}
          className="w-full h-14 rounded-2xl border border-white/5 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
          style={{ background: "rgba(17,82,212,0.06)" }}
        >
          <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(17,82,212,0.15)" }}>
            <MaterialIcon name="360" className="text-[20px]" style={{ color: "#60a5fa" }} />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-white">360° View</p>
            <p className="text-[10px] text-slate-500">Explore every angle interactively</p>
          </div>
          <MaterialIcon name="chevron_right" className="text-[20px] text-slate-600 ml-auto" />
        </button>
      </div>

      {/* ─── TOAST ─── */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2" style={{ background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)" }}>
          <MaterialIcon name="info" className="text-[18px]" style={{ color: "#60a5fa" }} />
          <span className="text-xs font-semibold text-white">360° View coming soon</span>
        </div>
      )}

      <BuyerBottomNav />
    </div>
  );
}
