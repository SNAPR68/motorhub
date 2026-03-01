"use client";

import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchAdminServices } from "@/lib/api";

/* Admin — Services Overview Page */

const TYPE_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  RC_TRANSFER: { label: "RC Transfer", icon: "description", color: "#2badee" },
  INSPECTION: { label: "Inspection", icon: "search", color: "#10b981" },
  SWAP: { label: "Swap", icon: "swap_horiz", color: "#f59e0b" },
  CROSS_STATE: { label: "Cross-State", icon: "local_shipping", color: "#8b5cf6" },
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#94a3b8",
  CONFIRMED: "#2badee",
  IN_PROGRESS: "#f59e0b",
  COMPLETED: "#10b981",
  CANCELLED: "#ef4444",
};

interface ServiceBooking {
  id: string;
  type: string;
  status: string;
  plan: string | null;
  amount: number | null;
  city: string | null;
  phone: string | null;
  createdAt: string;
}

function formatAmount(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}

export default function AdminServicesPage() {
  const { data, isLoading } = useApi(() => fetchAdminServices(), []);

  const bookings: ServiceBooking[] = data?.bookings ?? [];
  const byType = (data?.byType ?? {}) as Record<string, number>;
  const byStatus = (data?.byStatus ?? {}) as Record<string, number>;
  const revenue = (data?.revenue ?? { total: 0, completedCount: 0 }) as { total: number; completedCount: number };

  return (
    <div className="flex-1 overflow-y-auto pb-28 md:pb-8">
      <header className="sticky top-0 z-10 border-b border-white/[0.06] px-4 md:px-8 py-4" style={{ background: "rgba(10,17,20,0.9)", backdropFilter: "blur(12px)" }}>
        <h1 className="text-xl font-bold text-white">Services</h1>
        <p className="text-xs text-slate-500 mt-0.5">Service bookings & revenue pipeline</p>
      </header>

      <main className="px-4 md:px-8 py-6 max-w-6xl space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#2badee", borderTopColor: "transparent" }} />
          </div>
        ) : (
          <>
            {/* Service Type Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {Object.entries(TYPE_LABELS).map(([type, meta]) => (
                <div
                  key={type}
                  className="rounded-xl p-4 border border-white/[0.06]"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2" style={{ background: `${meta.color}15` }}>
                    <MaterialIcon name={meta.icon} className="text-[20px]" style={{ color: meta.color }} />
                  </div>
                  <p className="text-2xl font-black text-white">{byType[type] ?? 0}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{meta.label}</p>
                </div>
              ))}
            </div>

            {/* Revenue + Status Pipeline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* Revenue */}
              <div className="rounded-xl p-5 border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
                <h3 className="text-sm font-bold text-white mb-3">Revenue</h3>
                <p className="text-3xl font-black text-emerald-400">{formatAmount(revenue.total)}</p>
                <p className="text-xs text-slate-500 mt-1">from {revenue.completedCount} completed bookings</p>
              </div>

              {/* Status Pipeline */}
              <div className="rounded-xl p-5 border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
                <h3 className="text-sm font-bold text-white mb-3">Status Pipeline</h3>
                <div className="space-y-2">
                  {["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map((status) => {
                    const count = byStatus[status] ?? 0;
                    const total = bookings.length || 1;
                    const pct = Math.round((count / total) * 100);
                    return (
                      <div key={status}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-400">{status.replace(/_/g, " ")}</span>
                          <span className="text-xs font-bold" style={{ color: STATUS_COLORS[status] }}>{count}</span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: STATUS_COLORS[status] }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="rounded-xl border border-white/[0.06] overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
              <div className="px-4 py-3 border-b border-white/[0.06]">
                <h3 className="text-sm font-bold text-white">Recent Bookings ({bookings.length})</h3>
              </div>
              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <MaterialIcon name="build" className="text-[40px] text-slate-700 mb-2" />
                  <p className="text-sm text-slate-400">No service bookings yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.04]">
                  {bookings.map((b) => {
                    const meta = TYPE_LABELS[b.type] ?? { label: b.type, icon: "build", color: "#94a3b8" };
                    return (
                      <div key={b.id} className="flex items-center gap-3 px-4 py-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${meta.color}15` }}>
                          <MaterialIcon name={meta.icon} className="text-[16px]" style={{ color: meta.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white">{meta.label}</p>
                          <p className="text-[10px] text-slate-500">{b.city ?? "—"} &middot; {new Date(b.createdAt).toLocaleDateString()}</p>
                        </div>
                        {b.amount !== null && (
                          <span className="text-xs font-bold text-emerald-400 shrink-0">{formatAmount(b.amount)}</span>
                        )}
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0" style={{
                          background: `${STATUS_COLORS[b.status] ?? "#64748b"}15`,
                          color: STATUS_COLORS[b.status] ?? "#64748b",
                        }}>{b.status}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
