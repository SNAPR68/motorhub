"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";

/* ── design tokens: dealer_monthly_performance_report ── */
// primary: #f2b90d (gold), font: Newsreader (serif), bg: #121212, card: #1c1c1c, accent-silver: #a1a1a1

const REVENUE_BARS = [
  { month: "Jun", height: "40%", active: false },
  { month: "Jul", height: "55%", active: false },
  { month: "Aug", height: "48%", active: false },
  { month: "Sep", height: "70%", active: false },
  { month: "Oct", height: "90%", active: false },
  { month: "Nov", height: "60%", active: false },
  { month: "Dec", height: "72%", active: false },
  { month: "Jan", height: "80%", active: false },
  { month: "Feb", height: "95%", active: true },
];

export default function MonthlyReportPage() {
  return (
    <div
      className="min-h-screen max-w-md mx-auto pb-24"
      style={{ fontFamily: "'Newsreader', serif", background: "#121212", color: "#e2e8f0" }}
    >
      {/* ── Header ── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b"
        style={{
          background: "rgba(18,18,18,0.8)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(255,255,255,0.05)",
        }}
      >
        <Link
          href="/analytics"
          className="flex items-center justify-center w-10 h-10 rounded-full"
        >
          <MaterialIcon name="arrow_back_ios_new" />
        </Link>
        <div className="text-center">
          <h1 className="text-lg font-semibold tracking-tight text-white">
            Performance Report
          </h1>
          <p
            className="text-[10px] uppercase font-bold"
            style={{ letterSpacing: "0.2em", color: "#f2b90d", fontFamily: "system-ui, sans-serif" }}
          >
            February 2026
          </p>
        </div>
        <button className="flex items-center justify-center w-10 h-10 rounded-full">
          <MaterialIcon name="ios_share" />
        </button>
      </nav>

      <main className="px-5 py-6 space-y-6">
        {/* ── Executive Summary ── */}
        <section
          className="relative overflow-hidden rounded-xl p-6"
          style={{ background: "#1c1c1c", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div
            className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16"
            style={{ background: "rgba(242,185,13,0.1)", filter: "blur(48px)" }}
          />
          <div className="relative z-10">
            <p
              className="text-xs uppercase tracking-widest mb-2"
              style={{ color: "#a1a1a1", fontFamily: "system-ui, sans-serif" }}
            >
              Executive Summary
            </p>
            <h2 className="text-4xl font-medium text-white mb-1">₹1.24 Cr</h2>
            <div className="flex items-center gap-2 mb-6">
              <MaterialIcon name="trending_up" className="text-sm text-[#f2b90d]" />
              <p className="text-sm font-medium" style={{ fontFamily: "system-ui, sans-serif" }}>
                <span style={{ color: "#f2b90d" }}>+12.5%</span>{" "}
                <span style={{ color: "#a1a1a1" }}>vs last month</span>
              </p>
            </div>
            <div
              className="flex items-center justify-between p-4 rounded-lg border"
              style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.05)" }}
            >
              <div>
                <p
                  className="text-[10px] uppercase tracking-wider mb-1"
                  style={{ color: "#a1a1a1", fontFamily: "system-ui, sans-serif" }}
                >
                  AI Operational Efficiency
                </p>
                <p className="text-2xl font-medium" style={{ color: "#f2b90d" }}>
                  88%
                </p>
              </div>
              <div className="relative w-14 h-14">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18" cy="18" r="16"
                    fill="none" strokeWidth="3"
                    stroke="rgba(255,255,255,0.1)"
                  />
                  <circle
                    cx="18" cy="18" r="16"
                    fill="none" strokeWidth="3"
                    stroke="#f2b90d"
                    strokeDasharray="100"
                    strokeDashoffset="12"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <MaterialIcon name="auto_awesome" className="text-xs text-[#f2b90d]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Metrics Grid ── */}
        <section className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div
              className="p-5 rounded-xl border"
              style={{ background: "#1c1c1c", borderColor: "rgba(255,255,255,0.05)" }}
            >
              <MaterialIcon name="ads_click" className="mb-3 text-[#f2b90d]" />
              <p
                className="text-[10px] uppercase tracking-wider mb-1"
                style={{ color: "#a1a1a1", fontFamily: "system-ui, sans-serif" }}
              >
                Marketing Reach
              </p>
              <p className="text-xl font-medium text-white">
                42.8k{" "}
                <span className="text-xs" style={{ color: "#f2b90d", fontFamily: "system-ui, sans-serif" }}>
                  +4%
                </span>
              </p>
            </div>
            <div
              className="p-5 rounded-xl border"
              style={{ background: "#1c1c1c", borderColor: "rgba(255,255,255,0.05)" }}
            >
              <MaterialIcon name="speed" className="mb-3 text-[#f2b90d]" />
              <p
                className="text-[10px] uppercase tracking-wider mb-1"
                style={{ color: "#a1a1a1", fontFamily: "system-ui, sans-serif" }}
              >
                Inv. Velocity
              </p>
              <p className="text-xl font-medium text-white">14 Days</p>
            </div>
          </div>

          {/* Lead Conversion Funnel */}
          <div
            className="p-5 rounded-xl border"
            style={{ background: "#1c1c1c", borderColor: "rgba(255,255,255,0.05)" }}
          >
            <div className="flex justify-between items-end mb-4">
              <div>
                <p
                  className="text-[10px] uppercase tracking-wider mb-1"
                  style={{ color: "#a1a1a1", fontFamily: "system-ui, sans-serif" }}
                >
                  Lead Conversion Funnel
                </p>
                <p className="text-xl font-medium text-white">4.2% Rate</p>
              </div>
              <span style={{ color: "rgba(161,161,161,0.5)" }}>
                <MaterialIcon name="filter_alt" />
              </span>
            </div>
            <div className="space-y-3">
              <div
                className="relative h-2 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                <div
                  className="absolute top-0 left-0 h-full rounded-full"
                  style={{ width: "85%", background: "#f2b90d" }}
                />
              </div>
              <div
                className="flex justify-between text-[10px] uppercase"
                style={{ color: "#a1a1a1", fontFamily: "system-ui, sans-serif" }}
              >
                <span>Leads (840)</span>
                <span>Sales (35)</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Revenue Growth Chart ── */}
        <section
          className="p-6 rounded-xl border"
          style={{ background: "#1c1c1c", borderColor: "rgba(255,255,255,0.05)" }}
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-medium text-white">Revenue Growth</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: "#f2b90d" }} />
                <span
                  className="text-[10px]"
                  style={{ color: "#a1a1a1", fontFamily: "system-ui, sans-serif" }}
                >
                  Current
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }} />
                <span
                  className="text-[10px]"
                  style={{ color: "#a1a1a1", fontFamily: "system-ui, sans-serif" }}
                >
                  Projected
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-end justify-between h-40 gap-2 mb-2">
            {REVENUE_BARS.map((bar) => (
              <div key={bar.month} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className="w-full rounded-t-sm"
                  style={{
                    height: bar.height,
                    background: bar.active ? "#f2b90d" : "rgba(255,255,255,0.05)",
                    ...(bar.active ? { boxShadow: "0 0 15px rgba(242,185,13,0.3)" } : {}),
                  }}
                />
                <span
                  className="text-[10px]"
                  style={{
                    color: bar.active ? "#f2b90d" : "#a1a1a1",
                    fontWeight: bar.active ? "bold" : "normal",
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  {bar.month}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Top Performer ── */}
        <section
          className="rounded-xl border overflow-hidden"
          style={{ background: "#1c1c1c", borderColor: "rgba(255,255,255,0.05)" }}
        >
          <div className="p-5 flex items-center gap-4">
            <div className="relative">
              <div
                className="w-16 h-16 rounded-full overflow-hidden border-2 flex items-center justify-center text-xl font-bold"
                style={{ borderColor: "#f2b90d", background: "rgba(242,185,13,0.1)", color: "#f2b90d" }}
              >
                RK
              </div>
              <div
                className="absolute -bottom-1 -right-1 rounded-full p-1 border-2"
                style={{ background: "#f2b90d", color: "#121212", borderColor: "#1c1c1c" }}
              >
                <MaterialIcon name="workspace_premium" className="!text-[14px] font-bold" />
              </div>
            </div>
            <div className="flex-1">
              <p
                className="text-[10px] uppercase tracking-widest font-bold mb-0.5"
                style={{ color: "#f2b90d", fontFamily: "system-ui, sans-serif" }}
              >
                Top Sales Executive
              </p>
              <h4 className="text-xl font-medium text-white">Rajesh Kumar</h4>
              <p
                className="text-xs"
                style={{ color: "#a1a1a1", fontFamily: "system-ui, sans-serif" }}
              >
                ₹42L Revenue Generated
              </p>
            </div>
            <span style={{ color: "rgba(161,161,161,0.3)" }}>
              <MaterialIcon name="chevron_right" />
            </span>
          </div>
        </section>
      </main>

      {/* ── Bottom Nav ── */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50">
        <div
          className="mx-auto max-w-md px-6 pb-8 pt-3 border-t"
          style={{
            background: "rgba(18,18,18,0.9)",
            backdropFilter: "blur(16px)",
            borderColor: "rgba(255,255,255,0.05)",
          }}
        >
          <div className="flex items-center justify-between">
            {[
              { icon: "dashboard", label: "Dashboard", href: "/dashboard" },
              { icon: "directions_car", label: "Inventory", href: "/inventory" },
              { icon: "analytics", label: "Reports", href: "/reports/monthly", active: true },
              { icon: "group", label: "Leads", href: "/leads" },
              { icon: "settings", label: "Account", href: "/settings" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center gap-1"
                style={{ color: item.active ? "#f2b90d" : "#a1a1a1" }}
              >
                <MaterialIcon name={item.icon} fill={item.active} />
                <span
                  className={`text-[10px] tracking-tight ${item.active ? "font-bold" : "font-medium"}`}
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
