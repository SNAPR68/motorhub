"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CRETA, BLUR_DATA_URL } from "@/lib/car-images";
import { MaterialIcon } from "@/components/MaterialIcon";

/* Stitch: exclusive_commit_&_deposit — #7311d4, Work Sans, #050505 */

const PRICING = [
  { label: "Vehicle Price", value: "₹14,50,000" },
  { label: "Registration & RTO", value: "₹1,20,000" },
  { label: "Insurance (1 Year)", value: "₹45,000" },
  { label: "Handling & Logistics", value: "₹15,000" },
];

const DOCS = [
  { label: "PAN Card / Aadhaar", checked: true },
  { label: "Address Proof", checked: true },
  { label: "Income Documentation", checked: false },
];

export default function ReservationCommitPage() {
  const [deposit, setDeposit] = useState(50000);
  const [refundable, setRefundable] = useState(true);

  return (
    <div
      className="min-h-dvh w-full flex flex-col max-w-md mx-auto text-slate-100"
      style={{ fontFamily: "'Work Sans', sans-serif", background: "#050505" }}
    >
      {/* Header */}
      <header className="sticky top-0 z-30 px-4 py-4 flex items-center justify-between border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <Link href="/reservation" className="p-2 rounded-full hover:bg-white/5">
          <MaterialIcon name="arrow_back" />
        </Link>
        <h1 className="text-sm font-bold uppercase tracking-widest text-[#7311d4]">Commit & Deposit</h1>
        <button className="p-2 rounded-full hover:bg-white/5">
          <MaterialIcon name="help_outline" className="text-slate-400" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        {/* Vehicle Hero */}
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image src={CRETA} alt="Hyundai Creta" fill className="object-cover" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4">
            <h2 className="text-xl font-bold text-white">2023 Hyundai Creta SX(O)</h2>
            <p className="text-sm text-slate-400">1.5L Turbo • Automatic • Polar White</p>
          </div>
        </div>

        {/* Pricing Breakdown */}
        <section className="px-4 py-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
            <MaterialIcon name="receipt_long" className="text-sm text-[#7311d4]" /> Pricing Breakdown
          </h3>
          <div className="space-y-3">
            {PRICING.map((item) => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-sm text-slate-400">{item.label}</span>
                <span className="text-sm font-semibold text-white">{item.value}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-3">
              <span className="text-sm font-bold text-white">Total On-Road</span>
              <span className="text-lg font-bold text-[#7311d4]">₹16,30,000</span>
            </div>
          </div>
        </section>

        {/* Deposit Slider */}
        <section className="px-4 py-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
            <MaterialIcon name="savings" className="text-sm text-[#7311d4]" /> Secure Your Vehicle
          </h3>
          <div className="rounded-xl p-5 border border-white/10" style={{ background: "rgba(115,17,212,0.05)" }}>
            <div className="flex justify-between items-baseline mb-6">
              <span className="text-sm text-slate-400">Deposit Amount</span>
              <span className="text-3xl font-bold text-[#7311d4]">₹{(deposit / 1000).toFixed(0)}K</span>
            </div>
            <input
              type="range"
              min="10000"
              max="100000"
              step="5000"
              value={deposit}
              onChange={(e) => setDeposit(Number(e.target.value))}
              className="w-full h-1 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to right, #7311d4 ${((deposit - 10000) / 90000) * 100}%, rgba(255,255,255,0.1) ${((deposit - 10000) / 90000) * 100}%)` }}
            />
            <div className="flex justify-between mt-2">
              <span className="text-[10px] text-slate-500">₹10,000</span>
              <span className="text-[10px] text-slate-500">₹1,00,000</span>
            </div>
          </div>

          {/* Refundable Toggle */}
          <div className="flex items-center justify-between mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <div>
              <p className="text-sm font-medium text-white">Fully Refundable Deposit</p>
              <p className="text-xs text-slate-500 mt-0.5">Cancel within 48 hours for full refund</p>
            </div>
            <button
              onClick={() => setRefundable(!refundable)}
              className="w-11 h-6 rounded-full relative transition-colors"
              style={{ background: refundable ? "#7311d4" : "#334155" }}
            >
              <div
                className="absolute top-[2px] w-5 h-5 bg-white rounded-full transition-all shadow-sm"
                style={{ left: refundable ? "22px" : "2px" }}
              />
            </button>
          </div>
        </section>

        {/* Financial Documentation */}
        <section className="px-4 py-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
            <MaterialIcon name="description" className="text-sm text-[#7311d4]" /> Required Documents
          </h3>
          <div className="space-y-3">
            {DOCS.map((doc) => (
              <div key={doc.label} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className={`size-6 rounded-full flex items-center justify-center ${doc.checked ? "bg-[#7311d4]" : "bg-white/10"}`}>
                  {doc.checked && <MaterialIcon name="check" className="text-white text-sm" />}
                </div>
                <span className={`text-sm ${doc.checked ? "text-white" : "text-slate-400"}`}>{doc.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Security */}
        <div className="px-4 pb-6">
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <MaterialIcon name="lock" className="text-sm text-[#7311d4]" />
            256-bit Encrypted • Razorpay Secure
          </div>
        </div>
      </main>

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-30 p-4 bg-[#050505]/95 backdrop-blur-md border-t border-white/5">
        <button className="w-full bg-[#7311d4] text-white py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#7311d4]/30 active:scale-[0.98] transition-transform">
          Commit Deposit — ₹{(deposit / 1000).toFixed(0)}K
          <MaterialIcon name="arrow_forward" className="text-lg" />
        </button>
      </div>
    </div>
  );
}
