"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchAdminUsers, reassignLead } from "@/lib/api";

const TABS = [
  { key: "buyers", label: "Buyers", icon: "person" },
  { key: "leads", label: "Lead Assignment", icon: "swap_horiz" },
  { key: "activity", label: "Activity Log", icon: "history" },
];

const SENTIMENT_COLORS: Record<string, string> = { HOT: "#ef4444", WARM: "#f59e0b", COOL: "#94a3b8" };
const ACTIVITY_COLORS: Record<string, string> = { SUCCESS: "#10b981", WARNING: "#f59e0b", INFO: "#2badee", AUTO: "#8b5cf6" };

export default function AdminUsersPage() {
  const [tab, setTab] = useState("buyers");
  const [search, setSearch] = useState("");
  const [reassigning, setReassigning] = useState<string | null>(null);

  const { data, isLoading, refetch } = useApi(
    () => fetchAdminUsers({ tab, search, limit: 50 }),
    [tab, search]
  );

  async function handleReassign(leadId: string, newDealerProfileId: string) {
    setReassigning(leadId);
    try {
      await reassignLead(leadId, newDealerProfileId);
      refetch();
    } catch { /* ignore */ }
    setReassigning(null);
  }

  return (
    <div className="flex-1 overflow-y-auto pb-28 md:pb-8">
      <div className="px-4 md:px-8 py-6 max-w-6xl space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">User Management</h1>
          <p className="text-sm text-slate-500 mt-1">Buyers, lead assignment, and activity log</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setSearch(""); }}
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
        {tab !== "activity" && (
          <div className="relative">
            <MaterialIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]" />
            <input
              type="text"
              placeholder={tab === "buyers" ? "Search by name or email..." : "Search by buyer name or phone..."}
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
              <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.03)" }} />
            ))}
          </div>
        ) : tab === "buyers" ? (
          <BuyersTab buyers={data?.buyers ?? []} total={data?.total ?? 0} />
        ) : tab === "leads" ? (
          <LeadsTab leads={data?.leads ?? []} dealers={data?.dealers ?? []} onReassign={handleReassign} reassigning={reassigning} />
        ) : (
          <ActivityTab activities={data?.activities ?? []} />
        )}
      </div>
    </div>
  );
}

interface AdminBuyer {
  id: string; name: string; email: string; phone?: string;
  wishlistCount: number; serviceBookingCount: number;
}

interface AdminLead {
  id: string; buyerName: string; sentimentLabel?: string;
  dealerProfile?: { id: string; dealershipName: string };
  vehicle?: { name?: string };
}

interface AdminActivity {
  id: string; title: string; description: string; type: string; createdAt: string;
  dealerProfile?: { dealershipName?: string };
}

function BuyersTab({ buyers, total }: { buyers: AdminBuyer[]; total: number }) {
  return (
    <div>
      <p className="text-xs text-slate-500 mb-3">{total} total buyers</p>
      {buyers.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-slate-500">
          <MaterialIcon name="person_off" className="text-[40px] mb-3" />
          <p className="text-sm">No buyers found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {buyers.map((b) => (
            <div key={b.id} className="rounded-xl p-4 border border-white/[0.06] flex items-center gap-3" style={{ background: "rgba(255,255,255,0.02)" }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(139,92,246,0.1)" }}>
                <MaterialIcon name="person" className="text-[16px]" style={{ color: "#8b5cf6" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{b.name}</p>
                <p className="text-xs text-slate-500">{b.email} {b.phone ? `| ${b.phone}` : ""}</p>
              </div>
              <div className="flex gap-4 shrink-0 text-center">
                <div>
                  <p className="text-sm font-bold text-white">{b.wishlistCount}</p>
                  <p className="text-[9px] text-slate-500">Wishlist</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{b.serviceBookingCount}</p>
                  <p className="text-[9px] text-slate-500">Services</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LeadsTab({
  leads,
  dealers,
  onReassign,
  reassigning,
}: {
  leads: AdminLead[];
  dealers: Array<{ id: string; dealershipName: string }>;
  onReassign: (leadId: string, dealerId: string) => void;
  reassigning: string | null;
}) {
  return (
    <div className="space-y-2">
      {leads.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-slate-500">
          <MaterialIcon name="swap_horiz" className="text-[40px] mb-3" />
          <p className="text-sm">No leads found</p>
        </div>
      ) : (
        leads.map((lead) => {
          const sentiment = lead.sentimentLabel;
          return (
            <div key={lead.id} className="rounded-xl p-4 border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white">{lead.buyerName}</p>
                    {sentiment && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: `${SENTIMENT_COLORS[sentiment] || "#94a3b8"}15`, color: SENTIMENT_COLORS[sentiment] || "#94a3b8" }}>
                        {sentiment}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {lead.vehicle?.name || "No vehicle"} | {lead.dealerProfile?.dealershipName || "Unassigned"}
                  </p>
                </div>
                <select
                  className="px-2 py-1.5 rounded-lg text-xs border border-white/[0.06] text-white bg-transparent focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                  value={lead.dealerProfile?.id || ""}
                  onChange={(e) => onReassign(lead.id, e.target.value)}
                  disabled={reassigning === lead.id}
                >
                  {dealers.map((d) => (
                    <option key={d.id} value={d.id} style={{ background: "#0a1114" }}>{d.dealershipName}</option>
                  ))}
                </select>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

function ActivityTab({ activities }: { activities: AdminActivity[] }) {
  return (
    <div className="space-y-2">
      {activities.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-slate-500">
          <MaterialIcon name="history" className="text-[40px] mb-3" />
          <p className="text-sm">No activity yet</p>
        </div>
      ) : (
        activities.map((a) => (
          <div key={a.id} className="rounded-xl p-4 border border-white/[0.06] flex items-center gap-3" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: `${ACTIVITY_COLORS[a.type] || "#2badee"}15` }}>
              <div className="w-2 h-2 rounded-full" style={{ background: ACTIVITY_COLORS[a.type] || "#2badee" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white">{a.title}</p>
              <p className="text-xs text-slate-500">{a.dealerProfile?.dealershipName || "System"} | {a.description}</p>
            </div>
            <p className="text-[10px] text-slate-600 shrink-0">
              {new Date(a.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
