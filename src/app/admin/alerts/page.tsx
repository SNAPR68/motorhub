"use client";

import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchAdminAlerts } from "@/lib/api";

export default function AdminAlertsPage() {
  const { data, isLoading } = useApi(() => fetchAdminAlerts(), []);

  if (isLoading || !data) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "#2badee", borderTopColor: "transparent" }} />
      </div>
    );
  }

  const { today, thresholds, digest } = data;

  return (
    <div className="flex-1 overflow-y-auto pb-28 md:pb-8">
      <div className="px-4 md:px-8 py-6 max-w-6xl space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Alerts & Monitoring</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time alerts, thresholds, and digest preview</p>
        </div>

        {/* Today's Activity */}
        <div className="rounded-xl p-5 border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
          <div className="flex items-center gap-2 mb-4">
            <MaterialIcon name="today" className="text-[18px]" style={{ color: "#2badee" }} />
            <h2 className="text-base font-bold text-white">Today&apos;s Activity</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "New Signups", value: today.signups, icon: "person_add", color: "#2badee" },
              { label: "Deals Closed", value: today.dealsClosed, icon: "handshake", color: "#10b981" },
              { label: "Services Booked", value: today.servicesBooked, icon: "build", color: "#8b5cf6" },
            ].map((item) => (
              <div key={item.label} className="rounded-lg p-3 text-center border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
                <MaterialIcon name={item.icon} className="text-[22px] mb-1" style={{ color: item.color }} />
                <p className="text-xl font-bold text-white">{item.value}</p>
                <p className="text-[10px] text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Threshold Warnings */}
        <div className="rounded-xl p-5 border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
          <div className="flex items-center gap-2 mb-4">
            <MaterialIcon name="warning" className="text-[18px]" style={{ color: "#f59e0b" }} />
            <h2 className="text-base font-bold text-white">Threshold Warnings</h2>
          </div>
          <div className="space-y-3">
            <ThresholdRow
              icon="inventory_2"
              label="Stale Inventory"
              detail={`${thresholds.staleInventory} vehicles listed >60 days`}
              severity={thresholds.staleInventory > 10 ? "high" : thresholds.staleInventory > 0 ? "medium" : "ok"}
            />
            <ThresholdRow
              icon="cancel"
              label="Churn This Month"
              detail={`${thresholds.cancelledThisMonth} cancelled (vs ${thresholds.cancelledLastMonth} last month) ${thresholds.churnSpike > 0 ? `+${thresholds.churnSpike}%` : ""}`}
              severity={thresholds.churnSpike > 50 ? "high" : thresholds.cancelledThisMonth > 0 ? "medium" : "ok"}
            />
            <ThresholdRow
              icon="schedule"
              label="Unresponsive Leads"
              detail={`${thresholds.unresponsiveLeads} leads >24h with no response`}
              severity={thresholds.unresponsiveLeads > 5 ? "high" : thresholds.unresponsiveLeads > 0 ? "medium" : "ok"}
            />
          </div>
        </div>

        {/* System Health */}
        {data.systemHealth && (
          <div className="rounded-xl p-5 border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="flex items-center gap-2 mb-4">
              <MaterialIcon name="monitor_heart" className="text-[18px]" style={{ color: "#10b981" }} />
              <h2 className="text-base font-bold text-white">System Health</h2>
              <span className="text-xs text-slate-500 ml-auto">{data.systemHealth.eventsLastHour} events/hr</span>
            </div>

            {/* Circuit Breakers */}
            <div className="mb-4">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">AI Circuit Breakers</h3>
              {Object.keys(data.systemHealth.circuitBreakers as Record<string, { state: string; failures: number }>).length === 0 ? (
                <div className="flex items-center gap-2 rounded-lg p-3" style={{ background: "rgba(16,185,129,0.08)" }}>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#10b981" }} />
                  <span className="text-xs text-slate-400">All circuits nominal</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {Object.entries(data.systemHealth.circuitBreakers as Record<string, { state: string; failures: number }>).map(([service, status]) => {
                    const color = status.state === "CLOSED" ? "#10b981" : status.state === "OPEN" ? "#ef4444" : "#f59e0b";
                    const severity = status.state === "OPEN" ? "high" : status.state === "HALF_OPEN" ? "medium" : "ok";
                    return (
                      <ThresholdRow
                        key={service}
                        icon={status.state === "CLOSED" ? "check_circle" : status.state === "OPEN" ? "error" : "warning"}
                        label={`${service} Circuit`}
                        detail={`State: ${status.state} | Failures: ${status.failures}`}
                        severity={severity}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Recent Agent Events */}
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Recent Platform Events</h3>
            {(data.systemHealth.recentEvents as Array<{ id: string; type: string; entityType: string; createdAt: string }>).length === 0 ? (
              <p className="text-xs text-slate-500">No events recorded today</p>
            ) : (
              <div className="space-y-1.5">
                {(data.systemHealth.recentEvents as Array<{ id: string; type: string; entityType: string; createdAt: string }>).map((evt) => (
                  <div key={evt.id} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#2badee" }} />
                      <span className="text-xs text-white font-medium">{evt.type.replace(/_/g, " ")}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{new Date(evt.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Weekly Digest Preview */}
        <div className="rounded-xl p-5 border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
          <div className="flex items-center gap-2 mb-4">
            <MaterialIcon name="email" className="text-[18px]" style={{ color: "#8b5cf6" }} />
            <h2 className="text-base font-bold text-white">Weekly Digest Preview</h2>
            <span className="text-xs text-slate-500 ml-auto">{digest.period}</span>
          </div>

          <div className="rounded-xl p-4 border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
            <p className="text-sm font-bold text-white mb-3">Autovinci Weekly Summary</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "New Dealers", value: digest.newDealers, color: "#2badee" },
                { label: "New Leads", value: digest.newLeads, color: "#f59e0b" },
                { label: "Deals Won", value: digest.dealsWon, color: "#10b981" },
                { label: "Services Booked", value: digest.servicesBooked, color: "#8b5cf6" },
              ].map((d) => (
                <div key={d.label} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                  <span className="text-xs text-slate-400">{d.label}:</span>
                  <span className="text-sm font-bold text-white">{d.value}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-600 mt-3 border-t border-white/[0.06] pt-3">
              This is a preview of what the weekly digest email would contain. Email delivery requires integration with a service like Resend or SendGrid.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ThresholdRow({
  icon,
  label,
  detail,
  severity,
}: {
  icon: string;
  label: string;
  detail: string;
  severity: "ok" | "medium" | "high";
}) {
  const colors = {
    ok: { bg: "rgba(16,185,129,0.1)", icon: "#10b981", dot: "#10b981" },
    medium: { bg: "rgba(245,158,11,0.1)", icon: "#f59e0b", dot: "#f59e0b" },
    high: { bg: "rgba(239,68,68,0.1)", icon: "#ef4444", dot: "#ef4444" },
  };
  const c = colors[severity];

  return (
    <div className="flex items-center gap-3 rounded-lg p-3" style={{ background: c.bg }}>
      <MaterialIcon name={icon} className="text-[18px] shrink-0" style={{ color: c.icon }} />
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-slate-400">{detail}</p>
      </div>
      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.dot }} />
    </div>
  );
}
