"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

type RenewalOption = {
  id: string;
  label: string;
  price: number;
  desc: string;
};

const RENEWAL_OPTIONS: RenewalOption[] = [
  {
    id: "same",
    label: "Same Plan",
    price: 7200,
    desc: "Comprehensive — renew your existing coverage",
  },
  {
    id: "upgrade",
    label: "Upgrade to Zero Dep",
    price: 8900,
    desc: "Zero Depreciation — cover full value",
  },
];

export default function RenewInsurancePage() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [mobile, setMobile] = useState("");
  const [found, setFound] = useState(false);
  const [selectedOption, setSelectedOption] = useState("same");

  function handleFind(e: React.FormEvent) {
    e.preventDefault();
    if (vehicleNumber.trim().length >= 5 || policyNumber.trim().length >= 4) {
      setFound(true);
    }
  }

  function handleRenewNow() {
    alert("This will redirect to the payment gateway.");
  }

  return (
    <div
      className="min-h-dvh pb-36"
      style={{ background: "#080a0f", color: "#f1f5f9" }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-40 flex items-center gap-3 px-4 py-4 border-b border-white/10"
        style={{ background: "#080a0f" }}
      >
        <Link
          href="/car-insurance"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10"
        >
          <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
        </Link>
        <h1 className="text-lg font-bold text-white">Renew Insurance</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 space-y-6 pt-5">
        {/* Policy lookup form */}
        <form
          onSubmit={handleFind}
          className="rounded-2xl p-5 space-y-4"
          style={{ background: "#111827" }}
        >
          <div>
            <p className="text-white font-semibold text-base mb-1">Find Your Policy</p>
            <p className="text-slate-400 text-xs">Enter your vehicle number or policy number to continue</p>
          </div>

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

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block font-medium uppercase tracking-wide">
              Policy Number{" "}
              <span className="normal-case font-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. HDFC-2024-001234"
              value={policyNumber}
              onChange={(e) => setPolicyNumber(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm border border-white/10 focus:outline-none focus:border-blue-500"
              style={{ background: "#1a2235" }}
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block font-medium uppercase tracking-wide">
              Mobile Number
            </label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm border border-white/10 focus:outline-none focus:border-blue-500"
              style={{ background: "#1a2235" }}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl py-3.5 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
            style={{ background: "#1152d4" }}
          >
            <MaterialIcon name="search" className="text-[18px]" />
            Find My Policy
          </button>
        </form>

        {/* Found state */}
        {found && (
          <div className="space-y-4">
            {/* Policy card */}
            <div
              className="rounded-2xl p-5 border border-amber-500/40"
              style={{ background: "#1a1500" }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-white font-semibold">HDFC Ergo</p>
                  <p className="text-slate-400 text-xs mt-0.5">Comprehensive Plan</p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <MaterialIcon name="schedule" className="text-[13px]" />
                  Expires in 30 days
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl p-3" style={{ background: "#1a2235" }}>
                  <p className="text-slate-400 text-[10px] uppercase tracking-wide mb-1">Sum Assured</p>
                  <p className="text-white font-bold text-base">₹8.5 Lakh</p>
                </div>
                <div className="rounded-xl p-3" style={{ background: "#1a2235" }}>
                  <p className="text-slate-400 text-[10px] uppercase tracking-wide mb-1">Vehicle</p>
                  <p className="text-white font-bold text-sm font-mono tracking-wide">
                    {vehicleNumber || "MH02AB1234"}
                  </p>
                </div>
              </div>
            </div>

            {/* Renewal options */}
            <div>
              <p className="text-white font-semibold text-sm mb-3">Choose Renewal Plan</p>
              <div className="space-y-3">
                {RENEWAL_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedOption(opt.id)}
                    className="w-full rounded-2xl p-4 text-left flex items-center justify-between transition-all border"
                    style={{
                      background: selectedOption === opt.id ? "#0d1f47" : "#111827",
                      borderColor: selectedOption === opt.id ? "#1152d4" : "transparent",
                    }}
                  >
                    <div>
                      <p className="text-white font-semibold text-sm">{opt.label}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{opt.desc}</p>
                    </div>
                    <div className="text-right ml-4 flex-shrink-0">
                      <p className="text-white font-bold">
                        ₹{opt.price.toLocaleString("en-IN")}
                      </p>
                      <p className="text-slate-400 text-xs">/year</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Renew Now CTA */}
            <button
              onClick={handleRenewNow}
              className="w-full rounded-xl py-4 text-white font-bold text-base flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              style={{ background: "#1152d4" }}
            >
              <MaterialIcon name="verified" className="text-[20px]" />
              Renew Now — ₹
              {(RENEWAL_OPTIONS.find((o) => o.id === selectedOption)?.price ?? 7200).toLocaleString(
                "en-IN"
              )}/yr
            </button>
          </div>
        )}
      </div>

      <BuyerBottomNav />
    </div>
  );
}
