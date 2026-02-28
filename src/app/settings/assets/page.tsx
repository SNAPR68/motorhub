"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { fetchDealerPreferences, updateDealerPreferences } from "@/lib/api";

/* ── design tokens: ai_asset_&_media_settings ── */
// primary: #dab80b (gold), font: Newsreader (headings) + Inter (body), bg: #0a0a0a, surface: #161616, border: #2a2614

const STORAGE_KEY = "av_assets_prefs";

const SECTIONS = [
  {
    title: "Visual Assets",
    items: [
      { name: "360° Interior View", desc: "Interactive panoramic cabin showcase", icon: "visibility", enabled: true },
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

const DEFAULT_TOGGLES = SECTIONS.flatMap((s) => s.items.map((i) => i.enabled));

const ASSET_KEYS = SECTIONS.flatMap((s) =>
  s.items.map((i) => i.name.toLowerCase().replace(/[^a-z0-9]+/g, "_"))
);

function loadLocalPrefs(): boolean[] {
  if (typeof window === "undefined") return DEFAULT_TOGGLES;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as boolean[];
  } catch {}
  return DEFAULT_TOGGLES;
}

function togglesToMap(t: boolean[]): Record<string, boolean> {
  const map: Record<string, boolean> = {};
  ASSET_KEYS.forEach((k, i) => { map[k] = t[i] ?? DEFAULT_TOGGLES[i]; });
  return map;
}

function mapToToggles(m: Record<string, boolean>): boolean[] {
  return ASSET_KEYS.map((k, i) => m[k] ?? DEFAULT_TOGGLES[i]);
}

export default function AssetsPage() {
  const [toggles, setToggles] = useState<boolean[]>(DEFAULT_TOGGLES);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadPrefs = useCallback(async () => {
    try {
      const prefs = await fetchDealerPreferences();
      if (prefs?.assets && Object.keys(prefs.assets).length > 0) {
        setToggles(mapToToggles(prefs.assets));
        return;
      }
    } catch { /* fall through to localStorage */ }
    setToggles(loadLocalPrefs());
  }, []);

  useEffect(() => {
    loadPrefs();
  }, [loadPrefs]);

  const handleSave = async () => {
    setSaving(true);
    const assetsMap = togglesToMap(toggles);
    try {
      await updateDealerPreferences({ assets: assetsMap });
    } catch {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(toggles)); } catch {}
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

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
        <button onClick={handleSave} disabled={saving} className="font-medium text-sm transition-colors" style={{ color: saved ? "#22c55e" : "#dab80b" }}>
          {saving ? "Saving..." : saved ? "Saved" : "Save"}
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
          onClick={handleSave}
          disabled={saving}
          className="relative flex w-full max-w-sm items-center justify-center gap-2 overflow-hidden rounded-xl py-4 text-sm font-bold tracking-wider active:scale-95 transition-all disabled:opacity-60"
          style={{
            background: saved ? "#22c55e" : "#dab80b",
            color: "#0a0a0a",
            boxShadow: saved ? "0 10px 40px -10px rgba(34,197,94,0.5)" : "0 10px 40px -10px rgba(218,184,11,0.5)",
          }}
        >
          <MaterialIcon name={saving ? "sync" : saved ? "check_circle" : "auto_awesome"} />
          {saving ? "SAVING..." : saved ? "SAVED AS GLOBAL TEMPLATE" : "SAVE AS GLOBAL TEMPLATE"}
        </button>
      </div>

      {/* ── Bottom Nav (behind save button) ── */}
      <nav
        className="fixed bottom-0 inset-x-0 z-10 flex w-full border-t px-6 pb-8 pt-3 backdrop-blur-xl max-w-md mx-auto md:hidden"
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
