"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";

/* ── design tokens: social_media_integration_hub ── */
// primary: #135bec, font: Noto Serif (hero) + Noto Sans (body), bg: #101622

const PLATFORMS = [
  {
    name: "Instagram",
    icon: "photo_camera",
    gradient: "linear-gradient(135deg, #f9ce34, #ee2a7b, #6228d7)",
    subtitle: "AI Reel Sync",
    subtitleIcon: "auto_awesome",
  },
  {
    name: "Facebook",
    icon: "social_leaderboard",
    gradient: "#1877F2",
    subtitle: "Marketplace Auto-Post",
    subtitleIcon: "storefront",
  },
  {
    name: "YouTube",
    icon: "play_circle",
    gradient: "#000000",
    ring: true,
    subtitle: "Smart Distribution",
    subtitleIcon: "bolt",
  },
  {
    name: "WhatsApp",
    icon: "chat",
    gradient: "#25D366",
    subtitle: "24/7 AI Concierge",
    subtitleIcon: "support_agent",
  },
];

export default function SocialHubPage() {
  return (
    <div
      className="min-h-screen max-w-md mx-auto flex flex-col pb-24"
      style={{ fontFamily: "'Noto Sans', sans-serif", background: "#101622", color: "#e2e8f0" }}
    >
      {/* ── Background Decoration ── */}
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-20 overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            top: "-10%",
            right: "-10%",
            width: "24rem",
            height: "24rem",
            background: "rgba(19,91,236,0.2)",
            filter: "blur(120px)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            bottom: "-5%",
            left: "-5%",
            width: "20rem",
            height: "20rem",
            background: "rgba(30,41,59,0.3)",
            filter: "blur(100px)",
          }}
        />
      </div>

      {/* ── Header / Progress Bar ── */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: "rgba(16,22,34,0.8)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center p-4 justify-between">
          <Link
            href="/dashboard"
            className="flex items-center justify-center w-10 h-10 rounded-full"
          >
            <MaterialIcon name="arrow_back_ios_new" />
          </Link>
          <div className="flex-1 px-4">
            <div className="flex justify-between items-center mb-2">
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#135bec" }}
              >
                Onboarding
              </span>
              <span className="text-xs text-slate-400">Step 2 of 4</span>
            </div>
            <div
              className="w-full h-1.5 rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <div
                className="h-full rounded-full"
                style={{ width: "50%", background: "#135bec" }}
              />
            </div>
          </div>
          <div className="w-10 h-10" />
        </div>
      </header>

      <main className="flex-1 px-6 pt-4 pb-24 overflow-y-auto">
        {/* ── Hero Section ── */}
        <div className="text-center mb-10">
          <h1
            className="text-3xl font-bold mb-3 tracking-tight text-white"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            Connect Your Network
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
            Enable AI-powered marketing across your social channels to reach buyers instantly.
          </p>
        </div>

        {/* ── Connection Cards ── */}
        <div className="grid grid-cols-1 gap-4">
          {PLATFORMS.map((p) => (
            <div
              key={p.name}
              className="flex items-center gap-4 p-5 rounded-xl"
              style={{
                background: "rgba(15,23,42,0.5)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white shrink-0"
                style={{
                  background: p.gradient,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  ...(p.ring ? { boxShadow: "0 4px 12px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(100,116,139,0.5)" } : {}),
                }}
              >
                <MaterialIcon name={p.icon} className="text-3xl" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white">{p.name}</h3>
                <p className="text-xs font-medium flex items-center gap-1 mt-0.5" style={{ color: "#135bec" }}>
                  <MaterialIcon name={p.subtitleIcon} className="text-[14px]" />
                  {p.subtitle}
                </p>
              </div>
              <button
                className="text-white px-5 py-2 rounded-full text-sm font-semibold"
                style={{ background: "#135bec" }}
              >
                Connect
              </button>
            </div>
          ))}
        </div>

        {/* ── Footer Actions ── */}
        <div className="mt-12 flex flex-col items-center gap-6">
          <button
            className="w-full py-4 rounded-xl font-bold tracking-wide opacity-50 cursor-not-allowed"
            style={{ background: "rgba(255,255,255,0.08)", color: "#e2e8f0" }}
          >
            Continue
          </button>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-slate-400"
          >
            Skip for Now
          </Link>
        </div>
      </main>

      {/* ── Bottom Nav ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t pb-8 pt-2 max-w-md mx-auto"
        style={{
          background: "rgba(15,23,42,0.9)",
          backdropFilter: "blur(16px)",
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex justify-around items-center px-4 max-w-md mx-auto">
          {[
            { icon: "home", href: "/dashboard", active: true },
            { icon: "search", href: "/inventory" },
            { icon: "add_circle", href: "/content-studio" },
            { icon: "favorite", href: "/wishlist" },
            { icon: "person", href: "/settings" },
          ].map((item) => (
            <Link
              key={item.icon}
              href={item.href}
              className="flex flex-col items-center gap-1 p-2"
              style={{ color: item.active ? "#135bec" : "#94a3b8" }}
            >
              <MaterialIcon name={item.icon} fill={item.active} />
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
