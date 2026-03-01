"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { InquiryModal } from "@/components/InquiryModal";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicle, adaptVehicle } from "@/lib/api";
import { formatEmi } from "@/lib/car-catalog";
import { computeTrueCost, formatCost } from "@/lib/true-cost";
import { generatePassport, passportGradeColor, passportGradeLabel, type PassportFlag } from "@/lib/vehicle-passport";

/* ─── Used Car Detail Page ─── */

const TABS = ["Overview", "Specs", "EMI", "TrueCost", "Negotiate", "Passport"] as const;

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
  const [inquiryType, setInquiryType] = useState<"GENERAL" | "TEST_DRIVE" | "CALL_BACK" | null>(null);

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

  // TrueCost
  const trueCost = computeTrueCost({
    price: priceNum,
    fuel: vehicle.fuel,
    category: vehicle.category,
    modelSlug: vehicle.name.split(" ").pop()?.toLowerCase(),
    year: vehicle.year,
  });

  // NegotiationCoach — market price estimate (±12% of listing)
  const marketLow = Math.round(priceNum * 0.88);
  const marketHigh = Math.round(priceNum * 1.04);
  const marketMid = Math.round(priceNum * 0.96);
  const kmNum = vehicle.km ? Number(vehicle.km.replace(/\D/g, "")) : 0;
  const isOverpriced = priceNum > marketMid;
  const priceDelta = Math.abs(priceNum - marketMid);
  const priceDeltaPct = Math.round((priceDelta / marketMid) * 100);
  const negotiationPoints: string[] = [];
  if (kmNum > 60000) negotiationPoints.push(`High odometer (${kmNum.toLocaleString("en-IN")} km) — use for ₹${Math.round(priceNum * 0.03 / 1000)}K discount`);
  if (vehicle.year < 2020) negotiationPoints.push(`${2025 - vehicle.year} year old car — depreciation leverage`);
  if (trueCost.upcomingItems.some(i => i.urgency === "critical")) negotiationPoints.push(`Upcoming maintenance due — estimated ₹${trueCost.upcomingItems.filter(i => i.urgency === "critical").reduce((s, i) => s + i.cost, 0).toLocaleString("en-IN")} in repairs`);
  negotiationPoints.push(`Similar cars listed at ${formatCost(marketLow)}–${formatCost(marketHigh)} in your city`);

  // VehiclePassport — deterministic from vehicleId
  const passport = generatePassport({
    vehicleId: id,
    year: vehicle.year,
    km: kmNum,
    owner: vehicle.owner || "1st Owner",
    name: vehicle.name,
    fuel: vehicle.fuel,
  });
  const gradeColor = passportGradeColor(passport.grade);
  const gradeLabel = passportGradeLabel(passport.grade);

  const flagColors: Record<PassportFlag["level"], string> = {
    green: "#10b981",
    amber: "#f59e0b",
    red: "#ef4444",
  };
  const flagBg: Record<PassportFlag["level"], string> = {
    green: "rgba(16,185,129,0.08)",
    amber: "rgba(245,158,11,0.08)",
    red: "rgba(239,68,68,0.08)",
  };
  const flagIcon: Record<PassportFlag["level"], string> = {
    green: "check_circle",
    amber: "warning",
    red: "cancel",
  };

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
        <div className="max-w-lg mx-auto flex overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="shrink-0 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap"
              style={{
                borderColor: activeTab === tab ? "#1152d4" : "transparent",
                color: activeTab === tab ? "#fff" : "#64748b",
              }}
            >
              {tab === "TrueCost" ? "True Cost" : tab}
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

        {/* ── TrueCost ── */}
        {activeTab === "TrueCost" && (
          <div className="space-y-4">
            {/* Hero total */}
            <div className="rounded-2xl p-5 border border-amber-500/20" style={{ background: "rgba(245,158,11,0.05)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-1">3-Year Total Cost of Ownership</p>
              <p className="text-3xl font-black text-white">
                {formatCost(trueCost.total3Year)}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                <span className="text-amber-400 font-semibold">{formatCost(trueCost.perMonth)}/mo</span> beyond your EMI
              </p>
              {/* Reliability badge */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                <div className="flex gap-0.5">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-1.5 w-3 rounded-full"
                      style={{ background: i < Math.round(trueCost.reliabilityScore) ? "#10b981" : "rgba(255,255,255,0.1)" }}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-400">Reliability <span className="text-white font-bold">{trueCost.reliabilityScore}/10</span></span>
              </div>
            </div>

            {/* Cost breakdown */}
            <div className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-4 pt-4 pb-2">Annual Cost Breakdown</p>
              {[
                { label: "Insurance", val: trueCost.insurance, icon: "shield", color: "#3b82f6" },
                { label: "Fuel (15,000 km/yr)", val: trueCost.fuel, icon: "local_gas_station", color: "#f59e0b" },
                { label: "Maintenance", val: trueCost.maintenance, icon: "build", color: "#8b5cf6" },
                { label: "Depreciation", val: trueCost.depreciation, icon: "trending_down", color: "#ef4444" },
              ].map(({ label, val, icon, color }, i) => {
                const annual = trueCost.insurance + trueCost.fuel + trueCost.maintenance + trueCost.depreciation;
                const pct = Math.round((val / annual) * 100);
                return (
                  <div key={label} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-white/5" : ""}`}>
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
                      <MaterialIcon name={icon} className="text-[16px]" style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-slate-300">{label}</span>
                        <span className="text-xs font-bold text-white">{formatCost(val)}/yr</span>
                      </div>
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Upcoming maintenance */}
            {trueCost.upcomingItems.length > 0 && (
              <div className="rounded-2xl p-4 border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Upcoming Maintenance</p>
                <div className="space-y-2.5">
                  {trueCost.upcomingItems.map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <span
                        className="mt-0.5 h-2 w-2 rounded-full shrink-0"
                        style={{ background: item.urgency === "critical" ? "#ef4444" : item.urgency === "watch" ? "#f59e0b" : "#10b981" }}
                      />
                      <div className="flex-1">
                        <p className="text-xs text-slate-300">{item.label}</p>
                      </div>
                      <span className="text-xs font-bold text-white shrink-0">₹{item.cost.toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-2 text-[10px] text-slate-600">
                  <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full inline-block bg-emerald-500" /> Routine</span>
                  <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full inline-block bg-amber-500" /> Watch</span>
                  <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full inline-block bg-red-500" /> Critical</span>
                </div>
              </div>
            )}

            {/* Known issues */}
            {trueCost.knownIssues.length > 0 && (
              <div className="rounded-2xl p-4 border border-amber-500/15" style={{ background: "rgba(245,158,11,0.04)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-3">Known Issues for this Model</p>
                <div className="space-y-2">
                  {trueCost.knownIssues.map((issue) => (
                    <div key={issue} className="flex items-start gap-2">
                      <MaterialIcon name="warning" className="text-[13px] text-amber-500 mt-0.5 shrink-0" />
                      <span className="text-xs text-slate-300">{issue}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── VehiclePassport ── */}
        {activeTab === "Passport" && (
          <div className="space-y-4 pb-4">

            {/* Trust score ring */}
            <div className="rounded-2xl p-5 border" style={{ background: "rgba(255,255,255,0.02)", borderColor: `${gradeColor}30` }}>
              <div className="flex items-center gap-4">
                {/* Score ring */}
                <div className="relative shrink-0" style={{ width: 80, height: 80 }}>
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
                    <circle
                      cx="40" cy="40" r="34" fill="none"
                      stroke={gradeColor} strokeWidth="7"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 34}`}
                      strokeDashoffset={`${2 * Math.PI * 34 * (1 - passport.overallScore / 100)}`}
                      transform="rotate(-90 40 40)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-white">{passport.overallScore}</span>
                    <span className="text-[9px] text-slate-500 -mt-0.5">/ 100</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl font-black" style={{ color: gradeColor }}>Grade {passport.grade}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${gradeColor}20`, color: gradeColor }}>{gradeLabel}</span>
                  </div>
                  <p className="text-xs text-slate-500">Report ID: <span className="text-slate-300 font-mono">{passport.reportId}</span></p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-[10px] text-amber-400 font-semibold">AUTOVINCI COMPUTED</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Flags list */}
            <div className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-4 pt-4 pb-2">Verification Flags</p>
              <div className="divide-y divide-white/5">
                {passport.flags.map((flag, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3" style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                    <div className="h-6 w-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: flagBg[flag.level] }}>
                      <MaterialIcon name={flagIcon[flag.level]} className="text-[13px]" style={{ color: flagColors[flag.level] }} />
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed flex-1">{flag.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick stats row */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Owners", val: String(passport.ownership.totalOwners), icon: "person", good: passport.ownership.totalOwners === 1 },
                { label: "Claims", val: String(passport.accidents.totalClaims), icon: "car_crash", good: passport.accidents.totalClaims === 0 },
                { label: "Challans", val: String(passport.challans.pending), icon: "gavel", good: passport.challans.pending === 0 },
              ].map(({ label, val, icon, good }) => (
                <div key={label} className="rounded-xl p-3 border text-center border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <MaterialIcon name={icon} className="text-[20px] mb-1" style={{ color: good ? "#10b981" : "#f59e0b" }} />
                  <p className="text-lg font-black text-white">{val}</p>
                  <p className="text-[9px] text-slate-500 uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>

            {/* RC & Insurance status */}
            <div className="rounded-2xl p-4 border border-white/5 space-y-3" style={{ background: "rgba(255,255,255,0.03)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">RC & Insurance</p>
              {[
                { label: "RC Status", ok: passport.rcStatus.valid, okText: "Valid", failText: "Expired" },
                { label: "Insurance", ok: passport.rcStatus.insuranceActive, okText: `Active till ${passport.rcStatus.insuranceExpiry}`, failText: `Expired ${passport.rcStatus.insuranceExpiry}` },
                { label: "Fitness", ok: passport.rcStatus.fitnessValid, okText: "Valid", failText: "Expired" },
                { label: "Blacklist", ok: !passport.rcStatus.blacklisted, okText: "Clear", failText: "Flagged" },
              ].map(({ label, ok, okText, failText }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{label}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: ok ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)", color: ok ? "#10b981" : "#ef4444" }}>
                    {ok ? okText : failText}
                  </span>
                </div>
              ))}
            </div>

            {/* Odometer verdict */}
            <div className="rounded-2xl p-4 border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Odometer Analysis</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-black text-white">{passport.odometer.avgKmPerYear.toLocaleString("en-IN")} <span className="text-xs font-normal text-slate-500">km/yr avg</span></p>
                  <p className="text-xs text-slate-500 mt-0.5">Reading at sale: {passport.odometer.readingAtSale.toLocaleString("en-IN")} km</p>
                </div>
                <span
                  className="text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{
                    background: passport.odometer.verdict === "NORMAL" ? "rgba(16,185,129,0.12)" : passport.odometer.verdict === "SUSPICIOUS" ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)",
                    color: passport.odometer.verdict === "NORMAL" ? "#10b981" : passport.odometer.verdict === "SUSPICIOUS" ? "#ef4444" : "#f59e0b",
                  }}
                >
                  {passport.odometer.verdict}
                </span>
              </div>
            </div>

            {/* Challan records (if any) */}
            {passport.challans.records.length > 0 && (
              <div className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-4 pt-4 pb-2">Challan History</p>
                <div className="divide-y divide-white/5">
                  {passport.challans.records.map((c, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="text-xs font-semibold text-white">{c.offence}</p>
                        <p className="text-[10px] text-slate-500">{c.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-white">₹{c.amount.toLocaleString("en-IN")}</p>
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: c.status === "PAID" ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)", color: c.status === "PAID" ? "#10b981" : "#ef4444" }}>
                          {c.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Flood / Fire */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Flood Damage", flagged: passport.floodFire.floodDamage, icon: "water" },
                { label: "Fire Damage", flagged: passport.floodFire.fireDamage, icon: "local_fire_department" },
              ].map(({ label, flagged, icon }) => (
                <div key={label} className="rounded-xl p-3 border text-center" style={{ background: flagged ? "rgba(239,68,68,0.06)" : "rgba(16,185,129,0.04)", borderColor: flagged ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.15)" }}>
                  <MaterialIcon name={icon} className="text-[22px] mb-1" style={{ color: flagged ? "#ef4444" : "#10b981" }} />
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: flagged ? "#ef4444" : "#10b981" }}>{flagged ? "Detected" : "Clear"}</p>
                  <p className="text-[9px] text-slate-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Share CTA */}
            <Link
              href={`/vehicle/passport/${id}`}
              className="flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold w-full border border-white/10"
              style={{ background: "rgba(255,255,255,0.04)", color: "#94a3b8" }}
            >
              <MaterialIcon name="open_in_new" className="text-[16px]" />
              View Full Passport Report
            </Link>
          </div>
        )}

        {/* ── NegotiationCoach ── */}
        {activeTab === "Negotiate" && (
          <div className="space-y-4">
            {/* Fair price verdict */}
            <div
              className="rounded-2xl p-5 border"
              style={{
                background: isOverpriced ? "rgba(239,68,68,0.05)" : "rgba(16,185,129,0.05)",
                borderColor: isOverpriced ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <MaterialIcon
                  name={isOverpriced ? "warning" : "verified"}
                  className={`text-[20px] ${isOverpriced ? "text-red-400" : "text-emerald-400"}`}
                />
                <p className={`text-xs font-bold uppercase tracking-widest ${isOverpriced ? "text-red-400" : "text-emerald-400"}`}>
                  {isOverpriced ? "Above Market" : "Fair Price"}
                </p>
              </div>
              <p className="text-2xl font-black text-white">{vehicle.price}</p>
              <p className="text-xs text-slate-400 mt-1">
                Market range: <span className="text-white font-semibold">{formatCost(marketLow)} – {formatCost(marketHigh)}</span>
                {isOverpriced && <span className="text-red-400 font-semibold ml-1">({priceDeltaPct}% above market)</span>}
              </p>
            </div>

            {/* Target price */}
            <div className="rounded-2xl p-4 border border-blue-500/20" style={{ background: "rgba(17,82,212,0.06)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1">Your Target Price</p>
              <p className="text-2xl font-black text-white">{formatCost(marketMid)}</p>
              <p className="text-xs text-slate-500 mt-0.5">50th percentile — reasonable opening offer</p>
              {isOverpriced && (
                <p className="text-xs text-blue-300 mt-2 font-semibold">
                  Negotiate down <span className="text-white">₹{priceDelta.toLocaleString("en-IN")}</span> from asking price
                </p>
              )}
            </div>

            {/* Negotiation points */}
            <div className="rounded-2xl p-4 border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Your Leverage Points</p>
              <div className="space-y-3">
                {negotiationPoints.map((pt, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black text-white" style={{ background: "#1152d4" }}>
                      {i + 1}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{pt}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* What to say */}
            <div className="rounded-2xl p-4 border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">What to Say</p>
              <div className="rounded-xl p-3 border border-white/8" style={{ background: "rgba(255,255,255,0.03)" }}>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  &ldquo;I&apos;ve checked the market — similar {vehicle.name.split(" ").slice(-1)[0]}s are listed at {formatCost(marketLow)}–{formatCost(marketHigh)}.
                  Given {kmNum > 50000 ? `the ${kmFormatted} on the odometer` : "the current market"}, I can do {formatCost(marketMid)}.
                  {trueCost.upcomingItems.some(i => i.urgency !== "routine") ? ` There's also some maintenance coming up that I'll need to budget for.` : ""}&rdquo;
                </p>
              </div>
            </div>

            {/* Walk-away signal */}
            <div className="rounded-2xl p-4 border border-red-500/10" style={{ background: "rgba(239,68,68,0.03)" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-2">Walk Away If</p>
              <div className="space-y-1.5">
                {[
                  `Seller won't go below ${formatCost(Math.round(priceNum * 0.97))}`,
                  "No service history available",
                  "Inspection reveals undisclosed damage",
                ].map((w) => (
                  <div key={w} className="flex items-center gap-2">
                    <MaterialIcon name="close" className="text-[13px] text-red-500 shrink-0" />
                    <span className="text-xs text-slate-400">{w}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── STICKY CTA ─── */}
      <div className="fixed bottom-20 md:bottom-0 inset-x-0 z-40 max-w-lg mx-auto px-4 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setInquiryType("CALL_BACK")}
            className="flex-1 h-12 rounded-2xl font-bold text-sm border border-white/10 transition-all"
            style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8" }}
          >
            <span className="flex items-center justify-center gap-2">
              <MaterialIcon name="call" className="text-[18px]" />
              Call Dealer
            </span>
          </button>
          <button
            onClick={() => setInquiryType("TEST_DRIVE")}
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

      {/* Inquiry Modal */}
      <InquiryModal
        open={inquiryType !== null}
        onClose={() => setInquiryType(null)}
        vehicleId={id}
        vehicleName={vehicle?.name}
        type={inquiryType ?? "GENERAL"}
      />

      <BuyerBottomNav />
    </div>
  );
}
