"use client";

import Link from "next/link";
import Image from "next/image";
import { CRETA, NEXON, BLUR_DATA_URL } from "@/lib/car-images";
import { MaterialIcon } from "@/components/MaterialIcon";

/* Stitch: premium_comparison_studio_2 — #1269e2, Space Grotesk, #0a0c10 */

const PERF_SPECS = [
  { label: "Engine Output", left: "138 BHP", right: "168 BHP", leftW: 78, rightW: 100, winner: "right" },
  { label: "0-100 KM/H", left: "11.8s", right: "9.2s", leftW: 70, rightW: 90, winner: "right" },
  { label: "Max Torque", left: "250 Nm", right: "350 Nm", leftW: 72, rightW: 100, winner: "right" },
];

export default function CompareStudioV2Page() {
  return (
    <div
      className="min-h-dvh w-full flex flex-col max-w-md mx-auto text-slate-100 overflow-x-hidden"
      style={{ fontFamily: "'Space Grotesk', sans-serif", background: "#0a0c10" }}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0c10]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between px-4 h-16">
          <Link href="/compare" className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <MaterialIcon name="arrow_back" className="text-slate-100" />
          </Link>
          <div className="text-center">
            <h1 className="text-sm font-light tracking-[0.3em] uppercase text-[#1269e2]">Autovinci</h1>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Technical Duel</p>
          </div>
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <MaterialIcon name="share" className="text-slate-100" />
          </button>
        </div>
      </header>

      <main className="flex-1 pb-24">
        {/* Dual Hero */}
        <div className="flex w-full h-72 border-b border-white/10 relative">
          <div className="w-1/2 relative overflow-hidden border-r border-white/5 group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-transparent to-transparent z-10" />
            <Image src={CRETA} alt="Hyundai Creta" fill className="object-cover scale-110 group-hover:scale-100 transition-transform duration-700" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
            <div className="absolute bottom-4 left-4 z-20">
              <p className="text-[10px] uppercase tracking-widest text-[#1269e2] font-bold">Challenger A</p>
              <h2 className="text-lg font-bold leading-none">Creta SX(O)</h2>
            </div>
          </div>
          <div className="w-1/2 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-transparent to-transparent z-10" />
            <Image src={NEXON} alt="Tata Nexon EV" fill className="object-cover scale-110 group-hover:scale-100 transition-transform duration-700" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
            <div className="absolute bottom-4 right-4 z-20 text-right">
              <p className="text-[10px] uppercase tracking-widest text-[#1269e2] font-bold">Challenger B</p>
              <h2 className="text-lg font-bold leading-none">Nexon EV Max</h2>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
            <div className="size-12 rounded-full bg-[#0a0c10] border border-white/20 flex items-center justify-center backdrop-blur-md">
              <span className="text-xs font-bold tracking-tighter italic">VS</span>
            </div>
          </div>
        </div>

        {/* AI Match Scoring */}
        <div className="grid grid-cols-2 gap-px bg-white/5 border-b border-white/5">
          <div className="bg-[#0a0c10] p-6 flex flex-col items-center justify-center space-y-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">AI Compatibility</p>
            <div className="text-4xl font-light text-[#1269e2]">98<span className="text-xl">%</span></div>
            <div className="flex items-center gap-1 text-[10px] text-[#0bda5e]">
              <MaterialIcon name="trending_up" className="text-xs" /> +2.4% Match
            </div>
          </div>
          <div className="bg-[#0a0c10] p-6 flex flex-col items-center justify-center space-y-2 border-l border-white/5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">AI Compatibility</p>
            <div className="text-4xl font-light text-white/40">94<span className="text-xl">%</span></div>
            <div className="flex items-center gap-1 text-[10px] text-slate-500">
              <MaterialIcon name="remove" className="text-xs" /> Neutral
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="px-4 py-8 space-y-10">
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-slate-500">Performance Metrics</h3>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            {PERF_SPECS.map((s) => (
              <div key={s.label} className="space-y-3">
                <div className="flex justify-between items-end text-xs uppercase tracking-widest">
                  <span className={`font-bold ${s.winner === "left" ? "text-[#1269e2]" : ""}`}>{s.left}</span>
                  <span className="text-slate-500 font-medium">{s.label}</span>
                  <span className={`font-bold ${s.winner === "right" ? "text-[#1269e2]" : ""}`}>{s.right}</span>
                </div>
                <div className="flex h-1 gap-1">
                  <div className="flex-1 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${s.winner === "left" ? "bg-[#1269e2]" : "bg-slate-500"}`} style={{ width: `${s.leftW}%` }} />
                  </div>
                  <div className="flex-1 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${s.winner === "right" ? "bg-[#1269e2]" : "bg-slate-500"}`} style={{ width: `${s.rightW}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Autonomous & Cockpit */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-slate-500">Autonomous & Cockpit</h3>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <MaterialIcon name="neurology" className="text-[#1269e2] mb-2" />
                <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Powertrain</p>
                <p className="text-xs font-bold uppercase">1.5L Turbo ICE</p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <MaterialIcon name="rocket_launch" className="text-[#1269e2] mb-2" />
                <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">Powertrain</p>
                <p className="text-xs font-bold uppercase">40.5 kWh EV</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Floating CTA */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-xs z-40">
        <button className="w-full bg-slate-100 text-slate-950 py-4 rounded-full font-bold uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-white transition-all shadow-2xl">
          Inquire Technical Data
          <MaterialIcon name="arrow_right_alt" className="text-sm" />
        </button>
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0c10]/95 backdrop-blur-xl border-t border-white/10 px-6 pb-6 pt-3 max-w-md mx-auto">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex flex-col items-center gap-1 text-slate-500">
            <MaterialIcon name="home" />
            <span className="text-[9px] uppercase tracking-widest font-bold">Studio</span>
          </Link>
          <Link href="/compare/studio" className="flex flex-col items-center gap-1 text-[#1269e2]">
            <MaterialIcon name="compare_arrows" fill />
            <span className="text-[9px] uppercase tracking-widest font-bold">Duel</span>
          </Link>
          <Link href="/concierge" className="relative -top-6">
            <div className="bg-[#1269e2] size-14 rounded-full flex items-center justify-center shadow-lg shadow-[#1269e2]/20 border-4 border-[#0a0c10]">
              <MaterialIcon name="smart_toy" className="text-white text-3xl" />
            </div>
          </Link>
          <Link href="/wishlist" className="flex flex-col items-center gap-1 text-slate-500">
            <MaterialIcon name="favorite" />
            <span className="text-[9px] uppercase tracking-widest font-bold">Vault</span>
          </Link>
          <Link href="/login/buyer" className="flex flex-col items-center gap-1 text-slate-500">
            <MaterialIcon name="person" />
            <span className="text-[9px] uppercase tracking-widest font-bold">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
