"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";

/* Stitch: dealer_executive_dashboard_2 — #7311d4, Plus Jakarta Sans, #101622 */

const MARKET_DATA = [
  { label: "Avg. Price", value: "₹12.5L", change: "+3.2%", icon: "trending_up", color: "#10b981" },
  { label: "Demand Index", value: "94", change: "+8%", icon: "trending_up", color: "#10b981" },
  { label: "Days to Sell", value: "18", change: "-2", icon: "trending_down", color: "#10b981" },
];

const AI_INSIGHTS = [
  { title: "Creta demand up 12%", desc: "SUV segment showing strong buyer intent in Mumbai & Delhi. Consider adding more Creta variants.", icon: "auto_awesome", urgent: true },
  { title: "Price correction for Swift", desc: "Market data suggests Swift ZXi+ prices will drop 5% next month. Ideal time to acquire inventory.", icon: "show_chart", urgent: false },
  { title: "EV buyers increasing", desc: "Electric vehicle inquiries up 34% this quarter. Nexon EV and MG ZS EV lead interest.", icon: "bolt", urgent: false },
];

const QUICK_ACTIONS = [
  { icon: "add_circle", label: "Add Vehicle", href: "/inventory" },
  { icon: "group", label: "View Leads", href: "/leads" },
  { icon: "analytics", label: "Analytics", href: "/analytics" },
  { icon: "query_stats", label: "Intelligence", href: "/intelligence" },
];

export default function DashboardExecutivePage() {
  return (
    <div
      className="min-h-dvh w-full flex flex-col max-w-md mx-auto text-slate-100 pb-24"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#101622" }}
    >
      {/* Header */}
      <header className="sticky top-0 z-30 px-4 py-4 flex items-center justify-between border-b"
        style={{ background: "rgba(16,22,34,0.8)", backdropFilter: "blur(12px)", borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-[#7311d4]/20 border border-[#7311d4]/30 flex items-center justify-center text-[#7311d4] font-bold text-sm">AV</div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500">Good Morning</p>
            <h1 className="text-lg font-bold">Alex Sterling</h1>
          </div>
        </div>
        <button className="size-10 rounded-full bg-white/5 flex items-center justify-center relative">
          <MaterialIcon name="notifications" className="text-slate-400" />
          <div className="absolute top-1 right-1 size-2 rounded-full bg-red-500" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-8">
        {/* Market Data Scroll */}
        <section className="py-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Market Pulse</h2>
          <div className="flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4">
            {MARKET_DATA.map((m) => (
              <div key={m.label} className="min-w-[140px] rounded-xl p-4 shrink-0"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">{m.label}</p>
                <p className="text-2xl font-bold text-white">{m.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  <MaterialIcon name={m.icon} className="text-xs" style={{ color: m.color }} />
                  <span className="text-xs font-bold" style={{ color: m.color }}>{m.change}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI Insight Cards */}
        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">AI Insights</h2>
            <button className="text-xs text-[#7311d4] font-bold uppercase tracking-wider">View All</button>
          </div>
          <div className="space-y-3">
            {AI_INSIGHTS.map((insight) => (
              <div key={insight.title} className="rounded-xl p-4"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-lg bg-[#7311d4]/10 flex items-center justify-center shrink-0">
                    <MaterialIcon name={insight.icon} className="text-[#7311d4]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{insight.title}</h3>
                      {insight.urgent && (
                        <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">Urgent</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{insight.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Inventory Alerts */}
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Inventory Alerts</h2>
          <div className="rounded-xl p-4 flex items-center gap-3"
            style={{ background: "rgba(115,17,212,0.05)", border: "1px solid rgba(115,17,212,0.15)" }}>
            <MaterialIcon name="inventory_2" className="text-[#7311d4] text-2xl" />
            <div className="flex-1">
              <p className="text-sm font-bold text-white">3 vehicles arriving this week</p>
              <p className="text-xs text-slate-400 mt-0.5">Creta SX, Nexon EV, Swift ZXi — ready for listing</p>
            </div>
            <MaterialIcon name="chevron_right" className="text-slate-500" />
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-4 gap-3">
            {QUICK_ACTIONS.map((a) => (
              <Link key={a.label} href={a.href} className="flex flex-col items-center gap-2">
                <div className="size-14 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-[#7311d4] hover:border-[#7311d4]/30 transition-colors">
                  <MaterialIcon name={a.icon} className="text-2xl" />
                </div>
                <span className="text-[10px] font-medium text-slate-500">{a.label}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 border-t px-6 pb-6 pt-3 flex justify-between items-center"
        style={{ background: "rgba(16,22,34,0.95)", backdropFilter: "blur(16px)", borderColor: "rgba(255,255,255,0.05)" }}>
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-[#7311d4]">
          <MaterialIcon name="dashboard" fill className="text-2xl" />
          <span className="text-[10px] font-bold uppercase">Dashboard</span>
        </Link>
        <Link href="/inventory" className="flex flex-col items-center gap-1 text-slate-500">
          <MaterialIcon name="directions_car" className="text-2xl" />
          <span className="text-[10px] font-bold uppercase">Inventory</span>
        </Link>
        <Link href="/studio" className="relative -top-4">
          <div className="size-14 rounded-full bg-[#7311d4] flex items-center justify-center shadow-lg shadow-[#7311d4]/30 border-4 border-[#101622]">
            <MaterialIcon name="auto_awesome" className="text-white text-2xl" />
          </div>
        </Link>
        <Link href="/leads" className="flex flex-col items-center gap-1 text-slate-500">
          <MaterialIcon name="group" className="text-2xl" />
          <span className="text-[10px] font-bold uppercase">Leads</span>
        </Link>
        <Link href="/settings" className="flex flex-col items-center gap-1 text-slate-500">
          <MaterialIcon name="settings" className="text-2xl" />
          <span className="text-[10px] font-bold uppercase">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
