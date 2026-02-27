"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicles } from "@/lib/api";
import { useCompare } from "@/context/CompareContext";

/* Stitch: ai_technical_comparison — #ecc813, Space Grotesk, #121210 */

function buildSpecRow(
  label: string,
  leftRaw: string | number | null | undefined,
  rightRaw: string | number | null | undefined
) {
  const leftStr = leftRaw ? String(leftRaw) : "—";
  const rightStr = rightRaw ? String(rightRaw) : "—";

  // Parse for comparison (strip non-numeric chars)
  const leftNum = parseFloat(leftStr.replace(/[^0-9.]/g, "")) || 0;
  const rightNum = parseFloat(rightStr.replace(/[^0-9.]/g, "")) || 0;

  // Higher is better for power; lower is better for KM (less driven), same for mileage
  const higherIsBetter = ["POWER", "MILEAGE"].includes(label.toUpperCase());
  const winner = leftNum === rightNum ? "none" : higherIsBetter
    ? (leftNum > rightNum ? "left" : "right")
    : (leftNum < rightNum ? "left" : "right");

  const total = leftNum + rightNum || 100;
  const leftW = Math.round((leftNum / total) * 80) + 10;
  const rightW = Math.round((rightNum / total) * 80) + 10;

  return { label, left: leftStr, right: rightStr, leftW, rightW, winner };
}

export default function TechnicalComparisonPage() {
  const [tab, setTab] = useState<"specs" | "ai">("specs");
  const { compareIds } = useCompare();

  const { data, isLoading } = useApi(() => fetchVehicles({ limit: 100 }), []);
  const allVehicles = data?.vehicles ?? [];

  // Get the two vehicles to compare
  const carA = allVehicles.find((v) => v.id === compareIds[0]) ?? allVehicles[0];
  const carB = allVehicles.find((v) => v.id === compareIds[1]) ?? allVehicles[1];

  // Build specs from real data
  const specs = carA && carB ? [
    buildSpecRow("KM Driven", carA.km?.replace(/,/g, ""), carB.km?.replace(/,/g, "")),
    buildSpecRow("AI Score", carA.aiScore ?? 0, carB.aiScore ?? 0),
    buildSpecRow("Price (₹L)", carA.price / 100000, carB.price / 100000),
    buildSpecRow("Year", carA.year, carB.year),
  ] : [];

  const engineeringRows = carA && carB ? [
    { label: "Fuel Type", left: carA.fuel || "—", right: carB.fuel || "—" },
    { label: "Engine", left: carA.engine || "—", right: carB.engine || "—" },
    { label: "Transmission", left: carA.transmission || "—", right: carB.transmission || "—" },
    { label: "Power", left: carA.power || "—", right: carB.power || "—" },
  ] : [];

  // AI insight based on real data
  const aiInsight = carA && carB
    ? `The ${carA.name} ${carA.aiScore && carB.aiScore && carA.aiScore > carB.aiScore
        ? "has a higher AI score, making it our recommended pick"
        : "and " + carB.name + " are evenly matched"
      }. ${carA.km && carB.km && parseInt(carA.km.replace(/,/g, "")) < parseInt(carB.km.replace(/,/g, ""))
        ? carA.name + " has fewer kilometres driven, suggesting better longevity."
        : carB.name + " has fewer kilometres driven."
      }`
    : "Add vehicles to compare for an AI-powered insight.";

  const matchA = carA?.aiScore ? Math.min(99, carA.aiScore) : 88;
  const matchB = carB?.aiScore ? Math.min(99, carB.aiScore) : 75;

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
            <p className="text-[10px] text-slate-400 font-medium">AI Comparison Mode</p>
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
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 rounded-full border-2 border-[#ecc813]/30 border-t-[#ecc813] animate-spin" />
          </div>
        ) : (
          <>
            {/* Hero Comparison */}
            <div className="grid grid-cols-2 gap-[1px] relative" style={{ background: "#2d2d26" }}>
              {[
                { car: carA, label: "Base Vehicle", match: matchA },
                { car: carB, label: "Challenger", match: matchB },
              ].map(({ car, label, match }, idx) => (
                <div key={idx} className="bg-[#121210] p-4 flex flex-col items-center text-center">
                  <div className="w-full aspect-[4/3] rounded-lg overflow-hidden mb-3 bg-[#1c1c18] relative">
                    {car?.images[0] ? (
                      <Image src={car.images[0]} alt={car.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MaterialIcon name="directions_car" className="text-4xl text-slate-700" />
                      </div>
                    )}
                  </div>
                  <p className={`text-[10px] font-bold uppercase mb-1 ${idx === 0 ? "text-[#ecc813]" : "text-slate-400"}`}>{label}</p>
                  <h3 className="text-sm font-bold leading-tight">{car?.name ?? "Select Vehicle"}</h3>
                  <div className={`mt-2 inline-flex items-center px-2 py-1 rounded text-[10px] font-mono ${idx === 0 ? "bg-[#1c1c18] text-slate-300" : "bg-[#ecc813] text-[#121210] font-bold"}`}>
                    {match}% MATCH
                  </div>
                </div>
              ))}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 size-8 bg-[#ecc813] rounded-full flex items-center justify-center shadow-lg border-2 border-[#121210]">
                <span className="text-[10px] font-black text-[#121210] italic">VS</span>
              </div>
            </div>

            {tab === "specs" && (
              <>
                {/* Performance Benchmark */}
                <section className="mt-4 px-4">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-2">
                    <MaterialIcon name="precision_manufacturing" className="text-sm" />
                    Performance Benchmark
                  </h4>
                  <div className="space-y-4">
                    {specs.map((s) => (
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
                    {engineeringRows.map((e) => (
                      <div key={e.label} className="bg-[#1c1c18] p-3">
                        <p className="text-[9px] uppercase font-bold text-slate-500 mb-1">{e.label}</p>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            <div className="size-1.5 rounded-full bg-[#ecc813]" />
                            <span className="text-[11px] font-bold truncate">{e.left}</span>
                          </div>
                          <div className="flex items-center gap-1.5 opacity-50">
                            <div className="size-1.5 rounded-full bg-slate-400" />
                            <span className="text-[11px] font-medium truncate">{e.right}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {tab === "ai" && (
              <section className="mt-6 px-4 space-y-4">
                {/* Price comparison */}
                {carA && carB && (
                  <div className="rounded-xl p-4 border" style={{ background: "#1c1c18", borderColor: "#2d2d26" }}>
                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-3 tracking-widest">Price Analysis</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-slate-400">{carA.name}</p>
                        <p className="text-xl font-bold text-[#ecc813]">{carA.priceDisplay}</p>
                      </div>
                      <MaterialIcon name="compare_arrows" className="text-slate-600" />
                      <div className="text-right">
                        <p className="text-xs text-slate-400">{carB.name}</p>
                        <p className="text-xl font-bold text-slate-300">{carB.priceDisplay}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 italic">
                      {carA.price < carB.price
                        ? `${carA.name} is ₹${((carB.price - carA.price) / 100000).toFixed(1)}L cheaper`
                        : `${carB.name} is ₹${((carA.price - carB.price) / 100000).toFixed(1)}L cheaper`}
                    </p>
                  </div>
                )}
              </section>
            )}

            {/* AI Insight */}
            <section className="mt-8 px-4">
              <div className="bg-[#ecc813]/10 border border-[#ecc813]/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MaterialIcon name="auto_awesome" className="text-[#ecc813]" />
                  <h5 className="text-xs font-bold text-[#ecc813] uppercase tracking-wider">AI Match Insight</h5>
                </div>
                <p className="text-xs leading-relaxed text-slate-400">{aiInsight}</p>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Configure CTA */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-40 px-4">
        <Link
          href="/compare/studio"
          className="w-full bg-[#ecc813] text-[#121210] font-black uppercase text-xs tracking-[0.2em] py-4 rounded-lg shadow-[0_8px_30px_rgba(236,200,19,0.3)] flex items-center justify-center gap-2"
        >
          Full Comparison
          <MaterialIcon name="arrow_forward_ios" className="text-sm" />
        </Link>
      </div>

      {/* Bottom Nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 px-2 pb-6 pt-3 flex items-center justify-around max-w-md mx-auto border-t md:hidden"
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
        <Link href="/settings" className="flex flex-col items-center gap-1 text-slate-400">
          <MaterialIcon name="account_circle" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
