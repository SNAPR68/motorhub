"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicle, adaptVehicle } from "@/lib/api";

/* ─── TrueCost Engine ─── */

// ── Cost computation helpers ──

const DEPRECIATION_RATES = [0.15, 0.10, 0.08, 0.07, 0.06];
const ANNUAL_KM = 12_000;
const FUEL_COST_PER_KM: Record<string, number> = {
  petrol: 2.5,
  diesel: 1.8,
  electric: 0.6,
  ev: 0.6,
  cng: 1.2,
  hybrid: 1.5,
};
const MAINTENANCE_PETROL = [8_000, 12_000, 18_000, 25_000, 30_000];
const DIESEL_MULTIPLIER = 1.2;
const RC_RATE = 0.04;
const INSURANCE_BASE_RATE = 0.04;
const INSURANCE_DECLINE = 0.10;
const SEGMENT_AVG_COST_PER_KM = 14.5; // INR per km avg across Indian used car market

interface YearCost {
  year: number;
  maintenance: number;
  insurance: number;
  fuel: number;
  depreciation: number;
  total: number;
}

interface CostBreakdown {
  purchasePrice: number;
  registration: number;
  totalMaintenance: number;
  totalInsurance: number;
  totalFuel: number;
  totalDepreciation: number;
  totalCost: number;
  monthlyCost: number;
  resaleValue: number;
  costPerKm: number;
  years: YearCost[];
}

function computeTrueCost(
  price: number,
  fuelType: string,
  periodYears: 3 | 5
): CostBreakdown {
  const fuelKey = fuelType.toLowerCase();
  const fuelCostPerKm = FUEL_COST_PER_KM[fuelKey] ?? 2.5;
  const isDiesel = fuelKey === "diesel";

  const registration = Math.round(price * RC_RATE);
  const years: YearCost[] = [];
  let cumulativeDepreciationRate = 0;

  for (let i = 0; i < periodYears; i++) {
    const baseMaintenance = MAINTENANCE_PETROL[i] ?? 30_000;
    const maintenance = Math.round(
      isDiesel ? baseMaintenance * DIESEL_MULTIPLIER : baseMaintenance
    );

    // Insurance: declining IDV each year
    const idv = price * (1 - cumulativeDepreciationRate);
    const insuranceRate =
      INSURANCE_BASE_RATE * Math.pow(1 - INSURANCE_DECLINE, i);
    const insurance = Math.round(idv * insuranceRate);

    const fuel = Math.round(ANNUAL_KM * fuelCostPerKm);

    const depRate = DEPRECIATION_RATES[i] ?? 0.06;
    cumulativeDepreciationRate += depRate;
    const depreciation = Math.round(price * depRate);

    years.push({
      year: i + 1,
      maintenance,
      insurance,
      fuel,
      depreciation,
      total: maintenance + insurance + fuel + depreciation,
    });
  }

  const totalMaintenance = years.reduce((s, y) => s + y.maintenance, 0);
  const totalInsurance = years.reduce((s, y) => s + y.insurance, 0);
  const totalFuel = years.reduce((s, y) => s + y.fuel, 0);
  const totalDepreciation = years.reduce((s, y) => s + y.depreciation, 0);

  const totalCost =
    price + registration + totalMaintenance + totalInsurance + totalFuel;
  const monthlyCost = Math.round(totalCost / (periodYears * 12));
  const resaleValue = Math.round(price * (1 - cumulativeDepreciationRate));
  const totalKm = ANNUAL_KM * periodYears;
  const costPerKm = parseFloat((totalCost / totalKm).toFixed(1));

  return {
    purchasePrice: price,
    registration,
    totalMaintenance,
    totalInsurance,
    totalFuel,
    totalDepreciation,
    totalCost,
    monthlyCost,
    resaleValue,
    costPerKm,
    years,
  };
}

// ── Known defect database ──

interface DefectAlert {
  pattern: RegExp;
  title: string;
  description: string;
  severity: "red" | "amber";
}

const KNOWN_DEFECTS: DefectAlert[] = [
  {
    pattern: /creta.*dct|dct.*creta/i,
    title: "DCT Gearbox Issue",
    description:
      "Hyundai Creta DCT variants have known dual-clutch transmission issues. Budget extra for potential gearbox repairs (INR 80K-1.5L).",
    severity: "red",
  },
  {
    pattern: /seltos.*dct|dct.*seltos/i,
    title: "DCT Gearbox Issue",
    description:
      "Kia Seltos DCT has reported dual-clutch transmission problems. Factor in gearbox maintenance costs.",
    severity: "red",
  },
  {
    pattern: /ecosport/i,
    title: "Spare Parts Availability",
    description:
      "Ford EcoSport parts may become harder to source as Ford India has exited the market.",
    severity: "amber",
  },
  {
    pattern: /figo/i,
    title: "Spare Parts Availability",
    description:
      "Ford Figo parts availability is declining post Ford India exit. Plan for higher spare part costs.",
    severity: "amber",
  },
  {
    pattern: /xuv500/i,
    title: "Turbo & EGR Concerns",
    description:
      "XUV500 diesel variants may develop turbo and EGR valve issues after 60K km. Regular servicing is critical.",
    severity: "amber",
  },
  {
    pattern: /fortuner/i,
    title: "Injector Wear",
    description:
      "Fortuner diesel injectors can be expensive to replace after high mileage. Check service history carefully.",
    severity: "amber",
  },
  {
    pattern: /city.*cvt|cvt.*city/i,
    title: "CVT Gearbox Sensitivity",
    description:
      "Honda City CVT transmissions require careful maintenance. Ensure timely CVT fluid changes.",
    severity: "amber",
  },
  {
    pattern: /nexon.*amt|amt.*nexon/i,
    title: "AMT Jerks in Traffic",
    description:
      "Tata Nexon AMT can feel jerky in stop-and-go traffic. Not a defect per se, but worth test-driving.",
    severity: "amber",
  },
];

// ── SVG Donut Chart ──

interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

function DonutChart({
  slices,
  size = 200,
}: {
  slices: DonutSlice[];
  size?: number;
}) {
  const total = slices.reduce((s, sl) => s + sl.value, 0);
  if (total === 0) return null;

  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 4;
  const innerR = outerR * 0.6;

  let cumAngle = -90; // start at top

  const paths = slices.map((slice, i) => {
    const pct = slice.value / total;
    const angle = pct * 360;
    const startAngle = cumAngle;
    const endAngle = cumAngle + angle;
    cumAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1Outer = cx + outerR * Math.cos(startRad);
    const y1Outer = cy + outerR * Math.sin(startRad);
    const x2Outer = cx + outerR * Math.cos(endRad);
    const y2Outer = cy + outerR * Math.sin(endRad);

    const x1Inner = cx + innerR * Math.cos(endRad);
    const y1Inner = cy + innerR * Math.sin(endRad);
    const x2Inner = cx + innerR * Math.cos(startRad);
    const y2Inner = cy + innerR * Math.sin(startRad);

    const largeArc = angle > 180 ? 1 : 0;

    const d = [
      `M ${x1Outer} ${y1Outer}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2Outer} ${y2Outer}`,
      `L ${x1Inner} ${y1Inner}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${x2Inner} ${y2Inner}`,
      "Z",
    ].join(" ");

    return <path key={i} d={d} fill={slice.color} opacity={0.9} />;
  });

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className="mx-auto"
    >
      {paths}
      {/* Center text */}
      <text
        x={cx}
        y={cy - 6}
        textAnchor="middle"
        fill="#e2e8f0"
        fontSize="11"
        fontWeight="700"
      >
        Total Cost
      </text>
      <text
        x={cx}
        y={cy + 12}
        textAnchor="middle"
        fill="#94a3b8"
        fontSize="9"
      >
        Breakdown
      </text>
    </svg>
  );
}

// ── Formatters ──

function formatINR(n: number): string {
  if (n >= 10_000_000) {
    return `${(n / 10_000_000).toFixed(2)}Cr`;
  }
  if (n >= 100_000) {
    return `${(n / 100_000).toFixed(1)}L`;
  }
  return n.toLocaleString("en-IN");
}

function formatINRFull(n: number): string {
  return n.toLocaleString("en-IN");
}

// ── Cost category colors ──

const COST_COLORS = {
  purchase: "#1152d4",
  maintenance: "#f59e0b",
  insurance: "#8b5cf6",
  fuel: "#ef4444",
  depreciation: "#6b7280",
  registration: "#06b6d4",
};

// ── Main Page ──

export default function TrueCostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading: loading } = useApi(() => fetchVehicle(id), [id]);
  const vehicle = data?.vehicle ? adaptVehicle(data.vehicle) : null;

  const [period, setPeriod] = useState<3 | 5>(3);
  const [expandedYear, setExpandedYear] = useState<number | null>(null);

  const cost = useMemo(() => {
    if (!vehicle) return null;
    return computeTrueCost(vehicle.priceNumeric, vehicle.fuel, period);
  }, [vehicle, period]);

  const defects = useMemo(() => {
    if (!vehicle) return [];
    return KNOWN_DEFECTS.filter((d) => d.pattern.test(vehicle.name));
  }, [vehicle]);

  const savingsVsSegment = useMemo(() => {
    if (!cost) return 0;
    return Math.round(
      ((SEGMENT_AVG_COST_PER_KM - cost.costPerKm) / SEGMENT_AVG_COST_PER_KM) *
        100
    );
  }, [cost]);

  // ── Loading State ──
  if (loading) {
    return (
      <div
        className="min-h-dvh flex items-center justify-center"
        style={{ background: "#080a0f" }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <p className="text-slate-500 text-sm">Calculating true cost...</p>
        </div>
      </div>
    );
  }

  // ── Not Found ──
  if (!vehicle || !cost) {
    return (
      <div
        className="min-h-dvh flex items-center justify-center"
        style={{ background: "#080a0f" }}
      >
        <div className="text-center px-6">
          <MaterialIcon
            name="search_off"
            className="text-[48px] text-slate-700 mb-3"
          />
          <p className="text-slate-400 font-semibold">Vehicle not found</p>
          <Link
            href="/used-cars"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold"
            style={{ color: "#1152d4" }}
          >
            <MaterialIcon name="arrow_back" className="text-[15px]" /> Browse
            used cars
          </Link>
        </div>
      </div>
    );
  }

  // ── Donut slices ──
  const donutSlices: DonutSlice[] = [
    {
      label: "Purchase Price",
      value: cost.purchasePrice,
      color: COST_COLORS.purchase,
    },
    {
      label: "Maintenance",
      value: cost.totalMaintenance,
      color: COST_COLORS.maintenance,
    },
    {
      label: "Insurance",
      value: cost.totalInsurance,
      color: COST_COLORS.insurance,
    },
    { label: "Fuel", value: cost.totalFuel, color: COST_COLORS.fuel },
    {
      label: "Depreciation",
      value: cost.totalDepreciation,
      color: COST_COLORS.depreciation,
    },
    {
      label: "Registration/RC",
      value: cost.registration,
      color: COST_COLORS.registration,
    },
  ];

  return (
    <div
      className="min-h-dvh w-full pb-10"
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
        <div className="max-w-md mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href={`/vehicle/${id}`}
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <MaterialIcon
              name="arrow_back"
              className="text-[20px] text-slate-300"
            />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-white truncate">
              TrueCost Engine
            </h1>
            <p className="text-[10px] text-slate-500 truncate">
              {vehicle.name}
            </p>
          </div>
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(17,82,212,0.12)" }}
          >
            <MaterialIcon
              name="calculate"
              className="text-[20px]"
              style={{ color: "#1152d4" }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-5 space-y-4">
        {/* ─── Vehicle Summary Card ─── */}
        <div
          className="rounded-2xl p-4 border border-white/5"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-black text-white truncate">
                {vehicle.name}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {vehicle.year} · {vehicle.km} · {vehicle.fuel}
              </p>
            </div>
            <div className="text-right shrink-0 ml-3">
              <p className="text-lg font-black text-white">{vehicle.price}</p>
              <p className="text-[10px] text-slate-500">Purchase Price</p>
            </div>
          </div>
        </div>

        {/* ─── Period Selector ─── */}
        <div
          className="rounded-xl p-1 flex gap-1 border border-white/5"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          {([3, 5] as const).map((yr) => (
            <button
              key={yr}
              onClick={() => setPeriod(yr)}
              className="flex-1 py-2.5 rounded-lg text-xs font-bold transition-all"
              style={{
                background:
                  period === yr ? "#1152d4" : "transparent",
                color: period === yr ? "#ffffff" : "#94a3b8",
              }}
            >
              {yr} Year Projection
            </button>
          ))}
        </div>

        {/* ─── Big Total Number ─── */}
        <div
          className="rounded-2xl p-5 border text-center"
          style={{
            background: "rgba(17,82,212,0.06)",
            borderColor: "rgba(17,82,212,0.2)",
          }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
            Total Cost of Ownership ({period} Years)
          </p>
          <p className="text-3xl font-black text-white">
            INR {formatINRFull(cost.totalCost)}
          </p>
          <p className="text-sm text-slate-400 mt-1">
            INR {formatINRFull(cost.monthlyCost)}
            <span className="text-slate-600">/month</span>
          </p>
        </div>

        {/* ─── Donut Chart ─── */}
        <div
          className="rounded-2xl p-5 border border-white/5"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">
            Cost Breakdown
          </p>

          <DonutChart slices={donutSlices} size={180} />

          {/* Legend */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mt-5">
            {donutSlices.map((sl) => {
              const pct =
                cost.totalCost > 0
                  ? ((sl.value / (cost.totalCost + cost.totalDepreciation)) * 100).toFixed(1)
                  : "0";
              return (
                <div key={sl.label} className="flex items-center gap-2">
                  <div
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ background: sl.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-slate-500 truncate">
                      {sl.label}
                    </p>
                    <p className="text-xs font-semibold text-white">
                      INR {formatINR(sl.value)}{" "}
                      <span className="text-slate-600 font-normal">
                        ({pct}%)
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── Year-by-Year Breakdown (Accordion) ─── */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
            Year-by-Year Breakdown
          </p>
          <div
            className="rounded-2xl border border-white/5 overflow-hidden"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >
            {cost.years.map((yr, i) => {
              const isOpen = expandedYear === yr.year;
              return (
                <div
                  key={yr.year}
                  style={{
                    borderTop:
                      i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  }}
                >
                  <button
                    onClick={() =>
                      setExpandedYear(isOpen ? null : yr.year)
                    }
                    className="w-full flex items-center justify-between px-4 py-3.5"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-black"
                        style={{
                          background: "rgba(17,82,212,0.1)",
                          color: "#1152d4",
                        }}
                      >
                        Y{yr.year}
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-white">
                          Year {yr.year}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {(["maintenance", "insurance", "fuel", "depreciation"] as const).length}{" "}
                          cost categories
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white">
                        INR {formatINR(yr.total)}
                      </p>
                      <MaterialIcon
                        name={isOpen ? "expand_less" : "expand_more"}
                        className="text-[20px] text-slate-500"
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div
                      className="px-4 pb-4 space-y-2"
                      style={{
                        borderTop: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      <div className="pt-3" />
                      {[
                        {
                          label: "Maintenance",
                          val: yr.maintenance,
                          color: COST_COLORS.maintenance,
                          icon: "build",
                        },
                        {
                          label: "Insurance",
                          val: yr.insurance,
                          color: COST_COLORS.insurance,
                          icon: "shield",
                        },
                        {
                          label: "Fuel",
                          val: yr.fuel,
                          color: COST_COLORS.fuel,
                          icon: "local_gas_station",
                        },
                        {
                          label: "Depreciation",
                          val: yr.depreciation,
                          color: COST_COLORS.depreciation,
                          icon: "trending_down",
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center justify-between rounded-xl px-3 py-2.5"
                          style={{
                            background: "rgba(255,255,255,0.02)",
                          }}
                        >
                          <div className="flex items-center gap-2.5">
                            <MaterialIcon
                              name={item.icon}
                              className="text-[16px]"
                              style={{ color: item.color }}
                            />
                            <span className="text-xs text-slate-400">
                              {item.label}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-white">
                            INR {formatINRFull(item.val)}
                          </span>
                        </div>
                      ))}
                      {/* Monthly for this year */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                          Monthly Cost
                        </span>
                        <span className="text-xs font-bold text-white">
                          INR{" "}
                          {formatINRFull(Math.round(yr.total / 12))}
                          /mo
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── Known Defect Alerts ─── */}
        {defects.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
              Known Defect Alerts
            </p>
            <div className="space-y-2">
              {defects.map((defect, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-4 border flex items-start gap-3"
                  style={{
                    background:
                      defect.severity === "red"
                        ? "rgba(239,68,68,0.06)"
                        : "rgba(245,158,11,0.06)",
                    borderColor:
                      defect.severity === "red"
                        ? "rgba(239,68,68,0.2)"
                        : "rgba(245,158,11,0.2)",
                  }}
                >
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      background:
                        defect.severity === "red"
                          ? "rgba(239,68,68,0.12)"
                          : "rgba(245,158,11,0.12)",
                    }}
                  >
                    <MaterialIcon
                      name={
                        defect.severity === "red" ? "error" : "warning"
                      }
                      className="text-[16px]"
                      style={{
                        color:
                          defect.severity === "red"
                            ? "#ef4444"
                            : "#f59e0b",
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs font-bold"
                      style={{
                        color:
                          defect.severity === "red"
                            ? "#ef4444"
                            : "#f59e0b",
                      }}
                    >
                      {defect.title}
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                      {defect.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Resale Value Projection ─── */}
        <div
          className="rounded-2xl p-5 border text-center"
          style={{
            background: "rgba(16,185,129,0.04)",
            borderColor: "rgba(16,185,129,0.15)",
          }}
        >
          <div
            className="h-12 w-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
            style={{ background: "rgba(16,185,129,0.12)" }}
          >
            <MaterialIcon
              name="trending_up"
              className="text-[24px]"
              style={{ color: "#10b981" }}
            />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
            Resale Value in {period} Years
          </p>
          <p className="text-2xl font-black text-white">
            INR {formatINR(cost.resaleValue)}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Estimated market value after {period} years of ownership
          </p>

          {/* Depreciation bar */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] text-slate-600">
                Purchase Price
              </span>
              <span className="text-[10px] text-slate-600">
                Resale Value
              </span>
            </div>
            <div
              className="h-3 rounded-full overflow-hidden relative"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <div
                className="h-full rounded-full absolute left-0 top-0 transition-all"
                style={{
                  width: `${((cost.resaleValue / cost.purchasePrice) * 100).toFixed(0)}%`,
                  background:
                    "linear-gradient(90deg, #10b981, #059669)",
                }}
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5">
              Retains{" "}
              <span className="font-semibold text-emerald-400">
                {((cost.resaleValue / cost.purchasePrice) * 100).toFixed(0)}%
              </span>{" "}
              of purchase value
            </p>
          </div>
        </div>

        {/* ─── Cost Comparison Badge ─── */}
        <div
          className="rounded-2xl p-4 border border-white/5 flex items-center gap-4"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <div
            className="h-14 w-14 rounded-2xl flex items-center justify-center shrink-0"
            style={{
              background:
                savingsVsSegment > 0
                  ? "rgba(16,185,129,0.12)"
                  : "rgba(239,68,68,0.12)",
            }}
          >
            <MaterialIcon
              name={savingsVsSegment > 0 ? "thumb_up" : "thumb_down"}
              className="text-[24px]"
              style={{
                color: savingsVsSegment > 0 ? "#10b981" : "#ef4444",
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white">
              INR {cost.costPerKm}/km to own
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {savingsVsSegment > 0 ? (
                <>
                  <span
                    className="font-semibold"
                    style={{ color: "#10b981" }}
                  >
                    {savingsVsSegment}% better
                  </span>{" "}
                  than segment average (INR {SEGMENT_AVG_COST_PER_KM}/km)
                </>
              ) : savingsVsSegment < 0 ? (
                <>
                  <span
                    className="font-semibold"
                    style={{ color: "#ef4444" }}
                  >
                    {Math.abs(savingsVsSegment)}% higher
                  </span>{" "}
                  than segment average (INR {SEGMENT_AVG_COST_PER_KM}/km)
                </>
              ) : (
                <>
                  <span className="font-semibold text-slate-300">
                    On par
                  </span>{" "}
                  with segment average (INR {SEGMENT_AVG_COST_PER_KM}/km)
                </>
              )}
            </p>
          </div>
        </div>

        {/* ─── Assumptions ─── */}
        <div
          className="rounded-xl px-4 py-3 border border-white/5"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <MaterialIcon
              name="info"
              className="text-[14px] text-slate-600"
            />
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
              Assumptions
            </p>
          </div>
          <ul className="space-y-1">
            {[
              `Annual driving: ${ANNUAL_KM.toLocaleString("en-IN")} km/year`,
              `Fuel cost: INR ${FUEL_COST_PER_KM[vehicle.fuel.toLowerCase()] ?? 2.5}/km (${vehicle.fuel})`,
              "Insurance: 4% of IDV (declining 10% yearly)",
              "Registration/RC: 4% of vehicle price (one-time)",
              "Depreciation: 15% (Y1), 10% (Y2), 8% (Y3), 7% (Y4), 6% (Y5)",
            ].map((text) => (
              <li
                key={text}
                className="text-[10px] text-slate-600 leading-relaxed flex items-start gap-1.5"
              >
                <span className="text-slate-700 mt-0.5">-</span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* ─── CTA: Compare ─── */}
        <Link
          href="/compare"
          className="flex items-center justify-center gap-2 h-12 rounded-2xl text-sm font-bold text-white w-full"
          style={{ background: "#1152d4" }}
        >
          <MaterialIcon name="compare_arrows" className="text-[18px]" />
          Compare with Similar Cars
        </Link>

        {/* ─── Disclaimer ─── */}
        <div
          className="rounded-xl px-4 py-3 border border-white/5"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          <p className="text-[10px] text-slate-600 leading-relaxed">
            TrueCost Engine estimates are based on industry averages and
            algorithmic projections. Actual costs may vary based on driving
            habits, geography, service provider, and vehicle condition.
            Autovinci does not guarantee these figures.
          </p>
        </div>
      </main>
    </div>
  );
}
