"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicle, adaptVehicle } from "@/lib/api";
import { formatEmi, calcEmi } from "@/lib/car-catalog";

/* ─── Used Car Detail Page ─── */

const TABS = ["Overview", "Specs", "EMI"] as const;

export default function UsedCarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading: loading } = useApi(() => fetchVehicle(id), [id]);
  const vehicle = data?.vehicle ? adaptVehicle(data.vehicle) : null;

  const [activeTab, setActiveTab] = useState<typeof TABS[number]>("Overview");
  const [activeImg, setActiveImg] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

  // EMI state
  const [loanAmt, setLoanAmt] = useState(0);
  const [downPct, setDownPct] = useState(20);
  const [tenure, setTenure] = useState(84);
  const [rate, setRate] = useState(9);

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: "#080a0f" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <p className="text-slate-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: "#080a0f" }}>
        <div className="text-center">
          <MaterialIcon name="search_off" className="text-[48px] text-slate-700 mb-3" />
          <p className="text-slate-400 font-semibold">Vehicle not found</p>
          <Link href="/used-cars" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: "#1152d4" }}>
            <MaterialIcon name="arrow_back" className="text-[15px]" /> Back to listings
          </Link>
        </div>
      </div>
    );
  }

  const gallery = vehicle.gallery?.length ? vehicle.gallery : [vehicle.image];
  const priceNum = vehicle.priceNumeric;
  const downAmt = Math.round(priceNum * (downPct / 100));
  const principal = priceNum - downAmt;
  const r = rate / 100 / 12;
  const n = tenure;
  const emi = principal > 0 ? Math.round((principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)) : 0;
  const totalAmt = emi * n + downAmt;
  const totalInterest = totalAmt - priceNum;

  const kmFormatted = vehicle.km
    ? Number(vehicle.km.replace(/\D/g, "")).toLocaleString("en-IN") + " km"
    : "N/A";

  return (
    <div className="min-h-dvh w-full pb-36" style={{ background: "#080a0f", color: "#e2e8f0" }}>

      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-40 border-b border-white/5" style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <Link href="/used-cars" className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0" style={{ background: "rgba(255,255,255,0.05)" }}>
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
          </Link>
          <h1 className="flex-1 text-sm font-bold text-white truncate">{vehicle.name}</h1>
          <button
            onClick={() => setWishlisted(!wishlisted)}
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon name={wishlisted ? "favorite" : "favorite_border"} className={`text-[20px] ${wishlisted ? "text-red-500" : "text-slate-400"}`} />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0" style={{ background: "rgba(255,255,255,0.05)" }}>
            <MaterialIcon name="share" className="text-[20px] text-slate-400" />
          </button>
        </div>
      </header>

      {/* ─── IMAGE GALLERY ─── */}
      <div className="relative max-w-lg mx-auto" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
          {gallery[activeImg] ? (
            <Image
              src={gallery[activeImg]}
              alt={vehicle.name}
              fill
              sizes="(max-width: 512px) 100vw, 512px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(255,255,255,0.04)" }}>
              <MaterialIcon name="directions_car" className="text-[64px] text-slate-700" />
            </div>
          )}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,10,15,0.8) 0%, transparent 40%)" }} />
          {vehicle.aiTag && (
            <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded-full text-white" style={{ background: "rgba(17,82,212,0.9)", backdropFilter: "blur(4px)" }}>
              AI Verified
            </span>
          )}
          {vehicle.aiScore > 0 && (
            <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full" style={{ background: "rgba(0,0,0,0.6)", color: "#60a5fa" }}>
              Score {vehicle.aiScore}/100
            </span>
          )}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {gallery.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className="transition-all"
                style={{ width: i === activeImg ? "20px" : "6px", height: "6px", borderRadius: "3px", background: i === activeImg ? "#fff" : "rgba(255,255,255,0.4)" }}
              />
            ))}
          </div>
        </div>
        {/* Thumbnail strip */}
        {gallery.length > 1 && (
          <div className="flex gap-2 p-3 overflow-x-auto no-scrollbar">
            {gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className="relative shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all"
                style={{ borderColor: i === activeImg ? "#1152d4" : "transparent" }}
              >
                <Image src={img} alt="" fill sizes="64px" className="object-cover" unoptimized />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── PRICE BANNER ─── */}
      <div className="max-w-lg mx-auto px-4 py-4 border-b border-white/5">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mb-1">{vehicle.year} · {vehicle.owner}</p>
            <h2 className="text-2xl font-black text-white">{vehicle.price}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              EMI from <span className="text-slate-300 font-semibold">{formatEmi(priceNum)}</span> · 7yr loan
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-500 mb-1">Location</p>
            <p className="text-xs font-semibold text-slate-300">{vehicle.location || "Not specified"}</p>
          </div>
        </div>

        {/* Quick specs */}
        <div className="grid grid-cols-4 gap-2 mt-4">
          {[
            { icon: "local_gas_station", label: "Fuel", val: vehicle.fuel },
            { icon: "settings", label: "Gearbox", val: vehicle.transmission },
            { icon: "speed", label: "Odometer", val: kmFormatted },
            { icon: "person", label: "Owners", val: vehicle.owner?.replace(" Owner", "") || "1st" },
          ].map(({ icon, label, val }) => (
            <div key={label} className="rounded-xl p-2 text-center border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
              <MaterialIcon name={icon} className="text-[18px] text-slate-500 mb-1" />
              <p className="text-[9px] text-slate-600 uppercase tracking-wider">{label}</p>
              <p className="text-[11px] font-bold text-white truncate">{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── TABS ─── */}
      <div className="sticky top-14 z-30 border-b border-white/5" style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-lg mx-auto flex">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all"
              style={{
                borderColor: activeTab === tab ? "#1152d4" : "transparent",
                color: activeTab === tab ? "#fff" : "#64748b",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ─── TAB CONTENT ─── */}
      <div className="max-w-lg mx-auto px-4 pt-4">

        {/* Overview */}
        {activeTab === "Overview" && (
          <div className="space-y-4">
            {/* Dealer / Seller info */}
            <div className="rounded-2xl p-4 border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Seller Info</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm text-white" style={{ background: "#1152d4" }}>
                  {(vehicle.badge || "D")[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{vehicle.badge || "Verified Dealer"}</p>
                  <p className="text-xs text-slate-500">{vehicle.location || "India"} · Verified Dealer</p>
                </div>
              </div>
            </div>

            {/* Features */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div className="rounded-2xl p-4 border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Key Features</p>
                <div className="grid grid-cols-2 gap-2">
                  {vehicle.features.filter((f) => f.available).slice(0, 8).map((f) => (
                    <div key={f.key} className="flex items-center gap-2">
                      <MaterialIcon name="check_circle" className="text-[14px] text-emerald-500 shrink-0" />
                      <span className="text-xs text-slate-300">{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="rounded-2xl p-4 border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">About this car</p>
              <p className="text-sm text-slate-400 leading-relaxed">
                {vehicle.year} {vehicle.name} in excellent condition. {vehicle.fuel} powered, {vehicle.transmission} gearbox,
                driven {kmFormatted}. {vehicle.owner} ownership. Well maintained with service history available.
              </p>
            </div>
          </div>
        )}

        {/* Specs */}
        {activeTab === "Specs" && (
          <div className="space-y-3">
            {[
              { label: "Make & Model", val: vehicle.name },
              { label: "Year", val: String(vehicle.year) },
              { label: "Fuel Type", val: vehicle.fuel },
              { label: "Transmission", val: vehicle.transmission },
              { label: "Engine", val: vehicle.engine || "—" },
              { label: "Power", val: vehicle.power || "—" },
              { label: "Mileage", val: vehicle.mileage || "—" },
              { label: "Odometer", val: kmFormatted },
              { label: "Ownership", val: vehicle.owner || "—" },
              { label: "Location", val: vehicle.location || "—" },
            ].map(({ label, val }) => (
              <div key={label} className="flex items-center justify-between py-2.5 border-b border-white/5">
                <span className="text-xs text-slate-500">{label}</span>
                <span className="text-xs font-semibold text-white">{val}</span>
              </div>
            ))}
          </div>
        )}

        {/* EMI Calculator */}
        {activeTab === "EMI" && (
          <div className="space-y-4">
            <div className="rounded-2xl p-5 border border-blue-500/20" style={{ background: "rgba(17,82,212,0.05)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1">Monthly EMI</p>
              <p className="text-3xl font-black text-white">
                ₹{emi.toLocaleString("en-IN")}
                <span className="text-sm font-normal text-slate-400">/mo</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Total interest: ₹{totalInterest.toLocaleString("en-IN")} · Total payable: ₹{totalAmt.toLocaleString("en-IN")}
              </p>
            </div>

            {/* Controls */}
            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-2">
                  <p className="text-xs text-slate-400">Down Payment</p>
                  <p className="text-xs font-bold text-white">{downPct}% · ₹{downAmt.toLocaleString("en-IN")}</p>
                </div>
                <input type="range" min={10} max={50} step={5} value={downPct}
                  onChange={(e) => setDownPct(Number(e.target.value))}
                  className="w-full accent-blue-500 h-1.5 rounded-full"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-slate-600">10%</span>
                  <span className="text-[10px] text-slate-600">50%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <p className="text-xs text-slate-400">Loan Tenure</p>
                  <p className="text-xs font-bold text-white">{tenure / 12} years</p>
                </div>
                <input type="range" min={12} max={84} step={12} value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full accent-blue-500 h-1.5 rounded-full"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-slate-600">1 yr</span>
                  <span className="text-[10px] text-slate-600">7 yr</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <p className="text-xs text-slate-400">Interest Rate</p>
                  <p className="text-xs font-bold text-white">{rate}% p.a.</p>
                </div>
                <input type="range" min={7} max={18} step={0.5} value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full accent-blue-500 h-1.5 rounded-full"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-slate-600">7%</span>
                  <span className="text-[10px] text-slate-600">18%</span>
                </div>
              </div>
            </div>

            <Link
              href="/car-loan/emi-calculator"
              className="flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold text-white w-full border border-white/10"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <MaterialIcon name="calculate" className="text-[18px] text-slate-400" />
              Full EMI Calculator
            </Link>
          </div>
        )}
      </div>

      {/* ─── STICKY CTA ─── */}
      <div className="fixed bottom-20 md:bottom-0 inset-x-0 z-40 max-w-lg mx-auto px-4 pb-3">
        <div className="flex gap-2">
          <button
            className="flex-1 h-12 rounded-2xl font-bold text-sm border border-white/10 transition-all"
            style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8" }}
          >
            <span className="flex items-center justify-center gap-2">
              <MaterialIcon name="call" className="text-[18px]" />
              Call Dealer
            </span>
          </button>
          <button
            className="flex-1 h-12 rounded-2xl font-bold text-sm text-white transition-all"
            style={{ background: "#1152d4" }}
          >
            <span className="flex items-center justify-center gap-2">
              <MaterialIcon name="directions_car" className="text-[18px]" />
              Book Test Drive
            </span>
          </button>
        </div>
      </div>

      <BuyerBottomNav />
    </div>
  );
}
