"use client";

import { Suspense, useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

/* ─── Brand → base price lookup (lakhs, for a 2020 model, 30k km) ─── */
const BASE_PRICES: Record<string, number> = {
  "Maruti Suzuki": 4.8,
  "Hyundai": 5.5,
  "Tata": 5.2,
  "Mahindra": 6.0,
  "Honda": 5.8,
  "Toyota": 7.2,
  "Kia": 6.5,
  "Ford": 4.5,
  "Volkswagen": 5.0,
  "MG": 7.0,
  "Renault": 3.8,
  "Nissan": 3.5,
};

/* ─── Brand → popular models ─── */
const BRAND_MODELS: Record<string, string[]> = {
  "Maruti Suzuki": ["Swift", "Baleno", "WagonR", "Dzire", "Vitara Brezza", "Alto", "Ertiga", "Ciaz", "S-Presso", "XL6"],
  "Hyundai": ["Creta", "Venue", "i20", "Verna", "Tucson", "Aura", "Grand i10", "Alcazar", "Exter", "Kona"],
  "Tata": ["Nexon", "Punch", "Harrier", "Safari", "Altroz", "Tiago", "Tigor", "Nano", "Hexa", "Bolt"],
  "Mahindra": ["XUV700", "Thar", "Scorpio", "XUV300", "Bolero", "Marazzo", "KUV100", "Alturas", "XUV400", "Scorpio N"],
  "Honda": ["City", "Amaze", "WR-V", "Jazz", "Elevate", "Civic", "CR-V", "BR-V", "Brio", "Accord"],
  "Toyota": ["Fortuner", "Innova Crysta", "Glanza", "Urban Cruiser", "Camry", "Hilux", "Vellfire", "Yaris", "Etios", "Land Cruiser"],
  "Kia": ["Seltos", "Sonet", "Carens", "Carnival", "EV6", "Sportage"],
  "Ford": ["EcoSport", "Endeavour", "Figo", "Aspire", "Freestyle", "Mustang"],
  "Volkswagen": ["Polo", "Vento", "Taigun", "Tiguan", "T-Roc", "Virtus"],
  "MG": ["Hector", "Astor", "ZS EV", "Gloster", "Comet", "Hector Plus"],
  "Renault": ["Kwid", "Triber", "Kiger", "Duster", "Captur"],
  "Nissan": ["Magnite", "Kicks", "Sunny", "Terrano", "GT-R"],
};

/* ─── Model → variants ─── */
const DEFAULT_VARIANTS = ["Base", "LXi", "VXi", "ZXi", "ZXi+"];
const SUV_VARIANTS = ["Base", "EX", "MX", "GX", "ZX", "ZX+"];

/* ─── Top demand cities ─── */
const TOP_CITIES = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow"];

/* ─── Year depreciation factor ─── */
function yearFactor(year: number): number {
  const age = 2026 - year;
  if (age <= 1) return 1.1;
  if (age <= 2) return 1.0;
  if (age <= 3) return 0.92;
  if (age <= 5) return 0.82;
  if (age <= 7) return 0.68;
  if (age <= 10) return 0.52;
  return 0.38;
}

/* ─── Format lakhs ─── */
function formatLakhs(value: number): string {
  if (value >= 100) return `${(value / 100).toFixed(1)}Cr`;
  return `${value.toFixed(1)}L`;
}

/* ─── Generate next 7 dates ─── */
function getNext7Days(): { label: string; date: string; value: string; isToday: boolean }[] {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const result: { label: string; date: string; value: string; isToday: boolean }[] = [];

  for (let i = 1; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    result.push({
      label: days[d.getDay()],
      date: `${months[d.getMonth()]} ${d.getDate()}`,
      value: d.toISOString().split("T")[0],
      isToday: false,
    });
  }
  return result;
}

const TIME_SLOTS = [
  { label: "9 AM - 12 PM", value: "09:00-12:00", icon: "wb_sunny" },
  { label: "12 PM - 3 PM", value: "12:00-15:00", icon: "wb_cloudy" },
  { label: "3 PM - 6 PM", value: "15:00-18:00", icon: "wb_twilight" },
];

/* ─── Animated counter hook ─── */
function useCountUp(target: number, duration: number, active: boolean): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) { setValue(0); return; }
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, active]);
  return value;
}

/* ─── Step progress indicator ─── */
function StepIndicator({ current, total }: { current: number; total: number }) {
  const steps = [
    { label: "Details", icon: "edit_note" },
    { label: "Valuation", icon: "auto_awesome" },
    { label: "Inspection", icon: "event_available" },
  ];

  return (
    <div className="flex items-center justify-center gap-0 py-4 px-2">
      {steps.slice(0, total).map((step, i) => (
        <div key={step.label} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center transition-all duration-500"
              style={{
                background: i < current ? "#1152d4" : i === current ? "rgba(17,82,212,0.25)" : "rgba(255,255,255,0.05)",
                border: i === current ? "2px solid #1152d4" : "2px solid transparent",
              }}
            >
              {i < current ? (
                <MaterialIcon name="check" className="text-[16px] text-white" />
              ) : (
                <MaterialIcon
                  name={step.icon}
                  className="text-[16px]"
                  style={{ color: i === current ? "#1152d4" : "#475569" }}
                />
              )}
            </div>
            <span
              className="text-[9px] font-bold uppercase tracking-wider transition-colors duration-300"
              style={{ color: i <= current ? "#94a3b8" : "#334155" }}
            >
              {step.label}
            </span>
          </div>
          {i < total - 1 && (
            <div
              className="h-[2px] w-8 mx-1 -mt-4 rounded-full transition-all duration-500"
              style={{ background: i < current ? "#1152d4" : "rgba(255,255,255,0.08)" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Pill selector component ─── */
function PillGroup({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className="h-9 px-4 rounded-xl text-xs font-semibold transition-all duration-200"
          style={{
            background: value === opt ? "#1152d4" : "rgba(255,255,255,0.05)",
            color: value === opt ? "#fff" : "#94a3b8",
            border: value === opt ? "1px solid #1152d4" : "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

/* ─── Main inner component (needs Suspense for useSearchParams) ─── */
function ValuationPageInner() {
  const params = useSearchParams();
  const router = useRouter();

  /* Query params */
  const qBrand = params.get("brand") ?? "";
  const qYear = params.get("year") ?? "";
  const qKm = params.get("km") ?? "";

  /* Step state */
  const [step, setStep] = useState(0);
  const [animDir, setAnimDir] = useState<"forward" | "back">("forward");

  /* Step 1 form */
  const [brand] = useState(qBrand);
  const [year] = useState(qYear);
  const [km, setKm] = useState(qKm);
  const [model, setModel] = useState("");
  const [variant, setVariant] = useState("");
  const [fuel, setFuel] = useState("Petrol");
  const [transmission, setTransmission] = useState("Manual");
  const [condition, setCondition] = useState("Good");
  const [city, setCity] = useState("");

  /* Step 3 form */
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  /* Derived */
  const models = BRAND_MODELS[brand] ?? ["Other"];
  const isSuv = ["XUV700", "Thar", "Scorpio", "Fortuner", "Hector", "Safari", "Harrier", "Creta", "Seltos", "Carnival", "Endeavour", "Tucson", "Gloster", "Scorpio N", "Alcazar", "XUV300", "XUV400"].includes(model);
  const variants = isSuv ? SUV_VARIANTS : DEFAULT_VARIANTS;
  const dates = useMemo(() => getNext7Days(), []);

  /* AI Valuation state */
  const [aiValuation, setAiValuation] = useState<{
    estimatedPrice: number; low: number; high: number;
    marketLow: number; marketHigh: number; offer: number;
    depreciationRate?: number; marketDemand?: string;
    factors?: { name: string; impact: string; positive: boolean }[];
    generated?: boolean;
  } | null>(null);
  const [valLoading, setValLoading] = useState(false);

  /* Client-side fallback valuation */
  const clientValuation = useMemo(() => {
    const base = BASE_PRICES[brand] ?? 5.0;
    const yf = yearFactor(parseInt(year) || 2020);
    const basePrice = +(base * yf).toFixed(1);
    const kmNum = parseInt(km) || 30000;
    const kmOver = Math.max(0, kmNum - 30000);
    const kmDeduction = +((kmOver * 0.5) / 100000).toFixed(2);
    const condMultiplier = condition === "Excellent" ? 1.05 : condition === "Good" ? 1.0 : 0.9;
    const cityDemand = TOP_CITIES.some((c) => city.toLowerCase().includes(c.toLowerCase())) ? 1.03 : 1.0;
    const computed = (basePrice - kmDeduction) * condMultiplier * cityDemand;
    const recommended = Math.max(computed, 0.5);
    return {
      estimatedPrice: +recommended.toFixed(1),
      low: +(recommended * 0.93).toFixed(1),
      high: +(recommended * 1.07).toFixed(1),
      marketLow: +(recommended * 0.95).toFixed(1),
      marketHigh: +(recommended * 1.08).toFixed(1),
      offer: +(recommended * 1.02).toFixed(1),
      basePrice,
      kmDeduction,
      condMultiplier,
      cityDemand,
    };
  }, [brand, year, km, condition, city]);

  /* Use AI valuation if available, else client fallback */
  const valuation = useMemo(() => {
    const v = aiValuation ?? clientValuation;
    return {
      recommended: v.estimatedPrice ?? (v as typeof clientValuation).estimatedPrice,
      low: v.low,
      high: v.high,
      marketLow: v.marketLow,
      marketHigh: v.marketHigh,
      offer: v.offer,
      factors: (v as typeof aiValuation)?.factors,
      marketDemand: (v as typeof aiValuation)?.marketDemand,
      generated: (v as typeof aiValuation)?.generated,
      /* Client-side breakdown values (used when AI factors unavailable) */
      basePrice: clientValuation.basePrice,
      kmDeduction: clientValuation.kmDeduction,
      condMultiplier: clientValuation.condMultiplier,
      cityDemand: clientValuation.cityDemand,
    };
  }, [aiValuation, clientValuation]);

  const animatedValue = useCountUp(valuation.recommended, 1800, step === 1);

  /* Step navigation */
  const goForward = useCallback(async () => {
    // Trigger AI valuation when moving to step 1
    if (step === 0) {
      setValLoading(true);
      setAnimDir("forward");
      setStep(1);
      try {
        const res = await fetch("/api/ai/valuation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brand, model, year, km, fuel, transmission, owner: "1st Owner", city, condition }),
        });
        if (res.ok) {
          const data = await res.json();
          setAiValuation(data);
        }
      } catch { /* fall back to client computation */ }
      setValLoading(false);
      return;
    }
    setAnimDir("forward");
    setStep((s) => Math.min(s + 1, 2));
  }, [step, brand, model, year, km, fuel, transmission, city, condition]);

  const goBack = useCallback(() => {
    if (step === 0) {
      router.push("/sell-car");
      return;
    }
    setAnimDir("back");
    setStep((s) => s - 1);
  }, [step, router]);

  const step1Valid = brand && year && model && variant && fuel && transmission && condition && city.trim().length > 1;
  const step3Valid = selectedDate && selectedTime && address.trim().length > 5 && phone.trim().length >= 10;

  return (
    <div className="min-h-dvh w-full pb-28" style={{ background: "#080a0f", color: "#e2e8f0" }}>

      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-white/5"
        style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={goBack}
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
          </button>
          <h1 className="text-base font-bold text-white">
            {step === 0 ? "Vehicle Details" : step === 1 ? "AI Valuation" : "Schedule Inspection"}
          </h1>
          <span className="ml-auto text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Step {step + 1}/3
          </span>
        </div>
      </header>

      {/* Progress */}
      <div className="max-w-lg mx-auto px-4">
        <StepIndicator current={step} total={3} />
      </div>

      {/* Step content */}
      <main className="max-w-lg mx-auto px-4">
        <div
          className="transition-all duration-400 ease-out"
          style={{
            opacity: 1,
            transform: "translateX(0)",
          }}
        >

          {/* ═══ STEP 1: Vehicle Details ═══ */}
          {step === 0 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">

              {/* Pre-filled fields */}
              <div className="rounded-2xl p-4 border border-white/5 space-y-4" style={{ background: "rgba(255,255,255,0.03)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">From Previous Step</p>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 mb-1 block">Brand</label>
                    <div
                      className="h-10 rounded-xl px-3 flex items-center text-xs font-semibold text-slate-300 border border-white/5"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    >
                      {brand || "N/A"}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 mb-1 block">Year</label>
                    <div
                      className="h-10 rounded-xl px-3 flex items-center text-xs font-semibold text-slate-300 border border-white/5"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    >
                      {year || "N/A"}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 mb-1 block">KM</label>
                    <input
                      type="number"
                      value={km}
                      onChange={(e) => setKm(e.target.value)}
                      placeholder="30000"
                      className="w-full h-10 rounded-xl px-3 text-xs font-semibold text-white border border-white/8 outline-none placeholder:text-slate-600"
                      style={{ background: "rgba(255,255,255,0.05)" }}
                    />
                  </div>
                </div>
              </div>

              {/* Additional details */}
              <div className="rounded-2xl p-4 border border-white/5 space-y-4" style={{ background: "rgba(255,255,255,0.03)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Additional Details</p>

                {/* Model */}
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">Model</label>
                  <select
                    value={model}
                    onChange={(e) => { setModel(e.target.value); setVariant(""); }}
                    className="w-full h-11 rounded-xl px-3 text-sm font-semibold text-white border border-white/8 outline-none appearance-none"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    <option value="" style={{ background: "#111" }}>Select model</option>
                    {models.map((m) => (
                      <option key={m} value={m} style={{ background: "#111" }}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* Variant */}
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">Variant</label>
                  <select
                    value={variant}
                    onChange={(e) => setVariant(e.target.value)}
                    className="w-full h-11 rounded-xl px-3 text-sm font-semibold text-white border border-white/8 outline-none appearance-none"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    <option value="" style={{ background: "#111" }}>Select variant</option>
                    {variants.map((v) => (
                      <option key={v} value={v} style={{ background: "#111" }}>{v}</option>
                    ))}
                  </select>
                </div>

                {/* Fuel Type */}
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">Fuel Type</label>
                  <PillGroup options={["Petrol", "Diesel", "CNG"]} value={fuel} onChange={setFuel} />
                </div>

                {/* Transmission */}
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">Transmission</label>
                  <PillGroup options={["Manual", "Automatic"]} value={transmission} onChange={setTransmission} />
                </div>

                {/* Condition */}
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">Condition</label>
                  <PillGroup options={["Excellent", "Good", "Fair"]} value={condition} onChange={setCondition} />
                </div>

                {/* City */}
                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Mumbai, Delhi"
                    className="w-full h-11 rounded-xl px-3 text-sm font-semibold text-white border border-white/8 outline-none placeholder:text-slate-600"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  />
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={goForward}
                disabled={!step1Valid}
                className="flex items-center justify-center gap-2 h-12 rounded-2xl text-sm font-bold text-white w-full transition-all disabled:opacity-30 disabled:pointer-events-none"
                style={{ background: "#1152d4" }}
              >
                <MaterialIcon name="auto_awesome" className="text-[18px]" />
                Get AI Valuation
              </button>
            </div>
          )}

          {/* ═══ STEP 2: AI Valuation ═══ */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">

              {/* Car summary */}
              <div className="flex items-center gap-3 rounded-xl p-3 border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(17,82,212,0.15)" }}>
                  <MaterialIcon name="directions_car" className="text-[20px]" style={{ color: "#1152d4" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{year} {brand} {model}</p>
                  <p className="text-[10px] text-slate-500">{variant} &middot; {fuel} &middot; {transmission} &middot; {parseInt(km || "0").toLocaleString("en-IN")} km</p>
                </div>
              </div>

              {/* Big valuation card */}
              <div className="rounded-2xl p-5 border border-blue-500/20 relative overflow-hidden" style={{ background: "rgba(17,82,212,0.07)" }}>
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full" style={{ background: "rgba(17,82,212,0.15)", filter: "blur(40px)" }} />
                <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full" style={{ background: "rgba(16,185,129,0.1)", filter: "blur(32px)" }} />

                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1 relative z-10">Your Car&apos;s Market Value</p>

                <div className="relative z-10 my-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white tabular-nums">
                      {formatLakhs(animatedValue)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs text-slate-400">Range:</span>
                    <span className="text-xs font-bold text-emerald-400">
                      {formatLakhs(valuation.low)} - {formatLakhs(valuation.high)}
                    </span>
                  </div>
                </div>

                <div className="relative z-10 flex items-center gap-2 text-[10px] text-slate-500">
                  <MaterialIcon name="info" className="text-[12px]" />
                  Based on {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })} market data
                </div>
              </div>

              {/* Breakdown */}
              <div className="rounded-2xl p-4 border border-white/5 space-y-3" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Valuation Breakdown</p>
                  {valuation.generated && (
                    <span className="text-[9px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1">
                      <MaterialIcon name="auto_awesome" className="text-[10px]" /> AI Powered
                    </span>
                  )}
                </div>

                <div className="space-y-2.5">
                  {valuation.factors && valuation.factors.length > 0 ? (
                    /* AI-generated factors */
                    valuation.factors.map((f, i) => {
                      const icons = ["directions_car", "speed", "star", "location_city", "trending_up", "local_gas_station"];
                      const colors = [
                        { bg: "rgba(17,82,212,0.15)", fg: "#1152d4" },
                        { bg: "rgba(239,68,68,0.15)", fg: "#ef4444" },
                        { bg: "rgba(245,158,11,0.15)", fg: "#f59e0b" },
                        { bg: "rgba(139,92,246,0.15)", fg: "#8b5cf6" },
                        { bg: "rgba(16,185,129,0.15)", fg: "#10b981" },
                        { bg: "rgba(59,130,246,0.15)", fg: "#3b82f6" },
                      ];
                      const c = colors[i % colors.length];
                      return (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: c.bg }}>
                              <MaterialIcon name={icons[i % icons.length]} className="text-[14px]" style={{ color: c.fg }} />
                            </div>
                            <span className="text-xs text-slate-400">{f.name}</span>
                          </div>
                          <span className="text-xs font-bold" style={{ color: f.positive ? "#10b981" : "#ef4444" }}>
                            {f.impact}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    /* Client-side fallback breakdown */
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(17,82,212,0.15)" }}>
                            <MaterialIcon name="directions_car" className="text-[14px]" style={{ color: "#1152d4" }} />
                          </div>
                          <span className="text-xs text-slate-400">Base value ({brand} {year})</span>
                        </div>
                        <span className="text-xs font-bold text-white">{formatLakhs(valuation.basePrice)}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(239,68,68,0.15)" }}>
                            <MaterialIcon name="speed" className="text-[14px]" style={{ color: "#ef4444" }} />
                          </div>
                          <span className="text-xs text-slate-400">KM adjustment</span>
                        </div>
                        <span className="text-xs font-bold" style={{ color: valuation.kmDeduction > 0 ? "#ef4444" : "#10b981" }}>
                          {valuation.kmDeduction > 0 ? `-${formatLakhs(valuation.kmDeduction)}` : "No deduction"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(245,158,11,0.15)" }}>
                            <MaterialIcon name="star" className="text-[14px]" style={{ color: "#f59e0b" }} />
                          </div>
                          <span className="text-xs text-slate-400">Condition ({condition})</span>
                        </div>
                        <span className="text-xs font-bold" style={{ color: valuation.condMultiplier >= 1.0 ? "#10b981" : "#ef4444" }}>
                          {valuation.condMultiplier > 1.0 ? `+${((valuation.condMultiplier - 1) * 100).toFixed(0)}%` : valuation.condMultiplier < 1.0 ? `-${((1 - valuation.condMultiplier) * 100).toFixed(0)}%` : "Baseline"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(139,92,246,0.15)" }}>
                            <MaterialIcon name="location_city" className="text-[14px]" style={{ color: "#8b5cf6" }} />
                          </div>
                          <span className="text-xs text-slate-400">City demand ({city})</span>
                        </div>
                        <span className="text-xs font-bold" style={{ color: valuation.cityDemand > 1.0 ? "#10b981" : "#94a3b8" }}>
                          {valuation.cityDemand > 1.0 ? "+3% high demand" : "Standard"}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Market comparison */}
              <div className="rounded-2xl p-4 border border-white/5 space-y-3" style={{ background: "rgba(255,255,255,0.03)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Market Comparison</p>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)" }}>
                    <MaterialIcon name="trending_up" className="text-[18px]" style={{ color: "#10b981" }} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Similar cars selling at</p>
                    <p className="text-sm font-bold text-white">
                      {formatLakhs(valuation.marketLow)} - {formatLakhs(valuation.marketHigh)}
                    </p>
                  </div>
                </div>

                {/* Market bar visualization */}
                <div className="relative h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="absolute inset-y-0 rounded-full"
                    style={{
                      left: "15%",
                      right: "15%",
                      background: "linear-gradient(90deg, #10b981, #1152d4)",
                      opacity: 0.6,
                    }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full border-2 border-white shadow-lg"
                    style={{
                      left: "48%",
                      background: "#1152d4",
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Below Market</span>
                  <span>Above Market</span>
                </div>
              </div>

              {/* Autovinci offer */}
              <div className="rounded-2xl p-4 border border-emerald-500/20 relative overflow-hidden" style={{ background: "rgba(16,185,129,0.06)" }}>
                <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full" style={{ background: "rgba(16,185,129,0.15)", filter: "blur(24px)" }} />
                <div className="flex items-start gap-3 relative z-10">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(16,185,129,0.2)" }}>
                    <MaterialIcon name="verified" className="text-[20px]" style={{ color: "#10b981" }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#10b981" }}>Autovinci Offer</p>
                      <span className="h-4 px-1.5 rounded text-[8px] font-bold uppercase flex items-center" style={{ background: "rgba(16,185,129,0.2)", color: "#10b981" }}>Best Price</span>
                    </div>
                    <p className="text-2xl font-black text-white mb-0.5">{formatLakhs(valuation.offer)}</p>
                    <p className="text-[10px] text-slate-500">
                      We&apos;ll buy your car at this guaranteed price. Valid for 7 days.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={goForward}
                className="flex items-center justify-center gap-2 h-12 rounded-2xl text-sm font-bold text-white w-full transition-all"
                style={{ background: "#10b981" }}
              >
                <MaterialIcon name="event_available" className="text-[18px]" />
                Schedule Free Inspection
              </button>

              <button
                onClick={goBack}
                className="flex items-center justify-center gap-2 h-10 rounded-xl text-xs font-semibold w-full transition-all"
                style={{ color: "#94a3b8", background: "rgba(255,255,255,0.03)" }}
              >
                <MaterialIcon name="edit" className="text-[14px]" />
                Edit Vehicle Details
              </button>
            </div>
          )}

          {/* ═══ STEP 3: Schedule Inspection ═══ */}
          {step === 2 && !confirmed && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">

              {/* Car + price summary */}
              <div className="flex items-center gap-3 rounded-xl p-3 border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)" }}>
                  <MaterialIcon name="verified" className="text-[20px]" style={{ color: "#10b981" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{year} {brand} {model}</p>
                  <p className="text-[10px] text-slate-500">Offer: <span className="font-bold text-emerald-400">{formatLakhs(valuation.offer)}</span></p>
                </div>
              </div>

              {/* Date picker */}
              <div className="rounded-2xl p-4 border border-white/5 space-y-3" style={{ background: "rgba(255,255,255,0.03)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Pick a Date</p>
                <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
                  {dates.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setSelectedDate(d.value)}
                      className="flex flex-col items-center gap-0.5 min-w-[60px] py-2.5 px-2 rounded-xl transition-all duration-200 shrink-0"
                      style={{
                        background: selectedDate === d.value ? "#1152d4" : "rgba(255,255,255,0.04)",
                        border: selectedDate === d.value ? "1px solid #1152d4" : "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <span className="text-[10px] font-bold uppercase" style={{ color: selectedDate === d.value ? "rgba(255,255,255,0.7)" : "#64748b" }}>{d.label}</span>
                      <span className="text-sm font-bold" style={{ color: selectedDate === d.value ? "#fff" : "#e2e8f0" }}>{d.date.split(" ")[1]}</span>
                      <span className="text-[9px]" style={{ color: selectedDate === d.value ? "rgba(255,255,255,0.6)" : "#475569" }}>{d.date.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time slots */}
              <div className="rounded-2xl p-4 border border-white/5 space-y-3" style={{ background: "rgba(255,255,255,0.03)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Pick a Time Slot</p>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setSelectedTime(t.value)}
                      className="flex flex-col items-center gap-1 py-3 rounded-xl transition-all duration-200"
                      style={{
                        background: selectedTime === t.value ? "#1152d4" : "rgba(255,255,255,0.04)",
                        border: selectedTime === t.value ? "1px solid #1152d4" : "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <MaterialIcon
                        name={t.icon}
                        className="text-[18px]"
                        style={{ color: selectedTime === t.value ? "#fff" : "#64748b" }}
                      />
                      <span className="text-[10px] font-semibold" style={{ color: selectedTime === t.value ? "#fff" : "#94a3b8" }}>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Address + phone */}
              <div className="rounded-2xl p-4 border border-white/5 space-y-4" style={{ background: "rgba(255,255,255,0.03)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Inspection Location</p>

                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">Full Address</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House/flat no., street, area, landmark"
                    rows={2}
                    className="w-full rounded-xl px-3 py-2.5 text-sm font-semibold text-white border border-white/8 outline-none placeholder:text-slate-600 resize-none"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 mb-1.5 block">Phone Number</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-500">+91</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="9876543210"
                      maxLength={10}
                      className="flex-1 h-11 rounded-xl px-3 text-sm font-semibold text-white border border-white/8 outline-none placeholder:text-slate-600"
                      style={{ background: "rgba(255,255,255,0.05)" }}
                    />
                  </div>
                </div>
              </div>

              {/* Info note */}
              <div className="flex items-start gap-2.5 rounded-xl p-3 border border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
                <MaterialIcon name="info" className="text-[16px] text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    A certified inspector will visit your location for a free 250-point inspection. The process takes about 45 minutes. You can cancel up to 2 hours before the scheduled time.
                  </p>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => setConfirmed(true)}
                disabled={!step3Valid}
                className="flex items-center justify-center gap-2 h-12 rounded-2xl text-sm font-bold text-white w-full transition-all disabled:opacity-30 disabled:pointer-events-none"
                style={{ background: "#10b981" }}
              >
                <MaterialIcon name="check_circle" className="text-[18px]" />
                Confirm Inspection
              </button>
            </div>
          )}

          {/* ═══ STEP 3: Confirmation success ═══ */}
          {step === 2 && confirmed && (
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-500 pt-4">

              {/* Success card */}
              <div className="rounded-2xl p-6 border border-emerald-500/20 text-center relative overflow-hidden" style={{ background: "rgba(16,185,129,0.06)" }}>
                <div className="absolute inset-0" style={{ background: "radial-gradient(circle at center, rgba(16,185,129,0.12) 0%, transparent 70%)" }} />

                <div className="relative z-10">
                  <div className="h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(16,185,129,0.2)" }}>
                    <MaterialIcon name="check_circle" className="text-[36px]" style={{ color: "#10b981" }} />
                  </div>
                  <h2 className="text-xl font-black text-white mb-1">Inspection Scheduled</h2>
                  <p className="text-xs text-slate-400">You&apos;ll receive a confirmation SMS and WhatsApp message shortly.</p>
                </div>
              </div>

              {/* Details summary */}
              <div className="rounded-2xl p-4 border border-white/5 space-y-3" style={{ background: "rgba(255,255,255,0.03)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Booking Details</p>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(17,82,212,0.15)" }}>
                      <MaterialIcon name="directions_car" className="text-[16px]" style={{ color: "#1152d4" }} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500">Vehicle</p>
                      <p className="text-xs font-bold text-white">{year} {brand} {model} {variant}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(16,185,129,0.15)" }}>
                      <MaterialIcon name="payments" className="text-[16px]" style={{ color: "#10b981" }} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500">Guaranteed Offer</p>
                      <p className="text-xs font-bold text-emerald-400">{formatLakhs(valuation.offer)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(245,158,11,0.15)" }}>
                      <MaterialIcon name="calendar_month" className="text-[16px]" style={{ color: "#f59e0b" }} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500">Date & Time</p>
                      <p className="text-xs font-bold text-white">
                        {dates.find((d) => d.value === selectedDate)?.date ?? selectedDate}
                        {" "}
                        &middot;
                        {" "}
                        {TIME_SLOTS.find((t) => t.value === selectedTime)?.label ?? selectedTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(139,92,246,0.15)" }}>
                      <MaterialIcon name="location_on" className="text-[16px]" style={{ color: "#8b5cf6" }} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500">Location</p>
                      <p className="text-xs font-bold text-white">{address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(59,130,246,0.15)" }}>
                      <MaterialIcon name="phone" className="text-[16px]" style={{ color: "#3b82f6" }} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500">Phone</p>
                      <p className="text-xs font-bold text-white">+91 {phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* What's next */}
              <div className="rounded-2xl p-4 border border-white/5 space-y-2.5" style={{ background: "rgba(255,255,255,0.03)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">What Happens Next</p>
                {[
                  { icon: "sms", text: "Confirmation SMS & WhatsApp sent", color: "#1152d4" },
                  { icon: "engineering", text: "Certified inspector visits your location", color: "#f59e0b" },
                  { icon: "fact_check", text: "250-point inspection completed in ~45 min", color: "#10b981" },
                  { icon: "payments", text: "Same-day bank transfer on deal closure", color: "#8b5cf6" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${item.color}18` }}>
                      <MaterialIcon name={item.icon} className="text-[14px]" style={{ color: item.color }} />
                    </div>
                    <p className="text-xs text-slate-300">{item.text}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 h-12 rounded-2xl text-sm font-bold text-white w-full transition-all"
                  style={{ background: "#1152d4" }}
                >
                  <MaterialIcon name="home" className="text-[18px]" />
                  Back to Home
                </Link>
                <Link
                  href="/sell-car"
                  className="flex items-center justify-center gap-2 h-10 rounded-xl text-xs font-semibold w-full transition-all"
                  style={{ color: "#94a3b8", background: "rgba(255,255,255,0.03)" }}
                >
                  Sell Another Car
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <BuyerBottomNav className="md:hidden" />
    </div>
  );
}

/* ─── Page wrapper with Suspense ─── */
export default function SellCarValuationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh flex items-center justify-center" style={{ background: "#080a0f" }}>
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            <p className="text-xs text-slate-500 font-semibold">Loading valuation...</p>
          </div>
        </div>
      }
    >
      <ValuationPageInner />
    </Suspense>
  );
}
