"use client";

import Link from "next/link";
import Image from "next/image";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useCompare } from "@/context/CompareContext";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicles, adaptVehicle } from "@/lib/api";
import type { Vehicle } from "@/lib/types";
import { BLUR_DATA_URL } from "@/lib/car-images";

/* Stitch: premium_comparison_studio_2 — #1269e2, Space Grotesk, #0a0c10 */

interface PerfSpec {
  label: string;
  left: string;
  right: string;
  leftW: number;
  rightW: number;
  winner: "left" | "right" | "tie";
}

function buildPerfSpecs(a: Vehicle, b: Vehicle): PerfSpec[] {
  const parseKm = (s: string) => parseInt(s.replace(/,/g, ""), 10) || 0;
  const aKm = parseKm(a.km);
  const bKm = parseKm(b.km);
  const maxKm = Math.max(aKm, bKm) || 1;

  const aScore = a.aiScore;
  const bScore = b.aiScore;

  return [
    {
      label: "KM Driven",
      left: a.km,
      right: b.km,
      // lower km is better — invert bar
      leftW: Math.round((1 - aKm / maxKm) * 100) + 10,
      rightW: Math.round((1 - bKm / maxKm) * 100) + 10,
      winner: aKm < bKm ? "left" : bKm < aKm ? "right" : "tie",
    },
    {
      label: "AI Score",
      left: `${aScore}%`,
      right: `${bScore}%`,
      leftW: aScore,
      rightW: bScore,
      winner: aScore > bScore ? "left" : bScore > aScore ? "right" : "tie",
    },
    {
      label: "Price",
      left: a.price,
      right: b.price,
      leftW: Math.round((b.priceNumeric / (Math.max(a.priceNumeric, b.priceNumeric) || 1)) * 100),
      rightW: Math.round((a.priceNumeric / (Math.max(a.priceNumeric, b.priceNumeric) || 1)) * 100),
      winner: a.priceNumeric < b.priceNumeric ? "left" : b.priceNumeric < a.priceNumeric ? "right" : "tie",
    },
  ];
}

export default function CompareStudioV2Page() {
  const { compareIds } = useCompare();
  const { data, isLoading } = useApi(() => fetchVehicles({ limit: 100 }), []);
  const allVehicles = (data?.vehicles ?? []).map(adaptVehicle);

  const cars = compareIds
    .map((id) => allVehicles.find((v) => v.id === id))
    .filter(Boolean) as Vehicle[];

  const carA = cars[0];
  const carB = cars[1];
  const hasBoth = !!(carA && carB);

  const perfSpecs = hasBoth ? buildPerfSpecs(carA, carB) : [];

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
        {isLoading && (
          <div className="flex items-center justify-center py-32">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-[#1269e2] border-t-transparent animate-spin" />
              <span className="text-xs text-slate-400 uppercase tracking-widest">Loading vehicles...</span>
            </div>
          </div>
        )}

        {!isLoading && !hasBoth && (
          <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
            <MaterialIcon name="compare_arrows" className="text-[48px] text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No cars selected</h3>
            <p className="text-sm text-slate-400 mb-6">
              Select at least 2 vehicles from inventory to start your Technical Duel.
            </p>
            <Link
              href="/inventory"
              className="inline-flex items-center gap-2 rounded-full bg-[#1269e2] px-6 py-3 text-sm font-bold text-white"
            >
              Browse Inventory
            </Link>
          </div>
        )}

        {!isLoading && hasBoth && (
          <>
            {/* Dual Hero */}
            <div className="flex w-full h-72 border-b border-white/10 relative">
              <div className="w-1/2 relative overflow-hidden border-r border-white/5 group">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-transparent to-transparent z-10" />
                {carA.image ? (
                  <Image
                    src={carA.image}
                    alt={carA.name}
                    fill
                    className="object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                  />
                ) : (
                  <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                    <MaterialIcon name="directions_car" className="text-[48px] text-slate-600" />
                  </div>
                )}
                <div className="absolute bottom-4 left-4 z-20">
                  <p className="text-[10px] uppercase tracking-widest text-[#1269e2] font-bold">Challenger A</p>
                  <h2 className="text-base font-bold leading-tight">{carA.name}</h2>
                  <p className="text-[10px] text-slate-400">{carA.year}</p>
                </div>
              </div>
              <div className="w-1/2 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-transparent to-transparent z-10" />
                {carB.image ? (
                  <Image
                    src={carB.image}
                    alt={carB.name}
                    fill
                    className="object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                  />
                ) : (
                  <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                    <MaterialIcon name="directions_car" className="text-[48px] text-slate-600" />
                  </div>
                )}
                <div className="absolute bottom-4 right-4 z-20 text-right">
                  <p className="text-[10px] uppercase tracking-widest text-[#1269e2] font-bold">Challenger B</p>
                  <h2 className="text-base font-bold leading-tight">{carB.name}</h2>
                  <p className="text-[10px] text-slate-400">{carB.year}</p>
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
              {[carA, carB].map((car, i) => (
                <div
                  key={car.id}
                  className={`bg-[#0a0c10] p-6 flex flex-col items-center justify-center space-y-2 ${i === 1 ? "border-l border-white/5" : ""}`}
                >
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">AI Score</p>
                  <div className={`text-4xl font-light ${i === 0 ? "text-[#1269e2]" : "text-white/40"}`}>
                    {car.aiScore}<span className="text-xl">%</span>
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] ${car.aiScore >= 90 ? "text-[#0bda5e]" : "text-slate-500"}`}>
                    <MaterialIcon name={car.aiScore >= 90 ? "trending_up" : "remove"} className="text-xs" />
                    {car.aiScore >= 90 ? "High Match" : "Neutral"}
                  </div>
                </div>
              ))}
            </div>

            {/* Performance Metrics */}
            <div className="px-4 py-8 space-y-10">
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/10" />
                  <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-slate-500">Key Metrics</h3>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                {perfSpecs.map((s) => (
                  <div key={s.label} className="space-y-3">
                    <div className="flex justify-between items-end text-xs uppercase tracking-widest">
                      <span className={`font-bold ${s.winner === "left" ? "text-[#1269e2]" : "text-slate-300"}`}>{s.left}</span>
                      <span className="text-slate-500 font-medium">{s.label}</span>
                      <span className={`font-bold ${s.winner === "right" ? "text-[#1269e2]" : "text-slate-300"}`}>{s.right}</span>
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

              {/* Specs Grid */}
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/10" />
                  <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-slate-500">Powertrain & Details</h3>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: "neurology", label: "Fuel", aVal: carA.fuel, bVal: carB.fuel },
                    { icon: "settings", label: "Transmission", aVal: carA.transmission, bVal: carB.transmission },
                    { icon: "bolt", label: "Power", aVal: carA.power || "—", bVal: carB.power || "—" },
                    { icon: "local_gas_station", label: "Mileage", aVal: carA.mileage || "—", bVal: carB.mileage || "—" },
                  ].map((row) => (
                    <div key={row.label} className="col-span-2 grid grid-cols-2 gap-2">
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <MaterialIcon name={row.icon} className="text-[#1269e2] mb-1 text-sm" />
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-0.5">{row.label}</p>
                        <p className="text-xs font-bold uppercase truncate">{row.aVal}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                        <MaterialIcon name={row.icon} className="text-slate-500 mb-1 text-sm" />
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-0.5">{row.label}</p>
                        <p className="text-xs font-bold uppercase truncate">{row.bVal}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Location & Owner */}
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/10" />
                  <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-slate-500">Ownership</h3>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs text-slate-400 mb-1">Owner</p>
                    <p className="font-bold text-sm">{carA.owner}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{carA.location}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs text-slate-400 mb-1">Owner</p>
                    <p className="font-bold text-sm">{carB.owner}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{carB.location}</p>
                  </div>
                </div>
              </section>
            </div>
          </>
        )}
      </main>

      {/* Floating CTA */}
      {hasBoth && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-xs z-40">
          <Link
            href="/concierge"
            className="w-full bg-slate-100 text-slate-950 py-4 rounded-full font-bold uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-white transition-all shadow-2xl"
          >
            Ask AI Concierge
            <MaterialIcon name="arrow_right_alt" className="text-sm" />
          </Link>
        </div>
      )}

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
