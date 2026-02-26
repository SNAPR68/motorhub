"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { Badge } from "@/components/ui/Badge";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { STATUS_DISPLAY, INVENTORY_FILTERS, SORT_OPTIONS } from "@/lib/constants";
import { useApi } from "@/lib/hooks/use-api";
import { useApiMutation } from "@/lib/hooks/use-api-mutation";
import { fetchVehicles, adaptVehicle, setPanoramaImage } from "@/lib/api";
import type { Vehicle } from "@/lib/types";
import { BLUR_DATA_URL } from "@/lib/car-images";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ImageUploader } from "@/components/ImageUploader";
import { useCompare } from "@/context/CompareContext";

/* Stitch: premium_inventory_collection
   Tokens: primary=#137fec, font=Manrope, bg=#0a0c10
   Bottom nav: Inventory(active), Showcase, Studio, Settings */

const FILTER_PILLS = ["Premium", "Newest", "Status"];

const INITIAL_VEHICLE = {
  name: "",
  year: new Date().getFullYear(),
  price: "",
  category: "SUV",
  fuel: "PETROL",
  transmission: "MANUAL",
  engine: "",
  power: "",
  mileage: "",
  km: "",
  location: "",
  owner: "1st",
  images: [] as string[],
  panoramaImageIdx: null as number | null,
};

export default function InventoryPage() {
  const [activeFilter, setActiveFilter] = useState(0);
  const [sortBy, setSortBy] = useState("featured");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [newVehicle, setNewVehicle] = useState(INITIAL_VEHICLE);

  const { data, isLoading, refetch } = useApi(() => fetchVehicles({ limit: 100 }), []);

  const addVehicle = useApiMutation({
    mutationFn: async (vehicle: typeof INITIAL_VEHICLE) => {
      const res = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...vehicle,
          price: Number(vehicle.price),
          mileage: vehicle.mileage || "N/A",
          images: vehicle.images,
          panoramaImageIdx: vehicle.panoramaImageIdx,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      // If a panoramic image was selected, persist it via the dedicated PATCH route
      if (vehicle.panoramaImageIdx !== null && data.vehicle?.id) {
        await setPanoramaImage(data.vehicle.id, vehicle.panoramaImageIdx).catch(() => {});
      }
      return data;
    },
    successMessage: "Vehicle added to inventory",
    errorMessage: "Failed to add vehicle",
    onSuccess: () => {
      setAddOpen(false);
      setNewVehicle(INITIAL_VEHICLE);
      refetch();
    },
  });
  const allVehicles = (data?.vehicles ?? []).map(adaptVehicle);

  const filtered = useMemo(() => {
    let result = [...allVehicles];

    if (filters.fuel) result = result.filter((v) => v.fuel === filters.fuel);
    if (filters.transmission) result = result.filter((v) => v.transmission === filters.transmission);
    if (filters.price) {
      const [min, max] = filters.price.split("-").map(Number);
      result = result.filter((v) => v.priceNumeric >= min && v.priceNumeric <= max);
    }

    switch (sortBy) {
      case "price_asc": result.sort((a, b) => a.priceNumeric - b.priceNumeric); break;
      case "price_desc": result.sort((a, b) => b.priceNumeric - a.priceNumeric); break;
      case "newest": result.sort((a, b) => b.year - a.year); break;
      case "ai_score": result.sort((a, b) => b.aiScore - a.aiScore); break;
    }

    return result;
  }, [filters, sortBy, allVehicles]);

  return (
    <div
      className="min-h-dvh w-full text-slate-100 flex flex-col"
      style={{
        fontFamily: "'Manrope', sans-serif",
        background: "#0a0c10",
      }}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MaterialIcon name="blur_on" className="text-[30px] text-[#137fec] font-bold" />
          <h1 className="text-xl font-extrabold tracking-tight uppercase italic">Autovinci</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors"
          >
            <MaterialIcon name="search" className="text-[24px] text-slate-400" />
          </button>
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors"
          >
            <MaterialIcon name="menu" className="text-[24px] text-slate-400" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        {/* Filter Pills */}
        <div className="px-6 py-6 flex gap-3 overflow-x-auto no-scrollbar">
          {FILTER_PILLS.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => setActiveFilter(i)}
              className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-6 transition-all ${
                i === activeFilter
                  ? "bg-[#137fec] shadow-lg shadow-[#137fec]/20"
                  : "glass-panel hover:bg-slate-800"
              }`}
            >
              <p className={`text-sm font-semibold tracking-wide ${i === activeFilter ? "text-white" : "text-slate-300"}`}>
                {label}
              </p>
              <MaterialIcon
                name={i === activeFilter ? "keyboard_arrow_down" : "expand_more"}
                className={`text-[18px] ${i === activeFilter ? "text-white" : "text-slate-500"}`}
              />
            </button>
          ))}
        </div>

        {/* Inventory Cards */}
        <div className="flex flex-col gap-8 px-6">
          {isLoading && filtered.length === 0 && (
            <>
              <SkeletonCard variant="dark" />
              <SkeletonCard variant="dark" />
            </>
          )}

          {filtered.map((vehicle) => (
            <InventoryCard key={vehicle.id} vehicle={vehicle} />
          ))}

          {!isLoading && filtered.length === 0 && (
            <EmptyState
              icon="directions_car"
              title="No vehicles found"
              description="Add your first vehicle to get started"
              action={{ label: "Add Vehicle", onClick: () => setAddOpen(true) }}
            />
          )}
        </div>
      </main>

      {/* Bottom Nav — Inventory, Showcase, Studio, Settings */}
      <nav className="fixed bottom-0 left-0 right-0 glass-panel border-t border-slate-800/50 pt-2 pb-8 px-6 z-50 max-w-md mx-auto md:hidden">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <Link href="/inventory" className="flex flex-col items-center gap-1 text-[#137fec]">
            <MaterialIcon name="directions_car" fill className="text-[28px]" />
            <span className="text-[10px] font-bold tracking-tight uppercase">Inventory</span>
          </Link>
          <Link href="/showroom" className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors">
            <MaterialIcon name="storefront" className="text-[28px]" />
            <span className="text-[10px] font-medium tracking-tight uppercase">Showcase</span>
          </Link>
          <Link href="/studio" className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors">
            <MaterialIcon name="auto_awesome" className="text-[28px]" />
            <span className="text-[10px] font-medium tracking-tight uppercase">Studio</span>
          </Link>
          <Link href="/settings" className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors">
            <MaterialIcon name="settings" className="text-[28px]" />
            <span className="text-[10px] font-medium tracking-tight uppercase">Settings</span>
          </Link>
        </div>
      </nav>

      {/* Filter Bottom Sheet */}
      <BottomSheet open={filterOpen} onClose={() => setFilterOpen(false)} title="Filters">
        <div className="space-y-6">
          {INVENTORY_FILTERS.map((cat) => (
            <div key={cat.key}>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                {cat.label}
              </h4>
              <div className="flex flex-wrap gap-2">
                {cat.options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFilters((f) => ({ ...f, [cat.key]: opt.value }))}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      filters[cat.key] === opt.value
                        ? "bg-[#137fec] text-white"
                        : "glass-panel text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => { setFilters({}); setFilterOpen(false); }}
              className="flex-1 rounded-lg border border-slate-600 py-3 text-sm font-bold text-slate-300"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setFilterOpen(false)}
              className="flex-1 rounded-lg bg-[#137fec] py-3 text-sm font-bold text-white"
            >
              Apply
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* Sort Bottom Sheet */}
      <BottomSheet open={sortOpen} onClose={() => setSortOpen(false)} title="Sort By">
        <div className="space-y-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
              className={`w-full rounded-lg px-4 py-3.5 text-left text-sm font-medium transition-all ${
                sortBy === opt.value ? "bg-[#137fec]/10 text-[#137fec]" : "text-slate-300 hover:bg-white/5"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* Add Vehicle FAB */}
      <button
        type="button"
        onClick={() => setAddOpen(true)}
        className="fixed right-6 bottom-28 z-40 w-14 h-14 rounded-full bg-[#137fec] text-white shadow-xl shadow-[#137fec]/30 flex items-center justify-center active:scale-95 transition-transform"
      >
        <MaterialIcon name="add" className="text-[30px]" />
      </button>

      <CompareTray />

      {/* Add Vehicle Bottom Sheet */}
      <BottomSheet open={addOpen} onClose={() => setAddOpen(false)} title="Add Vehicle">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Vehicle Name *</label>
            <input type="text" value={newVehicle.name} onChange={(e) => setNewVehicle(v => ({ ...v, name: e.target.value }))} placeholder="e.g., Hyundai Creta SX(O)" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#137fec]/50" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Year *</label>
              <input type="number" value={newVehicle.year} onChange={(e) => setNewVehicle(v => ({ ...v, year: Number(e.target.value) }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#137fec]/50" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Price (₹) *</label>
              <input type="number" value={newVehicle.price} onChange={(e) => setNewVehicle(v => ({ ...v, price: e.target.value }))} placeholder="1450000" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#137fec]/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Category</label>
              <select value={newVehicle.category} onChange={(e) => setNewVehicle(v => ({ ...v, category: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#137fec]/50">
                <option value="SUV">SUV</option>
                <option value="SEDAN">Sedan</option>
                <option value="HATCHBACK">Hatchback</option>
                <option value="EV">EV</option>
                <option value="LUXURY">Luxury</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Fuel</label>
              <select value={newVehicle.fuel} onChange={(e) => setNewVehicle(v => ({ ...v, fuel: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#137fec]/50">
                <option value="PETROL">Petrol</option>
                <option value="DIESEL">Diesel</option>
                <option value="ELECTRIC">Electric</option>
                <option value="HYBRID">Hybrid</option>
                <option value="CNG">CNG</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Transmission</label>
              <select value={newVehicle.transmission} onChange={(e) => setNewVehicle(v => ({ ...v, transmission: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#137fec]/50">
                <option value="MANUAL">Manual</option>
                <option value="AUTOMATIC">Automatic</option>
                <option value="IMT">iMT</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">KM Driven</label>
              <input type="text" value={newVehicle.km} onChange={(e) => setNewVehicle(v => ({ ...v, km: e.target.value }))} placeholder="12,000" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#137fec]/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Engine</label>
              <input type="text" value={newVehicle.engine} onChange={(e) => setNewVehicle(v => ({ ...v, engine: e.target.value }))} placeholder="1.5L Turbo" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#137fec]/50" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Location</label>
              <input type="text" value={newVehicle.location} onChange={(e) => setNewVehicle(v => ({ ...v, location: e.target.value }))} placeholder="Delhi NCR" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#137fec]/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Power</label>
              <input type="text" value={newVehicle.power} onChange={(e) => setNewVehicle(v => ({ ...v, power: e.target.value }))} placeholder="115 bhp" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#137fec]/50" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Owner</label>
              <select value={newVehicle.owner} onChange={(e) => setNewVehicle(v => ({ ...v, owner: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#137fec]/50">
                <option value="1st">1st Owner</option>
                <option value="2nd">2nd Owner</option>
                <option value="3rd">3rd Owner</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Photos</label>
            <ImageUploader
              images={newVehicle.images}
              onChange={(imgs) => setNewVehicle(v => ({ ...v, images: imgs }))}
              max={10}
              panoramaImageIdx={newVehicle.panoramaImageIdx}
              onPanoramaChange={(idx) => setNewVehicle(v => ({ ...v, panoramaImageIdx: idx }))}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setAddOpen(false); setNewVehicle(INITIAL_VEHICLE); }} className="flex-1 rounded-lg border border-slate-600 py-3 text-sm font-bold text-slate-300">
              Cancel
            </button>
            <button
              type="button"
              disabled={!newVehicle.name.trim() || !newVehicle.price || addVehicle.isSubmitting}
              onClick={() => addVehicle.mutate(newVehicle)}
              className="flex-1 rounded-lg bg-[#137fec] py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              {addVehicle.isSubmitting ? "Adding..." : "Add Vehicle"}
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

/* Card matching stitch: 4:5 aspect, text-gradient name, AI Studio button */
function InventoryCard({ vehicle }: { vehicle: Vehicle }) {
  const status = STATUS_DISPLAY[vehicle.status];
  const { isInCompare, addToCompare, removeFromCompare, isFull } = useCompare();
  const inCompare = isInCompare(vehicle.id);

  return (
    <div className="group relative flex flex-col rounded-xl overflow-hidden shadow-2xl transition-transform active:scale-[0.98]">
      <Link href={`/showcase/${vehicle.id}`} className="relative aspect-[4/5] sm:aspect-video w-full overflow-hidden">
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          fill
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          {vehicle.aiTag && (
            <Badge variant="ai" label="AI Enhanced" />
          )}
          {status && (
            <Badge variant="status" label={status.label} color={status.color} dotColor={status.dot} />
          )}
        </div>

        {/* 360° Tour badge — shown when a panoramic image is marked */}
        {vehicle.panoramaImageIdx !== null && (
          <Link
            href={`/virtual-tour/${vehicle.id}`}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-20 right-4 z-10 flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-white transition-transform active:scale-95"
            style={{ background: "rgba(19,127,236,0.88)", backdropFilter: "blur(8px)", border: "1px solid rgba(19,127,236,0.6)" }}
          >
            <MaterialIcon name="360" className="text-[14px]" />
            Tour
          </Link>
        )}

        {/* Compare toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            inCompare ? removeFromCompare(vehicle.id) : addToCompare(vehicle.id);
          }}
          className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 ${
            inCompare
              ? "bg-[#137fec] shadow-lg shadow-[#137fec]/40"
              : isFull
              ? "bg-white/10 opacity-40 cursor-not-allowed"
              : "bg-black/40 backdrop-blur-md hover:bg-[#137fec]/40"
          }`}
          disabled={!inCompare && isFull}
          title={inCompare ? "Remove from compare" : "Add to compare"}
        >
          <MaterialIcon name="compare_arrows" className="text-white text-[18px]" />
        </button>

        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-1">
          <p className="text-slate-400 text-xs font-semibold tracking-[0.2em] uppercase">
            {vehicle.year} Model
          </p>
          <h3 className="text-2xl font-bold text-gradient tracking-tight">
            {vehicle.name}
          </h3>
          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-col">
              <span className="text-white text-xl font-light">{vehicle.price}</span>
              <span className="text-slate-500 text-[10px] font-medium tracking-wide">
                {vehicle.km} km &bull; {vehicle.fuel}
              </span>
            </div>
            <Link
              href={`/content-studio?vehicleId=${vehicle.id}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-2 glass-panel border border-[#137fec]/40 bg-[#137fec]/10 px-5 py-2.5 rounded-xl hover:bg-[#137fec]/20 transition-all active:scale-95"
            >
              <MaterialIcon name="auto_fix_high" className="text-[20px] text-[#137fec]" />
              <span className="text-white text-xs font-bold tracking-wider uppercase">AI Studio</span>
            </Link>
          </div>
        </div>
      </Link>
    </div>
  );
}

/* Sticky compare tray — appears when ≥1 car is selected */
function CompareTray() {
  const { compareCount, clearCompare } = useCompare();
  if (compareCount === 0) return null;

  return (
    <div className="fixed left-1/2 -translate-x-1/2 bottom-24 z-50 w-[calc(100%-3rem)] max-w-sm">
      <div
        className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3"
        style={{ background: "#0f1623", border: "1px solid rgba(19,127,236,0.4)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
      >
        <div className="flex items-center gap-2">
          <MaterialIcon name="compare_arrows" className="text-[#137fec]" />
          <span className="text-white text-sm font-bold">
            {compareCount} car{compareCount > 1 ? "s" : ""} selected
          </span>
          {compareCount < 2 && (
            <span className="text-slate-400 text-xs">— add 1 more</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={clearCompare} className="text-slate-400 text-xs hover:text-white">
            Clear
          </button>
          {compareCount >= 2 && (
            <Link
              href="/compare"
              className="bg-[#137fec] text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              Compare Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
