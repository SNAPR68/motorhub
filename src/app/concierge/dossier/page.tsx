"use client";

import { Suspense, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { CRETA, BLUR_DATA_URL } from "@/lib/car-images";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicle, adaptVehicle } from "@/lib/api";

/* Stitch: elite_ai_concierge_chat_2 — Vehicle dossier with lot history, service records */

const FALLBACK_LOT = [
  { date: "Jan 2024", event: "First Registration", location: "Mumbai, MH", icon: "flag" },
  { date: "Aug 2024", event: "1st Service Completed", location: "Authorized Service Center", icon: "build" },
  { date: "Feb 2026", event: "Listed on Autovinci", location: "Verified Dealer", icon: "verified" },
];

function DossierContent() {
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get("vehicleId") ?? searchParams.get("id") ?? "";

  const { data, isLoading } = useApi(
    async () => (vehicleId ? await fetchVehicle(vehicleId) : { vehicle: null }),
    [vehicleId]
  );
  const dbVehicle = data?.vehicle;
  const vehicle = dbVehicle ? adaptVehicle(dbVehicle) : null;

  if (vehicleId && isLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: "#111921" }}>
        <div className="animate-pulse text-slate-400">Loading dossier...</div>
      </div>
    );
  }

  const img = vehicle?.image ?? CRETA;
  const name = vehicle ? `${vehicle.year} ${vehicle.name}` : "2023 Hyundai Creta SX(O)";
  const specs = vehicle
    ? `${vehicle.engine} • ${vehicle.fuel} • ${vehicle.km} km`
    : "1.5L Turbo • Automatic • 32,000 km";
  const price = vehicle?.price ?? "₹14.5L";

  return (
    <div
      className="relative flex min-h-dvh w-full max-w-[450px] mx-auto flex-col text-slate-100"
      style={{ fontFamily: "'Newsreader', serif", background: "#111921" }}
    >
      <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#111921]/80 backdrop-blur-md border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="size-10 rounded-full bg-slate-800 overflow-hidden border border-[#1773cf]/20 flex items-center justify-center">
              <MaterialIcon name="smart_toy" className="text-[#1773cf] text-xl" />
            </div>
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-[#111921]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-none tracking-tight">Vehicle Dossier</h1>
            <p className="text-[11px] uppercase tracking-widest text-[#1773cf] font-medium mt-1">AI Generated</p>
          </div>
        </div>
        <Link href={vehicleId ? `/vehicle/${vehicleId}` : "/concierge"} className="text-slate-400">
          <MaterialIcon name="close" />
        </Link>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
        <div className="rounded-xl overflow-hidden bg-slate-800/50 border border-slate-700 shadow-xl">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image src={img} alt={name} fill sizes="450px" className="object-cover" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#1773cf] px-2 py-1 rounded text-[10px] font-bold text-white uppercase">
              <MaterialIcon name="verified" className="text-xs" /> Verified
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-xl font-bold">{name}</h3>
            <p className="text-slate-400 text-sm mt-1">{specs}</p>
            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-2xl font-bold text-[#1773cf]">{price}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-slate-800/30 border border-slate-700/50 p-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#1773cf] mb-4 flex items-center gap-2">
            <MaterialIcon name="engineering" className="text-sm" /> Chassis Details
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "VIN", value: "MALA51CF1KH032847" },
              { label: "Engine No.", value: "G4LCDU894521" },
              { label: "Chassis Type", value: "Monocoque" },
              { label: "Suspension", value: "McPherson Strut" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{item.label}</p>
                <p className="text-sm font-medium text-slate-200 font-mono">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl p-4 border" style={{ background: "rgba(23,115,207,0.05)", borderColor: "rgba(23,115,207,0.2)" }}>
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-full bg-[#1773cf]/10 flex items-center justify-center">
              <MaterialIcon name="shield" className="text-[#1773cf] text-2xl" />
            </div>
            <div>
              <h4 className="font-bold text-white">Provenance Verified</h4>
              <p className="text-xs text-slate-400 mt-0.5">AI-verified ownership chain • No accidents reported • All service records verified</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#1773cf] mb-4 flex items-center gap-2">
            <MaterialIcon name="timeline" className="text-sm" /> Lot History
          </h4>
          <div className="space-y-0">
            {FALLBACK_LOT.map((item, i) => (
              <div key={item.date} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="size-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                    <MaterialIcon name={item.icon} className="text-sm text-[#1773cf]" />
                  </div>
                  {i < FALLBACK_LOT.length - 1 && <div className="w-px flex-1 bg-slate-700 my-1" />}
                </div>
                <div className="pb-6">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">{item.date}</p>
                  <p className="text-sm font-semibold text-white">{item.event}</p>
                  <p className="text-xs text-slate-400">{item.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 max-w-[450px] mx-auto z-30 p-4 bg-[#111921]/95 backdrop-blur-md border-t border-slate-800 md:hidden">
        <div className="flex gap-3">
          <Link
            href={vehicleId ? `/reservation?vehicleId=${vehicleId}` : "/reservation"}
            className="flex-1 bg-[#1773cf] text-white py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold text-sm"
          >
            <MaterialIcon name="calendar_month" className="text-lg" /> Book Test Drive
          </Link>
          <Link
            href={vehicleId ? `/vehicle/${vehicleId}` : "/concierge"}
            className="flex-1 bg-slate-800 text-white py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold text-sm border border-slate-700"
          >
            <MaterialIcon name="call" className="text-lg" /> Contact Dealer
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ConciergeDossierPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh flex items-center justify-center bg-[#111921]"><div className="w-8 h-8 rounded-full border-2 border-[#1773cf] border-t-transparent animate-spin" /></div>}>
      <DossierContent />
    </Suspense>
  );
}
