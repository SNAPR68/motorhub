"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";

/* ── design tokens: dealer_social_onboarding ── */
// primary: #7311d4 (purple), font: Plus Jakarta Sans, bg: #191022

const PLATFORMS = [
  {
    name: "Instagram",
    badge: "Auto-Reels",
    desc: "AI converts vehicle walkarounds into cinematic, trending Reels automatically.",
    icon: "photo_camera",
    iconBg: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
    hasBlur: true,
  },
  {
    name: "TikTok",
    badge: "Viral Flow",
    desc: "Drive viral interest with AI-optimized short-form clips tailored for the FYP.",
    icon: "music_note",
    iconBg: "#000000",
    hasBlur: false,
  },
  {
    name: "Facebook",
    badge: "Marketplace",
    desc: "Automated listing updates and seamless inventory syncing for Marketplace.",
    icon: "thumbs_up_down",
    iconBg: "#1877F2",
    hasBlur: false,
  },
  {
    name: "WhatsApp",
    badge: "Concierge",
    desc: "24/7 AI-driven lead qualification and automated concierge responses.",
    icon: "chat",
    iconBg: "#25D366",
    hasBlur: false,
  },
];

export default function SocialOnboardingPage() {
  return (
    <div
      className="relative min-h-screen max-w-md mx-auto flex flex-col overflow-hidden"
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        background: "#191022",
        color: "#f1f5f9",
      }}
    >
      {/* Status Bar Spacer */}
      <div className="h-12 w-full" style={{ background: "#191022" }} />

      {/* ── Progress Header ── */}
      <header className="px-6 pt-4 pb-2">
        <div className="flex justify-between items-center mb-4">
          <span
            className="text-[10px] font-bold uppercase"
            style={{ letterSpacing: "0.2em", color: "#7311d4" }}
          >
            Autovinci Premium
          </span>
          <span
            className="text-[10px] font-bold uppercase"
            style={{ letterSpacing: "0.1em", color: "rgba(192,192,192,0.6)" }}
          >
            Step 1 of 4
          </span>
        </div>
        <div
          className="w-full h-[2px] rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <div
            className="w-1/4 h-full rounded-full"
            style={{ background: "linear-gradient(to right, #7311d4, #c0c0c0)" }}
          />
        </div>
      </header>

      {/* ── Main Content ── */}
      <main
        className="flex-1 px-6 pt-8 overflow-y-auto pb-32"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, rgba(115,17,212,0.05) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      >
        {/* Hero Section */}
        <section className="mb-10">
          <h1
            className="text-4xl font-extrabold tracking-tight mb-3"
            style={{
              background: "linear-gradient(180deg, #FFFFFF 0%, #C0C0C0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Elevate Your Reach
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-[280px]">
            Connect your social ecosystem. Our AI orchestrates high-end content while you close
            deals.
          </p>
        </section>

        {/* Integration Grid */}
        <div className="grid grid-cols-1 gap-4">
          {PLATFORMS.map((p) => (
            <div
              key={p.name}
              className="rounded-2xl p-5 flex flex-col relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(192,192,192,0.1)",
              }}
            >
              {/* Decorative blur for first card */}
              {p.hasBlur && (
                <div
                  className="absolute -right-4 -top-4 w-24 h-24 rounded-full pointer-events-none"
                  style={{ background: "rgba(115,17,212,0.1)", filter: "blur(24px)" }}
                />
              )}

              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                  style={{
                    background: p.iconBg,
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <MaterialIcon name={p.icon} className="text-white text-xl" />
                </div>
                <span
                  className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider"
                  style={{ background: "rgba(115,17,212,0.2)", color: "#7311d4" }}
                >
                  {p.badge}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{p.name}</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">{p.desc}</p>

              <button
                className="w-full py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors"
                style={{
                  border: "1px solid rgba(192,192,192,0.2)",
                  color: "#c0c0c0",
                  background: "transparent",
                }}
              >
                Connect Account
              </button>
            </div>
          ))}
        </div>

        {/* Skip Option */}
        <div className="mt-8 text-center pb-12">
          <button className="text-slate-500 text-xs font-medium uppercase tracking-widest">
            I&rsquo;ll configure these later
          </button>
        </div>
      </main>

      {/* ── Bottom Action Bar ── */}
      <div
        className="fixed bottom-0 left-0 right-0 p-6 pt-12 max-w-md mx-auto"
        style={{
          background:
            "linear-gradient(to top, #191022 0%, #191022 60%, transparent 100%)",
        }}
      >
        <Link href="/social-hub">
          <button
            className="w-full py-5 rounded-xl text-white font-bold text-sm uppercase active:scale-[0.98] transition-all"
            style={{
              background: "#7311d4",
              boxShadow: "0 0 20px rgba(115,17,212,0.4)",
              letterSpacing: "0.2em",
            }}
          >
            Continue to Social Hub
          </button>
        </Link>
        <div className="h-6" />
      </div>

      {/* ── Decoration Elements ── */}
      <div
        className="fixed -bottom-20 -left-20 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: "rgba(115,17,212,0.1)", filter: "blur(120px)" }}
      />
      <div
        className="fixed top-1/2 -right-20 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: "rgba(115,17,212,0.05)", filter: "blur(100px)" }}
      />
    </div>
  );
}
