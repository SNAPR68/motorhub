"use client";

import Link from "next/link";
import Image from "next/image";
import { CRETA, BLUR_DATA_URL } from "@/lib/car-images";
import { MaterialIcon } from "@/components/MaterialIcon";

/* Stitch: autovinci_luxury_landing_page — #1152d4, Noto Serif + Noto Sans, #101622 */

export default function LandingPage() {
  return (
    <div
      className="relative min-h-dvh w-full max-w-md mx-auto overflow-hidden"
      style={{ fontFamily: "'Noto Sans', sans-serif", background: "#101622", color: "#e2e8f0" }}
    >
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={CRETA}
          alt="Cinematic vehicle in studio"
          fill
          className="object-cover"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />
        <div className="absolute inset-0 bg-black/50 z-10" />
        {/* Vignette */}
        <div
          className="absolute inset-0 z-20"
          style={{ background: "radial-gradient(circle, transparent 20%, rgba(16,22,34,0.85) 100%)" }}
        />
      </div>

      {/* Top gradient */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#101622]/80 to-transparent z-10 pointer-events-none" />
      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#101622] to-transparent z-10 pointer-events-none" />

      {/* Navigation Header */}
      <header className="relative z-30 flex items-center justify-between px-6 pt-12 pb-6">
        <div className="flex items-center gap-2">
          <MaterialIcon name="token" className="text-3xl text-[#1152d4]" />
          <h2
            className="text-xl font-bold tracking-widest uppercase"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            Autovinci
          </h2>
        </div>
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full"
          style={{
            background: "rgba(16,22,34,0.6)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <MaterialIcon name="menu" className="text-slate-100" />
        </button>
      </header>

      {/* Main Content Overlay */}
      <main className="relative z-30 flex flex-col items-center justify-end min-h-dvh px-6 pb-36 text-center">
        <div className="mb-12">
          <p
            className="text-xs uppercase mb-4 font-semibold text-[#1152d4]"
            style={{ letterSpacing: "0.4em" }}
          >
            Intelligence &amp; Elegance
          </p>
          <h1
            className="text-4xl font-bold leading-tight mb-4 max-w-xs mx-auto text-slate-100"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            The Future of Luxury Automotive
          </h1>
          <div className="w-12 h-px bg-[#1152d4]/60 mx-auto" />
        </div>

        <div className="w-full max-w-sm space-y-4">
          <Link
            href="/dashboard"
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-lg bg-[#1152d4] px-8 py-5 text-base font-bold text-white transition-all active:scale-[0.98]"
          >
            <MaterialIcon name="admin_panel_settings" className="text-xl" />
            <span>Dealer Portal</span>
            <MaterialIcon
              name="arrow_forward"
              className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all text-lg"
            />
          </Link>

          <Link
            href="/showroom"
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-lg px-8 py-5 text-base font-bold text-white transition-all active:scale-[0.98]"
            style={{
              background: "rgba(16,22,34,0.6)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <MaterialIcon name="diamond" className="text-xl" />
            <span>Private Showroom</span>
            <MaterialIcon
              name="arrow_forward"
              className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all text-lg"
            />
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
          <span className="text-[10px] uppercase" style={{ letterSpacing: "0.3em" }}>
            Explore
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-[#1152d4] to-transparent" />
        </div>
      </main>

      {/* Bottom Nav — Pill Style */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 pt-4 max-w-md mx-auto">
        <div
          className="flex h-16 items-center justify-around rounded-full px-4 shadow-2xl"
          style={{
            background: "rgba(16,22,34,0.6)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Link href="/landing" className="flex flex-col items-center justify-center text-[#1152d4]">
            <MaterialIcon name="home" fill />
          </Link>
          <Link href="/inventory" className="flex flex-col items-center justify-center text-slate-400 hover:text-[#1152d4] transition-colors">
            <MaterialIcon name="directions_car" />
          </Link>
          <Link href="/showroom" className="flex flex-col items-center justify-center text-slate-400 hover:text-[#1152d4] transition-colors">
            <MaterialIcon name="search" />
          </Link>
          <Link href="/vip" className="flex flex-col items-center justify-center text-slate-400 hover:text-[#1152d4] transition-colors">
            <MaterialIcon name="verified_user" />
          </Link>
          <Link href="/login/buyer" className="flex flex-col items-center justify-center text-slate-400 hover:text-[#1152d4] transition-colors">
            <MaterialIcon name="account_circle" />
          </Link>
        </div>
      </nav>
    </div>
  );
}
