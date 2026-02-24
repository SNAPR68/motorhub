"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CRETA, BLUR_DATA_URL } from "@/lib/car-images";
import { MaterialIcon } from "@/components/MaterialIcon";

/* Stitch: ai_content_studio_editor_2 — #f97316 (orange), Manrope, #1a1008 */

const EFFECTS = [
  { name: "Chrome Enhancement", icon: "auto_awesome", enabled: true, intensity: 72 },
  { name: "HDR Processing", icon: "hdr_on", enabled: true, intensity: 85 },
  { name: "Ray Tracing", icon: "lens_blur", enabled: false, intensity: 50 },
];

const PRESETS = [
  { name: "Natural", active: false },
  { name: "Vivid", active: true },
  { name: "Cinema", active: false },
  { name: "Matte", active: false },
];

export default function ContentStudioAdvancedPage() {
  const [effects, setEffects] = useState(EFFECTS);

  const toggleEffect = (i: number) => {
    setEffects((prev) => prev.map((e, idx) => idx === i ? { ...e, enabled: !e.enabled } : e));
  };

  return (
    <div
      className="min-h-dvh w-full flex flex-col max-w-md mx-auto text-slate-100 pb-24"
      style={{ fontFamily: "'Manrope', sans-serif", background: "#1a1008" }}
    >
      {/* Header */}
      <header className="sticky top-0 z-30 px-4 py-4 flex items-center justify-between border-b"
        style={{ background: "rgba(26,16,8,0.8)", backdropFilter: "blur(12px)", borderColor: "rgba(249,115,22,0.1)" }}>
        <Link href="/content-studio" className="p-2 rounded-full hover:bg-white/5">
          <MaterialIcon name="arrow_back" className="text-slate-400" />
        </Link>
        <h1 className="text-sm font-bold uppercase tracking-[0.15em] text-[#f97316]">Advanced Studio</h1>
        <button className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#f97316] text-white">Save</button>
      </header>

      <main className="flex-1 overflow-y-auto pb-8">
        {/* Image Preview */}
        <div className="relative w-full aspect-[3/4] overflow-hidden">
          <Image src={CRETA} alt="Vehicle" fill className="object-cover brightness-110 contrast-110 saturate-120" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
          <div className="absolute top-4 left-4 px-3 py-1 rounded text-[10px] font-bold text-white uppercase tracking-widest"
            style={{ background: "rgba(249,115,22,0.8)", backdropFilter: "blur(12px)" }}>
            Enhanced
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1a1008] to-transparent" />
        </div>

        {/* Effect Toggles */}
        <section className="px-4 py-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">AI Effects</h3>
          <div className="space-y-4">
            {effects.map((effect, i) => (
              <div key={effect.name} className="rounded-xl p-4"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(249,115,22,0.1)" }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg flex items-center justify-center" style={{ background: effect.enabled ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.05)" }}>
                      <MaterialIcon name={effect.icon} className={effect.enabled ? "text-[#f97316]" : "text-slate-500"} />
                    </div>
                    <span className={`text-sm font-bold ${effect.enabled ? "text-white" : "text-slate-500"}`}>{effect.name}</span>
                  </div>
                  <button
                    onClick={() => toggleEffect(i)}
                    className="w-11 h-6 rounded-full relative transition-colors"
                    style={{ background: effect.enabled ? "#f97316" : "#334155" }}
                  >
                    <div className="absolute top-[2px] w-5 h-5 bg-white rounded-full transition-all shadow-sm"
                      style={{ left: effect.enabled ? "22px" : "2px" }} />
                  </button>
                </div>
                {effect.enabled && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Intensity</span>
                      <span className="text-xs font-bold text-[#f97316]">{effect.intensity}%</span>
                    </div>
                    <div className="relative w-full h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <div className="absolute top-0 left-0 h-full rounded-full bg-[#f97316]" style={{ width: `${effect.intensity}%` }} />
                      <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-[#f97316]"
                        style={{ left: `${effect.intensity}%`, transform: "translate(-50%, -50%)" }} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Before/After Toggle */}
        <div className="px-4 mb-6">
          <button className="w-full py-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-bold transition-all"
            style={{ borderColor: "rgba(249,115,22,0.3)", background: "rgba(249,115,22,0.05)", color: "#f97316" }}>
            <MaterialIcon name="compare" /> Toggle Before / After
          </button>
        </div>

        {/* Presets */}
        <section className="px-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Effect Presets</h3>
          <div className="flex gap-3">
            {PRESETS.map((p) => (
              <button key={p.name} className="flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                style={{
                  background: p.active ? "#f97316" : "rgba(255,255,255,0.03)",
                  color: p.active ? "white" : "#94a3b8",
                  border: p.active ? "none" : "1px solid rgba(255,255,255,0.05)",
                }}>
                {p.name}
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 border-t px-4 pb-6 pt-2 flex justify-around items-center"
        style={{ background: "rgba(26,16,8,0.95)", backdropFilter: "blur(16px)", borderColor: "rgba(249,115,22,0.1)" }}>
        <Link href="/inventory" className="flex flex-col items-center gap-1 text-slate-500">
          <MaterialIcon name="directions_car" /><span className="text-[10px] font-bold">Inventory</span>
        </Link>
        <Link href="/marketing" className="flex flex-col items-center gap-1 text-slate-500">
          <MaterialIcon name="campaign" /><span className="text-[10px] font-bold">Marketing</span>
        </Link>
        <Link href="/content-studio" className="flex flex-col items-center gap-1 text-[#f97316]">
          <MaterialIcon name="auto_fix_high" fill /><span className="text-[10px] font-bold">AI Tools</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center gap-1 text-slate-500">
          <MaterialIcon name="settings" /><span className="text-[10px] font-bold">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
