"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import {
  PRESETS,
  FilterValues,
  toCssFilter,
  applyFiltersToCanvas,
} from "@/lib/photo-filters";
import { CRETA } from "@/lib/car-images";

/* AI Content Studio — Real editor with background removal, filters, export */

const TOOLS = [
  { id: "lighting", icon: "wb_iridescent", label: "Lighting" },
  { id: "bg", icon: "background_replace", label: "Studio BG" },
  { id: "grade", icon: "palette", label: "Color Grade" },
] as const;

const DEFAULT_FILTERS: FilterValues = { brightness: 100, contrast: 100, saturation: 100 };

export default function ContentStudioPage() {
  const [sliderPos, setSliderPos] = useState(60);
  const [activeTool, setActiveTool] = useState<"lighting" | "bg" | "grade">("lighting");
  const [filters, setFilters] = useState<FilterValues>(DEFAULT_FILTERS);
  const [preset, setPreset] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(CRETA);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(CRETA);
  const [bgRemovedUrl, setBgRemovedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<"bg" | "export" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [vehicleLabel] = useState("2023 HYUNDAI CRETA");
  const [uploading, setUploading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayImage = originalImage ?? CRETA;
  const enhancedDisplay = enhancedImage ?? displayImage;
  const filterCss = toCssFilter(filters);

  const handleLightingChange = useCallback(
    (key: keyof FilterValues, value: number) => {
      const next = { ...filters, [key]: value };
      setFilters(next);
      setPreset(null);
    },
    [filters]
  );

  const applyPreset = useCallback((name: string) => {
    const p = PRESETS[name] ?? DEFAULT_FILTERS;
    setFilters(p);
    setPreset(name);
  }, []);

  const handleRemoveBackground = useCallback(async () => {
    if (!displayImage) return;
    setLoading("bg");
    setError(null);
    try {
      const res = await fetch("/api/ai/photo/background-remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: displayImage }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed");
      setBgRemovedUrl(json.url);
      setEnhancedImage(json.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Background removal failed");
    } finally {
      setLoading(null);
    }
  }, [displayImage]);

  const handleExport = useCallback(async () => {
    const src = bgRemovedUrl ?? enhancedDisplay;
    if (!src) return;
    setLoading("export");
    setError(null);
    try {
      let dataUrl = src;
      if (!bgRemovedUrl && (filters.brightness !== 100 || filters.contrast !== 100 || filters.saturation !== 100)) {
        dataUrl = await applyFiltersToCanvas(src, filters);
      }
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `autovinci-${Date.now()}.png`;
      a.click();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed");
    } finally {
      setLoading(null);
    }
  }, [enhancedDisplay, bgRemovedUrl, filters]);

  const handleSliderMove = useCallback(
    (e: React.PointerEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      setSliderPos(Math.round(Math.max(0, Math.min(100, x * 100))));
    },
    []
  );

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed");
      setOriginalImage(json.url);
      setEnhancedImage(json.url);
      setBgRemovedUrl(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }, []);

  return (
    <div
      className="relative flex min-h-screen max-w-md mx-auto flex-col overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif", background: "#101622", color: "#e2e8f0" }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-12 pb-4 z-20">
        <Link
          href="/marketing"
          className="flex items-center justify-center w-10 h-10 rounded-full"
          style={{ background: "rgba(30,41,59,0.5)" }}
        >
          <MaterialIcon name="arrow_back_ios_new" />
        </Link>
        <div className="text-center">
          <h1 className="text-sm font-bold uppercase text-white" style={{ letterSpacing: "0.2em" }}>
            AI Studio
          </h1>
          <p className="text-[10px] font-medium text-slate-400 tracking-wider">{vehicleLabel}</p>
        </div>
        <button
          onClick={handleExport}
          disabled={loading === "export"}
          className="px-5 py-2 text-white rounded-full text-xs font-bold uppercase tracking-wider disabled:opacity-50"
          style={{ background: "#2b6cee", boxShadow: "0 4px 12px rgba(43,108,238,0.2)" }}
        >
          {loading === "export" ? "..." : "Export"}
        </button>
      </header>

      {/* Image source / upload */}
      <div className="px-4 pb-2">
        <label className="glass-panel rounded-xl px-4 py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/5 transition-colors">
          <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
            <MaterialIcon name="add_photo_alternate" /> {uploading ? "Uploading..." : "Change image"}
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </label>
      </div>

      {error && (
        <div className="mx-4 mb-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Main Editor Stage */}
      <main className="relative flex-1 w-full px-4 py-2 flex flex-col items-center justify-center">
        <div
          ref={containerRef}
          className="relative w-full rounded-xl overflow-hidden select-none touch-none"
          style={{
            aspectRatio: "3/4",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.03)",
          }}
          onPointerMove={(e) => e.buttons === 1 && handleSliderMove(e)}
          onPointerDown={handleSliderMove}
        >
          {/* After (Enhanced) */}
          <div className="absolute inset-0">
            <img
              src={enhancedDisplay}
              alt=""
              className="w-full h-full object-cover"
              style={{ filter: bgRemovedUrl ? "none" : filterCss }}
            />
          </div>
          {/* Before (Original) */}
          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
            <img src={displayImage} alt="" className="w-full h-full object-cover" />
          </div>

          <div
            className="absolute top-4 left-4 px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-widest"
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            Original
          </div>
          <div
            className="absolute top-4 right-4 px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-widest"
            style={{ background: "rgba(43,108,238,0.8)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            Enhanced
          </div>

          {/* Slider Handle */}
          <div
            className="absolute inset-y-0 w-0.5 z-10 cursor-ew-resize"
            style={{ left: `${sliderPos}%`, background: "rgba(43,108,238,0.6)", boxShadow: "0 0 15px rgba(43,108,238,0.5)" }}
          >
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center"
              style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.3)", border: "4px solid #2b6cee" }}
            >
              <MaterialIcon name="unfold_more" className="text-lg font-bold text-[#2b6cee]" />
            </div>
          </div>
        </div>
      </main>

      {/* Tools Bottom Section */}
      <section
        className="border-t px-6 pt-6 pb-12 z-30"
        style={{
          background: "rgba(16,22,34,0.8)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(255,255,255,0.06)",
          borderTopLeftRadius: "2.5rem",
          borderTopRightRadius: "2.5rem",
        }}
      >
        {activeTool === "lighting" && (
          <div className="mb-8 space-y-6">
            {(["brightness", "contrast", "saturation"] as const).map((key) => (
              <div key={key}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {key.replace("_", " ")}
                  </span>
                  <span className="text-xs font-bold" style={{ color: "#2b6cee" }}>
                    {(filters[key] ?? 100)}%
                  </span>
                </div>
                <div className="relative w-full h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={filters[key] ?? 100}
                    onChange={(e) => handleLightingChange(key, Number(e.target.value))}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer"
                  />
                  <div
                    className="absolute top-0 left-0 h-full rounded-full"
                    style={{
                      width: `${((Math.min(150, Math.max(50, filters[key] ?? 100)) - 50) / 100) * 100}%`,
                      background: "#2b6cee",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTool === "grade" && (
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(PRESETS).map(([name, p]) => (
                <button
                  key={name}
                  onClick={() => applyPreset(name)}
                  className="py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all capitalize"
                  style={{
                    background: preset === name ? "rgba(43,108,238,0.2)" : "rgba(30,41,59,0.5)",
                    border: preset === name ? "1px solid rgba(43,108,238,0.5)" : "1px solid transparent",
                    color: preset === name ? "#2b6cee" : "#94a3b8",
                  }}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTool === "bg" && (
          <div className="mb-8">
            <button
              onClick={handleRemoveBackground}
              disabled={loading === "bg"}
              className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{ background: "#2b6cee", color: "white", boxShadow: "0 4px 12px rgba(43,108,238,0.3)" }}
            >
              {loading === "bg" ? (
                <>
                  <MaterialIcon name="hourglass_empty" className="animate-spin" />
                  Removing background...
                </>
              ) : (
                <>
                  <MaterialIcon name="background_replace" />
                  Remove Background (AI)
                </>
              )}
            </button>
            {bgRemovedUrl && (
              <p className="text-xs text-emerald-400 mt-2 text-center">Background removed. Slider shows before/after.</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          {TOOLS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              className="flex flex-col items-center gap-3 p-4 rounded-xl border transition-all"
              style={
                activeTool === t.id
                  ? { background: "rgba(43,108,238,0.1)", borderColor: "rgba(43,108,238,0.3)", color: "#2b6cee" }
                  : { background: "rgba(30,41,59,0.5)", borderColor: "transparent", color: "#94a3b8" }
              }
            >
              <MaterialIcon name={t.icon} fill={activeTool === t.id} className="text-2xl" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{t.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Bottom Nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex gap-2 border-t px-4 pb-6 pt-2 max-w-md mx-auto"
        style={{ background: "rgba(15,23,42,0.95)", borderColor: "rgba(255,255,255,0.06)" }}
      >
        {[
          { icon: "auto_fix_high", label: "Editor", href: "/content-studio", active: true },
          { icon: "folder_open", label: "Assets", href: "/studio" },
          { icon: "palette", label: "Creative", href: "/studio/creative" },
          { icon: "person_outline", label: "Profile", href: "/settings" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-1 flex-col items-center justify-end gap-1"
            style={{ color: item.active ? "#2b6cee" : "#94a3b8" }}
          >
            <MaterialIcon name={item.icon} fill={item.active} />
            <p className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</p>
          </Link>
        ))}
      </nav>
    </div>
  );
}
