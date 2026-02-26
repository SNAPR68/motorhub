
import type React from "react";
import Link from "next/link";
import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/car-images";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicles, fetchDashboard } from "@/lib/api";

/* Stitch: ai_market_intelligence_hub_3 — #0dccf2, Manrope, #0a0a0a */

const AUCTION_RESULTS = [
  { name: "Honda City ZX CVT", sold: "₹11.2L", market: "₹12.8L", savings: "12.5%", date: "Feb 20" },
  { name: "Kia Seltos HTX+", sold: "₹13.5L", market: "₹15.1L", savings: "10.6%", date: "Feb 18" },
  { name: "MG Hector Sharp", sold: "₹14.8L", market: "₹16.5L", savings: "10.3%", date: "Feb 15" },
];

export default function IntelligenceAcquisitionsPage() {
  const { data: vehiclesData, isLoading } = useApi(
    () => fetchVehicles({ status: "AVAILABLE", limit: 6 }),
    []
  );
  const { data: dashData } = useApi(() => fetchDashboard(), []);

  const vehicles = vehiclesData?.vehicles ?? [];

  // Build acquisition opportunities from real available vehicles
  const opportunities = vehicles.slice(0, 3).map((v) => {
    const priceNum = v.price;
    const aiScore = v.aiScore ?? 75;
    // Buy price = ~88-92% of listing (estimated dealer acquisition cost)
    const buyPct = 0.88 + (aiScore / 1000);
    const buyPrice = Math.round(priceNum * buyPct);
    const marginPct = ((priceNum - buyPrice) / buyPrice * 100).toFixed(1);
    const confidence = Math.min(99, Math.max(70, aiScore));
    const formatL = (n: number) => `₹${(n / 100000).toFixed(1)}L`;

    return {
      id: v.id,
      name: v.name,
      image: v.images?.[0] ?? null,
      buyPrice: formatL(buyPrice),
      sellPrice: formatL(priceNum),
      margin: `${marginPct}%`,
      confidence,
      year: v.year,
      fuel: v.fuel,
    };
  });

  // Classic spotlight: oldest available vehicle
  const classicVehicle = [...vehicles].sort((a, b) => a.year - b.year)[0];
  const totalAvailable = vehiclesData?.total ?? vehicles.length;
  const hotLeads = (dashData?.stats as Record<string, unknown>)?.hotLeads as number | undefined;

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
        <div className="flex items-center gap-2">
          {hotLeads !== undefined && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">{hotLeads} HOT</span>
          )}
          <div className="size-10 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-slate-700" style={{ border: "2px solid rgba(13,204,242,0.3)" }}>AV</div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-8">
        {/* Market Summary */}
        <div className="grid grid-cols-2 gap-3 py-4">
          <div className="rounded-xl p-4" style={{ background: "rgba(13,204,242,0.05)", border: "1px solid rgba(13,204,242,0.1)" }}>
            <MaterialIcon name="inventory_2" className="text-lg mb-1" style={{ color: "#0dccf2" } } />
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Available</p>
            <p className="text-2xl font-extrabold" style={{ color: "#0dccf2" }}>{isLoading ? "—" : totalAvailable}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">In inventory</p>
          </div>
          <div className="rounded-xl p-4" style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.1)" }}>
            <MaterialIcon name="trending_up" className="text-emerald-400 text-lg mb-1" />
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Avg Margin</p>
            <p className="text-2xl font-extrabold text-emerald-400">
              {opportunities.length > 0
                ? `${(opportunities.reduce((s, o) => s + parseFloat(o.margin), 0) / opportunities.length).toFixed(1)}%`
                : "—"}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">Est. acquisition</p>
          </div>
        </div>

        {/* Top Opportunities */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#94a3b8] mb-4 flex items-center gap-2">
            <MaterialIcon name="trending_up" className="text-sm" style={{ color: "#0dccf2" } } /> Top Acquisition Opportunities
          </h2>

          {isLoading ? (
            <div className="space-y-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-xl h-28 animate-pulse" style={{ background: "rgba(22,27,29,1)" }} />
              ))}
            </div>
          ) : opportunities.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <MaterialIcon name="inventory_2" className="text-4xl mb-2" />
              <p className="text-sm">No vehicles available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {opportunities.map((opp) => (
                <Link key={opp.id} href={`/vehicle/${opp.id}`}
                  className="block rounded-xl overflow-hidden"
                  style={{ background: "linear-gradient(145deg, rgba(22,27,29,1) 0%, rgba(10,10,10,1) 100%)", border: "1px solid rgba(148,163,184,0.1)" }}>
                  <div className="flex gap-4 p-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-white/5 bg-slate-800">
                      {opp.image ? (
                        <Image src={opp.image} alt={opp.name} width={80} height={80} className="w-full h-full object-cover" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <MaterialIcon name="directions_car" className="text-3xl text-slate-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-white truncate">{opp.name}</h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">{opp.year} • {opp.fuel}</p>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase">Buy At</p>
                          <p className="text-sm font-bold text-emerald-400">{opp.buyPrice}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase">List At</p>
                          <p className="text-sm font-bold" style={{ color: "#0dccf2" }}>{opp.sellPrice}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                    <span className="text-xs font-bold text-emerald-400">+{opp.margin} est. margin</span>
                    <div className="flex items-center gap-1">
                      <MaterialIcon name="auto_awesome" className="text-xs" style={{ color: "#0dccf2" } } />
                      <span className="text-xs font-bold" style={{ color: "#0dccf2" }}>{opp.confidence}% AI score</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Market Reference Data */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#94a3b8] mb-4 flex items-center gap-2">
            <MaterialIcon name="gavel" className="text-sm" style={{ color: "#0dccf2" } } /> Recent Market Data
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
                  <p className="text-[10px] text-emerald-400 font-bold">{a.savings} below market</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Oldest Vehicle Spotlight */}
        {!isLoading && classicVehicle && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#94a3b8] mb-4 flex items-center gap-2">
              <MaterialIcon name="star" className="text-sm" style={{ color: "#0dccf2" } } /> Collector Spotlight
            </h2>
            <Link href={`/vehicle/${classicVehicle.id}`}
              className="block rounded-xl p-5 relative overflow-hidden"
              style={{ background: "linear-gradient(145deg, rgba(13,204,242,0.05) 0%, rgba(10,10,10,1) 100%)", border: "1px solid rgba(13,204,242,0.15)" }}>
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #0dccf2, transparent)" }} />
              <p className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: "#0dccf2" }}>
                {classicVehicle.year <= 2015 ? "Classic Asset" : "Featured Vehicle"}
              </p>
              <h3 className="text-xl font-bold text-white">{classicVehicle.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{classicVehicle.year} • {classicVehicle.fuel} • {classicVehicle.km}</p>
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-2xl font-extrabold" style={{ color: "#0dccf2" }}>{classicVehicle.priceDisplay}</span>
                {classicVehicle.aiScore && (
                  <span className="text-xs text-emerald-400 font-bold">AI Score: {classicVehicle.aiScore}</span>
                )}
              </div>
            </Link>
          </section>
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 pb-8 pt-2 px-6 flex justify-between items-center border-t md:hidden"
        style={{ background: "rgba(10,10,10,0.9)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.05)" }}>
        <Link href="/inventory" className="flex flex-col items-center gap-1">
          <MaterialIcon name="directions_car" className="text-[#94a3b8]" />
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#94a3b8]">Inventory</span>
        </Link>
        <Link href="/intelligence" className="flex flex-col items-center gap-1 relative">
          <div className="absolute -top-12 w-14 h-14 rounded-2xl flex items-center justify-center rotate-45"
            style={{ background: "#0dccf2", boxShadow: "0 8px 20px rgba(13,204,242,0.4)", border: "4px solid #0a0a0a" }}>
            <MaterialIcon name="query_stats" className="font-bold -rotate-45" style={{ color: "#0a0a0a" } } />
          </div>
          <span className="text-[10px] font-black tracking-widest uppercase mt-4" style={{ color: "#0dccf2" }}>Insights</span>
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
