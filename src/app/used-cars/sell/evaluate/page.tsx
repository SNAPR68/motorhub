"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

const BRANDS = [
  "Maruti Suzuki",
  "Hyundai",
  "Tata",
  "Mahindra",
  "Honda",
  "Toyota",
  "Kia",
  "Volkswagen",
];

const YEARS = Array.from({ length: 16 }, (_, i) => 2025 - i);

const FUEL_OPTIONS = ["Petrol", "Diesel", "CNG", "Electric"];

const OWNER_OPTIONS = [
  { label: "1st Owner", value: "1" },
  { label: "2nd Owner", value: "2" },
  { label: "3rd Owner+", value: "3" },
];

interface FormData {
  brand: string;
  year: string;
  variant: string;
  fuel: string;
  km: string;
  owners: string;
  city: string;
  phone: string;
  name: string;
}

const TOTAL_STEPS = 3;

export default function EvaluatePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({
    brand: "",
    year: "",
    variant: "",
    fuel: "",
    km: "",
    owners: "",
    city: "",
    phone: "",
    name: "",
  });

  const set = (key: keyof FormData, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const canProceed = () => {
    if (step === 1) return form.brand && form.year && form.fuel;
    if (step === 2) return form.km && form.owners && form.city;
    if (step === 3) return form.phone.length === 10 && form.name.trim().length > 1;
    return false;
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    } else {
      const params = new URLSearchParams({
        brand: form.brand,
        year: form.year,
        variant: form.variant,
        fuel: form.fuel,
        km: form.km,
        owners: form.owners,
        city: form.city,
        name: form.name,
        phone: form.phone,
      });
      router.push(`/used-cars/sell/list?${params.toString()}`);
    }
  };

  const stepLabels = ["Car Details", "Usage History", "Contact Info"];

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
        <div className="max-w-lg mx-auto px-4 pt-3 pb-4">
          <div className="flex items-center gap-3 mb-4">
            {step === 1 ? (
              <Link
                href="/used-cars/sell"
                className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
              </Link>
            ) : (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
              </button>
            )}
            <div className="flex-1">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                Step {step} of {TOTAL_STEPS}
              </p>
              <h1 className="text-[16px] font-bold text-white leading-tight">
                {stepLabels[step - 1]}
              </h1>
            </div>
          </div>

          {/* Progress bar */}
          <div
            className="h-1 w-full rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(step / TOTAL_STEPS) * 100}%`,
                background: "linear-gradient(90deg, #1152d4, #3b82f6)",
              }}
            />
          </div>

          {/* Step labels */}
          <div className="flex justify-between mt-2">
            {stepLabels.map((label, idx) => (
              <span
                key={label}
                className="text-[9px] font-semibold uppercase tracking-wide"
                style={{ color: idx + 1 <= step ? "#1152d4" : "#334155" }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-6">
        {/* ─── STEP 1: Car Details ─── */}
        {step === 1 && (
          <div className="space-y-5">
            <SectionTitle icon="directions_car" label="Tell us about your car" />

            {/* Brand */}
            <div>
              <Label>Car Brand</Label>
              <div className="relative">
                <select
                  value={form.brand}
                  onChange={(e) => set("brand", e.target.value)}
                  className="w-full appearance-none rounded-xl px-4 py-3.5 pr-10 text-sm font-semibold outline-none border transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: form.brand ? "#fff" : "#475569",
                    borderColor: form.brand
                      ? "rgba(17,82,212,0.5)"
                      : "rgba(255,255,255,0.1)",
                  }}
                >
                  <option value="" disabled style={{ background: "#0f172a" }}>
                    Select brand
                  </option>
                  {BRANDS.map((b) => (
                    <option key={b} value={b} style={{ background: "#0f172a" }}>
                      {b}
                    </option>
                  ))}
                </select>
                <MaterialIcon
                  name="expand_more"
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-500"
                />
              </div>
            </div>

            {/* Year */}
            <div>
              <Label>Manufacturing Year</Label>
              <div className="relative">
                <select
                  value={form.year}
                  onChange={(e) => set("year", e.target.value)}
                  className="w-full appearance-none rounded-xl px-4 py-3.5 pr-10 text-sm font-semibold outline-none border transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: form.year ? "#fff" : "#475569",
                    borderColor: form.year
                      ? "rgba(17,82,212,0.5)"
                      : "rgba(255,255,255,0.1)",
                  }}
                >
                  <option value="" disabled style={{ background: "#0f172a" }}>
                    Select year
                  </option>
                  {YEARS.map((y) => (
                    <option key={y} value={y} style={{ background: "#0f172a" }}>
                      {y}
                    </option>
                  ))}
                </select>
                <MaterialIcon
                  name="expand_more"
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-500"
                />
              </div>
            </div>

            {/* Variant */}
            <div>
              <Label>
                Variant{" "}
                <span className="text-slate-600 font-normal normal-case text-[11px]">
                  (optional)
                </span>
              </Label>
              <TextInput
                placeholder="e.g. VXi, ZXi+, SX(O)"
                value={form.variant}
                onChange={(v) => set("variant", v)}
              />
            </div>

            {/* Fuel */}
            <div>
              <Label>Fuel Type</Label>
              <PillGroup
                options={FUEL_OPTIONS}
                value={form.fuel}
                onChange={(v) => set("fuel", v)}
              />
            </div>
          </div>
        )}

        {/* ─── STEP 2: Usage History ─── */}
        {step === 2 && (
          <div className="space-y-5">
            <SectionTitle icon="history" label="Usage & condition details" />

            {/* KM */}
            <div>
              <Label>Kilometres Driven</Label>
              <div className="relative">
                <TextInput
                  placeholder="e.g. 45000"
                  value={form.km}
                  onChange={(v) => set("km", v.replace(/\D/g, ""))}
                  type="number"
                />
                <span
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-semibold"
                  style={{ color: "#475569" }}
                >
                  km
                </span>
              </div>
              {form.km && (
                <p className="text-[11px] text-slate-500 mt-1.5 pl-1">
                  That&apos;s{" "}
                  <span className="text-slate-300 font-semibold">
                    {Number(form.km).toLocaleString("en-IN")} km
                  </span>
                </p>
              )}
            </div>

            {/* Owners */}
            <div>
              <Label>Number of Previous Owners</Label>
              <PillGroup
                options={OWNER_OPTIONS.map((o) => o.label)}
                value={
                  OWNER_OPTIONS.find((o) => o.value === form.owners)?.label ?? ""
                }
                onChange={(v) => {
                  const found = OWNER_OPTIONS.find((o) => o.label === v);
                  if (found) set("owners", found.value);
                }}
              />
            </div>

            {/* City */}
            <div>
              <Label>City</Label>
              <TextInput
                placeholder="e.g. Mumbai, Delhi, Bangalore"
                value={form.city}
                onChange={(v) => set("city", v)}
              />
            </div>

            {/* Tip card */}
            <div
              className="flex gap-3 rounded-xl p-3.5 border"
              style={{
                background: "rgba(17,82,212,0.06)",
                borderColor: "rgba(17,82,212,0.15)",
              }}
            >
              <MaterialIcon
                name="info"
                className="text-[18px] shrink-0 mt-0.5"
                style={{ color: "#1152d4" }}
              />
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Accurate mileage helps us give you the most precise valuation. Inflating or under-reporting km can affect your final offer.
              </p>
            </div>
          </div>
        )}

        {/* ─── STEP 3: Contact Info ─── */}
        {step === 3 && (
          <div className="space-y-5">
            <SectionTitle icon="person" label="Where to send your valuation?" />

            {/* Phone */}
            <div>
              <Label>Mobile Number</Label>
              <div
                className="flex items-center rounded-xl overflow-hidden border"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderColor: form.phone
                    ? "rgba(17,82,212,0.5)"
                    : "rgba(255,255,255,0.1)",
                }}
              >
                <div
                  className="flex items-center gap-1.5 px-3 py-3.5 shrink-0 border-r"
                  style={{ borderColor: "rgba(255,255,255,0.08)" }}
                >
                  <span className="text-[13px]">🇮🇳</span>
                  <span className="text-[13px] font-semibold text-slate-400">+91</span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))}
                  className="flex-1 bg-transparent px-3 py-3.5 text-sm font-semibold text-white outline-none placeholder:text-slate-600"
                />
                {form.phone.length === 10 && (
                  <MaterialIcon
                    name="check_circle"
                    className="text-[18px] mr-3 shrink-0"
                    fill
                    style={{ color: "#10b981" }}
                  />
                )}
              </div>
            </div>

            {/* Name */}
            <div>
              <Label>Full Name</Label>
              <TextInput
                placeholder="Your name"
                value={form.name}
                onChange={(v) => set("name", v)}
              />
            </div>

            {/* Privacy note */}
            <div
              className="flex gap-3 rounded-xl p-3.5 border"
              style={{
                background: "rgba(16,185,129,0.05)",
                borderColor: "rgba(16,185,129,0.12)",
              }}
            >
              <MaterialIcon
                name="lock"
                className="text-[16px] shrink-0 mt-0.5"
                style={{ color: "#10b981" }}
              />
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Your information is 100% secure. We never share your details with third parties without consent.
              </p>
            </div>

            {/* Summary card */}
            <div
              className="rounded-2xl p-4 border space-y-2"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.07)",
              }}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                Your car summary
              </p>
              {[
                { label: "Brand", value: form.brand || "—" },
                { label: "Year", value: form.year || "—" },
                { label: "Variant", value: form.variant || "Not specified" },
                { label: "Fuel", value: form.fuel || "—" },
                {
                  label: "KM Driven",
                  value: form.km
                    ? `${Number(form.km).toLocaleString("en-IN")} km`
                    : "—",
                },
                {
                  label: "Ownership",
                  value: form.owners
                    ? OWNER_OPTIONS.find((o) => o.value === form.owners)?.label ?? "—"
                    : "—",
                },
                { label: "City", value: form.city || "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-[11px] text-slate-500">{label}</span>
                  <span className="text-[12px] font-semibold text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── NAVIGATION BUTTONS ─── */}
        <div className="mt-8 flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl font-semibold text-[14px] border"
              style={{
                background: "rgba(255,255,255,0.04)",
                color: "#94a3b8",
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <MaterialIcon name="arrow_back" className="text-[18px]" />
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl font-bold text-[15px] text-white transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: canProceed()
                ? "linear-gradient(135deg, #1152d4 0%, #1d4ed8 100%)"
                : "rgba(255,255,255,0.06)",
              boxShadow: canProceed() ? "0 8px 24px rgba(17,82,212,0.35)" : "none",
            }}
          >
            {step === TOTAL_STEPS ? (
              <>
                <MaterialIcon name="auto_awesome" className="text-[18px]" />
                Get My Valuation
              </>
            ) : (
              <>
                Continue
                <MaterialIcon name="arrow_forward" className="text-[18px]" />
              </>
            )}
          </button>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}

/* ─── Shared sub-components ─── */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
      {children}
    </p>
  );
}

function SectionTitle({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-1">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
        style={{ background: "rgba(17,82,212,0.12)" }}
      >
        <MaterialIcon name={icon} className="text-[18px]" style={{ color: "#1152d4" }} />
      </div>
      <p className="text-[15px] font-bold text-white">{label}</p>
    </div>
  );
}

function TextInput({
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl px-4 py-3.5 text-sm font-semibold text-white outline-none border transition-colors placeholder:text-slate-600"
      style={{
        background: "rgba(255,255,255,0.05)",
        borderColor: value ? "rgba(17,82,212,0.5)" : "rgba(255,255,255,0.1)",
      }}
    />
  );
}

function PillGroup({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className="h-10 px-4 rounded-xl text-[13px] font-semibold border transition-all"
            style={{
              background: active ? "rgba(17,82,212,0.18)" : "rgba(255,255,255,0.04)",
              color: active ? "#fff" : "#64748b",
              borderColor: active ? "#1152d4" : "rgba(255,255,255,0.1)",
              boxShadow: active ? "0 0 0 1px #1152d4" : "none",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
