"use client";

import { use, useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/car-images";
import { useApi } from "@/lib/hooks/use-api";
import { useApiMutation } from "@/lib/hooks/use-api-mutation";
import { fetchLead } from "@/lib/api";
import type { DbLeadMessage } from "@/lib/api";

/* ── design tokens: lead_communication_history ── */
// primary: #137fec, font: Inter, bg: #f6f7f8

const SENTIMENT_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  HOT: { bg: "rgba(19,127,236,0.1)", color: "#137fec", label: "Hot Lead" },
  WARM: { bg: "rgba(245,158,11,0.1)", color: "#f59e0b", label: "Warm Lead" },
  COOL: { bg: "rgba(100,116,139,0.1)", color: "#64748b", label: "Cool Lead" },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function LeadProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [messageText, setMessageText] = useState("");

  const { data, isLoading, refetch } = useApi(() => fetchLead(id), [id]);
  const lead = data?.lead ?? null;
  const timeline: DbLeadMessage[] = data?.timeline ?? [];

  const sendMessage = useApiMutation({
    mutationFn: async (text: string) => {
      const res = await fetch(`/api/leads/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, role: "USER", type: "MANUAL" }),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    errorMessage: "Failed to send message",
    onSuccess: () => {
      setMessageText("");
      refetch();
    },
  });

  const handleSendMessage = () => {
    if (!messageText.trim() || sendMessage.isSubmitting) return;
    sendMessage.mutate(messageText.trim());
  };

  if (isLoading || !lead) {
    return (
      <div
        className="min-h-screen max-w-md mx-auto flex items-center justify-center"
        style={{ fontFamily: "'Inter', sans-serif", background: "#f6f7f8" }}
      >
        <div className="animate-pulse text-slate-400 text-sm">Loading lead...</div>
      </div>
    );
  }

  const sentimentKey = lead.sentimentLabel?.toUpperCase() || "COOL";
  const sStyles = SENTIMENT_STYLES[sentimentKey] || SENTIMENT_STYLES.COOL;
  const initials = lead.buyerName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="min-h-screen max-w-md mx-auto relative"
      style={{ fontFamily: "'Inter', sans-serif", background: "#f6f7f8" }}
    >
      {/* ── Header ── */}
      <div className="border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40 bg-white">
        <Link
          href="/leads"
          className="flex items-center gap-1"
          style={{ color: "#137fec" }}
        >
          <MaterialIcon name="arrow_back_ios_new" />
          <span className="text-lg">Leads</span>
        </Link>
        <h1 className="text-lg font-bold text-slate-900">Lead Profile</h1>
        <button style={{ color: "#137fec" }}>
          <MaterialIcon name="more_horiz" />
        </button>
      </div>

      {/* ── Main Content ── */}
      <main className="pb-48">
        {/* Profile Section */}
        <section className="p-4 bg-white">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-slate-200 overflow-hidden border-2 border-[#137fec]/20 flex items-center justify-center">
                <span
                  className="text-2xl font-bold"
                  style={{ color: "#137fec" }}
                >
                  {initials}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-slate-900">{lead.buyerName}</h2>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 uppercase tracking-wider"
                  style={{ background: sStyles.bg, color: sStyles.color }}
                >
                  <MaterialIcon
                    name="local_fire_department"
                    fill
                    className="!text-[12px]"
                  />
                  {sStyles.label}
                </span>
              </div>
              {lead.phone && (
                <p className="text-slate-500 text-sm flex items-center gap-1">
                  <MaterialIcon name="call" className="text-sm" />
                  {lead.phone}
                </p>
              )}
              {lead.email && (
                <p className="text-slate-500 text-sm flex items-center gap-1 mt-0.5">
                  <MaterialIcon name="mail" className="text-sm" />
                  {lead.email}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                <Link
                  href={(() => {
                    const params = new URLSearchParams({
                      leadId: id,
                      buyer: lead.buyerName,
                      message: (timeline.find((m) => m.role === "USER")?.text ?? lead.message ?? "Inquiry") as string,
                      vehicle: lead.vehicle?.name ?? "Vehicle",
                      price: lead.vehicle?.priceDisplay ?? "",
                      phone: lead.phone ?? "",
                    });
                    return `/smart-reply?${params.toString()}`;
                  })()}
                  className="flex-1 min-w-[100px] text-white font-semibold py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                  style={{ background: "#137fec" }}
                >
                  <MaterialIcon name="smart_toy" className="text-sm" /> AI Reply
                </Link>
                <button
                  className="flex-1 min-w-[80px] text-white font-semibold py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                  style={{ background: "#25D366" }}
                >
                  <MaterialIcon name="call" className="text-sm" /> Call
                </button>
                <button className="flex-1 min-w-[80px] bg-slate-100 font-semibold py-2 rounded-lg text-sm flex items-center justify-center gap-2 border border-slate-200">
                  <MaterialIcon name="mail" className="text-sm" /> Email
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Vehicle of Interest */}
        {lead.vehicle && (
          <section className="p-4">
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Vehicle of Interest
              </p>
              <div className="flex gap-3">
                <div className="w-24 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                  {lead.vehicle.images?.[0] ? (
                    <Image
                      src={lead.vehicle.images[0]}
                      alt={lead.vehicle.name}
                      width={96}
                      height={64}
                      className="w-full h-full object-cover"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MaterialIcon name="directions_car" className="text-slate-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-base text-slate-900">
                      {lead.vehicle.name}
                    </h3>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                      In Stock
                    </span>
                  </div>
                  <div className="flex justify-between items-end mt-1">
                    <p
                      className="font-bold text-lg leading-none"
                      style={{ color: "#137fec" }}
                    >
                      {lead.vehicle.priceDisplay}
                    </p>
                    {lead.budget && (
                      <span className="text-[10px] text-slate-400">
                        Budget: {lead.budget}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Lead Details */}
        <section className="px-4 py-2">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm mb-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Source</p>
                <p className="text-sm text-slate-700 font-medium">{lead.source}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Status</p>
                <p className="text-sm text-slate-700 font-medium">{lead.status}</p>
              </div>
              {lead.location && (
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Location</p>
                  <p className="text-sm text-slate-700 font-medium">{lead.location}</p>
                </div>
              )}
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Sentiment</p>
                <p className="text-sm text-slate-700 font-medium">{lead.sentiment}%</p>
              </div>
            </div>
          </div>
        </section>

        {/* Communication History Timeline */}
        <section className="px-4 py-2">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
            Communication History
          </h3>
          {timeline.length === 0 ? (
            <div className="py-8 text-center">
              <MaterialIcon name="chat_bubble_outline" className="text-3xl text-slate-300 mb-2" />
              <p className="text-slate-400 text-sm">No messages yet</p>
            </div>
          ) : (
            <div className="space-y-0">
              {timeline.map((item, i) => {
                const isAI = item.role === "AI";
                const iconBg = isAI ? "#9333ea" : "#22c55e";
                const icon = isAI ? "auto_awesome" : "chat";
                const label = isAI ? "AI Response" : "Message";
                const labelColor = isAI ? "text-purple-600" : "text-green-600";

                return (
                  <div key={item.id} className="relative pb-8 last:pb-0">
                    {i < timeline.length - 1 && (
                      <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-slate-200" />
                    )}
                    <div className="flex gap-4">
                      <div
                        className="z-10 w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-md text-white"
                        style={{ background: iconBg }}
                      >
                        <MaterialIcon name={icon} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className={`text-sm font-bold ${labelColor}`}>
                            {label}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {timeAgo(item.createdAt)}
                          </span>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-tr-xl rounded-br-xl rounded-bl-xl p-3 shadow-sm">
                          <p className="text-sm text-slate-800">{item.text}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* ── Sticky Bottom: AI Suggest + Input ── */}
      <div
        className="fixed bottom-0 left-0 right-0 max-w-md mx-auto border-t border-slate-200 pb-8 pt-3 px-4 z-50 md:hidden"
        style={{
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="max-w-md mx-auto flex flex-col gap-3">
          {/* AI Suggestion Bubble */}
          <div
            className="rounded-xl p-2.5 flex items-start gap-3"
            style={{
              background: "rgba(19,127,236,0.05)",
              border: "1px solid rgba(19,127,236,0.2)",
            }}
          >
            <div
              className="text-white p-1 rounded-lg shrink-0"
              style={{ background: "#137fec" }}
            >
              <MaterialIcon name="auto_awesome" className="!text-[18px]" />
            </div>
            <div className="flex-1">
              <p
                className="text-[11px] font-bold uppercase mb-0.5"
                style={{ color: "#137fec" }}
              >
                AI Suggestion
              </p>
              <p className="text-xs text-slate-700">
                &ldquo;Would you like to schedule a quick test drive or appraisal?&rdquo;
              </p>
            </div>
            <button
              className="text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shrink-0 self-center"
              style={{ background: "#137fec" }}
              onClick={() => setMessageText("Would you like to schedule a quick test drive or appraisal?")}
            >
              Use
            </button>
          </div>

          {/* Input Area */}
          <div className="flex gap-2 items-center">
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 bg-slate-100">
              <MaterialIcon name="add" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Type a reply..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="w-full bg-slate-100 border-none rounded-full px-4 py-2.5 text-sm outline-none pr-10"
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2"
                style={{ color: "#137fec" }}
              >
                <MaterialIcon name="mic" className="text-xl" />
              </button>
            </div>
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center text-white disabled:opacity-50"
              style={{
                background: "#137fec",
                boxShadow: "0 4px 12px rgba(19,127,236,0.3)",
              }}
              onClick={handleSendMessage}
              disabled={!messageText.trim() || sendMessage.isSubmitting}
            >
              <MaterialIcon name={sendMessage.isSubmitting ? "hourglass_empty" : "send"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
