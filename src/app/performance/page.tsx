"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchDashboard } from "@/lib/api";
import { SkeletonCard } from "@/components/ui/Skeleton";

/* ── design tokens: ai_performance_analytics_(dark) ── */
// primary: #137fec, accent-cyan: #00f2ff, font: Inter, bg: #0b0e14, card: #161b22

export default function PerformancePage() {
  const { data, isLoading } = useApi(() => fetchDashboard(), []);
  const stats = data?.stats as Record<string, unknown> | undefined;

  const totalVehicles   = (stats?.totalVehicles as number)   ?? 0;
  const availableVehicles = (stats?.availableVehicles as number) ?? 0;
  const activeLeads     = (stats?.activeLeads as number)     ?? 0;
  const hotLeads        = (stats?.hotLeads as number)        ?? 0;
  const conversionRate  = (stats?.conversionRate as string)  ?? "0%";
  const revenue         = (stats?.revenue as string)         ?? "₹0";
  const aiRepliesSent   = (stats?.aiRepliesSent as number)   ?? 0;
  const upcomingAppts   = (stats?.upcomingAppointments as number) ?? 0;
  const monthlySales    = (stats?.monthlySales as number)    ?? 0;

  // Compute gauge offsets from real data (0-100 scale → 0-100 dashoffset)
  const convNum = parseInt(conversionRate) || 0;
  const gauges = [
    { label: "Lead Conversion", value: conversionRate, offset: 100 - convNum, color: "#137fec" },
    { label: "Hot Leads", value: String(hotLeads), offset: Math.max(0, 100 - Math.min(hotLeads * 5, 100)), color: "#00f2ff" },
    { label: "AI Replies", value: String(aiRepliesSent), offset: Math.max(0, 100 - Math.min(aiRepliesSent * 2, 100)), color: "#a855f7" },
  ];

  // Bar chart: available vs sold by category (derived from totals as ratio)
  const soldPct = totalVehicles > 0 ? Math.round((monthlySales / totalVehicles) * 100) : 0;
  const availPct = totalVehicles > 0 ? Math.round((availableVehicles / totalVehicles) * 100) : 0;

  const activities = data?.activities ?? [];

  return (
    <div
      className="min-h-screen max-w-md mx-auto flex flex-col pb-24"
      style={{ fontFamily: "'Inter', sans-serif", background: "#0b0e14", color: "#e2e8f0" }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4 sticky top-0 z-50 border-b"
        style={{ background: "rgba(11,14,20,0.8)", backdropFilter: "blur(12px)", borderColor: "rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center border" style={{ background: "rgba(19,127,236,0.2)", borderColor: "rgba(19,127,236,0.3)" }}>
            <MaterialIcon name="analytics" className="text-[#137fec]" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">AI Analytics</h1>
        </div>
        <Link href="/dashboard" className="p-2 text-slate-400 hover:text-white transition-colors">
          <MaterialIcon name="monitoring" />
        </Link>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-4">
        {isLoading ? (
          <div className="mt-6 space-y-4">
            <SkeletonCard variant="dark" />
            <SkeletonCard variant="dark" />
          </div>
        ) : (
          <>
            {/* Hero ROI Card */}
            <section className="mt-6">
              <div className="rounded-xl p-6 relative overflow-hidden" style={{ background: "rgba(22,27,34,0.8)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 0 15px rgba(19,127,236,0.3)" }}>
                <div className="relative z-10">
                  <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#137fec" }}>Total Revenue</p>
                  <div className="flex items-end gap-3 mt-1">
                    <h2 className="text-4xl font-bold tracking-tight text-white">{revenue}</h2>
                    <span className="mb-1 text-emerald-400 font-medium text-sm flex items-center">
                      <MaterialIcon name="trending_up" className="text-sm mr-1" />
                      {conversionRate} conv.
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mt-1 italic font-light">From {monthlySales} vehicles sold</p>
                </div>
                <svg className="absolute bottom-0 right-0 w-full h-24 opacity-20 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 400 100">
                  <defs>
                    <linearGradient id="roiGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#137fec" stopOpacity="1" />
                      <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,80 Q50,70 100,85 T200,50 T300,30 T400,10 L400,100 L0,100 Z" fill="url(#roiGrad)" />
                </svg>
              </div>
            </section>

            {/* Quick Stats Row */}
            <section className="mt-6 grid grid-cols-3 gap-3">
              {[
                { label: "Total Cars", value: totalVehicles, icon: "directions_car", color: "#137fec" },
                { label: "Available", value: availableVehicles, icon: "check_circle", color: "#22c55e" },
                { label: "Active Leads", value: activeLeads, icon: "group", color: "#f59e0b" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl p-4 flex flex-col items-center text-center" style={{ background: "rgba(22,27,34,0.8)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <MaterialIcon name={s.icon} className="mb-2" style={{ color: s.color }} />
                  <p className="text-xl font-bold text-white">{s.value}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </section>

            {/* Gauge Metrics */}
            <section className="mt-8">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest px-1 mb-4">AI Efficiency Metrics</h3>
              <div className="flex items-center justify-between gap-3">
                {gauges.map((g) => (
                  <div key={g.label} className="flex flex-col items-center gap-3 rounded-xl p-4 flex-1" style={{ background: "rgba(22,27,34,0.8)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="relative w-16 h-16">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" fill="none" strokeWidth="3" stroke="#1e293b" />
                        <circle cx="18" cy="18" r="16" fill="none" strokeWidth="3" stroke={g.color} strokeDasharray="100" strokeDashoffset={g.offset} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{g.value}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-center font-medium leading-tight text-slate-400">{g.label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Inventory Health */}
            <section className="mt-8">
              <div className="rounded-xl p-6" style={{ background: "rgba(22,27,34,0.8)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-lg text-white">Inventory Health</h3>
                    <p className="text-xs text-slate-400">Available vs Sold ratio</p>
                  </div>
                  <span className="text-xs text-slate-400">{totalVehicles} total</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Available</span>
                      <span style={{ color: "#137fec" }}>{availPct}%</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div className="h-full rounded-full" style={{ width: `${availPct}%`, background: "#137fec" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Sold</span>
                      <span style={{ color: "#00f2ff" }}>{soldPct}%</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                      <div className="h-full rounded-full" style={{ width: `${soldPct}%`, background: "#00f2ff" }} />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Upcoming Appointments */}
            <section className="mt-8">
              <div className="rounded-xl p-4" style={{ background: "rgba(22,27,34,0.8)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white">Upcoming Appointments</h3>
                  <Link href="/appointments" className="text-xs font-bold" style={{ color: "#137fec" }}>View All</Link>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: "rgba(19,127,236,0.15)", border: "1px solid rgba(19,127,236,0.2)" }}>
                    <span className="text-2xl font-bold" style={{ color: "#137fec" }}>{upcomingAppts}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">Test drives scheduled</p>
                    <p className="text-xs text-slate-400">Across all locations</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Activity */}
            {activities.length > 0 && (
              <section className="mt-8 mb-4">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest px-1 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {activities.slice(0, 4).map((act) => (
                    <div key={(act as { id: string }).id} className="rounded-xl p-3 flex items-center gap-4" style={{ background: "rgba(22,27,34,0.8)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(19,127,236,0.15)" }}>
                        <MaterialIcon name="bolt" className="text-[#137fec] text-sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-white truncate">{(act as { title: string }).title}</h4>
                        <p className="text-xs text-slate-400 truncate">{(act as { description: string }).description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 px-4 pb-6 pt-3 border-t md:hidden" style={{ background: "rgba(11,14,20,0.9)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="flex items-center justify-around max-w-md mx-auto">
          {[
            { icon: "directions_car", label: "Inventory", href: "/inventory" },
            { icon: "campaign", label: "Marketing", href: "/social-hub" },
            { icon: "bar_chart", label: "Analytics", href: "/performance", active: true },
            { icon: "settings", label: "Settings", href: "/settings" },
          ].map((item) => (
            <Link key={item.label} href={item.href} className={`flex flex-col items-center gap-1 ${item.active ? "text-[#137fec]" : "text-slate-500"}`}>
              <MaterialIcon name={item.icon} fill={item.active} />
              <span className={`text-[10px] uppercase tracking-tight ${item.active ? "font-bold" : "font-medium"}`}>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
