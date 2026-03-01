"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchAdminVehicleModeration, adminVehicleAction } from "@/lib/api";

const TABS = [
  { key: "moderation", label: "Moderation", icon: "pending" },
  { key: "featured", label: "Featured", icon: "star" },
  { key: "low-quality", label: "Low Quality", icon: "warning" },
];

export default function AdminVehiclesPage() {
  const [tab, setTab] = useState("moderation");
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  const { data, isLoading, refetch } = useApi(
    () => fetchAdminVehicleModeration({ tab, search }),
    [tab, search]
  );

  async function handleAction(vehicleId: string, action: string) {
    setActionId(vehicleId);
    try {
      await adminVehicleAction(vehicleId, action);
      refetch();
    } catch { /* ignore */ }
    setActionId(null);
  }

  const vehicles: ModerationVehicle[] = data?.vehicles ?? [];
  const featured: ModerationVehicle[] = data?.featured ?? [];
  const available: ModerationVehicle[] = data?.available ?? [];

  return (
    <div className="flex-1 overflow-y-auto pb-28 md:pb-8">
      <div className="px-4 md:px-8 py-6 max-w-6xl space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Vehicle Management</h1>
          <p className="text-sm text-slate-500 mt-1">Moderate, feature, and flag vehicles</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: tab === t.key ? "rgba(43,173,238,0.1)" : "rgba(255,255,255,0.03)",
                color: tab === t.key ? "#2badee" : "#94a3b8",
                border: `1px solid ${tab === t.key ? "rgba(43,173,238,0.2)" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              <MaterialIcon name={t.icon} className="text-[16px]" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Search */}
        {(tab === "featured" || tab === "low-quality") && (
          <div className="relative">
            <MaterialIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]" />
            <input
              type="text"
              placeholder="Search vehicles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-600 border border-white/[0.06] focus:outline-none focus:border-[#2badee]/30"
              style={{ background: "rgba(255,255,255,0.03)" }}
            />
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.03)" }} />
            ))}
          </div>
        ) : tab === "featured" ? (
          /* Featured tab — show current featured + search results */
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-400 mb-3">CURRENTLY FEATURED ({featured.length})</h3>
              {featured.length === 0 ? (
                <p className="text-sm text-slate-600 text-center py-6">No featured vehicles</p>
              ) : (
                <div className="space-y-2">
                  {featured.map((v) => (
                    <VehicleRow key={v.id} vehicle={v} actions={[{ label: "Unfeature", action: "unfeature", color: "#f59e0b" }]} onAction={handleAction} loading={actionId === v.id} />
                  ))}
                </div>
              )}
            </div>
            {available.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-400 mb-3">SEARCH RESULTS</h3>
                <div className="space-y-2">
                  {available.map((v) => (
                    <VehicleRow key={v.id} vehicle={v} actions={[{ label: "Feature", action: "feature", color: "#10b981" }]} onAction={handleAction} loading={actionId === v.id} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Moderation / Low Quality */
          <div className="space-y-2">
            {vehicles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                <MaterialIcon name={tab === "moderation" ? "check_circle" : "thumb_up"} className="text-[40px] mb-3" />
                <p className="text-sm">{tab === "moderation" ? "No vehicles pending review" : "No low-quality vehicles"}</p>
              </div>
            ) : (
              vehicles.map((v) => (
                <VehicleRow
                  key={v.id}
                  vehicle={v}
                  actions={
                    tab === "moderation"
                      ? [
                          { label: "Approve", action: "approve", color: "#10b981" },
                          { label: "Reject", action: "reject", color: "#ef4444" },
                        ]
                      : [{ label: "Flag for Review", action: "flag", color: "#f59e0b" }]
                  }
                  onAction={handleAction}
                  loading={actionId === v.id}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface ModerationVehicle {
  id: string; name: string; year?: number;
  priceDisplay?: string; aiScore?: number; status?: string; badge?: string;
  images?: string[];
  dealerProfile?: { dealershipName?: string; city?: string };
}

function VehicleRow({
  vehicle,
  actions,
  onAction,
  loading,
}: {
  vehicle: ModerationVehicle;
  actions: { label: string; action: string; color: string }[];
  onAction: (id: string, action: string) => void;
  loading: boolean;
}) {
  const score = vehicle.aiScore ?? null;

  return (
    <div className="rounded-xl p-4 border border-white/[0.06] flex items-center gap-3" style={{ background: "rgba(255,255,255,0.02)" }}>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(43,173,238,0.1)" }}>
        <MaterialIcon name="directions_car" className="text-[18px]" style={{ color: "#2badee" }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">
          {vehicle.year} {vehicle.name}
        </p>
        <p className="text-xs text-slate-500 truncate">
          {vehicle.dealerProfile?.dealershipName || "Unknown"} | {vehicle.dealerProfile?.city || ""} | {vehicle.priceDisplay || "N/A"}
        </p>
      </div>
      {score !== null && (
        <div className="text-center shrink-0 hidden sm:block">
          <p className="text-sm font-bold" style={{ color: score >= 70 ? "#10b981" : score >= 40 ? "#f59e0b" : "#ef4444" }}>{score}</p>
          <p className="text-[9px] text-slate-500">AI Score</p>
        </div>
      )}
      <div className="flex gap-1.5 shrink-0">
        {actions.map((a) => (
          <button
            key={a.action}
            onClick={() => onAction(vehicle.id, a.action)}
            disabled={loading}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
            style={{ background: `${a.color}15`, color: a.color }}
          >
            {loading ? "..." : a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
