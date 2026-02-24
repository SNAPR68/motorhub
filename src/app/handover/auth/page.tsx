"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { INTERIOR } from "@/lib/car-images";

/* Stitch: digital_handover_experience_2 — #7311d4, Work Sans, #050505, gold: #d4af37 */

export default function HandoverAuthPage() {
  return (
    <div
      className="relative flex min-h-dvh w-full flex-col max-w-[430px] mx-auto text-slate-100 antialiased overflow-x-hidden"
      style={{ fontFamily: "'Work Sans', sans-serif", background: "#050505" }}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#050505]/80 backdrop-blur-md">
        <Link href="/handover" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <MaterialIcon name="arrow_back_ios_new" className="text-sm" />
        </Link>
        <span className="text-[#d4af37] font-bold tracking-widest text-xs uppercase">Autovinci</span>
        <button className="text-slate-400 hover:text-white transition-opacity">
          <MaterialIcon name="more_vert" />
        </button>
      </header>

      {/* Cinematic Hero */}
      <section className="relative w-full aspect-[9/14] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('${INTERIOR}')`, filter: "brightness(0.4)" }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-8 text-center">
          {/* Authenticating Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)" }}>
            <div className="size-2 rounded-full bg-[#d4af37] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4af37]">Authenticating</span>
          </div>

          <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            2023 Hyundai Creta
          </h1>
          <p className="text-sm text-slate-400 tracking-widest uppercase">SX(O) Turbo • Knight Edition</p>

          <div className="mt-4 px-4 py-2 rounded-lg bg-black/40 border border-white/5">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-0.5">Vehicle Identification</p>
            <p className="text-xs font-mono text-slate-300 tracking-widest">MALA51CF1KH032847</p>
          </div>

          <p className="text-lg text-[#d4af37] italic mt-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            &ldquo;Your masterpiece awaits.&rdquo;
          </p>
        </div>
      </section>

      {/* Ownership Certificate */}
      <section className="px-6 -mt-20 relative z-30">
        <div
          className="rounded-xl p-[1px] shadow-2xl"
          style={{ background: "linear-gradient(135deg, #d4af37 0%, #fff 50%, #d4af37 100%)" }}
        >
          <div className="bg-[#141414] rounded-[11px] p-6 flex flex-col items-center text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] border border-[#d4af37]/20">
              <MaterialIcon name="verified_user" className="text-4xl" />
            </div>

            <div>
              <h2 className="text-[#d4af37] tracking-widest text-xs uppercase font-semibold">Ownership Certificate</h2>
              <h3 className="text-xl text-white mt-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                Certified to Rajesh Kumar
              </h3>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />

            <div className="grid grid-cols-2 gap-6 w-full">
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Issue Date</p>
                <p className="text-sm font-medium text-slate-200">Feb 24, 2026</p>
              </div>
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Certificate ID</p>
                <p className="text-sm font-medium text-slate-200 font-mono">AV-2026-04821</p>
              </div>
            </div>

            {/* AI Authentication Progress */}
            <div className="w-full">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] uppercase tracking-wider text-slate-500">AI Authentication Seal</span>
                <span className="text-xs font-bold text-[#d4af37]">98%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/5">
                <div className="h-full w-[98%] rounded-full bg-gradient-to-r from-[#d4af37] to-[#f0d55c]" />
              </div>
            </div>

            <button className="text-[#d4af37] text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:underline">
              View Smart Contract <MaterialIcon name="open_in_new" className="text-xs" />
            </button>
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="px-6 pt-8 pb-32 space-y-3">
        <button className="w-full bg-[#d4af37] text-[#050505] py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#d4af37]/20 active:scale-[0.98] transition-transform">
          <MaterialIcon name="calendar_month" /> Schedule Delivery
        </button>
        <button className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 text-white"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <MaterialIcon name="support_agent" /> Meet Your Concierge
        </button>
      </section>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 border-t border-white/5 bg-[#141414]/95 backdrop-blur-xl px-6 pb-6 pt-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex flex-col items-center gap-1 text-slate-500">
            <MaterialIcon name="home" className="text-2xl" />
            <span className="text-[10px] font-medium uppercase">Home</span>
          </Link>
          <Link href="/showroom" className="flex flex-col items-center gap-1 text-slate-500">
            <MaterialIcon name="directions_car" className="text-2xl" />
            <span className="text-[10px] font-medium uppercase">Cars</span>
          </Link>
          <Link href="/handover/auth" className="flex flex-col items-center gap-1 text-[#d4af37]">
            <MaterialIcon name="verified_user" fill className="text-2xl" />
            <span className="text-[10px] font-medium uppercase">Auth</span>
          </Link>
          <Link href="/login/buyer" className="flex flex-col items-center gap-1 text-slate-500">
            <MaterialIcon name="person" className="text-2xl" />
            <span className="text-[10px] font-medium uppercase">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
