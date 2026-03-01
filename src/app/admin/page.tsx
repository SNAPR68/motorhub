"use client";

import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchAdminOverview } from "@/lib/api";

/* Admin Overview Dashboard — platform-wide KPIs */

function formatNum(n: number) {
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function GrowthBadge({ value }: { value: number }) {
  const positive = value >= 0;
  return (
    <span
      className="text-[11px] font-bold px-1.5 py-0.5 rounded-full"
      style={{
        background: positive ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
        color: positive ? "#10b981" : "#ef4444",
      }}
    >
      {positive ? "+" : ""}{value}%
    </span>
  );
}

export default function AdminOverviewPage() {
  const { data, isLoading } = useApi(() => fetchAdminOverview(), []);

  if (isLoading || !data) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#2badee", borderTopColor: "transparent" }} />
      </div>
    );
  }

  const d = data;

  return (
    <div className="flex-1 overflow-y-auto pb-28 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/[0.06] px-4 md:px-8 py-4" style={{ background: "rgba(10,17,20,0.9)", backdropFilter: "blur(12px)" }}>
        <h1 className="text-xl font-bold text-white">Platform Overview</h1>
        <p className="text-xs text-slate-500 mt-0.5">Real-time marketplace metrics</p>
      </header>

      <main className="px-4 md:px-8 py-6 max-w-6xl space-y-6">
        {/* Top KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Total Dealers", value: d.dealers.total, icon: "storefront", growth: d.dealers.growth, color: "#2badee" },
            { label: "Total Vehicles", value: d.vehicles.total, icon: "directions_car", sub: `${d.vehicles.available} available`, color: "#10b981" },
            { label: "Active Leads", value: d.leads.total, icon: "group", growth: d.leads.growth, color: "#f59e0b" },
            { label: "Total Buyers", value: d.buyers.total, icon: "person", growth: d.buyers.growth, color: "#8b5cf6" },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-xl p-4 border border-white/[0.06]"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${kpi.color}15` }}>
                  <MaterialIcon name={kpi.icon} className="text-[20px]" style={{ color: kpi.color }} />
                </div>
                {kpi.growth !== undefined && <GrowthBadge value={kpi.growth} />}
              </div>
              <p className="text-2xl font-black text-white">{formatNum(kpi.value)}</p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">{kpi.label}</p>
              {kpi.sub && <p className="text-[10px] mt-1" style={{ color: kpi.color }}>{kpi.sub}</p>}
            </div>
          ))}
        </div>

        {/* Growth + Subscriptions Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Growth Signals */}
          <div className="rounded-xl p-5 border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
            <h3 className="text-sm font-bold text-white mb-4">Month-over-Month Growth</h3>
            <div className="space-y-3">
              {[
                { label: "Dealer Signups", current: d.dealers.thisMonth, last: d.dealers.lastMonth, growth: d.dealers.growth },
                { label: "Buyer Registrations", current: d.buyers.thisMonth, last: d.buyers.lastMonth, growth: d.buyers.growth },
                { label: "New Leads", current: d.leads.thisMonth, last: d.leads.lastMonth, growth: d.leads.growth },
                { label: "Vehicles Listed", current: d.vehicles.listedThisMonth, last: 0, growth: 0 },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{row.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white">{row.current}</span>
                    <span className="text-[10px] text-slate-600">vs {row.last}</span>
                    <GrowthBadge value={row.growth} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subscription Distribution */}
          <div className="rounded-xl p-5 border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
            <h3 className="text-sm font-bold text-white mb-4">Subscription Plans</h3>
            <div className="space-y-3">
              {[
                { plan: "Starter", count: d.subscriptions.starter, color: "#94a3b8" },
                { plan: "Growth", count: d.subscriptions.growth, color: "#2badee" },
                { plan: "Enterprise", count: d.subscriptions.enterprise, color: "#f59e0b" },
              ].map((p) => (
                <div key={p.plan} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                    <span className="text-xs text-slate-400">{p.plan}</span>
                  </div>
                  <span className="text-sm font-bold text-white">{p.count} dealers</span>
                </div>
              ))}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-slate-400">Active Subscriptions</span>
                <span className="text-sm font-bold" style={{ color: "#2badee" }}>{d.subscriptions.active}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Sources + Inventory Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Lead Sources */}
          <div className="rounded-xl p-5 border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
            <h3 className="text-sm font-bold text-white mb-4">Lead Sources</h3>
            <div className="space-y-2">
              {Object.entries(d.leads.sources as Record<string, number>)
                .sort(([, a], [, b]) => b - a)
                .map(([source, count]) => {
                  const pct = d.leads.total > 0 ? Math.round((count / d.leads.total) * 100) : 0;
                  return (
                    <div key={source}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-400">{source}</span>
                        <span className="text-xs font-bold text-white">{count} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "#2badee" }} />
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-xs text-slate-400">Conversion Rate</span>
              <span className="text-sm font-bold text-emerald-400">{d.leads.conversionRate}%</span>
            </div>
          </div>

          {/* Inventory Health */}
          <div className="rounded-xl p-5 border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
            <h3 className="text-sm font-bold text-white mb-4">Inventory Health</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-lg p-3" style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.1)" }}>
                <p className="text-lg font-black text-emerald-400">{d.vehicles.sellThroughRate}%</p>
                <p className="text-[10px] text-slate-500">Sell-Through Rate</p>
              </div>
              <div className="rounded-lg p-3" style={{ background: "rgba(43,173,238,0.05)", border: "1px solid rgba(43,173,238,0.1)" }}>
                <p className="text-lg font-black" style={{ color: "#2badee" }}>{d.vehicles.avgAiScore}</p>
                <p className="text-[10px] text-slate-500">Avg AI Score</p>
              </div>
            </div>
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Stale Inventory</h4>
            <div className="space-y-2">
              {[
                { label: "> 30 days", count: d.vehicles.stale.over30, color: "#f59e0b" },
                { label: "> 60 days", count: d.vehicles.stale.over60, color: "#f97316" },
                { label: "> 90 days", count: d.vehicles.stale.over90, color: "#ef4444" },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{s.label}</span>
                  <span className="text-xs font-bold" style={{ color: s.color }}>{s.count} vehicles</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Services + AI Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="rounded-xl p-5 border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
            <h3 className="text-sm font-bold text-white mb-3">Services</h3>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-2xl font-black text-white">{d.services.total}</p>
                <p className="text-[10px] text-slate-500">Total Bookings</p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-400">{d.services.completed}</p>
                <p className="text-[10px] text-slate-500">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-black" style={{ color: "#2badee" }}>{formatNum(d.services.revenue)}</p>
                <p className="text-[10px] text-slate-500">Revenue</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl p-5 border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
            <h3 className="text-sm font-bold text-white mb-3">AI Activity</h3>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-2xl font-black" style={{ color: "#8b5cf6" }}>{d.aiActivity.autoReplies}</p>
                <p className="text-[10px] text-slate-500">AI Auto-Replies</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">{d.aiActivity.totalMessages}</p>
                <p className="text-[10px] text-slate-500">Total Messages</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl p-5 border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
          <h3 className="text-sm font-bold text-white mb-4">Recent Activity</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Recent Dealers */}
            <div>
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">New Dealers</h4>
              <div className="space-y-2">
                {(d.recent.dealers as Array<{ id: string; dealershipName: string; city: string; plan: string; createdAt: string }>).map((dealer) => (
                  <div key={dealer.id} className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{dealer.dealershipName}</p>
                      <p className="text-[10px] text-slate-500">{dealer.city}</p>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0" style={{
                      background: dealer.plan === "ENTERPRISE" ? "rgba(245,158,11,0.1)" : dealer.plan === "GROWTH" ? "rgba(43,173,238,0.1)" : "rgba(148,163,184,0.1)",
                      color: dealer.plan === "ENTERPRISE" ? "#f59e0b" : dealer.plan === "GROWTH" ? "#2badee" : "#94a3b8",
                    }}>{dealer.plan}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Leads */}
            <div>
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">New Leads</h4>
              <div className="space-y-2">
                {(d.recent.leads as Array<{ id: string; buyerName: string; source: string; sentimentLabel: string; vehicle?: { name: string } | null }>).map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{lead.buyerName}</p>
                      <p className="text-[10px] text-slate-500">{lead.vehicle?.name ?? lead.source}</p>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0" style={{
                      background: lead.sentimentLabel === "HOT" ? "rgba(239,68,68,0.1)" : lead.sentimentLabel === "WARM" ? "rgba(245,158,11,0.1)" : "rgba(148,163,184,0.1)",
                      color: lead.sentimentLabel === "HOT" ? "#ef4444" : lead.sentimentLabel === "WARM" ? "#f59e0b" : "#94a3b8",
                    }}>{lead.sentimentLabel}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Services */}
            <div>
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Service Bookings</h4>
              <div className="space-y-2">
                {(d.recent.services as Array<{ id: string; type: string; status: string; city: string | null }>).map((svc) => (
                  <div key={svc.id} className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{svc.type.replace(/_/g, " ")}</p>
                      <p className="text-[10px] text-slate-500">{svc.city ?? "N/A"}</p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{svc.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Quick Alerts */}
        {d.quickAlerts && (
          <div className="rounded-xl p-5 border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="flex items-center gap-2 mb-4">
              <MaterialIcon name="warning" className="text-[18px]" style={{ color: "#f59e0b" }} />
              <h3 className="text-sm font-bold text-white">Quick Alerts</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { label: "Stale Inventory (>60d)", value: d.quickAlerts.staleOver60, color: d.quickAlerts.staleOver60 > 0 ? "#f59e0b" : "#10b981" },
                { label: "Unresponsive Leads", value: d.quickAlerts.unresponsiveLeads, color: d.quickAlerts.unresponsiveLeads > 0 ? "#ef4444" : "#10b981" },
                { label: "Cancelled This Month", value: d.quickAlerts.cancelledThisMonth, color: d.quickAlerts.cancelledThisMonth > 0 ? "#ef4444" : "#10b981" },
              ].map((a) => (
                <div key={a.label} className="flex items-center gap-3 rounded-lg p-3" style={{ background: `${a.color}10` }}>
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: a.color }} />
                  <div>
                    <p className="text-sm font-bold text-white">{a.value}</p>
                    <p className="text-[10px] text-slate-500">{a.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
