"use client";

import { use } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicle, adaptVehicle } from "@/lib/api";
import {
  generatePassport,
  passportGradeColor,
  passportGradeLabel,
  type PassportFlag,
} from "@/lib/vehicle-passport";

/* ─── Standalone VehiclePassport Page ─── */

export default function VehiclePassportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading: loading } = useApi(() => fetchVehicle(id), [id]);
  const vehicle = data?.vehicle ? adaptVehicle(data.vehicle) : null;

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: "#080a0f" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <p className="text-slate-500 text-sm">Generating passport...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: "#080a0f" }}>
        <div className="text-center px-6">
          <MaterialIcon name="search_off" className="text-[48px] text-slate-700 mb-3" />
          <p className="text-slate-400 font-semibold">Vehicle not found</p>
          <Link href="/used-cars" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: "#1152d4" }}>
            <MaterialIcon name="arrow_back" className="text-[15px]" /> Browse used cars
          </Link>
        </div>
      </div>
    );
  }

  const kmNum = vehicle.km ? Number(vehicle.km.replace(/\D/g, "")) : 0;
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

  const greenCount = passport.flags.filter((f) => f.level === "green").length;
  const amberCount = passport.flags.filter((f) => f.level === "amber").length;
  const redCount = passport.flags.filter((f) => f.level === "red").length;

  return (
    <div className="min-h-dvh w-full pb-10" style={{ background: "#080a0f", color: "#e2e8f0" }}>

      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-40 border-b border-white/5" style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href={`/used-cars/details/${id}`}
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-white truncate">Vehicle Passport</h1>
            <p className="text-[10px] text-slate-500 truncate">{vehicle.name}</p>
          </div>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon name="share" className="text-[20px] text-slate-400" />
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-5 space-y-4">

        {/* ─── Hero card ─── */}
        <div
          className="rounded-2xl p-5 border"
          style={{ background: `${gradeColor}0a`, borderColor: `${gradeColor}30` }}
        >
          {/* Brand + report meta */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Autovinci VehiclePassport™</p>
              <h2 className="text-base font-black text-white">{vehicle.name}</h2>
              <p className="text-xs text-slate-500">{vehicle.year} · {vehicle.owner} · {vehicle.fuel}</p>
            </div>
            <div
              className="h-14 w-14 rounded-2xl flex items-center justify-center text-2xl font-black"
              style={{ background: `${gradeColor}20`, color: gradeColor }}
            >
              {passport.grade}
            </div>
          </div>

          {/* Score bar */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Trust Score</span>
              <span className="text-sm font-black text-white">{passport.overallScore}<span className="text-xs font-normal text-slate-500">/100</span></span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${passport.overallScore}%`, background: gradeColor }}
              />
            </div>
          </div>

          {/* Grade + label */}
          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-base font-black" style={{ color: gradeColor }}>Grade {passport.grade}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${gradeColor}18`, color: gradeColor }}>{gradeLabel}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] text-amber-400 font-semibold">COMPUTED</span>
            </div>
          </div>
        </div>

        {/* ─── Flag summary pills ─── */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { count: greenCount, label: "Clear", color: "#10b981", bg: "rgba(16,185,129,0.08)" },
            { count: amberCount, label: "Caution", color: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
            { count: redCount, label: "Alert", color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
          ].map(({ count, label, color, bg }) => (
            <div key={label} className="rounded-xl p-3 text-center border border-white/5" style={{ background: bg }}>
              <p className="text-2xl font-black" style={{ color }}>{count}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* ─── Report ID + generated at ─── */}
        <div className="rounded-xl px-4 py-3 border border-white/5 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.02)" }}>
          <div>
            <p className="text-[10px] text-slate-600 uppercase tracking-wider">Report ID</p>
            <p className="text-xs font-mono font-semibold text-white mt-0.5">{passport.reportId}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-600 uppercase tracking-wider">Generated</p>
            <p className="text-xs text-slate-400 mt-0.5">{new Date(passport.generatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
          </div>
        </div>

        {/* ─── All flags ─── */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Full Verification Report</p>
          <div className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
            {passport.flags.map((flag, i) => (
              <div
                key={i}
                className="flex items-start gap-3 px-4 py-3"
                style={{
                  borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                }}
              >
                <div className="h-7 w-7 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: flagBg[flag.level] }}>
                  <MaterialIcon name={flagIcon[flag.level]} className="text-[14px]" style={{ color: flagColors[flag.level] }} />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed flex-1 pt-1">{flag.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Ownership ─── */}
        <div className="rounded-2xl p-4 border border-white/5 space-y-3" style={{ background: "rgba(255,255,255,0.03)" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Ownership Details</p>
          {[
            { label: "Total Owners", val: String(passport.ownership.totalOwners) },
            { label: "Registration State", val: passport.ownership.registrationState },
            { label: "Registration Year", val: String(passport.ownership.registrationYear) },
            { label: "RTO Code", val: passport.ownership.rtoCode },
            { label: "Hypothecation", val: passport.ownership.hypothecation ? "Active (loan not cleared)" : "None" },
          ].map(({ label, val }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-xs text-slate-500">{label}</span>
              <span className="text-xs font-semibold text-white">{val}</span>
            </div>
          ))}
        </div>

        {/* ─── Accidents ─── */}
        <div className="rounded-2xl p-4 border border-white/5 space-y-3" style={{ background: "rgba(255,255,255,0.03)" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Accident & Claim History</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Total Insurance Claims</span>
            <span className="text-xs font-semibold text-white">{passport.accidents.totalClaims}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Major Accident</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: passport.accidents.majorAccident ? "rgba(239,68,68,0.12)" : "rgba(16,185,129,0.12)", color: passport.accidents.majorAccident ? "#ef4444" : "#10b981" }}>
              {passport.accidents.majorAccident ? "Yes" : "No"}
            </span>
          </div>
          {passport.accidents.claimYears.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Claim Years</span>
              <span className="text-xs font-semibold text-white">{passport.accidents.claimYears.join(", ")}</span>
            </div>
          )}
        </div>

        {/* ─── Odometer ─── */}
        <div className="rounded-2xl p-4 border border-white/5 space-y-3" style={{ background: "rgba(255,255,255,0.03)" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Odometer Analysis</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Reading at Sale</span>
            <span className="text-xs font-semibold text-white">{passport.odometer.readingAtSale.toLocaleString("en-IN")} km</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Avg km/year</span>
            <span className="text-xs font-semibold text-white">{passport.odometer.avgKmPerYear.toLocaleString("en-IN")} km/yr</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Verdict</span>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{
                background: passport.odometer.verdict === "NORMAL" ? "rgba(16,185,129,0.12)" : passport.odometer.verdict === "SUSPICIOUS" ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)",
                color: passport.odometer.verdict === "NORMAL" ? "#10b981" : passport.odometer.verdict === "SUSPICIOUS" ? "#ef4444" : "#f59e0b",
              }}
            >
              {passport.odometer.verdict}
            </span>
          </div>
        </div>

        {/* ─── RC & Insurance ─── */}
        <div className="rounded-2xl p-4 border border-white/5 space-y-3" style={{ background: "rgba(255,255,255,0.03)" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">RC & Insurance</p>
          {[
            { label: "RC Status", ok: passport.rcStatus.valid, okText: "Valid", failText: "Expired" },
            { label: "Insurance", ok: passport.rcStatus.insuranceActive, okText: `Active till ${passport.rcStatus.insuranceExpiry}`, failText: `Expired ${passport.rcStatus.insuranceExpiry}` },
            { label: "Fitness Certificate", ok: passport.rcStatus.fitnessValid, okText: "Valid", failText: "Expired" },
            { label: "Blacklist Check", ok: !passport.rcStatus.blacklisted, okText: "Clear", failText: "Flagged" },
          ].map(({ label, ok, okText, failText }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-xs text-slate-500">{label}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: ok ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)", color: ok ? "#10b981" : "#ef4444" }}>
                {ok ? okText : failText}
              </span>
            </div>
          ))}
        </div>

        {/* ─── Challans ─── */}
        {passport.challans.records.length > 0 ? (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Challan History</p>
            <div className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
              {passport.challans.records.map((c, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3" style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
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
            {passport.challans.pending > 0 && (
              <p className="text-xs text-red-400 font-semibold mt-2 text-center">
                {passport.challans.pending} pending challan(s) · ₹{passport.challans.totalAmount.toLocaleString("en-IN")} unpaid
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-xl px-4 py-3 border border-emerald-500/15 flex items-center gap-3" style={{ background: "rgba(16,185,129,0.04)" }}>
            <MaterialIcon name="check_circle" className="text-[20px] text-emerald-500 shrink-0" />
            <span className="text-xs font-semibold text-emerald-400">No challans on record</span>
          </div>
        )}

        {/* ─── Flood / Fire ─── */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Flood Damage", flagged: passport.floodFire.floodDamage, icon: "water" },
            { label: "Fire Damage", flagged: passport.floodFire.fireDamage, icon: "local_fire_department" },
          ].map(({ label, flagged, icon }) => (
            <div key={label} className="rounded-xl p-4 border text-center" style={{ background: flagged ? "rgba(239,68,68,0.06)" : "rgba(16,185,129,0.04)", borderColor: flagged ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.15)" }}>
              <MaterialIcon name={icon} className="text-[24px] mb-2" style={{ color: flagged ? "#ef4444" : "#10b981" }} />
              <p className="text-xs font-bold" style={{ color: flagged ? "#ef4444" : "#10b981" }}>{flagged ? "Detected" : "Clear"}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* ─── Disclaimer ─── */}
        <div className="rounded-xl px-4 py-3 border border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
          <p className="text-[10px] text-slate-600 leading-relaxed">
            This report is computed by Autovinci&apos;s proprietary algorithms and does not constitute a legally verified vehicle history. Actual Vahan/RTO data verification coming soon. Report ID: <span className="font-mono">{passport.reportId}</span>
          </p>
        </div>

        {/* ─── Back CTA ─── */}
        <Link
          href={`/used-cars/details/${id}`}
          className="flex items-center justify-center gap-2 h-12 rounded-2xl text-sm font-bold text-white w-full"
          style={{ background: "#1152d4" }}
        >
          <MaterialIcon name="arrow_back" className="text-[18px]" />
          Back to Vehicle Details
        </Link>

      </main>
    </div>
  );
}
