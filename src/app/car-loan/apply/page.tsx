"use client";

import { useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

/* ── Steps ──────────────────────────────────────── */
const STEPS = ["Personal", "Vehicle", "Financial", "Review"] as const;

const EMPLOYMENT_TYPES = ["Salaried", "Self-Employed", "Business"] as const;
const CAR_TYPES = ["New", "Used"] as const;
const BRANDS = ["Maruti", "Hyundai", "Tata", "Mahindra", "Kia", "Honda", "Toyota", "MG"] as const;
const TENURE_OPTIONS = [12, 24, 36, 48, 60, 72, 84] as const;
const BANKS = ["SBI", "HDFC", "ICICI", "Axis", "Kotak", "Any"] as const;

interface FormData {
  /* Personal */
  fullName: string;
  phone: string;
  email: string;
  dob: string;
  pan: string;
  employment: string;
  /* Vehicle */
  carType: string;
  brand: string;
  model: string;
  variant: string;
  exShowroom: string;
  /* Financial */
  monthlyIncome: string;
  existingEmis: string;
  loanAmount: string;
  tenure: string;
  preferredBank: string;
}

const INITIAL: FormData = {
  fullName: "",
  phone: "",
  email: "",
  dob: "",
  pan: "",
  employment: "Salaried",
  carType: "New",
  brand: "",
  model: "",
  variant: "",
  exShowroom: "",
  monthlyIncome: "",
  existingEmis: "",
  loanAmount: "",
  tenure: "60",
  preferredBank: "Any",
};

/* ── Pill selector ──────────────────────────────── */
function Pill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-4 py-2 text-sm font-semibold transition-colors"
      style={{
        background: active ? "#1152d4" : "rgba(255,255,255,0.06)",
        color: active ? "#fff" : "#94a3b8",
        border: active ? "1px solid #1152d4" : "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {label}
    </button>
  );
}

/* ── Text input ─────────────────────────────────── */
function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  optional = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  optional?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide">
        {label}
        {optional && <span className="text-slate-500 normal-case ml-1">(optional)</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/40"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
      />
    </div>
  );
}

/* ── Select input ───────────────────────────────── */
function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/40 appearance-none"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <option value="" disabled>
          Select
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-gray-900 text-white">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ── Review row ─────────────────────────────────── */
function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-slate-400 text-xs">{label}</span>
      <span className="text-white text-sm font-medium">{value || "—"}</span>
    </div>
  );
}

/* ── Main page ──────────────────────────────────── */
export default function CarLoanApplyPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [refId] = useState(() => {
    const n = Math.floor(100000 + Math.random() * 900000);
    return `LOAN-${n}`;
  });

  const set = (key: keyof FormData, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  /* ── Step renderers ── */
  const renderPersonal = () => (
    <div className="space-y-4">
      <Input label="Full Name" value={form.fullName} onChange={(v) => set("fullName", v)} placeholder="John Doe" />
      <Input label="Phone Number" value={form.phone} onChange={(v) => set("phone", v)} placeholder="9876543210" type="tel" />
      <Input label="Email" value={form.email} onChange={(v) => set("email", v)} placeholder="john@email.com" type="email" />
      <Input label="Date of Birth" value={form.dob} onChange={(v) => set("dob", v)} type="date" />
      <Input label="PAN Number" value={form.pan} onChange={(v) => set("pan", v)} placeholder="ABCDE1234F" optional />
      <div className="space-y-1.5">
        <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Employment Type</label>
        <div className="flex flex-wrap gap-2">
          {EMPLOYMENT_TYPES.map((t) => (
            <Pill key={t} label={t} active={form.employment === t} onClick={() => set("employment", t)} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderVehicle = () => (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Car Type</label>
        <div className="flex gap-2">
          {CAR_TYPES.map((t) => (
            <Pill key={t} label={t} active={form.carType === t} onClick={() => set("carType", t)} />
          ))}
        </div>
      </div>
      <Select
        label="Brand"
        value={form.brand}
        onChange={(v) => set("brand", v)}
        options={BRANDS.map((b) => ({ label: b, value: b }))}
      />
      <Input label="Model" value={form.model} onChange={(v) => set("model", v)} placeholder="e.g. Creta" />
      <Input label="Variant" value={form.variant} onChange={(v) => set("variant", v)} placeholder="e.g. SX(O) Turbo" />
      <Input label="Ex-Showroom Price (₹)" value={form.exShowroom} onChange={(v) => set("exShowroom", v)} placeholder="1500000" type="number" />
    </div>
  );

  const renderFinancial = () => (
    <div className="space-y-4">
      <Input label="Monthly Income (₹)" value={form.monthlyIncome} onChange={(v) => set("monthlyIncome", v)} placeholder="75000" type="number" />
      <Input label="Existing EMIs (₹/mo)" value={form.existingEmis} onChange={(v) => set("existingEmis", v)} placeholder="0" type="number" />
      <Input label="Loan Amount Needed (₹)" value={form.loanAmount} onChange={(v) => set("loanAmount", v)} placeholder="1000000" type="number" />
      <Select
        label="Preferred Tenure"
        value={form.tenure}
        onChange={(v) => set("tenure", v)}
        options={TENURE_OPTIONS.map((t) => ({ label: `${t} months`, value: String(t) }))}
      />
      <Select
        label="Preferred Bank"
        value={form.preferredBank}
        onChange={(v) => set("preferredBank", v)}
        options={BANKS.map((b) => ({ label: b, value: b }))}
      />
    </div>
  );

  const renderReview = () => {
    const sections = [
      {
        title: "Personal Details",
        step: 0,
        rows: [
          { label: "Full Name", value: form.fullName },
          { label: "Phone", value: form.phone },
          { label: "Email", value: form.email },
          { label: "Date of Birth", value: form.dob },
          { label: "PAN", value: form.pan || "Not provided" },
          { label: "Employment", value: form.employment },
        ],
      },
      {
        title: "Vehicle Details",
        step: 1,
        rows: [
          { label: "Car Type", value: form.carType },
          { label: "Brand", value: form.brand },
          { label: "Model", value: form.model },
          { label: "Variant", value: form.variant },
          { label: "Ex-Showroom", value: form.exShowroom ? `₹${Number(form.exShowroom).toLocaleString("en-IN")}` : "" },
        ],
      },
      {
        title: "Financial Details",
        step: 2,
        rows: [
          { label: "Monthly Income", value: form.monthlyIncome ? `₹${Number(form.monthlyIncome).toLocaleString("en-IN")}` : "" },
          { label: "Existing EMIs", value: form.existingEmis ? `₹${Number(form.existingEmis).toLocaleString("en-IN")}/mo` : "₹0/mo" },
          { label: "Loan Amount", value: form.loanAmount ? `₹${Number(form.loanAmount).toLocaleString("en-IN")}` : "" },
          { label: "Tenure", value: `${form.tenure} months` },
          { label: "Preferred Bank", value: form.preferredBank },
        ],
      },
    ];

    return (
      <div className="space-y-4">
        {sections.map((s) => (
          <div key={s.title} className="rounded-2xl p-4" style={{ background: "#111827" }}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-white font-semibold text-sm">{s.title}</h4>
              <button
                onClick={() => setStep(s.step)}
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{ color: "#1152d4", background: "rgba(17,82,212,0.1)" }}
              >
                Edit
              </button>
            </div>
            {s.rows.map((r) => (
              <ReviewRow key={r.label} label={r.label} value={r.value} />
            ))}
          </div>
        ))}
      </div>
    );
  };

  /* ── Success state ── */
  if (submitted) {
    return (
      <div className="min-h-dvh pb-36" style={{ background: "#080a0f", color: "#f1f5f9" }}>
        <div className="max-w-lg mx-auto px-4 flex flex-col items-center justify-center pt-24 text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
            style={{ background: "rgba(16,185,129,0.15)" }}
          >
            <MaterialIcon name="check_circle" className="text-[48px] text-emerald-400" fill />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Application Submitted!</h2>
          <p className="text-slate-400 text-sm mb-6">
            Ref: <span className="text-white font-semibold">{refId}</span>
          </p>
          <div className="rounded-2xl p-5 w-full" style={{ background: "#111827" }}>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "rgba(17,82,212,0.15)" }}
              >
                <MaterialIcon name="phone_in_talk" className="text-[22px]" style={{ color: "#1152d4" }} />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold text-sm">Our advisor will call you</p>
                <p className="text-slate-400 text-xs">Within 2 hours during business hours</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "rgba(16,185,129,0.15)" }}
              >
                <MaterialIcon name="mail" className="text-[22px] text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold text-sm">Confirmation sent</p>
                <p className="text-slate-400 text-xs">Check your email for details</p>
              </div>
            </div>
          </div>
          <Link
            href="/car-loan"
            className="mt-8 flex items-center justify-center gap-2 w-full rounded-xl py-4 text-white font-bold text-sm"
            style={{ background: "#1152d4" }}
          >
            <MaterialIcon name="arrow_back" className="text-[18px]" />
            Back to Car Loan
          </Link>
        </div>
        <BuyerBottomNav />
      </div>
    );
  }

  const stepContent = [renderPersonal, renderVehicle, renderFinancial, renderReview];

  return (
    <div className="min-h-dvh pb-36" style={{ background: "#080a0f", color: "#f1f5f9" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-40 flex items-center gap-3 px-4 py-4 border-b border-white/10"
        style={{ background: "#080a0f" }}
      >
        <Link
          href="/car-loan"
          className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10"
        >
          <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
        </Link>
        <h1 className="text-lg font-bold text-white">Apply for Car Loan</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-5 space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => {
            const done = i < step;
            const current = i === step;
            return (
              <div key={s} className="flex flex-col items-center flex-1">
                <div className="flex items-center w-full">
                  {i > 0 && (
                    <div
                      className="flex-1 h-0.5 rounded-full"
                      style={{ background: done || current ? "#1152d4" : "rgba(255,255,255,0.1)" }}
                    />
                  )}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      background: done ? "#1152d4" : current ? "rgba(17,82,212,0.2)" : "rgba(255,255,255,0.06)",
                      color: done || current ? "#fff" : "#64748b",
                      border: current ? "2px solid #1152d4" : "2px solid transparent",
                    }}
                  >
                    {done ? (
                      <MaterialIcon name="check" className="text-[16px]" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className="flex-1 h-0.5 rounded-full"
                      style={{ background: done ? "#1152d4" : "rgba(255,255,255,0.1)" }}
                    />
                  )}
                </div>
                <span
                  className="text-[10px] mt-1.5 font-semibold"
                  style={{ color: done || current ? "#fff" : "#64748b" }}
                >
                  {s}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step Title */}
        <div>
          <h2 className="text-white font-bold text-base">
            {step === 3 ? "Review Your Application" : `Step ${step + 1}: ${STEPS[step]} Details`}
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            {step === 0 && "Tell us about yourself"}
            {step === 1 && "Which car are you financing?"}
            {step === 2 && "Your financial information"}
            {step === 3 && "Confirm all details before submitting"}
          </p>
        </div>

        {/* Step Content */}
        {stepContent[step]()}

        {/* Navigation */}
        <div className="flex items-center gap-3 pt-2">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-slate-300 border border-white/10"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <MaterialIcon name="arrow_back" className="text-[18px]" />
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white"
              style={{ background: "#1152d4" }}
            >
              Next
              <MaterialIcon name="arrow_forward" className="text-[18px]" />
            </button>
          ) : (
            <button
              onClick={() => setSubmitted(true)}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white"
              style={{ background: "#059669" }}
            >
              <MaterialIcon name="send" className="text-[18px]" />
              Submit Application
            </button>
          )}
        </div>
      </div>

      <BuyerBottomNav />
    </div>
  );
}
