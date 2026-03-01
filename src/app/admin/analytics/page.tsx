"use client";

import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchAdminAnalytics } from "@/lib/api";

const PLAN_COLORS: Record<string, string> = {
  STARTER: "#94a3b8",
  GROWTH: "#2badee",
  ENTERPRISE: "#f59e0b",
};

export default function AdminAnalyticsPage() {
  const { data, isLoading } = useApi(() => fetchAdminAnalytics(), []);

  if (isLoading || !data) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#2badee", borderTopColor: "transparent" }} />
      </div>
    );
  }

  const { revenue, ltvByPlan, funnel, monthlyTrends, geographic } = data;
  const maxDealers = Math.max(...monthlyTrends.map((m: { dealers: number }) => m.dealers), 1);

  return (
    <div className="flex-1 overflow-y-auto pb-28 md:pb-8">
      <div className="px-4 md:px-8 py-6 max-w-6xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Analytics & Revenue</h1>
          <p className="text-sm text-slate-500 mt-1">Financial metrics, funnel, and geographic data</p>
        </div>

        {/* Revenue KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "MRR", value: `₹${(revenue.mrr / 1000).toFixed(1)}K`, icon: "currency_rupee", color: "#10b981" },
            { label: "ARPU", value: `₹${revenue.arpu.toLocaleString("en-IN")}`, icon: "person", color: "#2badee" },
            { label: "Churn Rate", value: `${revenue.churnRate}%`, icon: "trending_down", color: revenue.churnRate > 10 ? "#ef4444" : "#f59e0b" },
            { label: "Active Subs", value: revenue.activeSubs, icon: "check_circle", color: "#10b981" },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-xl p-4 border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: `${kpi.color}15` }}>
                <MaterialIcon name={kpi.icon} className="text-[18px]" style={{ color: kpi.color }} />
              </div>
              <p className="text-2xl font-bold text-white">{kpi.value}</p>
              <p className="text-xs text-slate-500 mt-1">{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Funnel */}
        <div className="rounded-xl p-5 border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
          <h2 className="text-base font-bold text-white mb-4">Dealer Funnel</h2>
          <div className="space-y-3">
            {[
              { label: "Total Dealers", value: funnel.totalDealers, pct: 100, color: "#94a3b8" },
              { label: "Active Subscribers", value: funnel.activeSubs, pct: funnel.conversionToActive, color: "#2badee" },
              { label: "Paid Subscribers", value: funnel.paidSubs, pct: funnel.conversionToPaid, color: "#10b981" },
            ].map((step) => (
              <div key={step.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-400">{step.label}</span>
                  <span className="text-sm font-bold text-white">{step.value} <span className="text-xs font-normal text-slate-500">({step.pct}%)</span></span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.max(step.pct, 2)}%`, background: step.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LTV by Plan */}
        <div className="rounded-xl p-5 border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
          <h2 className="text-base font-bold text-white mb-4">LTV by Plan</h2>
          <div className="grid grid-cols-3 gap-3">
            {ltvByPlan.map((p: { plan: string; price: number; activeSubs: number; monthlyRevenue: number; estimatedLtv: number }) => (
              <div key={p.plan} className="rounded-lg p-3 border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
                <p className="text-xs font-bold mb-1" style={{ color: PLAN_COLORS[p.plan] || "#94a3b8" }}>{p.plan}</p>
                <p className="text-lg font-bold text-white">₹{p.estimatedLtv.toLocaleString("en-IN")}</p>
                <p className="text-[10px] text-slate-500 mt-1">{p.activeSubs} active | ₹{p.price}/mo</p>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="rounded-xl p-5 border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
          <h2 className="text-base font-bold text-white mb-4">Monthly Trends (6 months)</h2>
          <div className="flex items-end gap-2 h-32">
            {monthlyTrends.map((m: { label: string; dealers: number; subscriptions: number }) => (
              <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-slate-400">{m.dealers}</span>
                <div className="w-full rounded-t" style={{ height: `${Math.max((m.dealers / maxDealers) * 100, 4)}%`, background: "#2badee", minHeight: "4px" }} />
                <span className="text-[9px] text-slate-500">{m.label}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1.5 text-[10px] text-slate-400"><span className="w-2 h-2 rounded-full" style={{ background: "#2badee" }} /> Dealer Signups</span>
          </div>
        </div>

        {/* Geographic Table */}
        <div className="rounded-xl p-5 border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
          <h2 className="text-base font-bold text-white mb-4">Geographic Distribution</h2>
          {geographic.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No geographic data yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-white/[0.06]">
                    <th className="pb-2 font-medium">City</th>
                    <th className="pb-2 font-medium text-right">Dealers</th>
                    <th className="pb-2 font-medium text-right">Leads</th>
                    <th className="pb-2 font-medium text-right">Won</th>
                  </tr>
                </thead>
                <tbody>
                  {geographic.map((g: { city: string; dealers: number; leads: number; closedWon: number }) => (
                    <tr key={g.city} className="border-b border-white/[0.04]">
                      <td className="py-2.5 text-white font-medium">{g.city}</td>
                      <td className="py-2.5 text-right text-slate-400">{g.dealers}</td>
                      <td className="py-2.5 text-right text-slate-400">{g.leads}</td>
                      <td className="py-2.5 text-right" style={{ color: "#10b981" }}>{g.closedWon}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
