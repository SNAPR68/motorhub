"use client";

import Link from "next/link";
import Image from "next/image";
import { CRETA, BLUR_DATA_URL } from "@/lib/car-images";
import { MaterialIcon } from "@/components/MaterialIcon";

/* ── design tokens: ai_cinematic_reel_editor ── */
// primary: #1773cf, font: Manrope, bg: #0a0e12

const WAVEFORM_BARS = [2, 4, 6, 3, 8, 5, 7, 4, 2, 4, 6, 3, 8, 5, 7, 4, 2, 4, 6, 3, 8, 5, 7, 4];

const TOOL_BUTTONS = [
  { icon: "magic_button", label: "Enhance" },
  { icon: "music_note", label: "Audio" },
  { icon: "title", label: "Text" },
];

export default function ReelEditorPage() {
  return (
    <div
      className="relative flex min-h-screen max-w-md mx-auto flex-col overflow-hidden"
      style={{ fontFamily: "'Manrope', sans-serif", background: "#0a0e12", color: "#e2e8f0" }}
    >
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-6 pt-12 pb-4 z-50">
        <Link
          href="/content-studio"
          className="w-10 h-10 flex items-center justify-center rounded-full"
          style={{ background: "rgba(255,255,255,0.1)" }}
        >
          <MaterialIcon name="arrow_back_ios_new" className="text-[20px]" />
        </Link>
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase font-bold text-slate-400" style={{ letterSpacing: "0.2em" }}>
            Project
          </span>
          <h1 className="text-sm font-bold tracking-tight text-white">Creta Showcase.mp4</h1>
        </div>
        <button
          className="px-4 py-2 text-white text-xs font-bold rounded-full"
          style={{ background: "#1773cf", boxShadow: "0 4px 12px rgba(23,115,207,0.2)" }}
        >
          EXPORT
        </button>
      </header>

      {/* ── Main Workspace (9:16 Video Canvas) ── */}
      <main className="flex-1 relative px-4 pb-6 flex flex-col items-center justify-center">
        <div
          className="relative w-full rounded-xl overflow-hidden border"
          style={{
            aspectRatio: "9/16",
            borderColor: "rgba(255,255,255,0.1)",
            boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
          }}
        >
          {/* Background */}
          <Image src={CRETA} alt="" fill className="absolute inset-0 object-cover" placeholder="blur" blurDataURL={BLUR_DATA_URL} />

          {/* Video gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.6) 100%)",
            }}
          />

          {/* Text Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <h2 className="text-3xl font-extrabold text-white text-center px-8 opacity-90" style={{ letterSpacing: "-0.05em" }}>
              THE NEW<br />
              <span style={{ color: "#1773cf" }}>CRETA SX(O)</span>
            </h2>
          </div>

          {/* Template Sidebar */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
            {[
              { label: "Midnight", active: true },
              { label: "Golden", active: false },
              { label: "Pulse", active: false },
            ].map((preset) => (
              <div key={preset.label} className="flex flex-col items-center gap-1 cursor-pointer" style={{ opacity: preset.active ? 1 : 0.6 }}>
                <div
                  className="w-12 h-12 rounded-lg overflow-hidden border-2"
                  style={{
                    borderColor: preset.active ? "#1773cf" : "rgba(255,255,255,0.2)",
                    ...(preset.active ? { boxShadow: "0 4px 12px rgba(0,0,0,0.5), 0 0 0 2px rgba(23,115,207,0.2)" } : {}),
                  }}
                >
                  <Image src={CRETA} alt="" width={48} height={48} className="object-cover" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
                </div>
                <span className="text-[8px] font-bold text-white uppercase tracking-wider">
                  {preset.label}
                </span>
              </div>
            ))}
          </div>

          {/* AI Status Indicator */}
          <div
            className="absolute top-4 left-4 rounded-full px-3 py-1 flex items-center gap-2"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#1773cf" }} />
            <span className="text-[10px] font-bold text-white/80 tracking-widest uppercase">
              AI Tracking active
            </span>
          </div>
        </div>
      </main>

      {/* ── Timeline / Editor Area ── */}
      <div
        className="px-4 py-6 border-t flex flex-col gap-6"
        style={{
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(255,255,255,0.08)",
          borderTopLeftRadius: "1rem",
          borderTopRightRadius: "1rem",
        }}
      >
        {/* Timeline Scrub */}
        <div className="relative w-full flex flex-col gap-4">
          {/* AI Keyframes Label */}
          <div className="flex justify-between items-center px-1">
            <div className="flex items-center gap-2">
              <span style={{ color: "#1773cf" }}>
                <MaterialIcon name="auto_videocam" className="text-sm" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-tighter" style={{ color: "#1773cf" }}>
                AI Keyframes
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">00:02:14 / 00:15:00</span>
          </div>

          {/* Visual Scrubber */}
          <div className="relative w-full h-12 flex items-center overflow-hidden">
            {/* Audio Waveform */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 flex items-center justify-center gap-[2px] opacity-20 pointer-events-none">
              {WAVEFORM_BARS.map((h, i) => (
                <div
                  key={i}
                  className="w-0.5 bg-white rounded-full"
                  style={{ height: `${h * 4}px` }}
                />
              ))}
            </div>

            {/* AI Keyframe Markers */}
            {[
              { pos: "25%", icon: "colors_spark" },
              { pos: "50%", icon: "zoom_in" },
              { pos: "75%", icon: "pan_tool_alt" },
            ].map((kf) => (
              <div
                key={kf.icon}
                className="absolute top-0 h-full flex flex-col items-center justify-between py-1"
                style={{ left: kf.pos }}
              >
                <MaterialIcon name={kf.icon} fill className="text-[12px] text-[#1773cf]" />
                <div className="w-0.5 flex-1 rounded-full" style={{ background: "rgba(23,115,207,0.4)" }} />
              </div>
            ))}

            {/* Playhead */}
            <div
              className="absolute inset-y-0 w-[2px] z-10"
              style={{
                left: "35%",
                background: "white",
                boxShadow: "0 0 15px rgba(255,255,255,0.5)",
              }}
            >
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full" />
            </div>
          </div>
        </div>

        {/* Toolbar Actions */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2">
            {TOOL_BUTTONS.map((tool) => (
              <button
                key={tool.label}
                className="w-12 h-12 flex flex-col items-center justify-center rounded-xl border"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderColor: "rgba(255,255,255,0.05)",
                }}
              >
                <MaterialIcon name={tool.icon} className="text-[20px] text-slate-400" />
                <span className="text-[8px] font-bold mt-1 text-slate-500 uppercase">{tool.label}</span>
              </button>
            ))}
          </div>
          <button
            className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl font-bold text-sm text-white"
            style={{
              background: "#1773cf",
              boxShadow: "0 8px 20px rgba(23,115,207,0.1)",
            }}
          >
            <MaterialIcon name="auto_awesome" className="text-[18px]" />
            <span>AI AUTO-SYNC</span>
          </button>
        </div>
      </div>

      {/* ── Bottom Nav ── */}
      <nav
        className="flex justify-around items-center px-6 pt-2 pb-8 border-t"
        style={{ background: "#0a0e12", borderColor: "rgba(255,255,255,0.06)" }}
      >
        {[
          { icon: "movie_edit", label: "Editor", href: "/reel-editor", active: true },
          { icon: "auto_fix_high", label: "Assets", href: "/studio" },
          { icon: "history", label: "Recent", href: "/studio" },
          { icon: "settings", label: "Setup", href: "/settings" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center gap-1"
            style={{ color: item.active ? "#1773cf" : "#94a3b8" }}
          >
            <MaterialIcon name={item.icon} fill={item.active} className="text-[24px]" />
            <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Home Indicator */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full" />
    </div>
  );
}
