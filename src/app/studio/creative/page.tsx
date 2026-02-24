"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";

/* Stitch: ai_creative_director_suite — #f97316, Manrope, #1a1008 */

const MOODS = [
  { name: "Golden Hour", desc: "Warm amber tones, long shadows", gradient: "from-amber-500 via-orange-400 to-yellow-300", icon: "wb_twilight" },
  { name: "Midnight", desc: "Deep blue, city reflections", gradient: "from-blue-900 via-indigo-800 to-slate-900", icon: "dark_mode" },
  { name: "Bloom", desc: "Soft pink, ethereal whites", gradient: "from-pink-300 via-rose-200 to-white", icon: "local_florist" },
];

const OVERLAYS = [
  { name: "Particles", icon: "blur_on", enabled: true },
  { name: "Lens Flare", icon: "flare", enabled: false },
  { name: "Rain", icon: "water_drop", enabled: false },
  { name: "Dust", icon: "grain", enabled: false },
];

const SUGGESTIONS = [
  { title: "Heritage Story", desc: "Highlight the vehicle's lineage and evolution through generations", icon: "auto_stories" },
  { title: "Performance Focus", desc: "Emphasize power, speed, and driving dynamics with action shots", icon: "speed" },
  { title: "Lifestyle Integration", desc: "Show the vehicle in aspirational lifestyle contexts — weekend getaways, city drives", icon: "landscape" },
];

export default function StudioCreativePage() {
  const [selectedMood, setSelectedMood] = useState("Golden Hour");
  const [overlays, setOverlays] = useState(OVERLAYS);

  const toggleOverlay = (i: number) => {
    setOverlays((prev) => prev.map((o, idx) => idx === i ? { ...o, enabled: !o.enabled } : o));
  };

  return (
    <div
      className="min-h-dvh w-full flex flex-col max-w-md mx-auto text-slate-100 pb-24"
      style={{ fontFamily: "'Manrope', sans-serif", background: "#1a1008" }}
    >
      {/* Header */}
      <header className="sticky top-0 z-30 px-4 py-4 flex items-center justify-between border-b"
        style={{ background: "rgba(26,16,8,0.8)", backdropFilter: "blur(12px)", borderColor: "rgba(249,115,22,0.1)" }}>
        <Link href="/studio" className="p-2 rounded-full hover:bg-white/5">
          <MaterialIcon name="arrow_back" className="text-slate-400" />
        </Link>
        <h1 className="text-sm font-bold uppercase tracking-[0.15em] text-[#f97316]">Creative Director</h1>
        <button className="p-2 text-slate-400"><MaterialIcon name="more_vert" /></button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-8">
        {/* Mood Boards */}
        <section className="py-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
            <MaterialIcon name="palette" className="text-sm text-[#f97316]" /> Mood Board
          </h3>
          <div className="space-y-3">
            {MOODS.map((mood) => (
              <button
                key={mood.name}
                onClick={() => setSelectedMood(mood.name)}
                className="w-full rounded-xl overflow-hidden transition-all"
                style={{
                  border: selectedMood === mood.name ? "2px solid #f97316" : "2px solid rgba(255,255,255,0.05)",
                }}
              >
                <div className={`h-24 bg-gradient-to-r ${mood.gradient} relative`}>
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-between px-5">
                    <div className="text-left">
                      <h4 className="text-base font-bold text-white">{mood.name}</h4>
                      <p className="text-xs text-white/70 mt-0.5">{mood.desc}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <MaterialIcon name={mood.icon} className="text-white text-2xl" />
                      {selectedMood === mood.name && (
                        <div className="size-6 rounded-full bg-[#f97316] flex items-center justify-center">
                          <MaterialIcon name="check" className="text-white text-sm" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Motion Overlays */}
        <section className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
            <MaterialIcon name="animation" className="text-sm text-[#f97316]" /> Motion Overlays
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {overlays.map((o, i) => (
              <button
                key={o.name}
                onClick={() => toggleOverlay(i)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all"
                style={{
                  background: o.enabled ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.03)",
                  border: o.enabled ? "1px solid rgba(249,115,22,0.3)" : "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <MaterialIcon name={o.icon} className={`text-2xl ${o.enabled ? "text-[#f97316]" : "text-slate-500"}`} />
                <span className={`text-[10px] font-bold ${o.enabled ? "text-[#f97316]" : "text-slate-500"}`}>{o.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Content Suggestions */}
        <section className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
            <MaterialIcon name="auto_awesome" className="text-sm text-[#f97316]" /> AI Content Suggestions
          </h3>
          <div className="space-y-3">
            {SUGGESTIONS.map((s) => (
              <div key={s.title} className="rounded-xl p-4 flex items-start gap-3"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(249,115,22,0.1)" }}>
                <div className="size-10 rounded-lg bg-[#f97316]/10 flex items-center justify-center shrink-0">
                  <MaterialIcon name={s.icon} className="text-[#f97316]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{s.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{s.desc}</p>
                </div>
                <MaterialIcon name="chevron_right" className="text-slate-600 mt-1 shrink-0" />
              </div>
            ))}
          </div>
        </section>

        {/* Campaign Planner Link */}
        <Link href="/marketing" className="block w-full py-3 rounded-xl border text-center text-sm font-bold"
          style={{ borderColor: "rgba(249,115,22,0.3)", background: "rgba(249,115,22,0.05)", color: "#f97316" }}>
          <MaterialIcon name="calendar_month" className="text-sm mr-1" /> Open Campaign Planner
        </Link>
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
        <Link href="/studio" className="flex flex-col items-center gap-1 text-[#f97316]">
          <MaterialIcon name="auto_fix_high" fill /><span className="text-[10px] font-bold">AI Tools</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center gap-1 text-slate-500">
          <MaterialIcon name="settings" /><span className="text-[10px] font-bold">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
