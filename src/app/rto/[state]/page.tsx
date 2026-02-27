"use client";

import { use } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";

function formatState(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const RTO_OFFICES = [
  {
    name: "Regional Transport Office — Central",
    code: "MH-01",
    address: "Tardeo Road, Mumbai Central, Mumbai 400034",
    phone: "022-2307-1234",
  },
  {
    name: "Regional Transport Office — Andheri",
    code: "MH-02",
    address: "SVP Road, Andheri West, Mumbai 400058",
    phone: "022-2672-5678",
  },
  {
    name: "Regional Transport Office — Borivali",
    code: "MH-03",
    address: "LBS Marg, Borivali East, Mumbai 400066",
    phone: "022-2896-9012",
  },
  {
    name: "District Transport Office — Thane",
    code: "MH-04",
    address: "Ghodbunder Road, Thane West, Thane 400607",
    phone: "022-2534-3456",
  },
];

const SERVICES = [
  { label: "Vehicle Registration", icon: "directions_car", color: "#1152d4" },
  { label: "Ownership Transfer", icon: "swap_horiz", color: "#10b981" },
  { label: "Driving License", icon: "badge", color: "#f59e0b" },
  { label: "NOC / Migration", icon: "description", color: "#8b5cf6" },
];

const FEES = [
  { service: "New Registration (Petrol)", fee: "Rs 600" },
  { service: "New Registration (Diesel)", fee: "Rs 600" },
  { service: "Registration Renewal", fee: "Rs 300" },
  { service: "Ownership Transfer", fee: "Rs 500" },
  { service: "Duplicate RC", fee: "Rs 400" },
  { service: "NOC for State Transfer", fee: "Rs 500" },
  { service: "Learner License", fee: "Rs 200" },
  { service: "Driving License (New)", fee: "Rs 400" },
  { service: "Driving License Renewal", fee: "Rs 250" },
];

export default function RTOStatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = use(params);
  const stateName = formatState(state);

  return (
    <div className="min-h-dvh w-full pb-32" style={{ background: "#080a0f", color: "#e2e8f0" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-white/5"
        style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}
      >
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/rto"
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-400" />
          </Link>
          <h1 className="text-base font-bold text-white flex-1">{stateName} RTO Information</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-5">
        {/* Services Available */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
            Services Available
          </p>
          <div className="grid grid-cols-2 gap-3">
            {SERVICES.map((svc) => (
              <div
                key={svc.label}
                className="rounded-xl p-4 flex items-center gap-3 border border-white/5"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: `${svc.color}20` }}
                >
                  <MaterialIcon name={svc.icon} className="text-[20px]" style={{ color: svc.color }} />
                </div>
                <span className="text-xs font-semibold text-white leading-tight">{svc.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RTO Offices */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
            RTO Offices
          </p>
          <div className="space-y-3">
            {RTO_OFFICES.map((office) => (
              <div
                key={office.code}
                className="rounded-2xl p-4 border border-white/5"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-bold text-white leading-snug flex-1 pr-2">{office.name}</h3>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: "rgba(17,82,212,0.12)", color: "#60a5fa" }}
                  >
                    {office.code}
                  </span>
                </div>
                <div className="flex items-start gap-1.5 mb-1.5">
                  <MaterialIcon name="location_on" className="text-[14px] text-slate-500 mt-0.5" />
                  <span className="text-xs text-slate-400 leading-relaxed">{office.address}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MaterialIcon name="phone" className="text-[14px] text-slate-500" />
                  <span className="text-xs text-slate-400">{office.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fees Table */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
            Fee Schedule
          </p>
          <div className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
            {/* Table header */}
            <div className="grid grid-cols-2 gap-2 px-4 py-3 border-b border-white/5">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Service</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase text-right">Fee</span>
            </div>
            {/* Table rows */}
            {FEES.map((row, idx) => (
              <div
                key={row.service}
                className="grid grid-cols-2 gap-2 px-4 py-2.5"
                style={{ background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}
              >
                <span className="text-xs text-slate-400">{row.service}</span>
                <span className="text-xs text-white font-medium text-right">{row.fee}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="rounded-xl p-4" style={{ background: "rgba(234,179,8,0.06)", border: "1px solid rgba(234,179,8,0.15)" }}>
          <div className="flex items-start gap-2">
            <MaterialIcon name="info" className="text-[16px] text-amber-400 mt-0.5" />
            <p className="text-amber-200/70 text-xs leading-relaxed">
              Fees shown are approximate and may vary. Please contact the respective RTO office for the most current fee structure and document requirements.
            </p>
          </div>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
