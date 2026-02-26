"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchReports, fetchVehicles } from "@/lib/api";
import { SkeletonCard } from "@/components/ui/Skeleton";

/* ── design tokens: dealer_monthly_performance_report ── */
// primary: #f2b90d (gold), font: Newsreader (serif), bg: #121212, card: #1c1c1c, accent-silver: #a1a1a1

const MONTH_LABELS = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];

export default function MonthlyReportPage() {
  const { data: reportsData, isLoading } = useApi(() => fetchReports(), []);
  const { data: vehiclesData } = useApi(() => fetchVehicles({ limit: 1, status: "SOLD" }), []);

  const summary = reportsData?.summary;
  const period = reportsData?.period;

  const revenue = summary?.revenue ?? "₹0";
  const totalRevenue = summary?.totalRevenue ?? "₹0";
  const conversionRate = summary ? `${summary.conversionRate}%` : "0%";
  const activeLeads = summary?.leads ?? 0;
  const monthlySales = summary?.salesVolume ?? 0;
  const leadGrowth = summary?.leadGrowth ?? 0;
  const salesGrowth = summary?.salesGrowth ?? 0;
  const conversionGrowth = summary?.conversionGrowth ?? 0;
  const totalVehicles = summary?.totalVehicles ?? 0;
  const periodLabel = period ? `${period.month} ${period.year}` : "Loading...";
  const convNum = summary?.conversionRate ?? 0;

  // Top performer from vehicles
  const topVehicle = vehiclesData?.vehicles?.[0];

  // Derive efficiency from conversion
  const efficiency = Math.min(99, 60 + convNum);

  // Revenue bars — last bar is current month
  const revenueBars = MONTH_LABELS.map((month, i) => ({
    month,
    height: i === MONTH_LABELS.length - 1 ? "95%" : `${Math.max(30, 40 + i * 7)}%`,
    active: i === MONTH_LABELS.length - 1,
  }));

  return (
    <div
      className="min-h-screen max-w-md mx-auto pb-24"
      style={{ fontFamily: "'Newsreader', serif", background: "#121212", color: "#e2e8f0" }}
    >
      {/* ── Header ── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b"
        style={{ background: "rgba(18,18,18,0.8)", backdropFilter: "blur(12px)", borderColor: "rgba(255,255,255,0.05)" }}
      >
        <Link href="/analytics" className="flex items-center justify-center w-10 h-10 rounded-full">
          <MaterialIcon name="arrow_back_ios_new" />
        </Link>
        <div className="text-center">
          <h1 className="text-lg font-semibold tracking-tight text-white">Performance Report</h1>
          <p className="text-[10px] uppercase font-bold" style={{ letterSpacing: "0.2em", color: "#f2b90d", fontFamily: "system-ui, sans-serif" }}>
            {periodLabel}
          </p>
        </div>
        <button className="flex items-center justify-center w-10 h-10 rounded-full">
          <MaterialIcon name="ios_share" />
        </button>
      </nav>

      <main className="px-5 py-6 space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            <SkeletonCard variant="dark" />
            <SkeletonCard variant="dark" />
          </div>
        ) : (
          <>
            {/* ── Executive Summary ── */}
            <section
              className="relative overflow-hidden rounded-xl p-6"
              style={{ background: "#1c1c1c", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16" style={{ background: "rgba(242,185,13,0.1)", filter: "blur(48px)" }} />
              <div className="relative z-10">
                <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#a1a1a1", fontFamily: "system-ui, sans-serif" }}>
                  Executive Summary
                </p>
                <h2 className="text-4xl font-medium text-white mb-1">{totalRevenue}</h2>
                <div className="flex items-center gap-2 mb-6">
                  <MaterialIcon name={salesGrowth >= 0 ? "trending_up" : "trending_down"} className="text-sm text-[#f2b90d]" />
                  <p className="text-sm font-medium" style={{ fontFamily: "system-ui, sans-serif" }}>
                    <span style={{ color: "#f2b90d" }}>{monthlySales} sold</span>{" "}
                    <span style={{ color: "#a1a1a1" }}>· {conversionRate} conv. rate</span>
                    {salesGrowth !== 0 && (
                      <span style={{ color: salesGrowth > 0 ? "#22c55e" : "#ef4444", marginLeft: "6px" }}>
                        {salesGrowth > 0 ? "+" : ""}{salesGrowth}%
                      </span>
                    )}
                  </p>
                </div>
                <div
                  className="flex items-center justify-between p-4 rounded-lg border"
                  style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.05)" }}
                >
                  <div>
                    <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "#a1a1a1", fontFamily: "system-ui, sans-serif" }}>
                      AI Operational Efficiency
                    </p>
                    <p className="text-2xl font-medium" style={{ color: "#f2b90d" }}>{efficiency}%</p>
                  </div>
                  <div className="relative w-14 h-14">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" strokeWidth="3" stroke="rgba(255,255,255,0.1)" />
                      <circle
                        cx="18" cy="18" r="16" fill="none" strokeWidth="3"
                        stroke="#f2b90d"
                        strokeDasharray="100"
                        strokeDashoffset={100 - efficiency}
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
                <div className="p-5 rounded-xl border" style={{ background: "#1c1c1c", borderColor: "rgba(255,255,255,0.05)" }}>
                  <MaterialIcon name="inventory" className="mb-3 text-[#f2b90d]" />
                  <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "#a1a1a1", fontFamily: "system-ui, sans-serif" }}>
                    Total Stock
                  </p>
                  <p className="text-xl font-medium text-white">
                    {totalVehicles}{" "}
                    <span className="text-xs" style={{ color: "#f2b90d", fontFamily: "system-ui, sans-serif" }}>cars</span>
                  </p>
                </div>
                <div className="p-5 rounded-xl border" style={{ background: "#1c1c1c", borderColor: "rgba(255,255,255,0.05)" }}>
                  <MaterialIcon name="speed" className="mb-3 text-[#f2b90d]" />
                  <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "#a1a1a1", fontFamily: "system-ui, sans-serif" }}>
                    Avg. Days to Sell
                  </p>
                  <p className="text-xl font-medium text-white">18 Days</p>
                </div>
              </div>

              {/* Lead Conversion Funnel */}
              <div className="p-5 rounded-xl border" style={{ background: "#1c1c1c", borderColor: "rgba(255,255,255,0.05)" }}>
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "#a1a1a1", fontFamily: "system-ui, sans-serif" }}>
                      Lead Conversion Funnel
                    </p>
                    <p className="text-xl font-medium text-white">{conversionRate} Rate</p>
                  </div>
                  <div className="text-right">
                    <span style={{ color: "rgba(161,161,161,0.5)" }}>
                      <MaterialIcon name="filter_alt" />
                    </span>
                    {conversionGrowth !== 0 && (
                      <p className="text-[10px] font-bold" style={{ color: conversionGrowth > 0 ? "#22c55e" : "#ef4444" }}>
                        {conversionGrowth > 0 ? "+" : ""}{conversionGrowth}% vs last mo.
                      </p>
                    )}
                    {leadGrowth !== 0 && (
                      <p className="text-[10px]" style={{ color: "#a1a1a1" }}>
                        Leads {leadGrowth > 0 ? "+" : ""}{leadGrowth}%
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="relative h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <div className="absolute top-0 left-0 h-full rounded-full" style={{ width: `${Math.min(99, convNum + 30)}%`, background: "#f2b90d" }} />
                  </div>
                  <div className="flex justify-between text-[10px] uppercase" style={{ color: "#a1a1a1", fontFamily: "system-ui, sans-serif" }}>
                    <span>Leads ({activeLeads})</span>
                    <span>Sales ({monthlySales})</span>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Revenue Growth Chart ── */}
            <section className="p-6 rounded-xl border" style={{ background: "#1c1c1c", borderColor: "rgba(255,255,255,0.05)" }}>
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-medium text-white">Revenue Growth</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ background: "#f2b90d" }} />
                    <span className="text-[10px]" style={{ color: "#a1a1a1", fontFamily: "system-ui, sans-serif" }}>Current</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }} />
                    <span className="text-[10px]" style={{ color: "#a1a1a1", fontFamily: "system-ui, sans-serif" }}>Past</span>
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-between h-40 gap-2 mb-2">
                {revenueBars.map((bar) => (
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
            <section className="rounded-xl border overflow-hidden" style={{ background: "#1c1c1c", borderColor: "rgba(255,255,255,0.05)" }}>
              <div className="p-5 flex items-center gap-4">
                <div className="relative">
                  <div
                    className="w-16 h-16 rounded-full overflow-hidden border-2 flex items-center justify-center text-xl font-bold"
                    style={{ borderColor: "#f2b90d", background: "rgba(242,185,13,0.1)", color: "#f2b90d" }}
                  >
                    {topVehicle ? topVehicle.name.slice(0, 2).toUpperCase() : "AV"}
                  </div>
                  <div
                    className="absolute -bottom-1 -right-1 rounded-full p-1 border-2"
                    style={{ background: "#f2b90d", color: "#121212", borderColor: "#1c1c1c" }}
                  >
                    <MaterialIcon name="workspace_premium" className="!text-[14px] font-bold" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] uppercase tracking-widest font-bold mb-0.5" style={{ color: "#f2b90d", fontFamily: "system-ui, sans-serif" }}>
                    {topVehicle ? "Top Selling Vehicle" : "Top Sales Executive"}
                  </p>
                  <h4 className="text-xl font-medium text-white truncate">
                    {topVehicle ? topVehicle.name : "Rajesh Kumar"}
                  </h4>
                  <p className="text-xs" style={{ color: "#a1a1a1", fontFamily: "system-ui, sans-serif" }}>
                    {topVehicle ? topVehicle.priceDisplay : `${monthlySales} vehicles sold this month`}
                  </p>
                </div>
                <span style={{ color: "rgba(161,161,161,0.3)" }}>
                  <MaterialIcon name="chevron_right" />
                </span>
              </div>
            </section>
          </>
        )}
      </main>

      {/* ── Bottom Nav ── */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 md:hidden">
        <div
          className="mx-auto max-w-md px-6 pb-8 pt-3 border-t"
          style={{ background: "rgba(18,18,18,0.9)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.05)" }}
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
                <span className={`text-[10px] tracking-tight ${item.active ? "font-bold" : "font-medium"}`} style={{ fontFamily: "system-ui, sans-serif" }}>
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
