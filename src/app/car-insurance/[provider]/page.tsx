"use client";

import { use } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

function formatProvider(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const PLANS = [
  {
    name: "Comprehensive",
    premium: "Rs 8,499/yr",
    coverage: "Rs 6,50,000",
    icon: "verified_user",
    color: "#1152d4",
    features: [
      "Own damage + third-party cover",
      "Natural calamity protection",
      "Theft and fire coverage",
      "Personal accident cover Rs 15L",
      "Roadside assistance included",
    ],
  },
  {
    name: "Third-Party Only",
    premium: "Rs 2,094/yr",
    coverage: "Rs 7,50,000",
    icon: "shield",
    color: "#10b981",
    features: [
      "Mandatory by law",
      "Third-party bodily injury cover",
      "Third-party property damage",
      "Personal accident cover Rs 15L",
      "No own damage coverage",
    ],
  },
  {
    name: "Own Damage",
    premium: "Rs 6,899/yr",
    coverage: "Rs 6,50,000",
    icon: "car_crash",
    color: "#f59e0b",
    features: [
      "Covers damage to your vehicle",
      "Accident and collision repair",
      "Natural calamity protection",
      "Theft and fire coverage",
      "No third-party liability",
    ],
  },
];

const CLAIMS_STEPS = [
  { step: 1, title: "Intimate Claim", desc: "Call the toll-free number or file online within 24 hours of the incident", icon: "phone_in_talk" },
  { step: 2, title: "Submit Documents", desc: "Upload FIR copy, photos, driving license, and RC through the app or email", icon: "upload_file" },
  { step: 3, title: "Inspection", desc: "Surveyor visits within 48 hours to assess damage and estimate repair cost", icon: "search" },
  { step: 4, title: "Settlement", desc: "Claim settled within 7 working days after approval; cashless at network garages", icon: "payments" },
];

export default function InsuranceProviderPage({ params }: { params: Promise<{ provider: string }> }) {
  const { provider } = use(params);
  const providerName = formatProvider(provider);

  return (
    <div className="min-h-dvh w-full pb-32" style={{ background: "#080a0f", color: "#e2e8f0" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-white/5"
        style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/car-insurance"
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-400" />
          </Link>
          <h1 className="text-base font-bold text-white flex-1">{providerName} Car Insurance</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-5">
        {/* Provider hero */}
        <div
          className="rounded-2xl p-5 text-white"
          style={{ background: "linear-gradient(135deg, #1152d4 0%, #0a3ba8 60%, #071e6b 100%)" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold" style={{ background: "rgba(255,255,255,0.2)" }}>
              {providerName.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold">{providerName}</h2>
              <p className="text-blue-200 text-xs">Car Insurance Plans</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <MaterialIcon name="star" className="text-[14px] text-amber-400" fill />
              <span className="text-sm font-semibold">4.5</span>
              <span className="text-blue-200 text-xs">(12.4K reviews)</span>
            </div>
            <span className="text-blue-300 text-xs">|</span>
            <span className="text-blue-200 text-xs">98% claim settlement ratio</span>
          </div>
        </div>

        {/* Plans */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
            Insurance Plans
          </p>
          <div className="space-y-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className="rounded-2xl p-4 border border-white/5"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: `${plan.color}20` }}
                    >
                      <MaterialIcon name={plan.icon} className="text-[20px]" style={{ color: plan.color }} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{plan.name}</h3>
                      <p className="text-[10px] text-slate-500 mt-0.5">Coverage: {plan.coverage}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 text-lg font-bold">{plan.premium}</p>
                  </div>
                </div>

                <div className="space-y-1.5 mb-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <MaterialIcon name="check" className="text-[14px] text-emerald-400 mt-0.5" />
                      <span className="text-xs text-slate-400">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  className="w-full rounded-xl py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{ background: `${plan.color}20`, color: plan.color, border: `1px solid ${plan.color}40` }}
                >
                  Get Quote
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Claims Process */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
            Claims Process
          </p>
          <div className="space-y-3">
            {CLAIMS_STEPS.map((step, idx) => (
              <div
                key={step.step}
                className="flex gap-3"
              >
                {/* Step indicator */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: "#1152d4" }}
                  >
                    {step.step}
                  </div>
                  {idx < CLAIMS_STEPS.length - 1 && (
                    <div className="w-px flex-1 mt-1" style={{ background: "rgba(17,82,212,0.3)" }} />
                  )}
                </div>

                {/* Content */}
                <div
                  className="flex-1 rounded-xl p-3 border border-white/5 mb-1"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <MaterialIcon name={step.icon} className="text-[16px] text-blue-400" />
                    <h4 className="text-xs font-bold text-white">{step.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Get Quote CTA */}
        <Link
          href="/car-insurance/compare"
          className="flex items-center justify-center gap-2 w-full rounded-xl py-3.5 text-white font-bold text-sm transition-opacity hover:opacity-90"
          style={{ background: "#1152d4" }}
        >
          Get Quote
          <MaterialIcon name="arrow_forward" className="text-[16px]" />
        </Link>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
