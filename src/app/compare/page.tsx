"use client";

import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useCompare } from "@/context/CompareContext";
import { COMPARISON_SPECS } from "@/lib/mock-data";
import type { Vehicle } from "@/lib/types";
import { BLUR_DATA_URL } from "@/lib/car-images";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicles, adaptVehicle } from "@/lib/api";

/* Stitch: premium_comparison_studio_1 — #1466b8, Newsreader, #050505 */

export default function ComparePage() {
  const { compareIds, removeFromCompare, clearCompare } = useCompare();
  const { data } = useApi(() => fetchVehicles({ limit: 100 }), []);
  const allVehicles = (data?.vehicles ?? []).map(adaptVehicle);

  const cars = compareIds
    .map((id) => allVehicles.find((v) => v.id === id))
    .filter(Boolean) as Vehicle[];

  const hasCars = cars.length >= 2;

  return (
    <div
      className="min-h-dvh w-full text-slate-100 antialiased selection:bg-[#1466b8]/30"
      style={{ fontFamily: "'Newsreader', serif", background: "#050505" }}
    >
      {/* Sticky Header */}
      <header
        className="sticky top-0 z-50 border-b border-white/5 px-4 py-3"
        style={{
          background: "rgba(5,5,5,0.8)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center justify-between max-w-lg mx-auto w-full">
          <Link
            href="/inventory"
            className="flex items-center justify-center size-10 rounded-full hover:bg-white/5 transition-colors"
          >
            <MaterialIcon name="arrow_back_ios_new" className="text-slate-100" />
          </Link>
          <div className="text-center">
            <h1 className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60">
              Autovinci
            </h1>
            <p className="text-sm italic text-slate-100">Comparison Studio</p>
          </div>
          <button className="flex items-center justify-center size-10 rounded-full hover:bg-white/5 transition-colors">
            <MaterialIcon name="ios_share" className="text-slate-100" />
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto pb-32">
        {/* Hero Comparison Section */}
        {hasCars ? (
          <section className="grid grid-cols-2 gap-px bg-white/10 p-px">
            {cars.slice(0, 2).map((car, i) => (
              <div
                key={car.id}
                className={`relative aspect-[3/5] overflow-hidden group ${
                  i === 1 ? "border-l border-white/10" : ""
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                <Image
                  className="object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                  src={car.image}
                  alt={car.name}
                  fill
                  sizes="50vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                />
                <button
                  onClick={() => removeFromCompare(car.id)}
                  className="absolute top-3 right-3 z-20 size-8 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-md"
                >
                  <MaterialIcon name="close" className="text-white text-sm" />
                </button>
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <span className="text-[10px] uppercase tracking-widest text-[#1466b8] font-bold">
                    {car.status === "available" ? "In Inventory" : "In Review"}
                  </span>
                  <h3 className="text-white text-xl leading-tight">
                    {car.year} {car.name}
                  </h3>
                  <p className="text-white/60 text-sm">{car.price}</p>
                </div>
              </div>
            ))}
          </section>
        ) : (
          /* Empty state */
          <div className="py-20 text-center px-6">
            <MaterialIcon
              name="compare_arrows"
              className="text-[48px] text-slate-600 mx-auto mb-4"
            />
            <h3 className="text-lg font-bold text-white mb-2">
              Add vehicles to compare
            </h3>
            <p className="text-sm text-slate-400 mb-6">
              Select at least 2 vehicles from inventory to see a side-by-side
              comparison with AI verdict.
            </p>
            <Link
              href="/inventory"
              className="inline-flex items-center gap-2 rounded-lg bg-[#1466b8] px-6 py-3 text-sm font-bold text-white"
            >
              Browse Inventory
            </Link>
          </div>
        )}

        {hasCars && (
          <>
            {/* Performance Metrics */}
            <section className="mt-8 px-6">
              <div className="flex items-center gap-2 mb-6">
                <MaterialIcon
                  name="speed"
                  className="text-[#1466b8] text-sm"
                />
                <h2 className="uppercase tracking-[0.2em] text-[10px] font-bold opacity-60">
                  Performance Metrics
                </h2>
              </div>
              <div className="space-y-8">
                {/* Mileage Row */}
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[#1466b8] text-2xl italic">
                      {cars[0].mileage}
                    </span>
                    <span className="text-xs uppercase tracking-widest opacity-40">
                      Mileage
                    </span>
                    <span className="text-slate-100 text-2xl italic">
                      {cars[1]?.mileage}
                    </span>
                  </div>
                  <div className="flex h-1 gap-4 items-center">
                    <div className="flex-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#1466b8] w-[75%] rounded-full" />
                    </div>
                    <div className="flex-1 bg-white/5 rounded-full overflow-hidden flex justify-end">
                      <div className="h-full bg-slate-400 w-[85%] rounded-full" />
                    </div>
                  </div>
                </div>
                {/* Power Row */}
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[#1466b8] text-2xl italic">
                      {cars[0].power}
                    </span>
                    <span className="text-xs uppercase tracking-widest opacity-40">
                      Power
                    </span>
                    <span className="text-slate-100 text-2xl italic">
                      {cars[1]?.power}
                    </span>
                  </div>
                  <div className="flex h-1 gap-4 items-center">
                    <div className="flex-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#1466b8] w-[60%] rounded-full" />
                    </div>
                    <div className="flex-1 bg-white/5 rounded-full overflow-hidden flex justify-end">
                      <div className="h-full bg-slate-400 w-full rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Investment Analysis */}
            <section className="mt-12 px-6">
              <div className="flex items-center gap-2 mb-6">
                <MaterialIcon
                  name="trending_up"
                  className="text-[#1466b8] text-sm"
                />
                <h2 className="uppercase tracking-[0.2em] text-[10px] font-bold opacity-60">
                  Investment Analysis
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {cars.slice(0, 2).map((car, i) => (
                  <div
                    key={car.id}
                    className="bg-white/5 rounded-xl p-5 border border-white/5 flex flex-col items-center text-center"
                  >
                    <div className="relative size-20 flex items-center justify-center mb-3">
                      <svg className="absolute inset-0 size-full -rotate-90">
                        <circle
                          className="text-white/10"
                          cx="40"
                          cy="40"
                          fill="transparent"
                          r="36"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <circle
                          className={
                            i === 0 ? "text-[#1466b8]" : "text-[#c0c0c0]"
                          }
                          cx="40"
                          cy="40"
                          fill="transparent"
                          r="36"
                          stroke="currentColor"
                          strokeDasharray="226"
                          strokeDashoffset={
                            226 - (226 * car.aiScore) / 100
                          }
                          strokeWidth="2"
                        />
                      </svg>
                      <span className="text-xl italic text-slate-100">
                        {car.aiScore}%
                      </span>
                    </div>
                    <p
                      className={`text-[10px] uppercase tracking-widest font-bold mb-1 ${
                        i === 0 ? "text-[#1466b8]" : "text-[#c0c0c0]"
                      }`}
                    >
                      AI Score
                    </p>
                    <p className="text-xs text-slate-400">Market Stability</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Detailed Specifications */}
            <section className="mt-12">
              <div className="px-6 flex items-center gap-2 mb-4">
                <MaterialIcon
                  name="list_alt"
                  className="text-[#1466b8] text-sm"
                />
                <h2 className="uppercase tracking-[0.2em] text-[10px] font-bold opacity-60">
                  Detailed Specifications
                </h2>
              </div>
              <div className="divide-y divide-white/5 border-t border-b border-white/5">
                {COMPARISON_SPECS.map((spec, i) => (
                  <div
                    key={spec.key}
                    className={`grid grid-cols-2 gap-px py-4 px-6 ${
                      i % 2 === 0 ? "bg-white/5" : ""
                    }`}
                  >
                    <div className="pr-4 border-r border-white/10">
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">
                        {spec.label}
                      </p>
                      <p className="text-sm text-slate-200">
                        {String(
                          cars[0][spec.key as keyof Vehicle] ?? "—"
                        )}
                      </p>
                    </div>
                    <div className="pl-4">
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">
                        {spec.label}
                      </p>
                      <p className="text-sm text-slate-200">
                        {String(
                          cars[1]?.[spec.key as keyof Vehicle] ?? "—"
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Floating AI Button & Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] max-w-lg mx-auto">
        {hasCars && (
          <div className="flex justify-center mb-4">
            <Link
              href="/concierge"
              className="flex items-center gap-3 px-6 py-4 rounded-full bg-[#1466b8]/20 hover:bg-[#1466b8]/30 border border-[#1466b8]/40 backdrop-blur-xl group transition-all duration-300"
            >
              <MaterialIcon
                name="auto_awesome"
                className="text-[#1466b8] group-hover:scale-110 transition-transform"
              />
              <span className="text-sm font-bold tracking-wide text-slate-100">
                Ask AI Concierge for Advice
              </span>
            </Link>
          </div>
        )}
        <nav
          className="border-t border-white/10 px-6 py-2"
          style={{
            background: "rgba(5,5,5,0.8)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="flex justify-between items-center max-w-lg mx-auto">
            <Link
              href="/inventory"
              className="flex flex-col items-center gap-1 py-1 text-slate-400"
            >
              <MaterialIcon name="garage" className="text-[24px]" />
              <span className="text-[10px] uppercase tracking-widest font-bold">
                Inventory
              </span>
            </Link>
            <Link
              href="/compare"
              className="flex flex-col items-center gap-1 py-1 text-[#1466b8]"
            >
              <MaterialIcon
                name="compare_arrows"
                fill
                className="text-[24px]"
              />
              <span className="text-[10px] uppercase tracking-widest font-bold">
                Compare
              </span>
            </Link>
            <Link
              href="/dashboard"
              className="flex flex-col items-center gap-1 py-1 text-slate-400"
            >
              <MaterialIcon name="monitoring" className="text-[24px]" />
              <span className="text-[10px] uppercase tracking-widest font-bold">
                Insights
              </span>
            </Link>
            <Link
              href="/wishlist"
              className="flex flex-col items-center gap-1 py-1 text-slate-400"
            >
              <MaterialIcon name="favorite" className="text-[24px]" />
              <span className="text-[10px] uppercase tracking-widest font-bold">
                Saved
              </span>
            </Link>
            <Link
              href="/login/buyer"
              className="flex flex-col items-center gap-1 py-1 text-slate-400"
            >
              <MaterialIcon name="account_circle" className="text-[24px]" />
              <span className="text-[10px] uppercase tracking-widest font-bold">
                Profile
              </span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
