"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { CRETA, BLUR_DATA_URL } from "@/lib/car-images";
import { MaterialIcon } from "@/components/MaterialIcon";

interface Suggestion {
  tone: string;
  toneIcon: string;
  toneBg: string;
  toneColor: string;
  text: string;
}

function SmartReplyContent() {
  const searchParams = useSearchParams();
  const leadMessage = searchParams.get("message") ?? "Is the 2023 Hyundai Creta SX(O) still available for financing? I'd like to come see it tomorrow if possible.";
  const vehicleName = searchParams.get("vehicle") ?? "2023 Hyundai Creta SX(O)";
  const vehiclePrice = searchParams.get("price") ?? "₹14.5L";
  const buyerName = searchParams.get("buyer") ?? "Priya Sharma";
  const leadId = searchParams.get("leadId") ?? "1";

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const generateSuggestions = useCallback(async () => {
    setLoading(true);
    setSent(false);
    try {
      const res = await fetch("/api/ai/smart-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadMessage, vehicleName, vehiclePrice, buyerName }),
      });
      const data = await res.json();
      if (data.suggestions?.length > 0) {
        setSuggestions(data.suggestions);
        setSelected(0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [leadMessage, vehicleName, vehiclePrice, buyerName]);

  useEffect(() => { generateSuggestions(); }, [generateSuggestions]);

  const handleSend = async (channel: "whatsapp" | "email") => {
    if (!suggestions[selected]) return;
    setSending(true);
    const text = suggestions[selected].text;
    try {
      await fetch(`/api/leads/${leadId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, role: "USER", type: "MANUAL" }),
      });
      setSent(true);

      if (channel === "whatsapp") {
        const phone = searchParams.get("phone") ?? "";
        if (phone) {
          const res = await fetch("/api/whatsapp/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ to: phone, text }),
          });
          const json = await res.json();
          if (res.ok && json.success) return;
          // API failed or not configured — open wa.me as fallback
        }
        if (phone) window.open(`https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`, "_blank");
      }
    } catch (err) {
      console.error(err);
      if (channel === "whatsapp") {
        const phone = searchParams.get("phone") ?? "";
        if (phone) window.open(`https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`, "_blank");
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="relative min-h-screen max-w-md mx-auto flex flex-col overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif", background: "#f6f7f8" }}
    >
      {/* Background blur */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="p-4 space-y-4">
          <div className="h-40 w-full rounded-xl bg-slate-200" />
          <div className="h-6 w-3/4 rounded bg-slate-200" />
          <div className="h-4 w-1/2 rounded bg-slate-200" />
        </div>
      </div>
      <div className="absolute inset-0 z-10 bg-black/20 backdrop-blur-sm" />

      {/* Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col rounded-t-[2.5rem] bg-white" style={{ maxHeight: "92%", boxShadow: "0 -10px 40px rgba(0,0,0,0.1)" }}>
        <div className="flex h-8 w-full items-center justify-center">
          <div className="h-1.5 w-12 rounded-full bg-slate-300" />
        </div>

        <div className="flex items-center justify-between px-6 pb-2 pt-2">
          <Link href={`/leads/${leadId}`} className="flex w-10 h-10 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100">
            <MaterialIcon name="close" />
          </Link>
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-bold text-slate-900">AI Smart Reply</h2>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#137fec" }} />
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#137fec" }}>
                {loading ? "Generating..." : "Assistant Active"}
              </span>
            </div>
          </div>
          <button
            onClick={generateSuggestions}
            className="flex w-10 h-10 items-center justify-center rounded-full"
            style={{ background: "rgba(19,127,236,0.1)" }}
          >
            <MaterialIcon name="auto_awesome" className="text-[22px] text-[#137fec]" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 pb-32" style={{ scrollbarWidth: "none" }}>
          {/* Last message */}
          <div className="mt-6">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-500">Last Message Received</h3>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-200">
                  <Image src={CRETA} alt="" width={56} height={56} className="object-cover" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold" style={{ color: "#137fec" }}>{vehicleName} &bull; {vehiclePrice}</p>
                  <p className="text-sm font-bold text-slate-900">Lead: {buyerName}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 italic">&ldquo;{leadMessage}&rdquo;</p>
                </div>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">AI Generated Suggestions</h3>
              <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "rgba(19,127,236,0.1)", color: "#137fec" }}>
                {loading ? "..." : `${suggestions.length} OPTIONS`}
              </span>
            </div>

            {loading && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-2xl border border-slate-100 bg-slate-50 p-5 animate-pulse">
                    <div className="h-4 w-24 rounded bg-slate-200 mb-3" />
                    <div className="space-y-2">
                      <div className="h-3 w-full rounded bg-slate-200" />
                      <div className="h-3 w-5/6 rounded bg-slate-200" />
                      <div className="h-3 w-4/6 rounded bg-slate-200" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && (
              <div className="space-y-4">
                {suggestions.map((s, i) => (
                  <div
                    key={s.tone}
                    onClick={() => setSelected(i)}
                    className="relative cursor-pointer rounded-2xl bg-white p-5 transition-all"
                    style={i === selected ? { border: "2px solid #137fec", boxShadow: "0 0 20px rgba(19,127,236,0.25)" } : { border: "1px solid #e2e8f0" }}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold" style={{ background: s.toneBg, color: s.toneColor }}>
                        <MaterialIcon name={s.toneIcon} className="text-sm" />
                        {s.tone}
                      </span>
                      {i === selected && <MaterialIcon name="check_circle" className="text-[#137fec]" />}
                    </div>
                    <p className="text-[15px] leading-relaxed" style={{ color: i === selected ? "#334155" : "#64748b" }}>{s.text}</p>
                    {i === selected && (
                      <div className="mt-4 flex gap-2 border-t pt-3" style={{ borderColor: "#f8fafc" }}>
                        <button
                          onClick={() => handleSend("whatsapp")}
                          disabled={sending || sent}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold text-white disabled:opacity-60"
                          style={{ background: "#137fec", boxShadow: "0 4px 12px rgba(19,127,236,0.25)" }}
                        >
                          <MaterialIcon name={sent ? "check" : "send"} className="text-lg" />
                          {sent ? "Sent!" : sending ? "Sending..." : "Send Now"}
                        </button>
                        <button className="flex items-center justify-center rounded-lg bg-slate-50 px-3 text-slate-400">
                          <MaterialIcon name="edit" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <button
                onClick={generateSuggestions}
                disabled={loading}
                className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold shadow-sm disabled:opacity-50"
                style={{ border: "1px solid rgba(19,127,236,0.3)", color: "#137fec" }}
              >
                <MaterialIcon name="auto_awesome" className="text-xl" />
                Regenerate Suggestions
              </button>
            </div>
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="absolute bottom-0 left-0 right-0 border-t p-4 bg-white/90 backdrop-blur-md" style={{ borderColor: "#f1f5f9" }}>
          <div className="flex gap-3">
            <button
              onClick={() => handleSend("whatsapp")}
              disabled={sending || loading || suggestions.length === 0}
              className="flex h-14 flex-1 items-center justify-center gap-3 rounded-xl font-bold text-white disabled:opacity-50"
              style={{ background: "#25D366", boxShadow: "0 4px 12px rgba(37,211,102,0.3)" }}
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.522-2.961-2.638-.087-.117-.708-.941-.708-1.793 0-.852.448-1.271.607-1.442.159-.171.347-.214.463-.214.116 0 .231.002.332.006.106.004.25-.039.391.299.144.347.491 1.2.535 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289-.087.101-.183.226-.261.304-.087.087-.177.182-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.088.275.073.376-.043.101-.117.434-.506.549-.68.116-.174.232-.145.391-.087.159.058 1.012.477 1.185.564.174.087.289.13.332.202.043.073.043.419-.101.824z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.434 5.176L2 22l4.954-1.298C8.411 21.503 10.138 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.634 0-3.159-.444-4.468-1.213l-.321-.189-2.354.617.628-2.293-.209-.333C4.482 15.318 4 13.716 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/></svg>
              WhatsApp
            </button>
            <button
              onClick={() => handleSend("email")}
              disabled={sending || loading || suggestions.length === 0}
              className="flex h-14 flex-1 items-center justify-center gap-3 rounded-xl font-bold text-white shadow-lg disabled:opacity-50"
              style={{ background: "#0f172a" }}
            >
              <MaterialIcon name="mail" />
              Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SmartReplyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f6f7f8] flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-[#137fec] border-t-transparent animate-spin" /></div>}>
      <SmartReplyContent />
    </Suspense>
  );
}
