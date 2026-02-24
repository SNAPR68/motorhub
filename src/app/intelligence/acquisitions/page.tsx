"use client";

import Link from "next/link";
import Image from "next/image";
import { CRETA, SWIFT, NEXON, BLUR_DATA_URL } from "@/lib/car-images";
import { MaterialIcon } from "@/components/MaterialIcon";

/* Stitch: ai_market_intelligence_hub_3 — #0dccf2, Manrope, #0a0a0a */

const OPPORTUNITIES = [
  { name: "2023 Hyundai Creta SX", image: CRETA, buyPrice: "₹12.8L", sellPrice: "₹14.5L", margin: "13.3%", confidence: 94 },
  { name: "2022 Maruti Swift ZXi+", image: SWIFT, buyPrice: "₹6.2L", sellPrice: "₹7.8L", margin: "25.8%", confidence: 88 },
  { name: "2023 Tata Nexon EV Max", image: NEXON, buyPrice: "₹14.1L", sellPrice: "₹16.2L", margin: "14.9%", confidence: 91 },
];

const AUCTION_RESULTS = [
  { name: "Honda City ZX CVT", sold: "₹11.2L", market: "₹12.8L", savings: "12.5%", date: "Feb 20" },
  { name: "Kia Seltos HTX+", sold: "₹13.5L", market: "₹15.1L", savings: "10.6%", date: "Feb 18" },
  { name: "MG Hector Sharp", sold: "₹14.8L", market: "₹16.5L", savings: "10.3%", date: "Feb 15" },
];

export default function IntelligenceAcquisitionsPage() {
  return (
    <div
      className="min-h-dvh w-full flex flex-col max-w-md mx-auto text-slate-100 pb-24"
      style={{ fontFamily: "'Manrope', sans-serif", background: "#0a0a0a" }}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-4 flex items-center justify-between border-b"
        style={{ background: "rgba(10,10,10,0.8)", backdropFilter: "blur(12px)", borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-3">
          <Link href="/intelligence" className="p-1"><MaterialIcon name="arrow_back" className="text-slate-400" /></Link>
          <h1 className="text-lg font-extrabold tracking-tight">
            <span style={{ color: "#0dccf2" }}>Acquisition</span> Intel
          </h1>
        </div>
        <div className="size-10 rounded-full p-0.5 flex items-center justify-center" style={{ border: "2px solid rgba(13,204,242,0.3)" }}>
          <div className="w-full h-full rounded-full bg-slate-600 flex items-center justify-center text-[10px] font-bold text-white">AV</div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-8">
        {/* Top Opportunities */}
        <section className="py-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#94a3b8] mb-4 flex items-center gap-2">
            <MaterialIcon name="trending_up" className="text-sm text-[#0dccf2]" /> Top Acquisition Opportunities
          </h2>
          <div className="space-y-4">
            {OPPORTUNITIES.map((opp) => (
              <div key={opp.name} className="rounded-xl overflow-hidden"
                style={{ background: "linear-gradient(145deg, rgba(22,27,29,1) 0%, rgba(10,10,10,1) 100%)", border: "1px solid rgba(148,163,184,0.1)" }}>
                <div className="flex gap-4 p-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-white/5">
                    <Image src={opp.image} alt={opp.name} width={80} height={80} className="w-full h-full object-cover" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-white">{opp.name}</h3>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase">Buy At</p>
                        <p className="text-sm font-bold text-[#10b981]">{opp.buyPrice}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase">Sell At</p>
                        <p className="text-sm font-bold text-[#0dccf2]">{opp.sellPrice}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#10b981]">+{opp.margin} margin</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MaterialIcon name="auto_awesome" className="text-xs text-[#0dccf2]" />
                    <span className="text-xs font-bold text-[#0dccf2]">{opp.confidence}% confidence</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Auction Results */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#94a3b8] mb-4 flex items-center gap-2">
            <MaterialIcon name="gavel" className="text-sm text-[#0dccf2]" /> Recent Auction Results
          </h2>
          <div className="rounded-xl overflow-hidden border" style={{ borderColor: "rgba(148,163,184,0.1)" }}>
            {AUCTION_RESULTS.map((a, i) => (
              <div key={a.name} className="flex items-center justify-between p-4"
                style={{ background: i % 2 === 0 ? "rgba(22,27,29,0.5)" : "rgba(10,10,10,1)", borderBottom: i < AUCTION_RESULTS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                <div>
                  <h4 className="text-sm font-bold text-white">{a.name}</h4>
                  <p className="text-[10px] text-slate-500">{a.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: "#0dccf2" }}>{a.sold}</p>
                  <p className="text-[10px] text-[#10b981] font-bold">{a.savings} below market</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Classic Car Spotlight */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#94a3b8] mb-4 flex items-center gap-2">
            <MaterialIcon name="star" className="text-sm text-[#0dccf2]" /> Classic Spotlight
          </h2>
          <div className="rounded-xl p-5 relative overflow-hidden"
            style={{ background: "linear-gradient(145deg, rgba(13,204,242,0.05) 0%, rgba(10,10,10,1) 100%)", border: "1px solid rgba(13,204,242,0.15)" }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #0dccf2, transparent)" }} />
            <p className="text-[10px] uppercase tracking-widest text-[#0dccf2] font-bold mb-2">Appreciating Asset</p>
            <h3 className="text-xl font-bold text-white">1998 Maruti 800 DX</h3>
            <p className="text-xs text-slate-400 mt-1">First-gen classic • Low production numbers • Collector interest rising</p>
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-2xl font-extrabold text-[#0dccf2]">₹3.5L</span>
              <span className="text-xs text-[#10b981] font-bold">+45% YoY appreciation</span>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Nav — same as intelligence */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 pb-8 pt-2 px-6 flex justify-between items-center border-t"
        style={{ background: "rgba(10,10,10,0.9)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.05)" }}>
        <Link href="/inventory" className="flex flex-col items-center gap-1">
          <MaterialIcon name="directions_car" className="text-[#94a3b8]" />
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#94a3b8]">Inventory</span>
        </Link>
        <Link href="/intelligence" className="flex flex-col items-center gap-1 relative">
          <div className="absolute -top-12 w-14 h-14 rounded-2xl flex items-center justify-center rotate-45"
            style={{ background: "#0dccf2", boxShadow: "0 8px 20px rgba(13,204,242,0.4)", border: "4px solid #0a0a0a" }}>
            <MaterialIcon name="query_stats" className="text-[#0a0a0a] font-bold -rotate-45" />
          </div>
          <span className="text-[10px] font-black tracking-widest uppercase mt-4 text-[#0dccf2]">Insights</span>
        </Link>
        <Link href="/reports/monthly" className="flex flex-col items-center gap-1">
          <MaterialIcon name="description" className="text-[#94a3b8]" />
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#94a3b8]">Reports</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center gap-1">
          <MaterialIcon name="account_circle" className="text-[#94a3b8]" />
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#94a3b8]">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
