"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CRETA, BLUR_DATA_URL } from "@/lib/car-images";
import { MaterialIcon } from "@/components/MaterialIcon";

/* ── design tokens: ai_content_studio_editor_1 ── */
// primary: #2b6cee, font: Inter, bg: #101622, glass-panel: rgba(16,22,34,0.8)+blur(12px)

const TOOLS = [
  { icon: "wb_iridescent", label: "Lighting", active: true },
  { icon: "background_replace", label: "Studio BG", active: false },
  { icon: "palette", label: "Color Grade", active: false },
];

export default function ContentStudioPage() {
  const [sliderPos] = useState(60);

  return (
    <div
      className="relative flex min-h-screen max-w-md mx-auto flex-col overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif", background: "#101622", color: "#e2e8f0" }}
    >
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-5 pt-12 pb-4 z-20">
        <Link
          href="/marketing"
          className="flex items-center justify-center w-10 h-10 rounded-full"
          style={{ background: "rgba(30,41,59,0.5)" }}
        >
          <MaterialIcon name="arrow_back_ios_new" />
        </Link>
        <div className="text-center">
          <h1
            className="text-sm font-bold uppercase text-white"
            style={{ letterSpacing: "0.2em" }}
          >
            AI Studio
          </h1>
          <p className="text-[10px] font-medium text-slate-400 tracking-wider">
            2023 HYUNDAI CRETA
          </p>
        </div>
        <button
          className="px-5 py-2 text-white rounded-full text-xs font-bold uppercase tracking-wider"
          style={{ background: "#2b6cee", boxShadow: "0 4px 12px rgba(43,108,238,0.2)" }}
        >
          Export
        </button>
      </header>

      {/* ── Main Editor Stage ── */}
      <main className="relative flex-1 w-full px-4 py-2 flex flex-col items-center justify-center">
        {/* Comparison Slider Container */}
        <div
          className="relative w-full rounded-xl overflow-hidden"
          style={{
            aspectRatio: "3/4",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.03)",
          }}
        >
          {/* After Image (Enhanced — full background) */}
          <div className="absolute inset-0">
            <Image src={CRETA} alt="" fill className="object-cover brightness-110 contrast-110 saturate-110" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
          </div>
          {/* Before Image (Original — clipped left portion) */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
          >
            <Image src={CRETA} alt="" fill className="object-cover brightness-75 contrast-90 saturate-75" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
          </div>

          {/* Labels */}
          <div
            className="absolute top-4 left-4 px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-widest"
            style={{
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            Original
          </div>
          <div
            className="absolute top-4 right-4 px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-widest"
            style={{
              background: "rgba(43,108,238,0.8)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            Enhanced
          </div>

          {/* Slider Handle */}
          <div
            className="absolute inset-y-0 w-0.5 z-10"
            style={{
              left: `${sliderPos}%`,
              background: "rgba(43,108,238,0.6)",
              boxShadow: "0 0 15px rgba(43,108,238,0.5)",
            }}
          >
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center"
              style={{
                boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                border: "4px solid #2b6cee",
              }}
            >
              <MaterialIcon name="unfold_more" className="text-lg font-bold text-[#2b6cee]" />
            </div>
          </div>

          {/* AI Processing Line */}
          <div
            className="absolute top-0 left-0 w-full h-0.5 opacity-40"
            style={{ background: "linear-gradient(to right, transparent, #2b6cee, transparent)" }}
          />
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-4 mt-6">
          <button className="flex items-center gap-2 text-slate-400">
            <MaterialIcon name="undo" className="text-xl" />
          </button>
          <div className="w-px h-4" style={{ background: "rgba(255,255,255,0.1)" }} />
          <button className="flex items-center gap-2 text-slate-400">
            <MaterialIcon name="redo" className="text-xl" />
          </button>
        </div>
      </main>

      {/* ── Tools Bottom Section ── */}
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
        {/* Active Tool Slider */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Studio Lighting
            </span>
            <span className="text-xs font-bold" style={{ color: "#2b6cee" }}>
              85%
            </span>
          </div>
          <div
            className="relative w-full h-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <div
              className="absolute top-0 left-0 h-full w-[85%] rounded-full"
              style={{ background: "#2b6cee" }}
            />
            <div
              className="absolute top-1/2 left-[85%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full"
              style={{ border: "2px solid #2b6cee", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
            />
          </div>
        </div>

        {/* Tool Selection Grid */}
        <div className="grid grid-cols-3 gap-4">
          {TOOLS.map((tool) => (
            <button
              key={tool.label}
              className="flex flex-col items-center gap-3 p-4 rounded-xl border"
              style={
                tool.active
                  ? {
                      background: "rgba(43,108,238,0.1)",
                      borderColor: "rgba(43,108,238,0.3)",
                      color: "#2b6cee",
                    }
                  : {
                      background: "rgba(30,41,59,0.5)",
                      borderColor: "transparent",
                      color: "#94a3b8",
                    }
              }
            >
              <MaterialIcon name={tool.icon} fill={tool.active} className="text-2xl" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{tool.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Bottom Nav ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex gap-2 border-t px-4 pb-6 pt-2 max-w-md mx-auto"
        style={{
          background: "rgba(15,23,42,0.95)",
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        {[
          { icon: "auto_fix_high", label: "Editor", href: "/content-studio", active: true },
          { icon: "folder_open", label: "Assets", href: "/studio" },
          { icon: "filter_list", label: "Presets", href: "/studio" },
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
