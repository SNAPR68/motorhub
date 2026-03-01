"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchAdminQuality } from "@/lib/api";

const TABS = [
  { key: "descriptions", label: "AI Descriptions", icon: "description" },
  { key: "replies", label: "Auto-Replies", icon: "smart_toy" },
  { key: "sentiment", label: "Sentiment", icon: "mood" },
];

const SENTIMENT_COLORS: Record<string, string> = { HOT: "#ef4444", WARM: "#f59e0b", COOL: "#94a3b8" };

export default function AdminQualityPage() {
  const [tab, setTab] = useState("descriptions");

  const { data, isLoading } = useApi(
    () => fetchAdminQuality({ tab, limit: 50 }),
    [tab]
  );

  return (
    <div className="flex-1 overflow-y-auto pb-28 md:pb-8">
      <div className="px-4 md:px-8 py-6 max-w-6xl space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">AI Quality Monitor</h1>
          <p className="text-sm text-slate-500 mt-1">Review AI-generated content, replies, and sentiment accuracy</p>
        </div>

        {/* Stats row */}
        {tab === "descriptions" && data?.avgAiScore !== undefined && (
          <div className="flex gap-3">
            <div className="rounded-xl px-4 py-3 border border-white/[0.06] flex items-center gap-3" style={{ background: "rgba(255,255,255,0.02)" }}>
              <MaterialIcon name="analytics" className="text-[18px]" style={{ color: "#2badee" }} />
              <div>
                <p className="text-lg font-bold text-white">{data.avgAiScore}</p>
                <p className="text-[10px] text-slate-500">Avg AI Score</p>
              </div>
            </div>
            <div className="rounded-xl px-4 py-3 border border-white/[0.06] flex items-center gap-3" style={{ background: "rgba(255,255,255,0.02)" }}>
              <MaterialIcon name="article" className="text-[18px]" style={{ color: "#10b981" }} />
              <div>
                <p className="text-lg font-bold text-white">{data.total ?? 0}</p>
                <p className="text-[10px] text-slate-500">Total Descriptions</p>
              </div>
            </div>
          </div>
        )}

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

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.03)" }} />)}
          </div>
        ) : tab === "descriptions" ? (
          <DescriptionsTab vehicles={data?.vehicles ?? []} />
        ) : tab === "replies" ? (
          <RepliesTab messages={data?.messages ?? []} total={data?.total ?? 0} />
        ) : (
          <SentimentTab stats={data?.sentimentStats ?? []} />
        )}
      </div>
    </div>
  );
}

interface QualityVehicle {
  id: string; name: string; year?: number;
  description?: string; aiScore?: number; status: string; createdAt: string;
  dealerProfile?: { dealershipName: string };
}

function DescriptionsTab({ vehicles }: { vehicles: QualityVehicle[] }) {
  if (vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-slate-500">
        <MaterialIcon name="description" className="text-[40px] mb-3" />
        <p className="text-sm">No AI descriptions found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {vehicles.map((v) => {
        const score = v.aiScore ?? null;
        const desc = v.description || "";
        return (
          <div key={v.id} className="rounded-xl p-4 border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  {v.year} {v.name}
                </p>
                <p className="text-xs text-slate-500">{v.dealerProfile?.dealershipName || "Unknown"}</p>
              </div>
              {score !== null && (
                <div className="px-2 py-1 rounded-lg text-center" style={{ background: `${score >= 70 ? "#10b981" : score >= 40 ? "#f59e0b" : "#ef4444"}15` }}>
                  <p className="text-sm font-bold" style={{ color: score >= 70 ? "#10b981" : score >= 40 ? "#f59e0b" : "#ef4444" }}>{score}</p>
                  <p className="text-[8px] text-slate-500">Score</p>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-400 line-clamp-2">{desc.substring(0, 200)}{desc.length > 200 ? "..." : ""}</p>
          </div>
        );
      })}
    </div>
  );
}

interface AutoReplyMessage {
  id: string; text: string; createdAt: string;
  lead?: { buyerName?: string; sentimentLabel?: string; dealerProfile?: { dealershipName?: string } };
}

function RepliesTab({ messages, total }: { messages: AutoReplyMessage[]; total: number }) {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-slate-500">
        <MaterialIcon name="smart_toy" className="text-[40px] mb-3" />
        <p className="text-sm">No auto-replies found</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs text-slate-500 mb-3">{total} total auto-replies</p>
      <div className="space-y-2">
        {messages.map((m) => (
          <div key={m.id} className="rounded-xl p-4 border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
            <div className="flex items-center gap-2 mb-2">
              <MaterialIcon name="smart_toy" className="text-[14px]" style={{ color: "#8b5cf6" }} />
              <span className="text-xs text-slate-400">{m.lead?.dealerProfile?.dealershipName || "Unknown"} &rarr; {m.lead?.buyerName || "Unknown"}</span>
              {m.lead?.sentimentLabel && (
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold" style={{ background: `${SENTIMENT_COLORS[m.lead.sentimentLabel] || "#94a3b8"}15`, color: SENTIMENT_COLORS[m.lead.sentimentLabel] || "#94a3b8" }}>
                  {m.lead.sentimentLabel}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300">{m.text.substring(0, 300)}</p>
            <p className="text-[10px] text-slate-600 mt-2">{new Date(m.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SentimentTab({ stats }: { stats: Array<{ label: string; total: number; closedWon: number; closedLost: number; conversionRate: number }> }) {
  if (stats.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-slate-500">
        <MaterialIcon name="mood" className="text-[40px] mb-3" />
        <p className="text-sm">No sentiment data available</p>
      </div>
    );
  }

  const totalLeads = stats.reduce((s, g) => s + g.total, 0);

  return (
    <div className="space-y-4">
      {/* Distribution */}
      <div className="rounded-xl p-5 border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
        <h3 className="text-sm font-bold text-white mb-4">Sentiment Distribution</h3>
        <div className="space-y-3">
          {stats.map((s) => {
            const pct = totalLeads > 0 ? Math.round((s.total / totalLeads) * 100) : 0;
            const color = SENTIMENT_COLORS[s.label] || "#94a3b8";
            return (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold" style={{ color }}>{s.label}</span>
                  <span className="text-sm text-white">{s.total} <span className="text-xs text-slate-500">({pct}%)</span></span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.max(pct, 2)}%`, background: color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Conversion by Sentiment */}
      <div className="rounded-xl p-5 border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
        <h3 className="text-sm font-bold text-white mb-4">Conversion by Sentiment</h3>
        <div className="grid grid-cols-3 gap-3">
          {stats.map((s) => {
            const color = SENTIMENT_COLORS[s.label] || "#94a3b8";
            return (
              <div key={s.label} className="rounded-lg p-3 text-center border border-white/[0.06]" style={{ background: "rgba(255,255,255,0.02)" }}>
                <p className="text-xs font-bold mb-1" style={{ color }}>{s.label}</p>
                <p className="text-2xl font-bold text-white">{s.conversionRate}%</p>
                <p className="text-[10px] text-slate-500 mt-1">{s.closedWon} won / {s.closedLost} lost</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
