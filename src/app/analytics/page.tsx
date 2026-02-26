"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchFunnel } from "@/lib/api";
import type { FunnelData } from "@/lib/api";

/* ── design tokens: lead_conversion_analytics_(light) ── */
// primary: #137fec, font: Inter, bg: white/light

const PERIOD_TABS = ["Weekly", "Monthly"];

/* Compute funnel display from API data, with fallback to empty state */
function buildFunnelDisplay(data: FunnelData | null) {
  if (!data || data.totalLeads === 0) {
    return {
      funnel: [
        { stage: "Inquiry", count: "0", width: "100%", opacity: 0.2, icon: "contact_page", label: "No data yet" },
        { stage: "AI Interaction", count: "0", width: "90%", opacity: 0.3, icon: "smart_toy", label: "—" },
        { stage: "Test Drive", count: "0", width: "80%", opacity: 0.5, icon: "directions_car", label: "—", whiteText: true },
        { stage: "Closed Deals", count: "0", width: "70%", opacity: 1, icon: "verified", label: "—", whiteText: true },
      ],
      trendLabel: "0%",
    };
  }

  const f = data.funnel;
  const maxCount = Math.max(...f.map((s) => s.count), 1);
  const widths = ["100%", "90%", "80%", "70%"];
  const opacities = [0.2, 0.3, 0.5, 1];
  const icons = ["contact_page", "smart_toy", "directions_car", "verified"];

  return {
    funnel: f.map((stage, i) => ({
      stage: stage.stage,
      count: stage.count.toLocaleString(),
      width: widths[i] ?? "70%",
      opacity: opacities[i] ?? 1,
      icon: icons[i] ?? "circle",
      label: i === 0 ? "Baseline Traffic" : `${stage.conversion}% Conversion`,
      whiteText: i >= 2,
    })),
    trendLabel: f.length >= 4 && f[3].count > 0
      ? `${f[3].conversion}% close rate`
      : "Building data...",
  };
}

function buildSentimentDisplay(data: FunnelData | null) {
  if (!data) return [];

  const total = data.sentiment.total || 1;
  const hotPct = Math.round((data.sentiment.hot / total) * 100);
  const warmPct = Math.round((data.sentiment.warm / total) * 100);
  const coolPct = Math.round((data.sentiment.cool / total) * 100);

  return [
    {
      icon: "mood",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      title: "Hot Leads",
      subtitle: `${data.sentiment.hot} high-intent buyers`,
      change: `${hotPct}%`,
      changeColor: "text-emerald-600",
      bars: [1, 2, 1.5, 3, Math.max(1, hotPct / 20)],
      barColor: "bg-emerald",
    },
    {
      icon: "sentiment_neutral",
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      title: "Warm Leads",
      subtitle: `${data.sentiment.warm} considering options`,
      change: `${warmPct}%`,
      changeColor: "text-amber-600",
      bars: [2, 3, 3.5, 2.5, Math.max(1, warmPct / 20)],
      barColor: "bg-amber",
    },
    {
      icon: "sentiment_dissatisfied",
      iconBg: "bg-blue-50",
      iconColor: "text-[#137fec]",
      title: "Cool Leads",
      subtitle: `${data.sentiment.cool} early-stage browsers`,
      change: `${coolPct}%`,
      changeColor: "text-[#137fec]",
      bars: [3, 2, 2.5, 1.5, Math.max(1, coolPct / 20)],
      barColor: "bg-blue",
    },
  ];
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState(0);
  const { data, isLoading } = useApi(() => fetchFunnel(), []);

  const { funnel, trendLabel } = buildFunnelDisplay(data ?? null);
  const sentiments = buildSentimentDisplay(data ?? null);

  return (
    <div
      className="min-h-screen max-w-md mx-auto bg-white flex flex-col pb-20"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-30 px-6 pt-12 pb-4 flex items-center justify-between border-b border-slate-100"
        style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Performance
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Lead Analytics
          </h1>
        </div>
        <div className="flex gap-3 items-center">
          <Link href="/notifications/history" className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-600">
            <MaterialIcon name="notifications" className="text-2xl" />
          </Link>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold border-2"
            style={{ background: "rgba(19,127,236,0.1)", borderColor: "rgba(19,127,236,0.2)", color: "#137fec" }}
          >
            R
          </div>
        </div>
      </header>

      {/* ── Timeframe Toggle ── */}
      <div className="px-6 py-6">
        <div className="flex p-1 bg-slate-100 rounded-xl">
          {PERIOD_TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setPeriod(i)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                i === period
                  ? "bg-white shadow-sm"
                  : "text-slate-500"
              }`}
              style={i === period ? { color: "#137fec" } : {}}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Sales Funnel ── */}
      <section className="px-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">Sales Funnel</h2>
          {!isLoading && (
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <MaterialIcon name="trending_up" className="text-sm" />
              {trendLabel}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-slate-100 animate-pulse" style={{ width: `${100 - i * 8}%` }} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {funnel.map((f) => (
              <div key={f.stage} className="relative">
                <div className="flex justify-between items-center mb-1 px-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
                    {f.stage}
                  </span>
                  <span className="text-sm font-bold text-slate-900">{f.count}</span>
                </div>
                <div
                  className="h-14 rounded-xl overflow-hidden relative mx-auto"
                  style={{
                    width: f.width,
                    background: f.opacity === 1
                      ? "#137fec"
                      : `rgba(19,127,236,${f.opacity})`,
                    ...(f.opacity === 1 ? { boxShadow: "0 4px 12px rgba(19,127,236,0.2)" } : {}),
                  }}
                >
                  <div className="absolute inset-0 flex items-center px-4">
                    <MaterialIcon
                      name={f.icon}
                      className={`mr-2 ${f.whiteText ? "text-white" : "text-[#137fec]/60"}`}
                    />
                    <span
                      className={`text-xs font-semibold ${
                        f.whiteText
                          ? "text-white uppercase tracking-wider font-bold"
                          : "text-[#137fec]"
                      }`}
                    >
                      {f.label}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── AI Sentiment Trends ── */}
      <section className="px-6 py-6 bg-slate-50 border-t border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">AI Sentiment Trends</h2>
            <p className="text-xs text-slate-500">Lead emotional analysis</p>
          </div>
          <MaterialIcon name="psychology" className="text-[#137fec]" />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-white animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sentiments.map((s) => (
              <div
                key={s.title}
                className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg ${s.iconBg} flex items-center justify-center ${s.iconColor}`}
                  >
                    <MaterialIcon name={s.icon} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{s.title}</p>
                    <p className="text-xs text-slate-400">{s.subtitle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${s.changeColor}`}>{s.change}</p>
                  <div className="w-16 h-4 flex items-end gap-0.5">
                    {s.bars.map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-full"
                        style={{
                          height: `${h * 4}px`,
                          background:
                            s.title === "Hot Leads"
                              ? `rgba(16,185,129,${0.2 + i * 0.2})`
                              : s.title === "Warm Leads"
                              ? `rgba(245,158,11,${0.6 - i * 0.1})`
                              : `rgba(19,127,236,${0.2 + i * 0.2})`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Insight Card */}
        {!isLoading && data && (
          <div
            className="mt-6 p-4 rounded-2xl border"
            style={{
              background: "rgba(19,127,236,0.05)",
              borderColor: "rgba(19,127,236,0.1)",
            }}
          >
            <div className="flex items-start gap-3">
              <MaterialIcon name="lightbulb" className="text-[#137fec] text-xl mt-0.5" />
              <p className="text-xs leading-relaxed text-slate-600">
                <span className="font-bold text-slate-900">AI Insight:</span>{" "}
                {data.totalLeads > 0
                  ? `You have ${data.totalLeads} total leads. ${data.sentiment.hot} are hot — focus your follow-ups there for the highest conversion potential.`
                  : "No leads yet. Once leads start coming in, you'll see sentiment analysis and funnel metrics here."}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ── Bottom Nav ── */}
      <nav
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md border-t border-slate-100 px-6 pt-3 pb-8 flex items-center justify-between z-50 md:hidden"
        style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(16px)" }}
      >
        {[
          { icon: "directions_car", label: "Inventory", href: "/inventory" },
          { icon: "campaign", label: "Marketing", href: "/social-hub" },
          { icon: "analytics", label: "Analytics", href: "/analytics", active: true },
          { icon: "grid_view", label: "Dashboard", href: "/dashboard" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center gap-1 ${
              item.active ? "text-[#137fec]" : "text-slate-400"
            }`}
          >
            <div className="relative">
              <MaterialIcon name={item.icon} fill={item.active} />
              {item.active && (
                <div
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: "#137fec" }}
                />
              )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
