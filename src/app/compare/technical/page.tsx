"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CRETA, SWIFT, BLUR_DATA_URL } from "@/lib/car-images";
import { MaterialIcon } from "@/components/MaterialIcon";

/* Stitch: ai_technical_comparison — #ecc813, Space Grotesk, #121210 */

const SPECS = [
  { label: "0-100 KM/H", left: "11.8s", right: "12.1s", leftW: 55, rightW: 50, winner: "left" },
  { label: "TOP SPEED", left: "190 km/h", right: "180 km/h", leftW: 55, rightW: 48, winner: "left" },
  { label: "POWER", left: "138 BHP", right: "121 BHP", leftW: 58, rightW: 45, winner: "left" },
  { label: "TORQUE", left: "250 Nm", right: "235 Nm", leftW: 52, rightW: 48, winner: "left" },
];

const ENGINEERING = [
  { label: "Aspiration", left: "Turbocharged", right: "Nat. Aspirated" },
  { label: "Configuration", left: "Inline-4", right: "Inline-4" },
];

export default function TechnicalComparisonPage() {
  const [tab, setTab] = useState<"specs" | "ai">("specs");

  return (
    <div
      className="min-h-dvh w-full flex flex-col max-w-md mx-auto text-slate-100"
      style={{ fontFamily: "'Space Grotesk', sans-serif", background: "#121210" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-30 border-b"
        style={{ background: "rgba(18,18,16,0.8)", backdropFilter: "blur(12px)", borderColor: "#2d2d26" }}
      >
        <div className="flex items-center justify-between p-4">
          <Link href="/compare" className="p-2 rounded-full hover:bg-white/5 transition-colors">
            <MaterialIcon name="arrow_back" />
          </Link>
          <div className="flex flex-col items-center">
            <h1 className="text-sm font-bold tracking-tight uppercase text-[#ecc813]">Technical Duel</h1>
            <p className="text-[10px] text-slate-400 font-medium">VIP Comparison Mode</p>
          </div>
          <button className="p-2 rounded-full hover:bg-white/5 transition-colors">
            <MaterialIcon name="share" />
          </button>
        </div>
        <div className="flex border-t" style={{ borderColor: "#2d2d26" }}>
          <button
            onClick={() => setTab("specs")}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest border-b-2 ${tab === "specs" ? "border-[#ecc813] text-[#ecc813]" : "border-transparent text-slate-400"}`}
          >
            Specs
          </button>
          <button
            onClick={() => setTab("ai")}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest border-b-2 ${tab === "ai" ? "border-[#ecc813] text-[#ecc813]" : "border-transparent text-slate-400"}`}
          >
            AI Analysis
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        {/* Hero Comparison */}
        <div className="grid grid-cols-2 gap-[1px] relative" style={{ background: "#2d2d26" }}>
          <div className="bg-[#121210] p-4 flex flex-col items-center text-center">
            <div className="w-full aspect-[4/3] rounded-lg overflow-hidden mb-3 bg-[#1c1c18]">
              <Image src={CRETA} alt="Hyundai Creta" fill={false} width={200} height={150} className="w-full h-full object-cover" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
            </div>
            <p className="text-[10px] font-bold text-[#ecc813] uppercase mb-1">Base Vehicle</p>
            <h3 className="text-sm font-bold leading-tight">Hyundai Creta SX(O)</h3>
            <div className="mt-2 inline-flex items-center px-2 py-1 bg-[#1c1c18] rounded text-[10px] font-mono">98% MATCH</div>
          </div>
          <div className="bg-[#121210] p-4 flex flex-col items-center text-center">
            <div className="w-full aspect-[4/3] rounded-lg overflow-hidden mb-3 bg-[#1c1c18] shadow-xl">
              <Image src={SWIFT} alt="Maruti Swift" fill={false} width={200} height={150} className="w-full h-full object-cover" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Challenger 1/4</p>
            <h3 className="text-sm font-bold leading-tight">Maruti Swift ZXi+</h3>
            <div className="mt-2 inline-flex items-center px-2 py-1 bg-[#ecc813] text-[#121210] rounded text-[10px] font-bold">94% MATCH</div>
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 size-8 bg-[#ecc813] rounded-full flex items-center justify-center shadow-lg border-2 border-[#121210]">
            <span className="text-[10px] font-black text-[#121210] italic">VS</span>
          </div>
        </div>

        {/* Performance Benchmark */}
        <section className="mt-4 px-4">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-2">
            <MaterialIcon name="precision_manufacturing" className="text-sm" />
            Performance Benchmark
          </h4>
          <div className="space-y-4">
            {SPECS.map((s) => (
              <div key={s.label}>
                <div className="flex justify-between items-end mb-1 px-1">
                  <span className={`text-xs font-bold ${s.winner === "left" ? "text-[#ecc813] italic" : "text-slate-400"}`}>{s.left}</span>
                  <span className="text-[10px] font-bold uppercase text-slate-500">{s.label}</span>
                  <span className={`text-xs font-bold ${s.winner === "right" ? "text-[#ecc813] italic" : "text-slate-400"}`}>{s.right}</span>
                </div>
                <div className="h-2 flex bg-[#1c1c18] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${s.winner === "left" ? "bg-[#ecc813]" : "bg-[#2d2d26]"}`} style={{ width: `${s.leftW}%` }} />
                  <div className={`h-full rounded-full ml-auto ${s.winner === "right" ? "bg-[#ecc813]" : "bg-[#2d2d26]"}`} style={{ width: `${s.rightW}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Engineering */}
        <section className="mt-8 px-4">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-2">
            <MaterialIcon name="settings_input_component" className="text-sm" />
            Engineering
          </h4>
          <div className="grid grid-cols-2 gap-px rounded-xl overflow-hidden border" style={{ background: "#2d2d26", borderColor: "#2d2d26" }}>
            {ENGINEERING.map((e) => (
              <div key={e.label} className="bg-[#1c1c18] p-3">
                <p className="text-[9px] uppercase font-bold text-slate-500 mb-1">{e.label}</p>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <div className="size-1.5 rounded-full bg-[#ecc813]" />
                    <span className="text-[11px] font-bold">{e.left}</span>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-50">
                    <div className="size-1.5 rounded-full bg-slate-400" />
                    <span className="text-[11px] font-medium">{e.right}</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="bg-[#1c1c18] p-3 col-span-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[9px] uppercase font-bold text-slate-500">Curb Weight</p>
                  <span className="text-xs font-bold text-[#ecc813] italic">1,365 kg</span>
                </div>
                <div className="h-6 w-px" style={{ background: "#2d2d26" }} />
                <div className="text-right">
                  <p className="text-[9px] uppercase font-bold text-slate-500">Curb Weight</p>
                  <span className="text-xs font-medium text-slate-400">890 kg</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Insight */}
        <section className="mt-8 px-4">
          <div className="bg-[#ecc813]/10 border border-[#ecc813]/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <MaterialIcon name="auto_awesome" className="text-[#ecc813]" />
              <h5 className="text-xs font-bold text-[#ecc813] uppercase tracking-wider">VIP Match Insight</h5>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              The <span className="text-[#ecc813] font-bold">Creta SX(O)</span> offers superior power and torque for highway cruising, while the <span className="text-slate-100 font-medium">Swift ZXi+</span> delivers better city fuel efficiency and lighter handling. For families, the Creta wins on space and features.
            </p>
          </div>
        </section>
      </main>

      {/* Configure CTA */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-40 px-4">
        <button className="w-full bg-[#ecc813] text-[#121210] font-black uppercase text-xs tracking-[0.2em] py-4 rounded-lg shadow-[0_8px_30px_rgba(236,200,19,0.3)] flex items-center justify-center gap-2">
          Configure Challenger
          <MaterialIcon name="arrow_forward_ios" className="text-sm" />
        </button>
      </div>

      {/* Bottom Nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 px-2 pb-6 pt-3 flex items-center justify-around max-w-md mx-auto border-t"
        style={{ background: "rgba(28,28,24,0.95)", backdropFilter: "blur(16px)", borderColor: "#2d2d26" }}
      >
        <Link href="/inventory" className="flex flex-col items-center gap-1 text-slate-400">
          <MaterialIcon name="directions_car" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Inventory</span>
        </Link>
        <Link href="/compare/technical" className="flex flex-col items-center gap-1 text-[#ecc813]">
          <MaterialIcon name="compare_arrows" fill />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Duel</span>
        </Link>
        <Link href="/showroom" className="flex flex-col items-center gap-1 text-slate-400">
          <MaterialIcon name="search" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Search</span>
        </Link>
        <Link href="/wishlist" className="flex flex-col items-center gap-1 text-slate-400">
          <MaterialIcon name="favorite" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Wishlist</span>
        </Link>
        <Link href="/login/buyer" className="flex flex-col items-center gap-1 text-slate-400">
          <MaterialIcon name="account_circle" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
