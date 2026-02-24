"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";

/* Stitch: ai_studio_content_editor — #f97316, Manrope, #1a1008 */

const TOOLS = [
  { name: "ColorGrade", icon: "palette", active: true },
  { name: "MotionBlur", icon: "blur_on", active: false },
  { name: "PrecisionBG", icon: "background_replace", active: false },
];

const TIMELINE_CLIPS = [
  { color: "#f97316", width: "30%", label: "Exterior" },
  { color: "#3b82f6", width: "25%", label: "Interior" },
  { color: "#10b981", width: "20%", label: "Details" },
  { color: "#8b5cf6", width: "25%", label: "Drive" },
];

export default function StudioEditorPage() {
  const [activeTool, setActiveTool] = useState("ColorGrade");
  const [voice, setVoice] = useState<"Male" | "Female">("Male");

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
        <h1 className="text-sm font-bold uppercase tracking-[0.15em] text-[#f97316]">Video Editor</h1>
        <button className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#f97316] text-white">Export</button>
      </header>

      <main className="flex-1 overflow-y-auto pb-8">
        {/* Video Preview */}
        <div className="relative w-full aspect-video mx-auto my-4 px-4">
          <div className="w-full h-full rounded-2xl overflow-hidden relative"
            style={{ background: "linear-gradient(145deg, #2a1a0a, #1a1008)", border: "1px solid rgba(249,115,22,0.15)" }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="size-14 rounded-full bg-[#f97316] flex items-center justify-center shadow-lg shadow-[#f97316]/30">
                <MaterialIcon name="play_arrow" className="text-white text-3xl" />
              </button>
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400">00:12 / 00:30</span>
              <div className="w-1/2 h-1 rounded-full bg-white/10">
                <div className="w-[40%] h-full rounded-full bg-[#f97316]" />
              </div>
            </div>
          </div>
        </div>

        {/* Script Generation */}
        <section className="px-4 py-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">AI Script Generator</h3>
          <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(249,115,22,0.1)" }}>
            <p className="text-xs text-slate-400 leading-relaxed italic mb-3">
              &ldquo;Introducing the 2023 Hyundai Creta SX(O) — where power meets elegance. With a 1.5L turbocharged engine delivering 138 BHP, this SUV redefines city driving...&rdquo;
            </p>
            <button className="w-full py-2.5 rounded-lg border flex items-center justify-center gap-2 text-xs font-bold text-[#f97316]"
              style={{ borderColor: "rgba(249,115,22,0.3)", background: "rgba(249,115,22,0.05)" }}>
              <MaterialIcon name="auto_awesome" className="text-sm" /> Regenerate Script
            </button>
          </div>
        </section>

        {/* Tool Tabs */}
        <section className="px-4 py-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Editing Tools</h3>
          <div className="flex gap-2 mb-4">
            {TOOLS.map((t) => (
              <button
                key={t.name}
                onClick={() => setActiveTool(t.name)}
                className="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all"
                style={{
                  background: activeTool === t.name ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.03)",
                  border: activeTool === t.name ? "1px solid rgba(249,115,22,0.3)" : "1px solid rgba(255,255,255,0.05)",
                  color: activeTool === t.name ? "#f97316" : "#94a3b8",
                }}
              >
                <MaterialIcon name={t.icon} className="text-lg" /> {t.name}
              </button>
            ))}
          </div>
        </section>

        {/* Audio Narrator */}
        <section className="px-4 py-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">AI Narrator</h3>
          <div className="flex gap-3 mb-3">
            {(["Male", "Female"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setVoice(v)}
                className="flex-1 py-3 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: voice === v ? "#f97316" : "rgba(255,255,255,0.03)",
                  color: voice === v ? "white" : "#94a3b8",
                  border: voice === v ? "none" : "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {v} Voice
              </button>
            ))}
          </div>
          <button className="w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-bold"
            style={{ background: "rgba(249,115,22,0.05)", border: "1px solid rgba(249,115,22,0.2)", color: "#f97316" }}>
            <MaterialIcon name="play_circle" className="text-sm" /> Preview Narration
          </button>
        </section>

        {/* Timeline */}
        <section className="px-4 py-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Timeline</h3>
          <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(249,115,22,0.1)" }}>
            {/* Video Track */}
            <p className="text-[10px] text-slate-500 uppercase mb-2">Video</p>
            <div className="flex gap-1 h-8 mb-4">
              {TIMELINE_CLIPS.map((clip) => (
                <div key={clip.label} className="rounded h-full flex items-center justify-center text-[9px] font-bold text-white/80"
                  style={{ width: clip.width, background: clip.color + "40", borderLeft: `2px solid ${clip.color}` }}>
                  {clip.label}
                </div>
              ))}
            </div>
            {/* Audio Waveform */}
            <p className="text-[10px] text-slate-500 uppercase mb-2">Audio</p>
            <div className="flex items-center h-6 gap-px">
              {Array.from({ length: 60 }, (_, i) => (
                <div key={i} className="flex-1 rounded-full" style={{
                  height: `${20 + Math.random() * 80}%`,
                  background: `rgba(249,115,22,${0.2 + Math.random() * 0.4})`,
                }} />
              ))}
            </div>
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
