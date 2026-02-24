"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";

/* ── design tokens: ai_quick_draft_studio ── */
// primary: #137fec, font: Inter, bg: #f6f7f8 (LIGHT theme)

const INTENTS = [
  { icon: "check_circle", label: "Availability", active: true },
  { icon: "sell", label: "Discount Offer", active: false },
  { icon: "calendar_month", label: "Schedule Drive", active: false },
  { icon: "settings", label: "Tech Specs", active: false },
  { icon: "currency_exchange", label: "Trade-In", active: false },
];

export default function QuickDraftPage() {
  const [selectedIntent, setSelectedIntent] = useState(0);
  const [draftText, setDraftText] = useState(
    "Hi Priya! Thanks for reaching out. Yes, the 2023 Creta SX(O) is currently available in our showroom. It does come with the Premium Tech Package included in the listed price.\n\nRegarding your 2020 Swift, we'd love to take a look! We're offering top trade-in values this month. Would you be free to bring it by for a quick appraisal tomorrow afternoon?"
  );

  return (
    <div
      className="relative flex min-h-screen w-full max-w-md mx-auto flex-col overflow-x-hidden"
      style={{ fontFamily: "'Inter', sans-serif", background: "#f6f7f8", color: "#0f172a" }}
    >
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-10 border-b px-4 py-3 flex items-center justify-between"
        style={{
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(12px)",
          borderColor: "#e2e8f0",
        }}
      >
        <Link href="/content-studio" className="flex items-center" style={{ color: "#137fec" }}>
          <MaterialIcon name="arrow_back_ios_new" />
        </Link>
        <div className="flex flex-col items-center">
          <h1 className="text-sm font-bold tracking-tight text-slate-900">AI Quick Draft Studio</h1>
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
            Smart Chips Mode
          </span>
        </div>
        <button className="text-slate-400">
          <MaterialIcon name="more_horiz" />
        </button>
      </header>

      {/* ── Chat Context ── */}
      <section className="p-4" style={{ background: "rgba(241,245,249,0.5)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "rgba(19,127,236,0.1)" }}
          >
            <span style={{ color: "#137fec" }}>
              <MaterialIcon name="person" />
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Inquiry: Priya Sharma</h3>
            <p className="text-xs text-slate-500">2023 Hyundai Creta SX(O) • Polar White</p>
          </div>
          <div className="ml-auto">
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-bold"
              style={{ background: "rgba(34,197,94,0.1)", color: "#16a34a" }}
            >
              ONLINE
            </span>
          </div>
        </div>
        <div
          className="bg-white border rounded-xl p-3"
          style={{ borderColor: "#e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
        >
          <p className="text-sm italic text-slate-600 line-clamp-2">
            &ldquo;Is this still available? I&apos;m looking to trade in my 2020 Swift. Does the price include the tech package?&rdquo;
          </p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] text-slate-400">Received 2m ago</span>
            <span className="text-[10px] font-semibold flex items-center gap-1" style={{ color: "#137fec" }}>
              <MaterialIcon name="auto_awesome" className="text-[12px]" />
              Context Synced
            </span>
          </div>
        </div>
      </section>

      {/* ── Intent Chips ── */}
      <section className="py-4">
        <h3 className="px-4 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Select Intent
        </h3>
        <div className="flex gap-2 px-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          {INTENTS.map((intent, i) => (
            <button
              key={intent.label}
              onClick={() => setSelectedIntent(i)}
              className="flex-none px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2"
              style={
                i === selectedIntent
                  ? {
                      background: "#137fec",
                      color: "white",
                      boxShadow: "0 4px 12px rgba(19,127,236,0.2)",
                    }
                  : {
                      background: "white",
                      color: "#475569",
                      border: "1px solid #e2e8f0",
                    }
              }
            >
              <MaterialIcon name={intent.icon} className="text-sm" />
              {intent.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Draft Area ── */}
      <main className="flex-1 px-4 pb-4 overflow-y-auto">
        <div className="relative flex flex-col h-full">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              AI Draft Content
            </h3>
            <button className="text-xs font-bold flex items-center gap-1" style={{ color: "#137fec" }}>
              <MaterialIcon name="refresh" className="text-sm" />
              Regenerate
            </button>
          </div>
          <div
            className="flex-1 rounded-2xl p-4 border relative min-h-[200px]"
            style={{
              background: "rgba(241,245,249,0.8)",
              borderColor: "#e2e8f0",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.03)",
            }}
          >
            <textarea
              className="w-full h-full bg-transparent border-none focus:outline-none focus:ring-0 text-slate-800 text-base leading-relaxed resize-none min-h-[180px]"
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              placeholder="AI is thinking..."
            />
            {/* AI Insight Tag */}
            <div
              className="absolute bottom-4 right-4 bg-white px-2 py-1 rounded-lg border flex items-center gap-2"
              style={{ borderColor: "#e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
            >
              <MaterialIcon name="bolt" fill className="text-[14px] text-[#137fec]" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">94% Fit Score</span>
            </div>
          </div>
        </div>
      </main>

      {/* ── Tone Control & Action ── */}
      <footer className="p-4 bg-white border-t space-y-6" style={{ borderColor: "#e2e8f0" }}>
        {/* Tone Slider */}
        <div className="space-y-3 px-2">
          <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <span>Formal</span>
            <span style={{ color: "#137fec" }}>Optimized Tone</span>
            <span>Casual</span>
          </div>
          <div className="relative h-6 flex items-center">
            <div className="absolute w-full h-1.5 bg-slate-200 rounded-full" />
            <div className="absolute w-3/4 h-1.5 rounded-full" style={{ background: "rgba(19,127,236,0.3)" }} />
            <div
              className="absolute left-3/4 -translate-x-1/2 w-5 h-5 bg-white rounded-full border-2 cursor-pointer"
              style={{ borderColor: "#137fec", boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }}
            />
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex gap-3">
          <button
            className="flex-1 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2"
            style={{
              background: "#137fec",
              boxShadow: "0 4px 16px rgba(19,127,236,0.25)",
            }}
          >
            <MaterialIcon name="send" />
            Approve &amp; Send
          </button>
        </div>
      </footer>

      {/* ── Bottom Nav ── */}
      <nav
        className="flex border-t px-4 pb-8 pt-2"
        style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(12px)",
          borderColor: "#e2e8f0",
        }}
      >
        {[
          { icon: "directions_car", label: "Inventory", href: "/inventory" },
          { icon: "group", label: "Leads", href: "/leads" },
          { icon: "magic_button", label: "Studio", href: "/quick-draft", active: true },
          { icon: "monitoring", label: "Analytics", href: "/analytics" },
          { icon: "settings", label: "Settings", href: "/settings" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-1 flex-col items-center gap-1"
            style={{ color: item.active ? "#137fec" : "#94a3b8" }}
          >
            <MaterialIcon name={item.icon} fill={item.active} />
            <p className={`text-[10px] ${item.active ? "font-bold" : "font-medium"}`}>{item.label}</p>
          </Link>
        ))}
      </nav>
    </div>
  );
}
