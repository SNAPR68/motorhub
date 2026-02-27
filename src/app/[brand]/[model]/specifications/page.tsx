"use client";

import { use, useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerBottomNav } from "@/components/BuyerBottomNav";
import { getModelBySlug, getBrandBySlug } from "@/lib/car-catalog";

/* ─── Default spec sections ─── */
interface SpecRow {
  label: string;
  value: string;
}

interface SpecSection {
  title: string;
  icon: string;
  rows: SpecRow[];
}

const DEFAULT_SPECS: SpecSection[] = [
  {
    title: "Engine & Transmission",
    icon: "settings",
    rows: [
      { label: "Engine Type", value: "1.2L / 1.5L Turbo Petrol" },
      { label: "Displacement", value: "1197 cc / 1482 cc" },
      { label: "Max Power", value: "89 bhp @ 6000 rpm / 118 bhp @ 5500 rpm" },
      { label: "Max Torque", value: "113 Nm @ 4400 rpm / 148 Nm @ 4000 rpm" },
      { label: "No. of Cylinders", value: "4" },
      { label: "Valves Per Cylinder", value: "4 (16V DOHC)" },
      { label: "Transmission", value: "5-Speed MT / 6-Speed AT / AMT" },
      { label: "Drive Type", value: "Front Wheel Drive (FWD)" },
    ],
  },
  {
    title: "Dimensions & Weight",
    icon: "straighten",
    rows: [
      { label: "Length", value: "3995 mm" },
      { label: "Width", value: "1790 mm" },
      { label: "Height", value: "1640 mm" },
      { label: "Wheelbase", value: "2500 mm" },
      { label: "Ground Clearance", value: "198 mm" },
      { label: "Boot Space", value: "328 Litres" },
      { label: "Kerb Weight", value: "1095 – 1190 kg" },
      { label: "Gross Vehicle Weight", value: "1580 kg" },
    ],
  },
  {
    title: "Performance",
    icon: "speed",
    rows: [
      { label: "Top Speed", value: "175 km/h" },
      { label: "0 – 100 km/h", value: "11.5 seconds" },
      { label: "Turning Radius", value: "5.2 metres" },
      { label: "Drag Coefficient", value: "0.34 Cd" },
    ],
  },
  {
    title: "Fuel Efficiency",
    icon: "local_gas_station",
    rows: [
      { label: "ARAI Mileage", value: "20.89 km/l" },
      { label: "City Mileage (est.)", value: "16 – 18 km/l" },
      { label: "Highway Mileage (est.)", value: "21 – 24 km/l" },
      { label: "Fuel Tank Capacity", value: "37 L / 48 L" },
      { label: "Fuel Type", value: "Petrol / CNG" },
      { label: "Emission Standard", value: "BS6 Phase 2 (OBD-II)" },
    ],
  },
  {
    title: "Suspension & Brakes",
    icon: "album",
    rows: [
      { label: "Front Suspension", value: "MacPherson Strut with Coil Spring" },
      { label: "Rear Suspension", value: "Torsion Beam with Coil Spring" },
      { label: "Front Brakes", value: "Ventilated Disc" },
      { label: "Rear Brakes", value: "Drum" },
      { label: "Steering Type", value: "Electric Power Assisted (EPS)" },
      { label: "Tyre Size", value: "215/60 R16" },
    ],
  },
  {
    title: "Safety",
    icon: "shield",
    rows: [
      { label: "GNCAP Rating", value: "5 Stars (Adult) / 3 Stars (Child)" },
      { label: "Airbags", value: "6 Airbags (Dual Front, Side, Curtain)" },
      { label: "ABS with EBD", value: "Yes" },
      { label: "Electronic Stability Control", value: "Yes (ESC)" },
      { label: "Hill Hold Assist", value: "Yes" },
      { label: "Tyre Pressure Monitoring", value: "Yes (TPMS)" },
      { label: "ISOFIX Child Seat Mounts", value: "Yes" },
      { label: "Rear Parking Sensors", value: "Yes" },
      { label: "Rear Parking Camera", value: "Yes (with guidelines)" },
      { label: "Speed Alert System", value: "Yes" },
    ],
  },
];

export default function SpecificationsPage({
  params,
}: {
  params: Promise<{ brand: string; model: string }>;
}) {
  const { brand: brandSlug, model: modelSlug } = use(params);
  const car = getModelBySlug(brandSlug, modelSlug);
  const brand = getBrandBySlug(brandSlug);

  /* Track expanded sections — all expanded by default */
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(DEFAULT_SPECS.map((s) => [s.title, true]))
  );

  const toggle = (title: string) =>
    setExpanded((prev) => ({ ...prev, [title]: !prev[title] }));

  /* ── 404 state ── */
  if (!car || !brand) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: "#080a0f" }}>
        <div className="text-center px-6">
          <MaterialIcon name="search_off" className="text-[48px] text-slate-700 mb-3" />
          <p className="text-slate-400 font-semibold">Model not found</p>
          <Link href="/new-cars" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: "#1152d4" }}>
            <MaterialIcon name="arrow_back" className="text-[15px]" /> Browse New Cars
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh w-full pb-36" style={{ background: "#080a0f", color: "#e2e8f0" }}>

      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-40 border-b border-white/5" style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link href={`/${brandSlug}/${modelSlug}`} className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0" style={{ background: "rgba(255,255,255,0.05)" }}>
            <MaterialIcon name="arrow_back" className="text-[20px] text-slate-300" />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{brand.name}</p>
            <h1 className="text-sm font-bold text-white truncate leading-tight">{car.name} Specifications</h1>
          </div>
        </div>
      </header>

      {/* ─── QUICK STAT BAR ─── */}
      <div className="max-w-lg mx-auto px-4 py-4 border-b border-white/5">
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: "bolt", label: "Power", val: car.power },
            { icon: "speed", label: "Mileage", val: car.mileage },
            { icon: "settings", label: "Engine", val: car.engine },
            { icon: "airline_seat_recline_normal", label: "Seats", val: `${car.seating}` },
          ].map(({ icon, label, val }) => (
            <div key={label} className="rounded-xl p-2 text-center border border-white/5" style={{ background: "rgba(255,255,255,0.03)" }}>
              <MaterialIcon name={icon} className="text-[16px] text-slate-500 mb-1" />
              <p className="text-[9px] text-slate-600 uppercase tracking-wider">{label}</p>
              <p className="text-[10px] font-bold text-white leading-tight">{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── SPEC SECTIONS (Accordion) ─── */}
      <div className="max-w-lg mx-auto px-4 pt-4 space-y-3">
        {DEFAULT_SPECS.map((section) => {
          const isOpen = expanded[section.title];
          return (
            <div
              key={section.title}
              className="rounded-2xl border border-white/5 overflow-hidden"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              {/* Section header */}
              <button
                onClick={() => toggle(section.title)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors"
              >
                <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(17,82,212,0.1)" }}>
                  <MaterialIcon name={section.icon} className="text-[16px]" style={{ color: "#60a5fa" }} />
                </div>
                <span className="flex-1 text-xs font-bold text-white uppercase tracking-wider">{section.title}</span>
                <MaterialIcon
                  name={isOpen ? "expand_less" : "expand_more"}
                  className="text-[20px] text-slate-500 transition-transform"
                />
              </button>

              {/* Section rows */}
              {isOpen && (
                <div className="border-t border-white/5">
                  {section.rows.map((row, idx) => (
                    <div
                      key={row.label}
                      className={`flex items-start justify-between px-4 py-2.5 ${idx > 0 ? "border-t border-white/[0.03]" : ""}`}
                    >
                      <span className="text-[11px] text-slate-500 shrink-0 w-[42%]">{row.label}</span>
                      <span className="text-[11px] font-semibold text-white text-right">{row.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ─── DISCLAIMER ─── */}
      <div className="max-w-lg mx-auto px-4 mt-6 mb-4">
        <p className="text-[10px] text-slate-600 leading-relaxed">
          Specifications shown are for general reference. Actual specs may vary by variant.
          Please confirm exact details with your nearest authorized dealer.
        </p>
      </div>

      <BuyerBottomNav />
    </div>
  );
}
