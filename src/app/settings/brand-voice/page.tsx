"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchDealerProfile, fetchDealerPreferences, updateDealerPreferences } from "@/lib/api";

/* ── design tokens: ai_brand_voice_setup ── */
// primary: #7311d4 (purple), font: Manrope, bg: #0a070d

const STORAGE_KEY = "av_brand_voice_persona";

const PERSONAS = [
  {
    name: "The Sophisticate",
    desc: "Refined, eloquent, and highly detailed automotive expertise.",
    preview: "Good evening. We have curated a bespoke selection of premium vehicles for your private review. Each element has been refined to meet your standards of excellence.",
  },
  {
    name: "The Minimalist",
    desc: "Direct, efficient, and modern. No-nonsense communication.",
    preview: "New stock available. 3 vehicles match your criteria. Prices from ₹8.5L. Inspect now.",
  },
  {
    name: "The Visionary",
    desc: "Inspiring, bold, and forward-thinking industry perspective.",
    preview: "The future of mobility is here. These aren't just cars — they're statements. Discover what drives tomorrow, today.",
  },
];

export default function BrandVoicePage() {
  const [selected, setSelected] = useState(0);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data: profileData } = useApi(() => fetchDealerProfile(), []);
  const { data: prefsData } = useApi(() => fetchDealerPreferences(), []);
  const dealershipName = (profileData?.profile as { dealershipName?: string } | undefined)?.dealershipName ?? "";

  // Load from API first, localStorage fallback
  useEffect(() => {
    const assets = prefsData?.assets;
    if (assets && typeof assets === "object" && "brandVoice" in assets) {
      setSelected(Number((assets as Record<string, unknown>).brandVoice) || 0);
    } else {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored !== null) setSelected(parseInt(stored, 10) || 0);
      } catch {}
    }
  }, [prefsData]);

  const handleConfirm = async () => {
    setSaving(true);
    try {
      const currentAssets = (prefsData?.assets as Record<string, unknown>) ?? {};
      await updateDealerPreferences({ assets: { ...currentAssets, brandVoice: selected } as unknown as Record<string, boolean> });
    } catch {
      try { localStorage.setItem(STORAGE_KEY, String(selected)); } catch {}
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div
      className="relative min-h-screen max-w-md mx-auto flex flex-col overflow-hidden"
      style={{ fontFamily: "'Manrope', sans-serif", background: "#0a070d", color: "#f1f5f9" }}
    >
      {/* Decorative Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, rgba(115,17,212,0.05) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
      <div
        className="absolute top-[-10%] right-[-10%] w-64 h-64 rounded-full pointer-events-none"
        style={{ background: "rgba(115,17,212,0.1)", filter: "blur(100px)" }}
      />

      {/* ── Header ── */}
      <header className="relative z-10 flex flex-col px-6 pt-12 pb-4">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/settings"
            className="flex items-center justify-center w-10 h-10 rounded-full"
            style={{ background: "rgba(30,41,59,0.5)" }}
          >
            <MaterialIcon name="arrow_back_ios_new" className="text-xl" />
          </Link>
          <div className="flex flex-col items-center">
            <span
              className="text-[10px] uppercase font-bold"
              style={{ letterSpacing: "0.3em", color: "#7311d4" }}
            >
              {dealershipName || "Autovinci"}
            </span>
            <h1 className="text-sm font-semibold tracking-tight text-slate-400">AI Brand Voice</h1>
          </div>
          <div className="w-10 h-10 flex items-center justify-center">
            <MaterialIcon name="more_horiz" className="text-slate-400" />
          </div>
        </div>

        {/* Progress Bar */}
        <div
          className="w-full h-[2px] rounded-full mb-8 overflow-hidden"
          style={{ background: "#1e293b" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${((selected + 1) / PERSONAS.length) * 100}%`,
              background: "#7311d4",
              boxShadow: "0 0 8px rgba(115,17,212,0.6)",
            }}
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
            Define Your{" "}
            <span className="italic" style={{ color: "#7311d4" }}>
              Voice
            </span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-[85%]">
            Select the digital persona that will represent your dealership to high-value clients.
          </p>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="relative z-10 flex-1 px-6 pb-32 overflow-y-auto space-y-6">
        {/* Persona Selection */}
        <div className="space-y-3">
          {PERSONAS.map((p, i) => (
            <button
              key={p.name}
              onClick={() => setSelected(i)}
              className="w-full flex items-center gap-4 p-5 rounded-xl transition-all text-left"
              style={
                i === selected
                  ? {
                      border: "1px solid #7311d4",
                      background: "rgba(115,17,212,0.05)",
                      boxShadow: "0 0 0 1px rgba(115,17,212,0.3)",
                    }
                  : {
                      border: "1px solid #1e293b",
                      background: "rgba(255,255,255,0.05)",
                    }
              }
            >
              <div className="flex-1">
                <h3 className="font-bold text-base tracking-tight mb-1 text-white">{p.name}</h3>
                <p className="text-xs text-slate-400 leading-normal">{p.desc}</p>
              </div>
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                style={{
                  border: `2px solid ${i === selected ? "#7311d4" : "#334155"}`,
                }}
              >
                {i === selected && (
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: "#7311d4" }}
                  />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Live Preview */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Live Preview
            </h3>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: "#7311d4" }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ background: "#7311d4" }}
                />
              </span>
              <span className="text-[10px] font-medium" style={{ color: "#7311d4" }}>
                {PERSONAS[selected].name}
              </span>
            </div>
          </div>

          {/* Preview Card */}
          <div
            className="rounded-xl p-6 relative overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(115,17,212,0.1)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
            }}
          >
            <div
              className="absolute top-0 left-0 w-full h-[1px]"
              style={{ background: "linear-gradient(to right, transparent, rgba(115,17,212,0.3), transparent)" }}
            />
            <div className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(115,17,212,0.2)",
                  border: "1px solid rgba(115,17,212,0.3)",
                }}
              >
                <MaterialIcon name="auto_awesome" className="text-xl text-[#7311d4]" />
              </div>
              <div className="space-y-3">
                <p className="text-[13px] leading-relaxed italic text-slate-300">
                  &ldquo;{PERSONAS[selected].preview}&rdquo;
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1" style={{ background: "#1e293b" }} />
                  <span className="text-[10px] text-slate-500 font-mono">
                    {dealershipName ? `${dealershipName.toUpperCase()} · ` : ""}ENHANCED BY AUTOVINCI
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Sticky Bottom Action ── */}
      <div
        className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 z-20"
        style={{
          background: "linear-gradient(to top, #0a070d 0%, rgba(10,7,13,0.95) 60%, transparent 100%)",
        }}
      >
        <button
          onClick={handleConfirm}
          className="w-full h-14 rounded-full flex items-center justify-center gap-2 text-white font-bold text-base active:scale-95 transition-all"
          style={{
            background: saved
              ? "linear-gradient(135deg, #16a34a 0%, #15803d 100%)"
              : "linear-gradient(135deg, #7311d4 0%, #4a0a8a 100%)",
            boxShadow: saved
              ? "0 10px 30px -10px rgba(22,163,74,0.5)"
              : "0 10px 30px -10px rgba(115,17,212,0.5)",
          }}
        >
          <span>{saved ? "Persona Saved ✓" : "Confirm AI Persona"}</span>
          {!saved && <MaterialIcon name="arrow_forward" className="text-lg" />}
        </button>
        <p className="text-center mt-4 text-[11px] text-slate-500 font-medium">
          You can fine-tune these settings later in the Dashboard.
        </p>
      </div>
    </div>
  );
}
