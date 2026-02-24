"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";

/* ── design tokens: ai_asset_&_media_settings ── */
// primary: #dab80b (gold), font: Newsreader (headings) + Inter (body), bg: #0a0a0a, surface: #161616, border: #2a2614

const SECTIONS = [
  {
    title: "Visual Assets",
    items: [
      { name: "360\u00b0 Interior View", desc: "Interactive panoramic cabin showcase", icon: "visibility", enabled: true },
      { name: "Cinematic Reel", desc: "AI-edited 15s highlight for social", icon: "play_circle", enabled: true },
      { name: "Background Studio", desc: "Replace inventory lot with studio bokeh", icon: "auto_fix_high", enabled: false },
    ],
  },
  {
    title: "Data Insights",
    items: [
      { name: "Market Trend Chart", desc: "Real-time appreciation/depreciation graph", icon: "show_chart", enabled: true },
      { name: "Scarcity Index Comparison", desc: "Relative scarcity index for local market", icon: "bar_chart", enabled: false },
    ],
  },
  {
    title: "Communication",
    items: [
      { name: "Personalized Greeting", desc: "AI voice-cloned custom intro", icon: "record_voice_over", enabled: true },
    ],
  },
];

export default function AssetsPage() {
  const [toggles, setToggles] = useState<boolean[]>(
    SECTIONS.flatMap((s) => s.items.map((i) => i.enabled))
  );

  let globalIdx = 0;

  return (
    <div
      className="relative min-h-screen max-w-md mx-auto flex flex-col pb-32"
      style={{ fontFamily: "'Inter', sans-serif", background: "#0a0a0a", color: "#f1f5f9" }}
    >
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-20 flex items-center justify-between px-4 py-4 border-b"
        style={{
          background: "rgba(10,10,10,0.8)",
          backdropFilter: "blur(12px)",
          borderColor: "#2a2614",
        }}
      >
        <div className="flex items-center gap-2">
          <Link href="/settings">
            <MaterialIcon name="arrow_back_ios_new" className="text-[#dab80b]" />
          </Link>
          <h1
            className="text-xl font-semibold tracking-tight"
            style={{ fontFamily: "'Newsreader', serif" }}
          >
            Dynamic Assets
          </h1>
        </div>
        <button className="flex w-10 h-10 items-center justify-center rounded-full">
          <MaterialIcon name="more_horiz" className="text-slate-400" />
        </button>
      </header>

      <main className="flex flex-col">
        {SECTIONS.map((section) => (
          <section key={section.title} className="mt-6">
            <div className="px-6 py-2">
              <h3
                className="text-[10px] font-bold uppercase"
                style={{ letterSpacing: "0.2em", color: "rgba(218,184,11,0.6)" }}
              >
                {section.title}
              </h3>
            </div>
            {section.items.map((item) => {
              const idx = globalIdx++;
              return (
                <div
                  key={item.name}
                  className="flex flex-col gap-3 px-6 py-5"
                  style={{ borderBottom: "0.5px solid rgba(218,184,11,0.15)" }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <h4
                        className="text-lg font-medium leading-tight"
                        style={{ fontFamily: "'Newsreader', serif" }}
                      >
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-normal">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => {
                        const next = [...toggles];
                        next[idx] = !next[idx];
                        setToggles(next);
                      }}
                      className="w-11 h-6 rounded-full relative transition-colors"
                      style={{ background: toggles[idx] ? "#dab80b" : "#334155" }}
                    >
                      <div
                        className="absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all shadow-sm"
                        style={{ left: toggles[idx] ? "22px" : "2px" }}
                      />
                    </button>
                  </div>
                  <div className="flex">
                    <button
                      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium"
                      style={{
                        border: "1px solid #2a2614",
                        color: "#dab80b",
                      }}
                    >
                      <MaterialIcon name={item.icon} className="text-sm" />
                      Sample View
                    </button>
                  </div>
                </div>
              );
            })}
          </section>
        ))}
      </main>

      {/* ── Save Button ── */}
      <div className="fixed bottom-0 left-0 right-0 z-30 flex justify-center p-6 max-w-md mx-auto">
        <button
          className="relative flex w-full max-w-sm items-center justify-center gap-2 overflow-hidden rounded-xl py-4 text-sm font-bold tracking-wider active:scale-95 transition-transform"
          style={{
            background: "#dab80b",
            color: "#0a0a0a",
            boxShadow: "0 10px 40px -10px rgba(218,184,11,0.5)",
          }}
        >
          <MaterialIcon name="auto_awesome" />
          SAVE AS GLOBAL TEMPLATE
        </button>
      </div>

      {/* ── Bottom Nav (behind save button) ── */}
      <nav
        className="fixed bottom-0 inset-x-0 z-10 flex w-full border-t px-6 pb-8 pt-3 backdrop-blur-xl max-w-md mx-auto"
        style={{
          background: "rgba(10,10,10,0.95)",
          borderColor: "#2a2614",
        }}
      >
        {[
          { icon: "inventory_2", label: "Inventory", href: "/inventory", active: true },
          { icon: "campaign", label: "Marketing", href: "/marketing" },
          { icon: "auto_videocam", label: "AI Tools", href: "/settings/assets" },
          { icon: "settings", label: "Settings", href: "/settings" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-1 flex-col items-center gap-1"
            style={{ color: item.active ? "#dab80b" : "#64748b" }}
          >
            <MaterialIcon name={item.icon} className="text-2xl" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
