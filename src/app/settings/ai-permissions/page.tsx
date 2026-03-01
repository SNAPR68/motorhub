"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";

/* Stitch: ai_automation_permissions — #1754cf, Manrope, #0a0c10, card: #161b26 */

const STORAGE_KEY = "av_ai_permissions";

const PERMISSIONS = [
  {
    icon: "auto_awesome",
    iconBg: "rgba(23,84,207,0.1)",
    title: "Automated Posting",
    desc: "Allow Autovinci to automatically publish vehicle listings and marketing content to connected social platforms.",
    defaultOn: true,
  },
  {
    icon: "sync_saved_locally",
    iconBg: "rgba(16,185,129,0.1)",
    title: "Media Sync",
    desc: "Sync AI-enhanced photos and videos across all your dealership platforms and marketing channels.",
    defaultOn: true,
  },
  {
    icon: "forum",
    iconBg: "rgba(249,115,22,0.1)",
    title: "Smart Engagement",
    desc: "Enable AI to respond to comments, DMs, and inquiries on social platforms using your brand voice.",
    defaultOn: false,
  },
];

export default function AIPermissionsPage() {
  const [toggles, setToggles] = useState(PERMISSIONS.map((p) => p.defaultOn));
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setToggles(JSON.parse(stored) as boolean[]);
    } catch (e) { console.warn("localStorage read failed:", e); }
  }, []);

  const handleSave = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(toggles)); } catch (e) { console.warn("localStorage write failed:", e); }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div
      className="min-h-dvh w-full flex flex-col max-w-md mx-auto text-slate-100"
      style={{ fontFamily: "'Manrope', sans-serif", background: "#0a0c10" }}
    >
      {/* Header */}
      <header className="px-6 pt-12 pb-4">
        <div className="flex items-center justify-between mb-6">
          <Link href="/settings" className="p-2 rounded-full hover:bg-white/5">
            <MaterialIcon name="arrow_back" className="text-slate-400" />
          </Link>
          <div className="flex gap-1.5">
            <div className="w-8 h-1 rounded-full bg-[#1754cf]" />
            <div className="w-8 h-1 rounded-full bg-[#1754cf]" />
            <div className="w-8 h-1 rounded-full bg-white/10" />
          </div>
          <span className="text-xs text-slate-500 font-medium">2 of 3</span>
        </div>

        {/* Title */}
        <div className="mb-2">
          <h1 className="text-3xl font-bold">
            <span className="text-white">AI </span>
            <span style={{ background: "linear-gradient(135deg, #1754cf, #6366f1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Power-Up
            </span>
          </h1>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">
          Grant Autovinci permission to supercharge your dealership with AI automation. You can change these anytime.
        </p>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-32">
        {/* Permission Cards */}
        <section className="py-6 space-y-4">
          {PERMISSIONS.map((perm, i) => (
            <div
              key={perm.title}
              className="rounded-xl p-5"
              style={{ background: "#161b26", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div
                    className="size-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: perm.iconBg }}
                  >
                    <MaterialIcon
                      name={perm.icon}
                      className="text-2xl"
                      style={{ color: i === 0 ? "#1754cf" : i === 1 ? "#10b981" : "#f97316" }}
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">{perm.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{perm.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const next = [...toggles];
                    next[i] = !next[i];
                    setToggles(next);
                  }}
                  className="w-12 h-7 rounded-full relative transition-colors shrink-0 mt-1"
                  style={{ background: toggles[i] ? "#1754cf" : "#334155" }}
                >
                  <div
                    className="absolute top-[3px] w-[22px] h-[22px] bg-white rounded-full transition-all shadow-sm"
                    style={{ left: toggles[i] ? "24px" : "3px" }}
                  />
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* Privacy Info */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ background: "rgba(23,84,207,0.05)", border: "1px solid rgba(23,84,207,0.1)" }}>
          <MaterialIcon name="lock" className="text-[#1754cf] text-xl shrink-0" />
          <p className="text-xs text-slate-400">Your data is <span className="text-white font-medium">end-to-end encrypted</span>. AI permissions can be revoked anytime from Settings.</p>
        </div>
      </main>

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-30 p-6 bg-[#0a0c10]/95 backdrop-blur-md border-t border-white/5">
        <button
          onClick={handleSave}
          className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all"
          style={{ background: saved ? "#10b981" : "#1754cf", boxShadow: saved ? "0 10px 30px -10px rgba(16,185,129,0.4)" : "0 10px 30px -10px rgba(23,84,207,0.4)", color: "white" }}
        >
          <MaterialIcon name={saved ? "check_circle" : "arrow_forward"} />
          {saved ? "Saved!" : "Save Permissions"}
        </button>
      </div>
    </div>
  );
}
