"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useWishlist } from "@/context/WishlistContext";
import { BLUR_DATA_URL } from "@/lib/car-images";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicles, adaptVehicle } from "@/lib/api";

/* Stitch: private_collection_wishlist — #f2cc0d (gold), Noto Sans + Noto Serif, #0a0a0a */

const AI_TAGS = ["Price Drop", "Low Stock", "Investment Grade"];

export default function WishlistPage() {
  const { wishlistIds, isWishlisted, toggleWishlist, wishlistCount } =
    useWishlist();
  const [activeTab, setActiveTab] = useState(0);
  const { data } = useApi(() => fetchVehicles({ limit: 100 }), []);
  const allVehicles = (data?.vehicles ?? []).map(adaptVehicle);

  const wishlistedVehicles = allVehicles.filter((v) =>
    wishlistIds.includes(v.id)
  );

  return (
    <div
      className="relative flex min-h-dvh w-full max-w-md mx-auto flex-col overflow-x-hidden text-slate-100 antialiased"
      style={{ fontFamily: "'Noto Sans', sans-serif", background: "#0a0a0a" }}
    >
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#2a2a2a] px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="flex items-center justify-center size-10 rounded-full hover:bg-[#2a2a2a] transition-colors"
          >
            <MaterialIcon name="arrow_back_ios_new" className="text-2xl" />
          </Link>
          <h1
            className="text-xl font-bold tracking-tight"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            My Collection
          </h1>
          <button className="flex items-center justify-center size-10 rounded-full hover:bg-[#2a2a2a] transition-colors">
            <MaterialIcon name="search" className="text-2xl" />
          </button>
        </div>
        {/* Segmented Control */}
        <div className="flex p-1 bg-[#2a2a2a] rounded-xl">
          {["Active Interests", "Past Viewed"].map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === i
                  ? "bg-[#0a0a0a] shadow-sm text-[#f2cc0d]"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Wishlist Feed */}
      <main className="flex-1 px-4 py-6 space-y-8 pb-24">
        {activeTab === 0 && (
          <>
            {wishlistedVehicles.length === 0 ? (
              <div className="py-20 text-center">
                <MaterialIcon
                  name="favorite"
                  className="text-[48px] text-slate-700 mx-auto mb-4"
                />
                <h3 className="text-lg font-bold text-white mb-2">
                  No saved vehicles yet
                </h3>
                <p className="text-sm text-slate-400 mb-6 max-w-xs mx-auto">
                  Browse our inventory and tap the heart icon to save vehicles
                  you&apos;re interested in.
                </p>
                <Link
                  href="/inventory"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#f2cc0d] px-6 py-3 text-sm font-bold text-[#0a0a0a]"
                >
                  Browse Inventory
                </Link>
              </div>
            ) : (
              wishlistedVehicles.map((vehicle, i) => (
                <div key={vehicle.id} className="group relative flex flex-col gap-4">
                  <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl bg-[#1a1a1a] shadow-lg">
                    <Image
                      alt={vehicle.name}
                      fill
                      sizes="(max-width: 448px) 100vw, 448px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      src={vehicle.image}
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {/* Wishlist Heart */}
                    <button
                      onClick={() => toggleWishlist(vehicle.id)}
                      className="absolute top-3 right-3 z-10 size-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md"
                    >
                      <MaterialIcon
                        name="favorite"
                        fill
                        className="text-[#f2cc0d]"
                      />
                    </button>
                    {/* AI Tag */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2cc0d]/90 text-[#0a0a0a] text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
                      <MaterialIcon
                        name={
                          i % 3 === 0
                            ? "auto_awesome"
                            : i % 3 === 1
                            ? "inventory_2"
                            : "verified"
                        }
                        className="text-xs"
                      />
                      {AI_TAGS[i % 3]}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 px-1">
                    <div className="flex items-baseline justify-between">
                      <h2
                        className="text-2xl font-bold tracking-tight"
                        style={{ fontFamily: "'Noto Serif', serif" }}
                      >
                        {vehicle.year} {vehicle.name}
                      </h2>
                      {vehicle.badge && (
                        <span className="text-xs font-bold text-[#f2cc0d] bg-[#f2cc0d]/10 px-2 py-0.5 rounded">
                          {vehicle.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <span
                        className="italic"
                        style={{ fontFamily: "'Noto Serif', serif" }}
                      >
                        Market Value:
                      </span>
                      <span className="font-bold text-slate-200">
                        {vehicle.price}
                      </span>
                      <span className="flex items-center text-emerald-500 font-medium">
                        <MaterialIcon name="trending_up" className="text-sm" />
                        Trending
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">
                      {vehicle.fuel} {"\u2022"} {vehicle.engine} {"\u2022"}{" "}
                      {vehicle.power}
                    </p>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === 1 && (
          <div className="py-20 text-center">
            <p className="text-sm text-slate-400">
              Recently viewed vehicles will appear here
            </p>
          </div>
        )}
      </main>

      {/* FAB */}
      <div className="fixed bottom-24 right-4 z-20">
        <Link
          href="/inventory"
          className="size-14 rounded-full bg-[#f2cc0d] text-[#0a0a0a] shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        >
          <MaterialIcon name="add" className="text-3xl font-bold" />
        </Link>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 mx-auto max-w-md bg-[#0a0a0a]/95 backdrop-blur-lg border-t border-[#2a2a2a] px-6 pb-8 pt-3">
        <div className="flex items-center justify-between">
          <Link
            href="/inventory"
            className="flex flex-col items-center gap-1 text-slate-500"
          >
            <MaterialIcon name="directions_car" className="text-2xl" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Inventory
            </span>
          </Link>
          <Link
            href="/wishlist"
            className="flex flex-col items-center gap-1 text-[#f2cc0d]"
          >
            <MaterialIcon name="favorite" fill className="text-2xl" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Collection
            </span>
          </Link>
          <Link
            href="/dashboard"
            className="flex flex-col items-center gap-1 text-slate-500"
          >
            <MaterialIcon name="monitoring" className="text-2xl" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Insights
            </span>
          </Link>
          <Link
            href="/login/buyer"
            className="flex flex-col items-center gap-1 text-slate-500"
          >
            <MaterialIcon name="person" className="text-2xl" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Profile
            </span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
