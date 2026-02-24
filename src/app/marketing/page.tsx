"use client";

import Link from "next/link";
import Image from "next/image";
import { CRETA, INTERIOR, BLUR_DATA_URL } from "@/lib/car-images";
import { MaterialIcon } from "@/components/MaterialIcon";

/* ── design tokens: elite_marketing_studio_1 ── */
// primary: #1773cf, font: Manrope, bg: #0a0c10, glass: rgba(255,255,255,0.05)+blur(12px)

const ASSETS = [
  {
    title: "IG Reel: Morning Drive",
    subtitle: "Video • 15s",
    aspect: "aspect-[9/16]",
    image: CRETA,
  },
  {
    title: "FB: Interior Details",
    subtitle: "Image • High-Res",
    aspect: "aspect-square",
    image: INTERIOR,
  },
];

export default function MarketingPage() {
  return (
    <div
      className="min-h-screen max-w-md mx-auto flex flex-col pb-40"
      style={{ fontFamily: "'Manrope', sans-serif", background: "#0a0c10", color: "#e2e8f0" }}
    >
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-50 px-4 py-4 flex items-center justify-between border-b"
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(23,115,207,0.1)",
        }}
      >
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center justify-center w-10 h-10 rounded-full">
            <MaterialIcon name="arrow_back_ios_new" />
          </Link>
          <h1 className="text-lg font-bold tracking-tight text-white">Elite Studio</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full">
            <MaterialIcon name="notifications" />
          </button>
          <div
            className="w-9 h-9 rounded-full overflow-hidden border flex items-center justify-center text-xs font-bold"
            style={{ borderColor: "rgba(23,115,207,0.3)", background: "rgba(23,115,207,0.15)", color: "#1773cf" }}
          >
            AV
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-4">
        {/* ── Featured Campaign ── */}
        <section className="px-4 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight text-white">Featured Campaign</h2>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest"
              style={{ background: "rgba(239,68,68,0.2)", color: "#ef4444" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "#ef4444" }}
              />
              Live
            </span>
          </div>
          <div
            className="relative group rounded-xl overflow-hidden border"
            style={{
              aspectRatio: "16/9",
              boxShadow: "0 25px 50px rgba(23,115,207,0.1)",
              borderColor: "rgba(255,255,255,0.05)",
            }}
          >
            <Image
              src={CRETA}
              alt=""
              fill
              className="object-cover brightness-75"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            {/* Play Button */}
            <button
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center border"
              style={{
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(12px)",
                borderColor: "rgba(255,255,255,0.3)",
              }}
            >
              <MaterialIcon name="play_arrow" fill className="text-white text-[32px] ml-1" />
            </button>
            {/* Progress Bar */}
            <div className="absolute bottom-0 inset-x-0 p-4">
              <h3 className="text-lg font-semibold text-white mb-2">Creta SX(O): AI Showcase</h3>
              <div className="flex items-center gap-3">
                <div
                  className="h-1 flex-1 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                >
                  <div className="h-full w-2/3" style={{ background: "#1773cf" }} />
                </div>
                <span className="text-[10px] font-medium text-white/70">02:14 / 03:45</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── AI Marketing Assets Grid ── */}
        <section className="px-4 mt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">AI Marketing Assets</h2>
              <p className="text-xs text-slate-400 mt-0.5">Custom content for your inventory</p>
            </div>
            <button className="text-sm font-semibold" style={{ color: "#1773cf" }}>
              View All
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Asset 1: IG Reel */}
            <div className="flex flex-col gap-2">
              <div
                className="aspect-[9/16] rounded-lg overflow-hidden relative border"
                style={{
                  borderColor: "rgba(255,255,255,0.05)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
              >
                <Image src={CRETA} alt="" fill className="object-cover" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
                <div
                  className="absolute top-2 left-2 px-2 py-1 rounded-md flex items-center gap-1"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <MaterialIcon name="workspace_premium" fill className="text-[12px] text-amber-400" />
                  <span className="text-[9px] font-bold text-white uppercase tracking-tighter">
                    Premium Edit
                  </span>
                </div>
              </div>
              <div>
                <p className="text-[13px] font-semibold truncate text-slate-200">
                  {ASSETS[0].title}
                </p>
                <p className="text-[11px] text-slate-500">{ASSETS[0].subtitle}</p>
              </div>
            </div>

            {/* Asset 2: FB Post + Brochure */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div
                  className="aspect-square rounded-lg overflow-hidden relative border"
                  style={{
                    borderColor: "rgba(255,255,255,0.05)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  }}
                >
                  <Image src={INTERIOR} alt="" fill className="object-cover" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
                  <div
                    className="absolute top-2 left-2 px-2 py-1 rounded-md flex items-center gap-1"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <MaterialIcon name="workspace_premium" fill className="text-[12px] text-amber-400" />
                    <span className="text-[9px] font-bold text-white uppercase tracking-tighter">
                      Premium Edit
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-[13px] font-semibold truncate text-slate-200">
                    {ASSETS[1].title}
                  </p>
                  <p className="text-[11px] text-slate-500">{ASSETS[1].subtitle}</p>
                </div>
              </div>

              {/* Brochure Placeholder */}
              <div className="flex flex-col gap-2">
                <div
                  className="aspect-[3/4] rounded-lg overflow-hidden border flex flex-col p-3"
                  style={{
                    background: "rgba(15,23,42,0.8)",
                    borderColor: "rgba(255,255,255,0.05)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  }}
                >
                  <div
                    className="relative h-1/2 w-full rounded mb-2 overflow-hidden"
                    style={{ background: "rgba(30,41,59,0.5)" }}
                  >
                    <Image src={CRETA} alt="" fill className="object-cover opacity-60" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-3/4 rounded" style={{ background: "rgba(255,255,255,0.2)" }} />
                    <div className="h-1.5 w-1/2 rounded" style={{ background: "rgba(255,255,255,0.1)" }} />
                    <div className="h-1.5 w-2/3 rounded" style={{ background: "rgba(255,255,255,0.1)" }} />
                  </div>
                  <div className="mt-auto flex justify-end">
                    <span className="text-[8px] font-bold uppercase" style={{ color: "rgba(23,115,207,0.8)" }}>
                      Catalogue
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-[13px] font-semibold truncate text-slate-200">Digital Brochure V2</p>
                  <p className="text-[11px] text-slate-500">PDF • 8 Pages</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Insights Preview ── */}
        <section className="px-4 mt-8 mb-4">
          <div
            className="rounded-xl p-4 border"
            style={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(12px)",
              borderColor: "rgba(23,115,207,0.2)",
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span style={{ color: "#1773cf" }}>
                <MaterialIcon name="analytics" />
              </span>
              <h3 className="font-bold text-sm text-white">Real-time Forecast</h3>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-2xl font-extrabold tracking-tight text-white">+14.2%</p>
                <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">
                  Estimated Engagement
                </p>
              </div>
              <div className="flex gap-1 h-12 items-end">
                <div className="w-1.5 rounded-full h-1/2" style={{ background: "rgba(23,115,207,0.2)" }} />
                <div className="w-1.5 rounded-full h-2/3" style={{ background: "rgba(23,115,207,0.4)" }} />
                <div className="w-1.5 rounded-full h-3/4" style={{ background: "rgba(23,115,207,0.6)" }} />
                <div className="w-1.5 rounded-full h-full" style={{ background: "#1773cf" }} />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Bottom: Global Sync + Tab Bar ── */}
      <div className="fixed bottom-0 inset-x-0 z-50 max-w-md mx-auto">
        {/* Global Sync Button */}
        <div className="px-4 pb-4 max-w-md mx-auto">
          <button
            className="w-full text-white h-14 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            style={{
              background: "linear-gradient(135deg, #1773cf 0%, #0c4a8a 100%)",
              boxShadow: "0 8px 24px rgba(23,115,207,0.3)",
            }}
          >
            <MaterialIcon name="sync_alt" fill />
            Global Sync
            <span className="text-xs font-normal text-white/70 ml-1">Distribute to Network</span>
          </button>
        </div>
        {/* Tab Bar */}
        <nav
          className="border-t px-6 pb-6 pt-3 flex justify-between items-center max-w-md mx-auto"
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(16px)",
            borderColor: "rgba(255,255,255,0.05)",
          }}
        >
          {[
            { icon: "dashboard", label: "Studio", href: "/marketing", active: true },
            { icon: "directions_car", label: "Inventory", href: "/inventory" },
            { icon: "campaign", label: "Ads", href: "/performance" },
            { icon: "settings", label: "Settings", href: "/settings" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-1"
              style={{ color: item.active ? "#1773cf" : "#94a3b8" }}
            >
              <MaterialIcon name={item.icon} fill={item.active} className="text-[26px]" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
