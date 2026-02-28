"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";
import { useApi } from "@/lib/hooks/use-api";
import { fetchWishlist } from "@/lib/api";

/* ── static data ─────────────────────────────────────────────── */

const COVERED_COMPONENTS = [
  { label: "Engine & Internals", icon: "manufacturing" },
  { label: "Transmission & Gearbox", icon: "settings" },
  { label: "Air Conditioning System", icon: "ac_unit" },
  { label: "Electrical & Wiring", icon: "bolt" },
];

const WARRANTY_PLANS = [
  {
    tier: "Silver",
    price: "4,999",
    coverage: "Engine + Transmission",
    color: "#94a3b8",
  },
  {
    tier: "Gold",
    price: "7,999",
    coverage: "+ AC + Electrical",
    color: "#f59e0b",
  },
  {
    tier: "Platinum",
    price: "11,999",
    coverage: "Bumper-to-bumper",
    color: "#8b5cf6",
  },
];

const CLAIMS = [
  {
    id: "WC-2847",
    part: "AC Compressor Replacement",
    status: "Approved",
    statusColor: "#10b981",
    statusIcon: "check_circle",
    amount: "12,400",
  },
  {
    id: "WC-2901",
    part: "Battery Issue",
    status: "Under Review",
    statusColor: "#3b82f6",
    statusIcon: "schedule",
    amount: null,
  },
];

/* ── helpers ──────────────────────────────────────────────────── */

const TOTAL_DAYS = 730; // 2 years
const ELAPSED_DAYS = 183;
const REMAINING_DAYS = TOTAL_DAYS - ELAPSED_DAYS; // 547
const progressPct = Math.round((ELAPSED_DAYS / TOTAL_DAYS) * 100);

/* ── page ─────────────────────────────────────────────────────── */

export default function WarrantyTrackerPage() {
  return (
    <div
      className="min-h-dvh w-full pb-32"
      style={{ background: "#080a0f", color: "#e2e8f0" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-white/5"
        style={{
          background: "rgba(8,10,15,0.97)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/my-account"
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon
              name="arrow_back"
              className="text-[20px] text-slate-400"
            />
          </Link>
          <h1 className="text-base font-bold text-white flex-1">
            My Warranties
          </h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-5">
        {/* ── Active Warranty Card ───────────────────────────── */}
        <section
          className="rounded-2xl overflow-hidden border border-white/5"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          {/* gradient banner */}
          <div
            className="px-4 pt-4 pb-3"
            style={{
              background:
                "linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(17,82,212,0.08) 100%)",
            }}
          >
            <div className="flex items-start justify-between mb-1">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
                  Active Warranty
                </p>
                <h2 className="text-sm font-black text-white">
                  2022 Maruti Suzuki Brezza ZXi
                </h2>
              </div>
              <span
                className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(16,185,129,0.15)",
                  color: "#10b981",
                }}
              >
                <MaterialIcon name="verified" className="text-[12px]" />
                Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Autovinci Comprehensive Warranty
            </p>
          </div>

          <div className="px-4 pb-4 space-y-4">
            {/* Validity */}
            <div className="pt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-slate-500">
                  Valid until Aug 15, 2027
                </span>
                <span className="text-[11px] font-bold text-emerald-400">
                  {REMAINING_DAYS} days remaining
                </span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${progressPct}%`,
                    background:
                      "linear-gradient(90deg, #10b981, #1152d4)",
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-slate-600">
                  Purchased
                </span>
                <span className="text-[10px] text-slate-600">
                  Expires
                </span>
              </div>
            </div>

            {/* Covered Components */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Covered Components
              </p>
              <div className="grid grid-cols-2 gap-2">
                {COVERED_COMPONENTS.map((c) => (
                  <div
                    key={c.label}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  >
                    <MaterialIcon
                      name="check_circle"
                      fill
                      className="text-[16px] text-emerald-400"
                    />
                    <span className="text-[11px] font-semibold text-slate-300">
                      {c.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* File a Claim CTA */}
            <button
              className="w-full flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-bold text-white"
              style={{ background: "#1152d4" }}
            >
              <MaterialIcon name="description" className="text-[18px]" />
              File a Claim
            </button>
          </div>
        </section>

        {/* ── Expired / Basic Warranty Card ──────────────────── */}
        <section
          className="rounded-2xl overflow-hidden border border-white/5"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div className="px-4 py-4 flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">
                2019 Hyundai i20 Asta
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Basic Warranty
              </p>
            </div>
            <span
              className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(239,68,68,0.1)",
                color: "#f87171",
              }}
            >
              <MaterialIcon name="error" className="text-[12px]" />
              Expired
            </span>
          </div>
          <div
            className="px-4 py-3 border-t border-white/5 flex items-center justify-between"
            style={{ background: "rgba(245,158,11,0.04)" }}
          >
            <div className="flex items-center gap-2">
              <MaterialIcon
                name="upgrade"
                className="text-[18px] text-amber-400"
              />
              <span className="text-xs font-semibold text-amber-400">
                Upgrade to Extended Warranty
              </span>
            </div>
            <MaterialIcon
              name="arrow_forward"
              className="text-[16px] text-amber-400"
            />
          </div>
        </section>

        {/* ── Extended Warranty Plans ────────────────────────── */}
        <section>
          <h3 className="text-sm font-bold text-white mb-3">
            Extended Warranty Plans
          </h3>
          <div className="space-y-2">
            {WARRANTY_PLANS.map((plan) => (
              <div
                key={plan.tier}
                className="flex items-center justify-between px-4 py-3.5 rounded-2xl border border-white/5"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-9 w-9 rounded-xl flex items-center justify-center"
                    style={{ background: `${plan.color}15` }}
                  >
                    <MaterialIcon
                      name="shield"
                      fill
                      className="text-[18px]"
                      style={{ color: plan.color }}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">
                      {plan.tier}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {plan.coverage}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">
                    ₹{plan.price}
                  </p>
                  <p className="text-[10px] text-slate-600">/year</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Recent Claims ──────────────────────────────────── */}
        <section>
          <h3 className="text-sm font-bold text-white mb-3">
            Recent Claims
          </h3>
          <div className="space-y-2">
            {CLAIMS.map((claim) => (
              <div
                key={claim.id}
                className="flex items-start gap-3 px-4 py-3.5 rounded-2xl border border-white/5"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div
                  className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: `${claim.statusColor}12` }}
                >
                  <MaterialIcon
                    name={claim.statusIcon}
                    fill
                    className="text-[18px]"
                    style={{ color: claim.statusColor }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-bold text-white">
                      {claim.part}
                    </p>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2"
                      style={{
                        background: `${claim.statusColor}15`,
                        color: claim.statusColor,
                      }}
                    >
                      {claim.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Claim #{claim.id}
                  </p>
                  {claim.amount && (
                    <p className="text-xs font-semibold text-emerald-400 mt-1">
                      ₹{claim.amount} covered
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
