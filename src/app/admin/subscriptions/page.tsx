"use client";

import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchAdminSubscriptions } from "@/lib/api";

/* Admin — Subscriptions & Revenue Page */

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "#10b981",
  TRIALING: "#2badee",
  PAST_DUE: "#f59e0b",
  CANCELLED: "#ef4444",
};

interface Subscription {
  id: string;
  dealerName: string;
  city: string;
  plan: string;
  status: string;
  periodStart: string | null;
  periodEnd: string | null;
  razorpayId: string | null;
  createdAt: string;
}

export default function AdminSubscriptionsPage() {
  const { data, isLoading } = useApi(() => fetchAdminSubscriptions(), []);

  const subscriptions: Subscription[] = data?.subscriptions ?? [];
  const planDist = (data?.planDistribution ?? {}) as Record<string, number>;
  const statusCounts = (data?.statusCounts ?? { active: 0, trialing: 0, pastDue: 0, cancelled: 0 }) as Record<string, number>;

  return (
    <div className="flex-1 overflow-y-auto pb-28 md:pb-8">
      <header className="sticky top-0 z-10 border-b border-white/[0.06] px-4 md:px-8 py-4" style={{ background: "rgba(10,17,20,0.9)", backdropFilter: "blur(12px)" }}>
        <h1 className="text-xl font-bold text-white">Subscriptions</h1>
        <p className="text-xs text-slate-500 mt-0.5">Plan distribution & billing overview</p>
      </header>

      <main className="px-4 md:px-8 py-6 max-w-6xl space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#2badee", borderTopColor: "transparent" }} />
          </div>
        ) : (
          <>
            {/* Plan Distribution Cards */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { plan: "STARTER", label: "Starter", color: "#94a3b8" },
                { plan: "GROWTH", label: "Growth", color: "#2badee" },
                { plan: "ENTERPRISE", label: "Enterprise", color: "#f59e0b" },
              ].map((p) => (
                <div
                  key={p.plan}
                  className="rounded-xl p-4 border border-white/[0.06] text-center"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                >
                  <p className="text-3xl font-black text-white">{planDist[p.plan] ?? 0}</p>
                  <p className="text-[11px] font-bold mt-1" style={{ color: p.color }}>{p.label}</p>
                </div>
              ))}
            </div>

            {/* Status Breakdown */}
            <div className="rounded-xl p-5 border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
              <h3 className="text-sm font-bold text-white mb-3">Subscription Status</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { key: "active", label: "Active" },
                  { key: "trialing", label: "Trialing" },
                  { key: "pastDue", label: "Past Due" },
                  { key: "cancelled", label: "Cancelled" },
                ].map((s) => (
                  <div key={s.key} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: STATUS_COLORS[s.key.toUpperCase()] ?? STATUS_COLORS[s.label.toUpperCase().replace(" ", "_")] ?? "#64748b" }} />
                    <span className="text-xs text-slate-400">{s.label}:</span>
                    <span className="text-xs font-bold text-white">{statusCounts[s.key] ?? 0}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscriptions Table */}
            <div className="rounded-xl border border-white/[0.06] overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
              <div className="px-4 py-3 border-b border-white/[0.06]">
                <h3 className="text-sm font-bold text-white">All Subscriptions ({subscriptions.length})</h3>
              </div>
              {subscriptions.length === 0 ? (
                <div className="text-center py-12">
                  <MaterialIcon name="payments" className="text-[40px] text-slate-700 mb-2" />
                  <p className="text-sm text-slate-400">No subscriptions yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.04]">
                  {subscriptions.map((sub) => (
                    <div key={sub.id} className="flex items-center gap-3 px-4 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{sub.dealerName}</p>
                        <p className="text-[10px] text-slate-500">{sub.city}</p>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0" style={{
                        background: sub.plan === "ENTERPRISE" ? "rgba(245,158,11,0.1)" : "rgba(43,173,238,0.1)",
                        color: sub.plan === "ENTERPRISE" ? "#f59e0b" : "#2badee",
                      }}>{sub.plan}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0" style={{
                        background: `${STATUS_COLORS[sub.status] ?? "#64748b"}15`,
                        color: STATUS_COLORS[sub.status] ?? "#64748b",
                      }}>{sub.status}</span>
                      <span className="text-[10px] text-slate-500 shrink-0 hidden sm:block">
                        {sub.periodEnd ? new Date(sub.periodEnd).toLocaleDateString() : "—"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
