"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

// Feb 24–28 2026 (Mon–Fri)
const DATES = [
  { label: "Mon", date: "Feb 24", value: "2026-02-24" },
  { label: "Tue", date: "Feb 25", value: "2026-02-25" },
  { label: "Wed", date: "Feb 26", value: "2026-02-26" },
  { label: "Thu", date: "Feb 27", value: "2026-02-27" },
  { label: "Fri", date: "Feb 28", value: "2026-02-28" },
];

const TIMES = [
  { label: "9:00 AM", value: "09:00" },
  { label: "11:00 AM", value: "11:00" },
  { label: "1:00 PM", value: "13:00" },
  { label: "3:00 PM", value: "15:00" },
  { label: "5:00 PM", value: "17:00" },
];

const WHAT_TO_EXPECT = [
  {
    icon: "checklist",
    title: "250-point inspection",
    desc: "Engine, brakes, tyres, electricals, body panels — thoroughly checked.",
  },
  {
    icon: "schedule",
    title: "45 minutes only",
    desc: "Quick, non-invasive process. Your car won't leave your premises.",
  },
  {
    icon: "payments",
    title: "Completely free",
    desc: "No charges whatsoever. Cancel anytime up to 2 hours before.",
  },
  {
    icon: "videocam",
    title: "Live video option",
    desc: "Watch the inspection in real-time via video call if you prefer.",
  },
];

function SchedulePageInner() {
  const params = useSearchParams();
  const brand = params.get("brand") ?? "";
  const year = params.get("year") ?? "";

  const [address, setAddress] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const canConfirm = address.trim().length > 5 && selectedDate && selectedTime;

  const selectedDateLabel = DATES.find((d) => d.value === selectedDate);
  const selectedTimeLabel = TIMES.find((t) => t.value === selectedTime);

  if (confirmed) {
    return (
      <div
        className="min-h-dvh w-full flex flex-col pb-32"
        style={{ background: "#080a0f", color: "#e2e8f0" }}
      >
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-lg mx-auto w-full py-16">
          {/* Success icon */}
          <div
            className="relative flex h-24 w-24 items-center justify-center rounded-full mb-6"
            style={{
              background: "rgba(16,185,129,0.12)",
              border: "2px solid rgba(16,185,129,0.3)",
            }}
          >
            <MaterialIcon
              name="check_circle"
              className="text-[52px]"
              fill
              style={{ color: "#10b981" }}
            />
            <div
              className="absolute -inset-2 rounded-full animate-ping opacity-20"
              style={{ background: "#10b981" }}
            />
          </div>

          <h2 className="text-[24px] font-black text-white mb-2">
            Inspection Scheduled!
          </h2>
          <p className="text-[14px] text-slate-400 leading-relaxed mb-8">
            Your inspection is confirmed. Rajan Kumar will arrive at the address below.
          </p>

          {/* Summary card */}
          <div
            className="w-full rounded-2xl border p-5 text-left space-y-4 mb-6"
            style={{
              background: "rgba(255,255,255,0.03)",
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            <SummaryRow icon="event" label="Date">
              {selectedDateLabel?.label}, {selectedDateLabel?.date} 2026
            </SummaryRow>
            <div
              className="h-px"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
            <SummaryRow icon="schedule" label="Time">
              {selectedTimeLabel?.label}
            </SummaryRow>
            <div
              className="h-px"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
            <SummaryRow icon="location_on" label="Address">
              {address}
            </SummaryRow>
            <div
              className="h-px"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
            <SummaryRow icon="person" label="Inspector">
              Rajan Kumar · 4.9★
            </SummaryRow>
            {(brand || year) && (
              <>
                <div
                  className="h-px"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                />
                <SummaryRow icon="directions_car" label="Vehicle">
                  {[brand, year].filter(Boolean).join(" ")}
                </SummaryRow>
              </>
            )}
          </div>

          {/* What happens next */}
          <div
            className="w-full rounded-2xl border p-4 text-left mb-6"
            style={{
              background: "rgba(17,82,212,0.06)",
              borderColor: "rgba(17,82,212,0.15)",
            }}
          >
            <p className="text-[11px] font-bold uppercase tracking-widest text-blue-400 mb-3">
              What happens next?
            </p>
            <div className="space-y-2">
              {[
                "SMS & WhatsApp confirmation sent to your number",
                "Inspector will call 30 min before arrival",
                "Receive your final offer immediately after inspection",
                "Payment processed within 24 hours of acceptance",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-black text-white mt-0.5"
                    style={{ background: "#1152d4" }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-[12px] text-slate-400">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full rounded-2xl py-4 font-bold text-[15px] text-white"
            style={{
              background: "linear-gradient(135deg, #1152d4 0%, #1d4ed8 100%)",
              boxShadow: "0 8px 24px rgba(17,82,212,0.35)",
            }}
          >
            <MaterialIcon name="home" className="text-[20px]" />
            Back to Home
          </Link>

          <Link
            href="/used-cars/sell"
            className="mt-3 text-[13px] font-semibold text-slate-500 underline underline-offset-2"
          >
            Sell another car
          </Link>
        </div>

        <BuyerBottomNav />
      </div>
    );
  }

  return (
    <div
      className="min-h-dvh w-full pb-32"
      style={{ background: "#080a0f", color: "#e2e8f0" }}
    >
      {/* ─── HEADER ─── */}
      <header
        className="sticky top-0 z-40 border-b border-white/5"
        style={{
          background: "rgba(8,10,15,0.97)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-lg mx-auto flex items-center gap-3 px-4 py-3">
          <Link
            href="/used-cars/sell/list"
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
          </Link>
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Step 3 of 4
            </p>
            <h1 className="text-[16px] font-bold text-white leading-tight">
              Schedule Inspection
            </h1>
          </div>
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
            style={{
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.2)",
            }}
          >
            <MaterialIcon name="payments" className="text-[13px]" style={{ color: "#10b981" }} />
            <span className="text-[10px] font-bold text-emerald-400">Free</span>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-5 space-y-6">
        {/* ─── INSPECTOR PROFILE ─── */}
        <div
          className="flex items-center gap-4 rounded-2xl border p-4"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderColor: "rgba(255,255,255,0.07)",
          }}
        >
          {/* Avatar */}
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full shrink-0 text-[20px] font-black text-white"
            style={{
              background: "linear-gradient(135deg, #1152d4 0%, #3b82f6 100%)",
            }}
          >
            R
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-bold text-white">Rajan Kumar</p>
            <p className="text-[12px] text-slate-400 mt-0.5">
              Certified Inspector · 4.9★ · 312 inspections
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span
                className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(16,185,129,0.12)",
                  color: "#10b981",
                  border: "1px solid rgba(16,185,129,0.2)",
                }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Available
              </span>
              <span className="text-[10px] text-slate-600">
                Responds within 5 min
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[11px] text-slate-500">Rating</p>
            <p className="text-[20px] font-black text-amber-400">4.9</p>
            <div className="flex gap-0.5 justify-end mt-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <MaterialIcon
                  key={i}
                  name="star"
                  className="text-[12px]"
                  fill
                  style={{ color: i < 5 ? "#f59e0b" : "#334155" }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ─── ADDRESS ─── */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            Inspection Address
          </p>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your full address including flat/house number, street, landmark, city and pincode"
            rows={3}
            className="w-full rounded-xl px-4 py-3 text-[13px] text-white outline-none resize-none border placeholder:text-slate-600 leading-relaxed"
            style={{
              background: "rgba(255,255,255,0.05)",
              borderColor: address
                ? "rgba(17,82,212,0.5)"
                : "rgba(255,255,255,0.1)",
            }}
          />
          <button
            className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold"
            style={{ color: "#1152d4" }}
          >
            <MaterialIcon name="my_location" className="text-[14px]" />
            Use current location
          </button>
        </div>

        {/* ─── DATE PICKER ─── */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
            Preferred Date
          </p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {DATES.map((d) => {
              const active = selectedDate === d.value;
              return (
                <button
                  key={d.value}
                  onClick={() => setSelectedDate(d.value)}
                  className="flex flex-col items-center shrink-0 rounded-2xl px-4 py-3 border transition-all"
                  style={{
                    background: active
                      ? "rgba(17,82,212,0.18)"
                      : "rgba(255,255,255,0.04)",
                    borderColor: active ? "#1152d4" : "rgba(255,255,255,0.1)",
                    minWidth: "64px",
                    boxShadow: active ? "0 0 0 1px #1152d4" : "none",
                  }}
                >
                  <span
                    className="text-[10px] font-bold uppercase tracking-wide"
                    style={{ color: active ? "#93c5fd" : "#475569" }}
                  >
                    {d.label}
                  </span>
                  <span
                    className="text-[18px] font-black mt-1"
                    style={{ color: active ? "#fff" : "#64748b" }}
                  >
                    {d.date.split(" ")[1]}
                  </span>
                  <span
                    className="text-[9px] font-semibold"
                    style={{ color: active ? "#60a5fa" : "#334155" }}
                  >
                    {d.date.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── TIME SLOTS ─── */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
            Preferred Time
          </p>
          <div className="grid grid-cols-3 gap-2">
            {TIMES.map((t) => {
              const active = selectedTime === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => setSelectedTime(t.value)}
                  className="flex items-center justify-center rounded-xl py-3 text-[13px] font-bold border transition-all"
                  style={{
                    background: active
                      ? "rgba(17,82,212,0.18)"
                      : "rgba(255,255,255,0.04)",
                    color: active ? "#fff" : "#64748b",
                    borderColor: active ? "#1152d4" : "rgba(255,255,255,0.1)",
                    boxShadow: active ? "0 0 0 1px #1152d4" : "none",
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── WHAT TO EXPECT ─── */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
            What to expect
          </p>
          <div className="grid grid-cols-2 gap-3">
            {WHAT_TO_EXPECT.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl p-3.5 border"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  borderColor: "rgba(255,255,255,0.06)",
                }}
              >
                <MaterialIcon
                  name={item.icon}
                  className="text-[20px] mb-2"
                  style={{ color: "#1152d4" }}
                />
                <p className="text-[12px] font-bold text-white leading-tight">
                  {item.title}
                </p>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── SELECTED SUMMARY ─── */}
        {(selectedDate || selectedTime) && (
          <div
            className="flex items-center gap-3 rounded-xl px-4 py-3 border"
            style={{
              background: "rgba(17,82,212,0.08)",
              borderColor: "rgba(17,82,212,0.2)",
            }}
          >
            <MaterialIcon
              name="event_available"
              className="text-[20px] shrink-0"
              style={{ color: "#60a5fa" }}
            />
            <p className="text-[13px] text-slate-300">
              {selectedDateLabel && selectedTimeLabel ? (
                <>
                  <span className="font-bold text-white">
                    {selectedDateLabel.label}, {selectedDateLabel.date}
                  </span>{" "}
                  at{" "}
                  <span className="font-bold text-white">
                    {selectedTimeLabel.label}
                  </span>
                </>
              ) : selectedDateLabel ? (
                <>
                  <span className="font-bold text-white">
                    {selectedDateLabel.label}, {selectedDateLabel.date}
                  </span>{" "}
                  — pick a time slot
                </>
              ) : (
                "Pick a date above"
              )}
            </p>
          </div>
        )}

        {/* ─── CONFIRM BUTTON ─── */}
        <button
          onClick={() => canConfirm && setConfirmed(true)}
          disabled={!canConfirm}
          className="flex items-center justify-center gap-2 w-full rounded-2xl py-4 font-bold text-[15px] text-white transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: canConfirm
              ? "linear-gradient(135deg, #065f46 0%, #10b981 100%)"
              : "rgba(255,255,255,0.06)",
            boxShadow: canConfirm ? "0 8px 24px rgba(16,185,129,0.3)" : "none",
          }}
        >
          <MaterialIcon name="event_available" className="text-[20px]" />
          Confirm Inspection
        </button>

        <p className="text-center text-[11px] text-slate-600 pb-2">
          Free cancellation up to 2 hours before inspection
        </p>
      </main>

      <BuyerBottomNav />
    </div>
  );
}

function SummaryRow({
  icon,
  label,
  children,
}: {
  icon: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0"
        style={{ background: "rgba(17,82,212,0.1)" }}
      >
        <MaterialIcon name={icon} className="text-[15px]" style={{ color: "#60a5fa" }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
          {label}
        </p>
        <p className="text-[13px] font-semibold text-white mt-0.5">{children}</p>
      </div>
    </div>
  );
}

export default function SchedulePage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-dvh flex items-center justify-center"
          style={{ background: "#080a0f" }}
        >
          <div className="flex flex-col items-center gap-3">
            <div
              className="h-10 w-10 rounded-full border-2 border-transparent animate-spin"
              style={{ borderTopColor: "#1152d4" }}
            />
            <p className="text-[13px] text-slate-500">Loading…</p>
          </div>
        </div>
      }
    >
      <SchedulePageInner />
    </Suspense>
  );
}
