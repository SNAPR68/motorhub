"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MaterialIcon } from "@/components/MaterialIcon";

const INTENTS = [
  { icon: "check_circle", label: "Availability" },
  { icon: "sell", label: "Discount Offer" },
  { icon: "calendar_month", label: "Schedule Drive" },
  { icon: "settings", label: "Tech Specs" },
  { icon: "currency_exchange", label: "Trade-In" },
];

export default function QuickDraftPage() {
  const searchParams = useSearchParams();
  const buyerName = searchParams.get("buyer") ?? "Priya Sharma";
  const vehicleName = searchParams.get("vehicle") ?? "2023 Hyundai Creta SX(O)";
  const vehiclePrice = searchParams.get("price") ?? "₹14.5L";
  const buyerMessage = searchParams.get("message") ?? "Is this still available? I'm looking to trade in my 2020 Swift. Does the price include the tech package?";
  const leadId = searchParams.get("leadId") ?? "";

  const [selectedIntent, setSelectedIntent] = useState(0);
  const [tone, setTone] = useState(50);
  const [draftText, setDraftText] = useState("");
  const [fitScore, setFitScore] = useState(94);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const generateDraft = useCallback(async (intent: string, currentTone: number) => {
    setLoading(true);
    setSent(false);
    try {
      const res = await fetch("/api/ai/quick-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent, buyerName, vehicleName, vehiclePrice, buyerMessage, tone: currentTone }),
      });
      const data = await res.json();
      if (data.draft) {
        setDraftText(data.draft);
        setFitScore(data.fitScore ?? 94);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [buyerName, vehicleName, vehiclePrice, buyerMessage]);

  // Auto-generate on mount
  useEffect(() => {
    generateDraft(INTENTS[0].label, 50);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleIntentChange = (i: number) => {
    setSelectedIntent(i);
    generateDraft(INTENTS[i].label, tone);
  };

  const handleSend = async () => {
    if (!draftText.trim()) return;
    setSending(true);
    try {
      if (leadId) {
        await fetch(`/api/leads/${leadId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: draftText, role: "USER", type: "MANUAL" }),
        });
      }
      setSent(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen w-full max-w-md mx-auto flex-col overflow-x-hidden"
      style={{ fontFamily: "'Inter', sans-serif", background: "#f6f7f8", color: "#0f172a" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-10 border-b px-4 py-3 flex items-center justify-between"
        style={{ background: "rgba(255,255,255,0.8)", backdropFilter: "blur(12px)", borderColor: "#e2e8f0" }}
      >
        <Link href={leadId ? `/leads/${leadId}` : "/leads"} className="flex items-center" style={{ color: "#137fec" }}>
          <MaterialIcon name="arrow_back_ios_new" />
        </Link>
        <div className="flex flex-col items-center">
          <h1 className="text-sm font-bold tracking-tight text-slate-900">AI Quick Draft Studio</h1>
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Smart Chips Mode</span>
        </div>
        <button onClick={() => generateDraft(INTENTS[selectedIntent].label, tone)} className="text-slate-400">
          <MaterialIcon name="refresh" />
        </button>
      </header>

      {/* Chat Context */}
      <section className="p-4" style={{ background: "rgba(241,245,249,0.5)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(19,127,236,0.1)" }}>
            <MaterialIcon name="person" style={{ color: "#137fec" }} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Inquiry: {buyerName}</h3>
            <p className="text-xs text-slate-500">{vehicleName}</p>
          </div>
          <div className="ml-auto">
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: "rgba(34,197,94,0.1)", color: "#16a34a" }}>ONLINE</span>
          </div>
        </div>
        <div className="bg-white border rounded-xl p-3" style={{ borderColor: "#e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <p className="text-sm italic text-slate-600 line-clamp-2">&ldquo;{buyerMessage}&rdquo;</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] text-slate-400">Received just now</span>
            <span className="text-[10px] font-semibold flex items-center gap-1" style={{ color: "#137fec" }}>
              <MaterialIcon name="auto_awesome" className="text-[12px]" />
              Context Synced
            </span>
          </div>
        </div>
      </section>

      {/* Intent Chips */}
      <section className="py-4">
        <h3 className="px-4 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Select Intent</h3>
        <div className="flex gap-2 px-4 overflow-x-auto pb-2 no-scrollbar">
          {INTENTS.map((intent, i) => (
            <button
              key={intent.label}
              onClick={() => handleIntentChange(i)}
              disabled={loading}
              className="flex-none px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 disabled:opacity-60"
              style={i === selectedIntent
                ? { background: "#137fec", color: "white", boxShadow: "0 4px 12px rgba(19,127,236,0.2)" }
                : { background: "white", color: "#475569", border: "1px solid #e2e8f0" }}
            >
              <MaterialIcon name={intent.icon} className="text-sm" />
              {intent.label}
            </button>
          ))}
        </div>
      </section>

      {/* Draft Area */}
      <main className="flex-1 px-4 pb-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Draft Content</h3>
          <button
            onClick={() => generateDraft(INTENTS[selectedIntent].label, tone)}
            disabled={loading}
            className="text-xs font-bold flex items-center gap-1 disabled:opacity-50"
            style={{ color: "#137fec" }}
          >
            <MaterialIcon name="refresh" className="text-sm" />
            Regenerate
          </button>
        </div>
        <div
          className="rounded-2xl p-4 border relative min-h-[200px]"
          style={{ background: "rgba(241,245,249,0.8)", borderColor: "#e2e8f0", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.03)" }}
        >
          {loading ? (
            <div className="space-y-2 animate-pulse pt-2">
              <div className="h-3 w-full rounded bg-slate-200" />
              <div className="h-3 w-5/6 rounded bg-slate-200" />
              <div className="h-3 w-4/6 rounded bg-slate-200" />
              <div className="h-3 w-full rounded bg-slate-200" />
              <div className="h-3 w-3/4 rounded bg-slate-200" />
            </div>
          ) : (
            <textarea
              className="w-full h-full bg-transparent border-none focus:outline-none focus:ring-0 text-slate-800 text-base leading-relaxed resize-none min-h-[180px]"
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              placeholder="AI is generating your draft..."
            />
          )}
          {!loading && draftText && (
            <div
              className="absolute bottom-4 right-4 bg-white px-2 py-1 rounded-lg border flex items-center gap-2"
              style={{ borderColor: "#e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
            >
              <MaterialIcon name="bolt" fill className="text-[14px] text-[#137fec]" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">{fitScore}% Fit Score</span>
            </div>
          )}
        </div>
      </main>

      {/* Tone Control & Action */}
      <footer className="p-4 bg-white border-t space-y-4" style={{ borderColor: "#e2e8f0" }}>
        <div className="space-y-3 px-2">
          <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <span>Formal</span>
            <span style={{ color: "#137fec" }}>Optimized Tone</span>
            <span>Casual</span>
          </div>
          <div className="relative h-6 flex items-center">
            <div className="absolute w-full h-1.5 bg-slate-200 rounded-full" />
            <div className="absolute h-1.5 rounded-full" style={{ background: "rgba(19,127,236,0.3)", width: `${tone}%` }} />
            <input
              type="range" min={0} max={100} value={tone}
              onChange={(e) => setTone(Number(e.target.value))}
              onMouseUp={() => generateDraft(INTENTS[selectedIntent].label, tone)}
              onTouchEnd={() => generateDraft(INTENTS[selectedIntent].label, tone)}
              className="absolute w-full opacity-0 cursor-pointer h-6"
            />
            <div
              className="absolute w-5 h-5 bg-white rounded-full border-2 pointer-events-none"
              style={{ borderColor: "#137fec", boxShadow: "0 2px 6px rgba(0,0,0,0.15)", left: `calc(${tone}% - 10px)` }}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSend}
            disabled={sending || loading || !draftText.trim() || sent}
            className="flex-1 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: "#137fec", boxShadow: "0 4px 16px rgba(19,127,236,0.25)" }}
          >
            <MaterialIcon name={sent ? "check" : "send"} />
            {sent ? "Sent!" : sending ? "Sending..." : "Approve & Send"}
          </button>
        </div>
      </footer>

      {/* Bottom Nav */}
      <nav className="flex border-t px-4 pb-8 pt-2" style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderColor: "#e2e8f0" }}>
        {[
          { icon: "directions_car", label: "Inventory", href: "/inventory" },
          { icon: "group", label: "Leads", href: "/leads" },
          { icon: "magic_button", label: "Studio", href: "/quick-draft", active: true },
          { icon: "monitoring", label: "Analytics", href: "/analytics" },
          { icon: "settings", label: "Settings", href: "/settings" },
        ].map((item) => (
          <Link key={item.label} href={item.href} className="flex flex-1 flex-col items-center gap-1" style={{ color: item.active ? "#137fec" : "#94a3b8" }}>
            <MaterialIcon name={item.icon} fill={item.active} />
            <p className={`text-[10px] ${item.active ? "font-bold" : "font-medium"}`}>{item.label}</p>
          </Link>
        ))}
      </nav>
    </div>
  );
}
