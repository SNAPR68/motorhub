"use client";

import { use } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

function formatBank(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const TENURE_RATES = [
  { tenure: "1 Year", rate: "8.50%", emi: "Rs 87,112" },
  { tenure: "3 Years", rate: "8.75%", emi: "Rs 31,567" },
  { tenure: "5 Years", rate: "9.00%", emi: "Rs 20,758" },
  { tenure: "7 Years", rate: "9.25%", emi: "Rs 16,177" },
];

const CHARGES = [
  { label: "Processing Fee", value: "0.5% of loan amount (min Rs 3,000)" },
  { label: "Prepayment Charges", value: "2% of outstanding (after 12 EMIs, nil for floating rate)" },
  { label: "Late Payment Fee", value: "Rs 500 + 2% p.a. on overdue EMI" },
  { label: "Loan Cancellation", value: "Rs 3,000 + applicable taxes" },
];

const ELIGIBILITY = {
  minIncome: "Rs 25,000/month",
  ageRange: "21 - 65 years",
  employment: "Salaried or Self-Employed",
  minExperience: "1 year in current job / 2 years in business",
};

const DOCUMENTS = [
  "PAN Card",
  "Aadhaar Card",
  "Last 3 months salary slips",
  "Last 6 months bank statements",
  "Address proof",
  "Passport-size photographs",
];

export default function BankDetailPage({ params }: { params: Promise<{ bank: string }> }) {
  const { bank } = use(params);
  const bankName = formatBank(bank);

  return (
    <div className="min-h-dvh w-full pb-32" style={{ background: "#080a0f", color: "#e2e8f0" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-white/5"
        style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/car-loan/banks"
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-400" />
          </Link>
          <h1 className="text-base font-bold text-white flex-1">{bankName} Car Loan Rates</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-5">
        {/* Bank hero */}
        <div
          className="rounded-2xl p-5 text-white"
          style={{ background: "linear-gradient(135deg, #1152d4 0%, #0a3ba8 60%, #071e6b 100%)" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold" style={{ background: "rgba(255,255,255,0.2)" }}>
              {bankName.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold">{bankName}</h2>
              <p className="text-blue-200 text-xs">Car Loan Interest Rates</p>
            </div>
          </div>
          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold">8.50%</span>
            <span className="text-blue-200 text-sm mb-1">p.a. onwards</span>
          </div>
        </div>

        {/* Interest Rates by Tenure */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
            Interest Rates by Tenure
          </p>
          <div className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="grid grid-cols-3 gap-2 px-4 py-3 border-b border-white/5">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Tenure</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase text-center">Rate</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase text-right">EMI/10L</span>
            </div>
            {TENURE_RATES.map((row, idx) => (
              <div
                key={row.tenure}
                className="grid grid-cols-3 gap-2 px-4 py-3"
                style={{ background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}
              >
                <span className="text-xs text-slate-300 font-medium">{row.tenure}</span>
                <span className="text-xs text-emerald-400 font-bold text-center">{row.rate}</span>
                <span className="text-xs text-white font-medium text-right">{row.emi}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Charges */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
            Processing Fee &amp; Charges
          </p>
          <div className="space-y-2">
            {CHARGES.map((item) => (
              <div
                key={item.label}
                className="rounded-xl p-3 flex items-start gap-3 border border-white/5"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <MaterialIcon name="receipt_long" className="text-[18px] text-slate-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-white">{item.label}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Eligibility */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
            Eligibility Criteria
          </p>
          <div className="rounded-2xl p-4 border border-white/5 space-y-3" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(16,185,129,0.12)" }}>
                <MaterialIcon name="currency_rupee" className="text-[18px] text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase">Min Income</p>
                <p className="text-sm text-white font-semibold">{ELIGIBILITY.minIncome}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(17,82,212,0.12)" }}>
                <MaterialIcon name="person" className="text-[18px] text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase">Age Range</p>
                <p className="text-sm text-white font-semibold">{ELIGIBILITY.ageRange}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(245,158,11,0.12)" }}>
                <MaterialIcon name="work" className="text-[18px] text-amber-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase">Employment</p>
                <p className="text-sm text-white font-semibold">{ELIGIBILITY.employment}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(139,92,246,0.12)" }}>
                <MaterialIcon name="schedule" className="text-[18px] text-purple-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase">Experience</p>
                <p className="text-sm text-white font-semibold">{ELIGIBILITY.minExperience}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
            Documents Required
          </p>
          <div className="rounded-2xl p-4 border border-white/5 space-y-2" style={{ background: "rgba(255,255,255,0.03)" }}>
            {DOCUMENTS.map((doc) => (
              <div key={doc} className="flex items-center gap-2">
                <MaterialIcon name="check_circle" className="text-[16px] text-emerald-400" fill />
                <span className="text-xs text-slate-300">{doc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Apply CTA */}
        <Link
          href="/car-loan/apply"
          className="flex items-center justify-center gap-2 w-full rounded-xl py-3.5 text-white font-bold text-sm transition-opacity hover:opacity-90"
          style={{ background: "#1152d4" }}
        >
          Apply Now
          <MaterialIcon name="arrow_forward" className="text-[16px]" />
        </Link>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
