"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MaterialIcon } from "@/components/MaterialIcon";
import DealerAppShell from "@/components/DealerAppShell";
import { useApi } from "@/lib/hooks/use-api";
import { fetchAuctions, fetchVehicles, createAuction, cancelAuction } from "@/lib/api";
import type { AuctionItem, DbVehicle } from "@/lib/api";
import { BLUR_DATA_URL } from "@/lib/car-images";

type TabFilter = "LIVE" | "ENDED" | "MINE";

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  LIVE: { bg: "rgba(16,185,129,0.12)", color: "#34d399", label: "Live" },
  ENDED: { bg: "rgba(59,130,246,0.12)", color: "#60a5fa", label: "Ended" },
  SOLD: { bg: "rgba(139,92,246,0.12)", color: "#a78bfa", label: "Sold" },
  CANCELLED: { bg: "rgba(239,68,68,0.12)", color: "#f87171", label: "Cancelled" },
  NO_BIDS: { bg: "rgba(107,114,128,0.12)", color: "#9ca3af", label: "No Bids" },
  DRAFT: { bg: "rgba(245,158,11,0.12)", color: "#fbbf24", label: "Draft" },
};

function formatPrice(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

function timeLeft(endTime: string): string {
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return "Ended";
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  if (hours >= 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
  return `${hours}h ${mins}m`;
}

function AuctionCard({ auction, onCancel }: { auction: AuctionItem; onCancel?: () => void }) {
  const style = STATUS_STYLES[auction.status] ?? STATUS_STYLES.DRAFT;
  const img = auction.vehicle?.images?.[0] ?? "";

  return (
    <div className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: "rgba(255,255,255,0.03)" }}>
      <div className="relative aspect-[2/1]">
        {img ? (
          <Image src={img} alt={auction.vehicle?.name ?? ""} fill className="object-cover" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
        ) : (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
            <MaterialIcon name="directions_car" className="text-4xl text-slate-600" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: style.bg, color: style.color }}>
            {style.label}
          </span>
        </div>
        {auction.status === "LIVE" && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm">
            <MaterialIcon name="timer" className="text-sm text-amber-400" />
            <span className="text-xs font-bold text-white">{timeLeft(auction.endTime)}</span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-sm font-bold text-white">{auction.vehicle?.name ?? "Vehicle"}</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {auction.vehicle?.year} {auction.vehicle?.fuel ? `• ${auction.vehicle.fuel}` : ""} {auction.vehicle?.km ? `• ${auction.vehicle.km} km` : ""}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Start Price</p>
            <p className="text-sm font-bold text-white">{formatPrice(auction.startPrice)}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Current Bid</p>
            <p className="text-sm font-bold text-emerald-400">{formatPrice(auction.currentPrice)}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Bids</p>
            <p className="text-sm font-bold text-white">{auction._count?.bids ?? 0}</p>
          </div>
        </div>

        {auction.dealerProfile && (
          <p className="text-xs text-slate-500">
            by {auction.dealerProfile.dealershipName} • {auction.dealerProfile.city}
          </p>
        )}

        {auction.status === "LIVE" && onCancel && (
          <button
            onClick={onCancel}
            className="w-full h-9 rounded-xl text-xs font-semibold text-red-400 border border-red-500/20 bg-red-500/5 flex items-center justify-center gap-1.5"
          >
            <MaterialIcon name="cancel" className="text-sm" /> Cancel Auction
          </button>
        )}
      </div>
    </div>
  );
}

export default function DealerAuctionsPage() {
  const [tab, setTab] = useState<TabFilter>("LIVE");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [startPrice, setStartPrice] = useState("");
  const [duration, setDuration] = useState("24");
  const [creating, setCreating] = useState(false);

  const { data: liveData, refetch: refetchLive } = useApi(() => fetchAuctions({ status: "LIVE", limit: 50 }), []);
  const { data: endedData, refetch: refetchEnded } = useApi(() => fetchAuctions({ status: "ENDED", limit: 50 }), []);
  const { data: vehicleData } = useApi(() => fetchVehicles({ status: "AVAILABLE", limit: 100 }), []);

  const auctions = tab === "LIVE" ? (liveData?.auctions ?? []) : (endedData?.auctions ?? []);
  const vehicles = (vehicleData?.vehicles ?? []) as DbVehicle[];

  const handleCreate = async () => {
    if (!selectedVehicle || !startPrice) return;
    setCreating(true);
    try {
      await createAuction({
        vehicleId: selectedVehicle,
        startPrice: parseInt(startPrice),
        durationHours: parseInt(duration),
      });
      setShowCreate(false);
      setSelectedVehicle("");
      setStartPrice("");
      refetchLive();
    } catch {
      // Error handled by useApi
    }
    setCreating(false);
  };

  const handleCancel = async (id: string) => {
    await cancelAuction(id);
    refetchLive();
    refetchEnded();
  };

  return (
    <DealerAppShell>
      <div className="min-h-dvh pb-32" style={{ background: "#080a0f" }}>
        <header className="sticky top-0 z-40 border-b border-white/5" style={{ background: "rgba(8,10,15,0.97)", backdropFilter: "blur(20px)" }}>
          <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
            <Link href="/dashboard" className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0 bg-white/5">
              <MaterialIcon name="arrow_back" className="text-[20px] text-slate-400" />
            </Link>
            <h1 className="text-base font-bold text-white flex-1">Auctions</h1>
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="h-9 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5"
              style={{ background: "#1152d4", color: "#fff" }}
            >
              <MaterialIcon name="add" className="text-sm" />
              New
            </button>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 pt-4 space-y-4">
          {/* Create Form */}
          {showCreate && (
            <div className="rounded-2xl p-4 border border-white/10 space-y-3" style={{ background: "rgba(17,82,212,0.05)" }}>
              <h3 className="text-sm font-bold text-white">Create Auction</h3>
              <select
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm text-white bg-white/5 border border-white/10 outline-none"
              >
                <option value="">Select Vehicle</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id} className="bg-gray-900 text-white">
                    {v.name} — {v.priceDisplay}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Start Price (₹)"
                value={startPrice}
                onChange={(e) => setStartPrice(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm text-white bg-white/5 border border-white/10 outline-none placeholder-slate-500"
              />
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm text-white bg-white/5 border border-white/10 outline-none"
              >
                <option value="6" className="bg-gray-900">6 hours</option>
                <option value="12" className="bg-gray-900">12 hours</option>
                <option value="24" className="bg-gray-900">24 hours</option>
                <option value="48" className="bg-gray-900">48 hours</option>
                <option value="72" className="bg-gray-900">72 hours</option>
                <option value="168" className="bg-gray-900">7 days</option>
              </select>
              <button
                onClick={handleCreate}
                disabled={creating || !selectedVehicle || !startPrice}
                className="w-full py-3 rounded-xl text-sm font-bold text-white disabled:opacity-50"
                style={{ background: "#1152d4" }}
              >
                {creating ? "Creating..." : "Start Auction"}
              </button>
            </div>
          )}

          {/* Tab Pills */}
          <div className="flex gap-2">
            {(["LIVE", "ENDED"] as TabFilter[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-4 py-2 rounded-full text-xs font-bold transition-all"
                style={{
                  background: tab === t ? "#1152d4" : "rgba(255,255,255,0.05)",
                  color: tab === t ? "#fff" : "#94a3b8",
                }}
              >
                {t === "LIVE" ? `Live (${liveData?.total ?? 0})` : `Ended (${endedData?.total ?? 0})`}
              </button>
            ))}
          </div>

          {/* Auction Grid */}
          <div className="space-y-4">
            {auctions.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center mb-3 bg-white/5">
                  <MaterialIcon name="gavel" className="text-[28px] text-slate-600" />
                </div>
                <p className="text-sm font-semibold text-slate-500">No {tab.toLowerCase()} auctions</p>
                <p className="text-xs text-slate-600 mt-1">Create one from your available inventory.</p>
              </div>
            ) : (
              auctions.map((a) => (
                <AuctionCard key={a.id} auction={a} onCancel={a.status === "LIVE" ? () => handleCancel(a.id) : undefined} />
              ))
            )}
          </div>
        </main>
      </div>
    </DealerAppShell>
  );
}
