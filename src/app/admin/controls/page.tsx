"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchAdminDealers, toggleDealerActive, sendAdminBroadcast, type AdminDealer } from "@/lib/api";

const PLAN_PRICES: Record<string, { monthly: string; features: string[] }> = {
  STARTER: { monthly: "Free", features: ["5 vehicle listings", "Basic lead management", "Email support"] },
  GROWTH: { monthly: "₹2,999/mo", features: ["25 vehicle listings", "AI descriptions", "Smart replies", "Analytics", "Priority support"] },
  ENTERPRISE: { monthly: "₹9,999/mo", features: ["Unlimited listings", "AI studio", "DemandPulse intelligence", "Dedicated manager", "White-label"] },
};

export default function AdminControlsPage() {
  const [section, setSection] = useState<"dealers" | "broadcast" | "config">("dealers");

  return (
    <div className="flex-1 overflow-y-auto pb-28 md:pb-8">
      <div className="px-4 md:px-8 py-6 max-w-6xl space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Platform Controls</h1>
          <p className="text-sm text-slate-500 mt-1">Dealer activation, broadcasts, and configuration</p>
        </div>

        {/* Section tabs */}
        <div className="flex gap-2">
          {[
            { key: "dealers" as const, label: "Dealer Toggle", icon: "toggle_on" },
            { key: "broadcast" as const, label: "Broadcast", icon: "campaign" },
            { key: "config" as const, label: "Platform Config", icon: "settings" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setSection(t.key)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: section === t.key ? "rgba(43,173,238,0.1)" : "rgba(255,255,255,0.03)",
                color: section === t.key ? "#2badee" : "#94a3b8",
                border: `1px solid ${section === t.key ? "rgba(43,173,238,0.2)" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              <MaterialIcon name={t.icon} className="text-[16px]" />
              {t.label}
            </button>
          ))}
        </div>

        {section === "dealers" && <DealerToggleSection />}
        {section === "broadcast" && <BroadcastSection />}
        {section === "config" && <ConfigSection />}
      </div>
    </div>
  );
}

function DealerToggleSection() {
  const { data, isLoading, refetch } = useApi(() => fetchAdminDealers(), []);
  const [toggling, setToggling] = useState<string | null>(null);

  async function handleToggle(dealerId: string, activate: boolean) {
    setToggling(dealerId);
    try {
      await toggleDealerActive(dealerId, activate);
      refetch();
    } catch { /* ignore */ }
    setToggling(null);
  }

  const dealers = data?.dealers ?? [];

  return (
    <div className="space-y-2">
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.03)" }} />)}
        </div>
      ) : dealers.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-slate-500">
          <MaterialIcon name="storefront" className="text-[40px] mb-3" />
          <p className="text-sm">No dealers found</p>
        </div>
      ) : (
        dealers.map((d: AdminDealer) => {
          const hasVehicles = d.vehicleCount > 0;
          return (
            <div key={d.id} className="rounded-xl p-4 border border-white/[0.06] flex items-center gap-3" style={{ background: "rgba(255,255,255,0.02)" }}>
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: hasVehicles ? "#10b981" : "#ef4444" }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{d.dealershipName}</p>
                <p className="text-xs text-slate-500">{d.city} | {d.vehicleCount} vehicles | {d.plan}</p>
              </div>
              <button
                onClick={() => handleToggle(d.id, !hasVehicles)}
                disabled={toggling === d.id}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                style={{
                  background: hasVehicles ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
                  color: hasVehicles ? "#ef4444" : "#10b981",
                }}
              >
                {toggling === d.id ? "..." : hasVehicles ? "Deactivate" : "Activate"}
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}

function BroadcastSection() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("ALL");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number } | null>(null);

  async function handleSend() {
    if (!title.trim() || !message.trim()) return;
    setSending(true);
    setResult(null);
    try {
      const res = await sendAdminBroadcast({ title, message, targetPlan: target });
      setResult(res);
      setTitle("");
      setMessage("");
    } catch { /* ignore */ }
    setSending(false);
  }

  return (
    <div className="rounded-xl p-5 border border-white/[0.06] space-y-4" style={{ background: "rgba(255,255,255,0.02)" }}>
      <div className="flex items-center gap-2">
        <MaterialIcon name="campaign" className="text-[20px]" style={{ color: "#f59e0b" }} />
        <h3 className="text-sm font-bold text-white">Send Broadcast Notification</h3>
      </div>

      <div>
        <label className="text-xs font-medium text-slate-400 mb-1 block">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Notification title..."
          className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-600 border border-white/[0.06] focus:outline-none focus:border-[#2badee]/30"
          style={{ background: "rgba(255,255,255,0.03)" }}
        />
      </div>

      <div>
        <label className="text-xs font-medium text-slate-400 mb-1 block">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your announcement..."
          rows={3}
          className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-600 border border-white/[0.06] focus:outline-none focus:border-[#2badee]/30 resize-none"
          style={{ background: "rgba(255,255,255,0.03)" }}
        />
      </div>

      <div>
        <label className="text-xs font-medium text-slate-400 mb-1 block">Target Audience</label>
        <select
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="px-3 py-2.5 rounded-xl text-sm text-white border border-white/[0.06] focus:outline-none"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <option value="ALL" style={{ background: "#0a1114" }}>All Dealers</option>
          <option value="STARTER" style={{ background: "#0a1114" }}>Starter Plan Only</option>
          <option value="GROWTH" style={{ background: "#0a1114" }}>Growth Plan Only</option>
          <option value="ENTERPRISE" style={{ background: "#0a1114" }}>Enterprise Plan Only</option>
        </select>
      </div>

      <button
        onClick={handleSend}
        disabled={sending || !title.trim() || !message.trim()}
        className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
        style={{ background: "#2badee" }}
      >
        {sending ? "Sending..." : "Send Broadcast"}
      </button>

      {result && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(16,185,129,0.1)" }}>
          <MaterialIcon name="check_circle" className="text-[16px]" style={{ color: "#10b981" }} />
          <p className="text-xs" style={{ color: "#10b981" }}>Sent to {result.sent} dealers</p>
        </div>
      )}
    </div>
  );
}

function ConfigSection() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl p-5 border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
        <h3 className="text-sm font-bold text-white mb-4">Plan Pricing & Features</h3>
        <div className="space-y-4">
          {Object.entries(PLAN_PRICES).map(([plan, config]) => (
            <div key={plan} className="rounded-lg p-3 border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold" style={{ color: plan === "GROWTH" ? "#2badee" : plan === "ENTERPRISE" ? "#f59e0b" : "#94a3b8" }}>{plan}</span>
                <span className="text-sm font-bold text-white">{config.monthly}</span>
              </div>
              <ul className="space-y-1">
                {config.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-slate-400">
                    <MaterialIcon name="check" className="text-[12px]" style={{ color: "#10b981" }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl p-5 border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
        <h3 className="text-sm font-bold text-white mb-3">Service Pricing</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: "RC Transfer", range: "₹2,499 - ₹7,999" },
            { name: "Inspection", range: "₹999 - ₹3,499" },
            { name: "Swap", range: "₹4,999 - ₹12,999" },
            { name: "Cross-State", range: "₹6,999 - ₹19,999" },
          ].map((s) => (
            <div key={s.name} className="rounded-lg p-3 border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
              <p className="text-xs text-slate-400">{s.name}</p>
              <p className="text-sm font-bold text-white mt-1">{s.range}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
