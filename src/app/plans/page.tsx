"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchDealerProfile } from "@/lib/api";

/* ── design tokens: premium_dealer_plans ── */
// primary: #f4c025 (gold), font: Manrope, bg: #221e10

// Maps DB enum → display tier key
const PLAN_KEY_MAP: Record<string, string> = {
  STARTER: "Silver",
  GROWTH: "Gold",
  ENTERPRISE: "Platinum",
};

const BASE_PLANS = [
  {
    dbKey: "STARTER",
    tier: "Starter",
    name: "Silver",
    price: "₹14,999",
    features: [
      { icon: "check_circle", text: "10 Vehicle Slots" },
      { icon: "check_circle", text: "Standard Marketing Tools" },
      { icon: "check_circle", text: "Basic Lead Analytics" },
    ],
    featureColor: "#94a3b8",
    ctaText: "Current Plan",
    border: "rgba(244,192,37,0.1)",
    bg: "rgba(255,255,255,0.05)",
    highlight: false,
  },
  {
    dbKey: "ENTERPRISE",
    tier: "Full Concierge",
    name: "Platinum",
    price: "₹69,999",
    ribbon: "Executive",
    features: [
      { icon: "verified", text: "Unlimited Vehicle Slots" },
      { icon: "verified", text: "Full AI-Automation Engine" },
      { icon: "verified", text: "Personal Concierge Manager" },
      { icon: "verified", text: "24/7 Priority VIP Support" },
    ],
    featureColor: "#f1f5f9",
    ctaText: "Upgrade to Platinum",
    border: "#f4c025",
    bg: "rgba(244,192,37,0.05)",
    highlight: true,
  },
  {
    dbKey: "GROWTH",
    tier: "Advanced",
    name: "Gold",
    price: "₹39,999",
    features: [
      { icon: "check_circle", text: "50 Vehicle Slots" },
      { icon: "check_circle", text: "AI-Generated Descriptions" },
      { icon: "check_circle", text: "Advanced Market Analytics" },
    ],
    featureColor: "#94a3b8",
    ctaText: "Select Gold",
    border: "rgba(244,192,37,0.1)",
    bg: "rgba(255,255,255,0.05)",
    highlight: false,
  },
];

export default function PlansPage() {
  const [billing, setBilling] = useState<"annual" | "monthly">("annual");
  const { data: profileData } = useApi(() => fetchDealerProfile(), []);
  const currentPlan = (profileData?.profile as { plan?: string } | undefined)?.plan ?? "STARTER";
  const currentPlanName = PLAN_KEY_MAP[currentPlan] ?? "Silver";

  return (
    <div
      className="min-h-screen max-w-md mx-auto flex flex-col pb-24"
      style={{ fontFamily: "'Manrope', sans-serif", background: "#221e10", color: "#f1f5f9" }}
    >
      {/* ── Header ── */}
      <div className="flex items-center p-4 pb-2 justify-between">
        <Link href="/settings" className="flex w-12 shrink-0 items-center justify-start">
          <MaterialIcon name="arrow_back_ios_new" className="text-2xl" />
        </Link>
        <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-12 text-white">
          Dealer Plans
        </h2>
      </div>

      {/* ── Billing Toggle ── */}
      <div className="px-4 py-6">
        <div
          className="flex h-12 flex-1 items-center justify-center rounded-xl p-1"
          style={{
            background: "rgba(244,192,37,0.05)",
            border: "1px solid rgba(244,192,37,0.2)",
          }}
        >
          <button
            onClick={() => setBilling("monthly")}
            className="flex h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-semibold transition-all"
            style={
              billing === "monthly"
                ? { background: "#f4c025", color: "#221e10" }
                : { color: "#f4c025" }
            }
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("annual")}
            className="flex h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-semibold transition-all relative"
            style={
              billing === "annual"
                ? { background: "#f4c025", color: "#221e10" }
                : { color: "#f4c025" }
            }
          >
            Annual
            <span
              className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider"
              style={{ background: "#f4c025", color: "#221e10" }}
            >
              2 Mo Free
            </span>
          </button>
        </div>
      </div>

      {/* ── Plans Content ── */}
      <div className="flex flex-col gap-6 px-4 py-3">
        {BASE_PLANS.map((plan) => {
          const isCurrent = plan.name === currentPlanName;
          return (
            <div
              key={plan.name}
              className="flex flex-col gap-4 rounded-xl p-6 relative overflow-hidden backdrop-blur-sm"
              style={{
                background: plan.bg,
                border: plan.highlight ? `2px solid ${plan.border}` : `1px solid ${plan.border}`,
              }}
            >
              {/* Executive Ribbon */}
              {"ribbon" in plan && plan.ribbon && (
                <div className="absolute top-0 right-0">
                  <div
                    className="text-[10px] font-black px-4 py-1 rotate-45 translate-x-3 translate-y-2 w-32 text-center uppercase"
                    style={{ background: "#f4c025", color: "#221e10" }}
                  >
                    {plan.ribbon}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <h3
                    className="text-xs font-bold uppercase tracking-widest leading-tight"
                    style={{ color: plan.highlight ? "#f4c025" : "#94a3b8" }}
                  >
                    {plan.tier}
                  </h3>
                  {isCurrent && (
                    <span
                      className="text-[10px] px-2 py-1 rounded font-medium"
                      style={{ background: "rgba(51,65,85,0.5)", color: "#cbd5e1" }}
                    >
                      Current Plan
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  {plan.name}
                  {plan.highlight && (
                    <MaterialIcon name="workspace_premium" className="text-base text-[#f4c025]" />
                  )}
                </h1>
                <p className="flex items-baseline gap-1">
                  <span className="text-4xl font-black leading-tight tracking-tight text-white">
                    {plan.price}
                  </span>
                  <span className="text-sm font-medium text-slate-400">/mo</span>
                </p>
              </div>

              <div
                className="flex flex-col gap-3 pt-4 border-t"
                style={{ borderColor: plan.highlight ? "rgba(244,192,37,0.2)" : "rgba(255,255,255,0.1)" }}
              >
                {plan.features.map((f) => (
                  <div
                    key={f.text}
                    className="text-[13px] font-normal leading-normal flex gap-3"
                    style={{ color: plan.featureColor }}
                  >
                    <MaterialIcon name={f.icon} className="text-lg text-[#f4c025]" />
                    {f.text}
                  </div>
                ))}
              </div>

              <button
                className="w-full mt-2 py-3 px-4 rounded-lg text-sm font-bold"
                disabled={isCurrent}
                style={{
                  background: isCurrent ? "#1e293b" : plan.highlight ? "#f4c025" : "rgba(244,192,37,0.2)",
                  color: isCurrent ? "#94a3b8" : plan.highlight ? "#221e10" : "#f4c025",
                  ...(!isCurrent && !plan.highlight ? { border: "1px solid rgba(244,192,37,0.3)" } : {}),
                  ...(isCurrent ? { opacity: 0.5, cursor: "not-allowed" } : {}),
                  ...(plan.highlight && !isCurrent ? { boxShadow: "0 4px 16px rgba(244,192,37,0.2)" } : {}),
                }}
              >
                {isCurrent ? "Current Plan" : plan.ctaText}
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Comparison Link ── */}
      <div className="px-4 py-8 text-center">
        <Link
          href="/plans"
          className="text-sm font-medium flex items-center justify-center gap-2"
          style={{ color: "#f4c025" }}
        >
          View all feature comparisons
          <MaterialIcon name="keyboard_arrow_right" className="text-sm" />
        </Link>
      </div>

      {/* ── Bottom Nav ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex gap-2 border-t px-4 pb-6 pt-3 backdrop-blur-md max-w-md mx-auto md:hidden"
        style={{
          background: "rgba(34,30,16,0.95)",
          borderColor: "rgba(244,192,37,0.2)",
        }}
      >
        {[
          { icon: "directions_car", label: "Inventory", href: "/inventory" },
          { icon: "group", label: "Leads", href: "/leads" },
          { icon: "star", label: "Plans", href: "/plans", active: true },
          { icon: "bar_chart", label: "Analytics", href: "/analytics" },
          { icon: "account_circle", label: "Profile", href: "/settings" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-1 flex-col items-center justify-center gap-1"
            style={{ color: item.active ? "#f4c025" : "#94a3b8" }}
          >
            <MaterialIcon name={item.icon} fill={item.active} />
            <p className="text-[10px] font-medium leading-normal tracking-wide">{item.label}</p>
          </Link>
        ))}
      </nav>
    </div>
  );
}
