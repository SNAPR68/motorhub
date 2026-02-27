"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

const INSURERS = [
  "HDFC Ergo",
  "ICICI Lombard",
  "Bajaj Allianz",
  "New India",
  "Reliance",
  "Tata AIG",
];

const FEATURES = [
  {
    icon: "local_hospital",
    title: "Cashless Claims",
    desc: "6500+ network garages across India",
  },
  {
    icon: "bolt",
    title: "Instant Policy",
    desc: "Digital policy issued in 2 minutes",
  },
  {
    icon: "verified_user",
    title: "Zero Depreciation",
    desc: "Cover full value without depreciation cut",
  },
];

const POLICY_TYPES = ["Comprehensive", "Third Party", "Own Damage"] as const;
const USAGE_TYPES = ["Personal", "Commercial"] as const;

export default function CarInsurancePage() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [policyType, setPolicyType] = useState<string>("Comprehensive");
  const [usage, setUsage] = useState<string>("Personal");

  const queryString = new URLSearchParams({
    vehicleNumber: vehicleNumber || "",
    policyType,
    usage,
  }).toString();

  return (
    <div
      className="min-h-dvh pb-36"
      style={{ background: "#080a0f", color: "#f1f5f9" }}
    >
      {/* Header */}
      <div className="sticky top-0 z-40 flex items-center gap-3 px-4 py-4 border-b border-white/10"
        style={{ background: "#080a0f" }}>
        <Link href="/" className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10">
          <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
        </Link>
        <h1 className="text-lg font-bold text-white">Car Insurance</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 space-y-6 pt-5">
        {/* Hero */}
        <div
          className="rounded-2xl p-6 text-white"
          style={{
            background: "linear-gradient(135deg, #1152d4 0%, #0a3ba8 60%, #071e6b 100%)",
          }}
        >
          <div className="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-xs font-semibold mb-3">
            <MaterialIcon name="local_offer" className="text-[14px]" />
            Save up to 40%
          </div>
          <h2 className="text-2xl font-bold leading-tight mb-1">
            Compare &amp; Save up to 40% on Car Insurance
          </h2>
          <p className="text-blue-200 text-sm">Instant quotes from 20+ insurers</p>
        </div>

        {/* Quick Quote Form */}
        <div className="rounded-2xl p-5 space-y-4" style={{ background: "#111827" }}>
          <h3 className="text-white font-semibold text-base">Get Your Free Quote</h3>

          {/* Vehicle number */}
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block font-medium uppercase tracking-wide">
              Vehicle Number
            </label>
            <input
              type="text"
              placeholder="MH02AB1234"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
              className="w-full rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm font-mono tracking-wider border border-white/10 focus:outline-none focus:border-blue-500"
              style={{ background: "#1a2235" }}
            />
          </div>

          {/* Policy type */}
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block font-medium uppercase tracking-wide">
              Policy Type
            </label>
            <div className="flex flex-wrap gap-2">
              {POLICY_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setPolicyType(t)}
                  className="rounded-full px-4 py-2 text-sm font-medium transition-all"
                  style={{
                    background: policyType === t ? "#1152d4" : "#1a2235",
                    color: policyType === t ? "#fff" : "#94a3b8",
                    border: policyType === t ? "1px solid #1152d4" : "1px solid transparent",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Usage */}
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block font-medium uppercase tracking-wide">
              Usage
            </label>
            <div className="flex gap-2">
              {USAGE_TYPES.map((u) => (
                <button
                  key={u}
                  onClick={() => setUsage(u)}
                  className="flex-1 rounded-full px-4 py-2 text-sm font-medium transition-all"
                  style={{
                    background: usage === u ? "#1152d4" : "#1a2235",
                    color: usage === u ? "#fff" : "#94a3b8",
                    border: usage === u ? "1px solid #1152d4" : "1px solid transparent",
                  }}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <Link
            href={`/car-insurance/compare?${queryString}`}
            className="flex items-center justify-center gap-2 w-full rounded-xl py-3.5 text-white font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ background: "#1152d4" }}
          >
            <MaterialIcon name="search" className="text-[18px]" />
            Get Quotes
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-3 gap-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl p-3 flex flex-col items-center text-center gap-2"
              style={{ background: "#111827" }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "#1152d420" }}
              >
                <MaterialIcon name={f.icon} className="text-[20px]" style={{ color: "#4d80f0" }} />
              </div>
              <p className="text-white text-xs font-semibold leading-tight">{f.title}</p>
              <p className="text-slate-400 text-[10px] leading-tight">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Top Insurers */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-3">Top Insurers</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {INSURERS.map((insurer) => (
              <div
                key={insurer}
                className="flex-shrink-0 flex items-center gap-2 rounded-full px-4 py-2 border border-white/10"
                style={{ background: "#111827" }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: "#1152d4" }}
                >
                  {insurer[0]}
                </div>
                <span className="text-slate-300 text-xs font-medium whitespace-nowrap">{insurer}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Renew CTA Banner */}
        <Link
          href="/car-insurance/renew"
          className="flex items-center justify-between rounded-2xl p-5 border border-amber-500/30"
          style={{ background: "#1a1500" }}
        >
          <div>
            <p className="text-amber-400 font-semibold text-sm mb-0.5">Already have insurance?</p>
            <p className="text-slate-400 text-xs">Renew in 2 minutes — don't let it lapse</p>
          </div>
          <div className="flex items-center gap-1 text-amber-400">
            <span className="text-xs font-semibold">Renew</span>
            <MaterialIcon name="arrow_forward" className="text-[16px]" />
          </div>
        </Link>
      </div>

      <BuyerBottomNav />
    </div>
  );
}
