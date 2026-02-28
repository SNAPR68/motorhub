"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { fetchDealerPreferences, updateDealerPreferences } from "@/lib/api";

/* Stitch: elite_marketing_studio_2 — #3366FF, Space Grotesk, #0B1426 */

const MOODS = [
  { name: "Neon", desc: "Electric blue glow", gradient: "from-blue-600 to-cyan-400", icon: "electric_bolt" },
  { name: "Drift", desc: "Motion blur cinematic", gradient: "from-purple-600 to-pink-400", icon: "speed" },
  { name: "Luxe", desc: "Gold tones premium", gradient: "from-amber-500 to-yellow-300", icon: "diamond" },
];

const PLATFORMS = [
  { label: "Instagram Reel", icon: "photo_camera", ratio: "9:16" },
  { label: "YouTube Shorts", icon: "play_circle", ratio: "9:16" },
  { label: "Facebook", icon: "thumb_up", ratio: "16:9" },
];

export default function MarketingCinemaPage() {
  const [quality, setQuality] = useState("4K");
  const [selectedMood, setSelectedMood] = useState("Neon");
  const [selectedPlatform, setSelectedPlatform] = useState("Instagram Reel");
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  // Load saved cinema prefs from DB
  const loadPrefs = useCallback(async () => {
    try {
      const prefs = await fetchDealerPreferences();
      const cinema = prefs?.assets as unknown as Record<string, string> | undefined;
      if (cinema?.cinemaQuality) setQuality(cinema.cinemaQuality);
      if (cinema?.cinemaMood) setSelectedMood(cinema.cinemaMood);
      if (cinema?.cinemaPlatform) setSelectedPlatform(cinema.cinemaPlatform);
    } catch { /* use defaults */ }
  }, []);

  useEffect(() => { loadPrefs(); }, [loadPrefs]);

  const handleExport = async () => {
    setExporting(true);
    try {
      // Save cinema prefs to DB
      await updateDealerPreferences({
        assets: {
          cinemaQuality: quality,
          cinemaMood: selectedMood,
          cinemaPlatform: selectedPlatform,
        } as unknown as Record<string, boolean>,
      });
      setExported(true);
      setTimeout(() => setExported(false), 3000);
    } catch { /* ignore */ }
    setExporting(false);
  };

  return (
    <div
      className="min-h-dvh w-full flex flex-col max-w-md mx-auto text-slate-100 pb-24"
      style={{ fontFamily: "'Space Grotesk', sans-serif", background: "#0B1426" }}
    >
      {/* Header */}
      <header className="sticky top-0 z-30 px-4 py-4 flex items-center justify-between border-b"
        style={{ background: "rgba(11,20,38,0.8)", backdropFilter: "blur(12px)", borderColor: "rgba(255,255,255,0.05)" }}>
        <Link href="/marketing" className="p-2 rounded-full hover:bg-white/5">
          <MaterialIcon name="arrow_back" className="text-slate-400" />
        </Link>
        <h1 className="text-sm font-bold uppercase tracking-[0.2em] text-[#3366FF]">Cinema Studio</h1>
        <button className="text-slate-400 p-2"><MaterialIcon name="more_vert" /></button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-8">
        {/* Video Preview */}
        <section className="py-6">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden"
            style={{ background: "linear-gradient(145deg, #0f1d36, #0a1222)", border: "1px solid rgba(51,102,255,0.15)" }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="size-16 rounded-full bg-[#3366FF] flex items-center justify-center shadow-lg shadow-[#3366FF]/30">
                <MaterialIcon name="play_arrow" className="text-white text-4xl" />
              </button>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">00:00 / 00:30</span>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 rounded bg-[#3366FF]/20 text-[#3366FF] text-[10px] font-bold">{quality}</span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-white text-[10px] font-bold">{selectedMood}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Export Quality */}
        <section className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Export Quality</h3>
          <div className="flex gap-3">
            {["1080p", "4K", "8K"].map((q) => (
              <button
                key={q}
                onClick={() => setQuality(q)}
                className="flex-1 py-3 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: quality === q ? "#3366FF" : "rgba(255,255,255,0.03)",
                  color: quality === q ? "white" : "#94a3b8",
                  border: quality === q ? "none" : "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </section>

        {/* Mood Presets */}
        <section className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Mood Presets</h3>
          <div className="grid grid-cols-3 gap-3">
            {MOODS.map((mood) => (
              <button
                key={mood.name}
                onClick={() => setSelectedMood(mood.name)}
                className="rounded-xl p-4 text-center transition-all"
                style={{
                  background: selectedMood === mood.name ? "rgba(51,102,255,0.1)" : "rgba(255,255,255,0.03)",
                  border: selectedMood === mood.name ? "1px solid rgba(51,102,255,0.3)" : "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div className={`w-10 h-10 rounded-lg mx-auto mb-2 bg-gradient-to-br ${mood.gradient} flex items-center justify-center`}>
                  <MaterialIcon name={mood.icon} className="text-white text-lg" />
                </div>
                <p className={`text-xs font-bold ${selectedMood === mood.name ? "text-[#3366FF]" : "text-slate-400"}`}>{mood.name}</p>
                <p className="text-[10px] text-slate-600 mt-0.5">{mood.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Platform Format */}
        <section className="mb-8">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Platform Format</h3>
          <div className="flex gap-3">
            {PLATFORMS.map((p) => (
              <button
                key={p.label}
                onClick={() => setSelectedPlatform(p.label)}
                className="flex-1 rounded-xl p-3 text-center transition-all"
                style={{
                  background: selectedPlatform === p.label ? "rgba(51,102,255,0.1)" : "rgba(255,255,255,0.03)",
                  border: selectedPlatform === p.label ? "1px solid rgba(51,102,255,0.3)" : "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <MaterialIcon name={p.icon} className={`text-2xl mb-1 ${selectedPlatform === p.label ? "text-[#3366FF]" : "text-slate-500"}`} />
                <p className={`text-[10px] font-bold ${selectedPlatform === p.label ? "text-[#3366FF]" : "text-slate-500"}`}>{p.label}</p>
                <p className="text-[9px] text-slate-600">{p.ratio}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Export CTA */}
        {exported ? (
          <div className="w-full bg-emerald-500/10 border border-emerald-500/20 text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
            <MaterialIcon name="check_circle" className="text-emerald-400" />
            <span className="text-emerald-400">Reel Settings Saved</span>
          </div>
        ) : (
          <button
            onClick={handleExport}
            disabled={exporting}
            className="w-full bg-[#3366FF] text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#3366FF]/30 active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            {exporting ? (
              <div className="h-5 w-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <MaterialIcon name="movie" />
            )}
            {exporting ? "Exporting..." : "Export Cinema Reel"}
          </button>
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 border-t px-6 pb-6 pt-3 flex justify-between items-center md:hidden"
        style={{ background: "rgba(11,20,38,0.95)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.05)" }}>
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-slate-500">
          <MaterialIcon name="dashboard" />
          <span className="text-[10px] font-bold uppercase">Dashboard</span>
        </Link>
        <Link href="/inventory" className="flex flex-col items-center gap-1 text-slate-500">
          <MaterialIcon name="directions_car" />
          <span className="text-[10px] font-bold uppercase">Inventory</span>
        </Link>
        <Link href="/studio" className="relative -top-4">
          <div className="size-14 rounded-full bg-[#3366FF] flex items-center justify-center shadow-lg shadow-[#3366FF]/30 border-4 border-[#0B1426]">
            <MaterialIcon name="auto_awesome" className="text-white text-2xl" />
          </div>
        </Link>
        <Link href="/leads" className="flex flex-col items-center gap-1 text-slate-500">
          <MaterialIcon name="group" />
          <span className="text-[10px] font-bold uppercase">Leads</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center gap-1 text-slate-500">
          <MaterialIcon name="settings" />
          <span className="text-[10px] font-bold uppercase">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
