"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchAdminDealers, updateDealerAdmin, type AdminDealer } from "@/lib/api";

/* Admin — Dealer Management Page */

const PLAN_COLORS: Record<string, { bg: string; color: string }> = {
  STARTER: { bg: "rgba(148,163,184,0.1)", color: "#94a3b8" },
  GROWTH: { bg: "rgba(43,173,238,0.1)", color: "#2badee" },
  ENTERPRISE: { bg: "rgba(245,158,11,0.1)", color: "#f59e0b" },
};

export default function AdminDealersPage() {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const { data, isLoading, refetch } = useApi(
    () => fetchAdminDealers({ search, plan: planFilter }),
    [search, planFilter]
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [changingPlan, setChangingPlan] = useState<string | null>(null);

  const dealers: AdminDealer[] = data?.dealers ?? [];

  async function handlePlanChange(dealerId: string, newPlan: string) {
    setChangingPlan(dealerId);
    try {
      await updateDealerAdmin(dealerId, { plan: newPlan });
      refetch();
    } catch (err) {
      console.error("Failed to update dealer plan:", err);
    } finally {
      setChangingPlan(null);
    }
  }

  return (
    <div className="flex-1 overflow-y-auto pb-28 md:pb-8">
      <header className="sticky top-0 z-10 border-b border-white/[0.06] px-4 md:px-8 py-4" style={{ background: "rgba(10,17,20,0.9)", backdropFilter: "blur(12px)" }}>
        <h1 className="text-xl font-bold text-white">Dealer Management</h1>
        <p className="text-xs text-slate-500 mt-0.5">{dealers.length} registered dealers</p>
      </header>

      <main className="px-4 md:px-8 py-6 max-w-6xl space-y-4">
        {/* Search + Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <MaterialIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full h-10 pl-10 pr-4 rounded-xl text-sm text-white placeholder:text-slate-600 outline-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
          </div>
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="h-10 px-3 rounded-xl text-sm font-medium outline-none"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8" }}
          >
            <option value="">All Plans</option>
            <option value="STARTER">Starter</option>
            <option value="GROWTH">Growth</option>
            <option value="ENTERPRISE">Enterprise</option>
          </select>
        </div>

        {/* Dealer List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.03)" }} />
            ))}
          </div>
        ) : dealers.length === 0 ? (
          <div className="text-center py-16">
            <MaterialIcon name="storefront" className="text-[48px] text-slate-700 mb-3" />
            <p className="text-sm text-slate-400">No dealers found.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {dealers.map((dealer) => {
              const expanded = expandedId === dealer.id;
              const planStyle = PLAN_COLORS[dealer.plan] ?? PLAN_COLORS.STARTER;
              return (
                <div
                  key={dealer.id}
                  className="rounded-xl border border-white/[0.06] overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                >
                  <button
                    onClick={() => setExpandedId(expanded ? null : dealer.id)}
                    className="w-full flex items-center gap-3 p-4 text-left"
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(43,173,238,0.1)" }}>
                      <MaterialIcon name="storefront" className="text-[20px]" style={{ color: "#2badee" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-white truncate">{dealer.dealershipName}</p>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0" style={{ background: planStyle.bg, color: planStyle.color }}>{dealer.plan}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{dealer.email} &middot; {dealer.city}, {dealer.state}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-4 shrink-0">
                      <div className="text-center">
                        <p className="text-sm font-bold text-white">{dealer.vehicleCount}</p>
                        <p className="text-[10px] text-slate-500">Vehicles</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-white">{dealer.leadCount}</p>
                        <p className="text-[10px] text-slate-500">Leads</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-emerald-400">{dealer.closedWonCount}</p>
                        <p className="text-[10px] text-slate-500">Deals</p>
                      </div>
                    </div>
                    <MaterialIcon name={expanded ? "expand_less" : "expand_more"} className="text-[20px] text-slate-500 shrink-0" />
                  </button>

                  {expanded && (
                    <div className="px-4 pb-4 pt-0 border-t border-white/[0.06]">
                      {/* Mobile stats */}
                      <div className="flex gap-4 sm:hidden py-3">
                        <div><span className="text-sm font-bold text-white">{dealer.vehicleCount}</span> <span className="text-[10px] text-slate-500">vehicles</span></div>
                        <div><span className="text-sm font-bold text-white">{dealer.leadCount}</span> <span className="text-[10px] text-slate-500">leads</span></div>
                        <div><span className="text-sm font-bold text-emerald-400">{dealer.closedWonCount}</span> <span className="text-[10px] text-slate-500">deals</span></div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <p className="text-xs text-slate-400">
                          Owner: <span className="text-white font-medium">{dealer.ownerName || "—"}</span>
                        </p>
                        <p className="text-xs text-slate-400">
                          Joined: <span className="text-white font-medium">{new Date(dealer.createdAt).toLocaleDateString()}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs text-slate-500">Change Plan:</span>
                        {["STARTER", "GROWTH", "ENTERPRISE"].map((p) => (
                          <button
                            key={p}
                            onClick={() => handlePlanChange(dealer.id, p)}
                            disabled={dealer.plan === p || changingPlan === dealer.id}
                            className="text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all disabled:opacity-30"
                            style={{
                              background: dealer.plan === p ? (PLAN_COLORS[p]?.bg ?? "") : "rgba(255,255,255,0.05)",
                              color: dealer.plan === p ? (PLAN_COLORS[p]?.color ?? "") : "#64748b",
                              border: `1px solid ${dealer.plan === p ? (PLAN_COLORS[p]?.color ?? "") + "30" : "rgba(255,255,255,0.08)"}`,
                            }}
                          >
                            {changingPlan === dealer.id ? "..." : p}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
