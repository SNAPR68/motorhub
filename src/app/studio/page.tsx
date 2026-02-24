"use client";

import Link from "next/link";
import Image from "next/image";
import { CRETA, BLUR_DATA_URL } from "@/lib/car-images";
import { MaterialIcon } from "@/components/MaterialIcon";

/* ── design tokens: premium_ai_studio_&_marketing ── */
// primary: #137fec, font: Inter, bg: #0a0a0a, card: #161616, border: #262626

export default function StudioPage() {
  return (
    <div
      className="min-h-screen max-w-md mx-auto flex flex-col pb-24"
      style={{ fontFamily: "'Inter', sans-serif", background: "#0a0a0a", color: "#e2e8f0" }}
    >
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between border-b"
        style={{
          background: "rgba(26,26,26,0.7)",
          backdropFilter: "blur(12px)",
          borderColor: "#262626",
        }}
      >
        <Link href="/marketing" className="flex items-center justify-center p-2 rounded-full">
          <MaterialIcon name="arrow_back_ios_new" />
        </Link>
        <h1 className="text-sm font-semibold tracking-wide uppercase text-white">
          AI Studio Enhancer
        </h1>
        <button className="flex items-center justify-center p-2 rounded-full">
          <MaterialIcon name="more_horiz" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        {/* ── Immersive Media Canvas ── */}
        <section className="relative w-full" style={{ aspectRatio: "4/5" }}>
          <div className="absolute inset-0">
            <Image src={CRETA} alt="" fill className="object-cover" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
          </div>

          {/* AI Control Overlay */}
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] p-1 flex rounded-2xl border"
            style={{
              background: "rgba(26,26,26,0.7)",
              backdropFilter: "blur(12px)",
              borderColor: "rgba(255,255,255,0.1)",
              boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
            }}
          >
            <button
              className="flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-white"
              style={{ background: "#137fec", boxShadow: "0 4px 12px rgba(19,127,236,0.4)" }}
            >
              <MaterialIcon name="auto_videocam" className="text-sm" />
              <span className="text-xs font-semibold whitespace-nowrap">Background Remov.</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-slate-300">
              <MaterialIcon name="light_mode" className="text-sm" />
              <span className="text-xs font-semibold whitespace-nowrap">Studio Lighting</span>
            </button>
          </div>

          {/* Status Indicator */}
          <div
            className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full border"
            style={{
              background: "rgba(26,26,26,0.7)",
              backdropFilter: "blur(12px)",
              borderColor: "rgba(255,255,255,0.2)",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: "#137fec" }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ background: "#137fec" }}
              />
            </span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-white">
              Live AI Preview
            </span>
          </div>
        </section>

        {/* ── Vehicle Details ── */}
        <section className="px-6 py-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white mb-1">
                Hyundai Creta SX(O)
              </h2>
              <p className="text-slate-400 font-medium">2023 • Polar White • 18,300 km</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold" style={{ color: "#137fec" }}>
                ₹14.5L
              </p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                AI Estimated
              </p>
            </div>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { icon: "speed", label: "Top Speed", value: "188 km/h" },
              { icon: "bolt", label: "0-100 km/h", value: "11.5 s" },
              { icon: "settings_input_component", label: "Engine", value: "1.5L Turbo" },
            ].map((spec) => (
              <div
                key={spec.label}
                className="rounded-xl p-4 flex flex-col items-center text-center border"
                style={{ background: "#161616", borderColor: "#262626" }}
              >
                <span style={{ color: "#137fec" }}>
                  <MaterialIcon name={spec.icon} className="mb-2" />
                </span>
                <span className="text-xs text-slate-400 mb-0.5">{spec.label}</span>
                <span className="text-sm font-bold text-white">{spec.value}</span>
              </div>
            ))}
          </div>

          {/* Social Sync Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
                <span style={{ color: "#137fec" }}>
                  <MaterialIcon name="auto_awesome" />
                </span>
                Social Sync Preview
              </h3>
              <span className="text-xs font-medium" style={{ color: "#137fec" }}>
                Edit Template
              </span>
            </div>

            <div
              className="relative w-full rounded-2xl overflow-hidden border"
              style={{ aspectRatio: "9/16", background: "#161616", borderColor: "#262626" }}
            >
              <Image src={CRETA} alt="" fill className="absolute inset-0 object-cover" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
              <div className="absolute inset-0 bg-black/20" />

              {/* Text Overlay */}
              <div className="absolute top-6 left-6 right-6">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(19,127,236,0.2)", backdropFilter: "blur(12px)" }}
                  >
                    <MaterialIcon name="stars" className="text-white text-sm" />
                  </div>
                  <span className="text-xs font-bold text-white drop-shadow-md">AUTOVINCI AI</span>
                </div>
                <h4 className="text-2xl font-black italic text-white leading-tight drop-shadow-lg">
                  DRIVE THE<br />FUTURE.
                </h4>
              </div>

              {/* Bottom */}
              <div className="absolute bottom-6 left-6 flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-full border-2 overflow-hidden flex items-center justify-center"
                  style={{ borderColor: "rgba(255,255,255,0.3)", background: "#334155" }}
                >
                  <MaterialIcon name="play_circle" className="text-white text-xl" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">
                    Reel Transition
                  </span>
                  <span className="text-xs font-bold text-white">Cinematic Reveal</span>
                </div>
              </div>

              {/* Center Play */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center border"
                  style={{
                    background: "rgba(26,26,26,0.7)",
                    backdropFilter: "blur(12px)",
                    borderColor: "rgba(255,255,255,0.2)",
                  }}
                >
                  <MaterialIcon name="play_arrow" className="text-white text-4xl ml-1" />
                </div>
              </div>
            </div>
            <p className="text-xs text-center text-slate-500 mt-4 italic">
              AI-generated reels sync automatically with your inventory music preferences.
            </p>
          </div>
        </section>
      </main>

      {/* ── Bottom Action Bar ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-8 flex items-center gap-4 border-t max-w-md mx-auto"
        style={{
          background: "rgba(26,26,26,0.7)",
          backdropFilter: "blur(12px)",
          borderColor: "#262626",
        }}
      >
        <div className="max-w-md mx-auto flex items-center gap-4 w-full">
          <button
            className="w-14 h-14 rounded-2xl border flex items-center justify-center text-slate-300"
            style={{ background: "#161616", borderColor: "#262626" }}
          >
            <MaterialIcon name="save" />
          </button>
          <button
            className="flex-1 h-14 rounded-2xl text-white font-bold flex items-center justify-center gap-2"
            style={{
              background: "#137fec",
              boxShadow: "0 8px 20px -4px rgba(19,127,236,0.4)",
            }}
          >
            <MaterialIcon name="share_windows" />
            Export to Socials
          </button>
        </div>
      </nav>
    </div>
  );
}
