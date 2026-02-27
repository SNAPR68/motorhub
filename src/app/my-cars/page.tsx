"use client";

import Link from "next/link";
import Image from "next/image";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BLUR_DATA_URL } from "@/lib/car-images";
import { useApi } from "@/lib/hooks/use-api";
import { fetchWishlist, adaptVehicle } from "@/lib/api";
import type { DbVehicle } from "@/lib/api";
import { EmptyState } from "@/components/ui/EmptyState";

/* Stitch: premium_ownership_dashboard — #dab80b, Space Grotesk, #16150d */

const DOCUMENTS = [
  { icon: "description", title: "Title", desc: "Digital Certified Copy" },
  { icon: "shield", title: "Insurance", desc: "Expires 14 Jan 2027" },
  { icon: "history", title: "Service Log", desc: "12 Digital Records" },
];

export default function MyCarsPage() {
  const { data, isLoading } = useApi(() => fetchWishlist(), []);

  const vehicles = (data?.vehicles ?? []).map((v: DbVehicle) => adaptVehicle(v));
  const primaryCar = vehicles[0] ?? null;

  return (
    <div
      className="relative flex min-h-dvh w-full flex-col text-slate-100"
      style={{ fontFamily: "'Space Grotesk', sans-serif", background: "#16150d" }}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#16150d]/80 backdrop-blur-md px-6 pt-12 pb-4">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="size-12 rounded-full border-2 border-[#dab80b]/30 p-0.5 bg-[#221f10] flex items-center justify-center">
                <MaterialIcon name="person" className="text-[#dab80b] text-2xl" />
              </div>
              <div className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-[#16150d] rounded-full" />
            </div>
            <div>
              <p className="text-xs text-[#dab80b]/60 uppercase tracking-widest font-bold">
                My Collection
              </p>
              <h1 className="text-xl font-bold tracking-tight">My Garage</h1>
            </div>
          </div>
          <Link
            href="/notifications/history"
            className="size-10 flex items-center justify-center rounded-full bg-[#221f10] border border-[#342f18] text-[#dab80b]"
          >
            <MaterialIcon name="notifications" className="text-[22px]" />
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-lg mx-auto px-6 pb-24">
        {/* Loading */}
        {isLoading && (
          <div className="mt-6 space-y-4">
            <div className="aspect-[16/10] rounded-2xl bg-[#221f10] animate-pulse" />
            <div className="h-4 w-2/3 rounded bg-[#221f10] animate-pulse" />
            <div className="h-4 w-1/3 rounded bg-[#221f10] animate-pulse" />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && vehicles.length === 0 && (
          <div className="mt-16">
            <EmptyState
              icon="garage"
              title="Your garage is empty"
              description="Add cars to your wishlist to see them here. Start browsing the showroom to find your dream car."
              action={{
                label: "Browse Showroom",
                onClick: () => { window.location.href = "/showroom"; },
              }}
              variant="dark"
            />
          </div>
        )}

        {/* Hero Vehicle Card — first wishlisted car */}
        {!isLoading && primaryCar && (
          <section className="mt-6">
            <Link href={`/vehicle/${primaryCar.id}`}>
              <div className="relative overflow-hidden rounded-2xl bg-[#221f10] border border-[#342f18] shadow-2xl group">
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#dab80b] text-[#16150d] text-[10px] font-bold uppercase tracking-wider">
                    <MaterialIcon name="favorite" className="text-sm" />
                    Wishlisted
                  </span>
                </div>
                <div className="aspect-[16/10] w-full relative">
                  {primaryCar.image ? (
                    <Image
                      alt={primaryCar.name}
                      fill
                      sizes="(max-width: 512px) 100vw, 512px"
                      className="object-cover"
                      src={primaryCar.image}
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#221f10]">
                      <MaterialIcon name="directions_car" className="text-slate-600 text-6xl" />
                    </div>
                  )}
                </div>
                <div className="p-5 bg-gradient-to-t from-[#16150d] to-transparent">
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-2xl font-bold text-white tracking-tight">
                        {primaryCar.name}
                      </h2>
                      <p className="text-[#dab80b]/80 font-mono text-sm mt-1">
                        {primaryCar.year} &bull; {primaryCar.km} km
                      </p>
                    </div>
                    <span className="text-lg font-bold text-[#dab80b]">
                      {primaryCar.price}
                    </span>
                  </div>
                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-[#342f18]">
                    <div className="text-center">
                      <p className="text-[10px] uppercase text-slate-500 tracking-tighter">
                        Fuel
                      </p>
                      <p className="text-sm font-bold">{primaryCar.fuel}</p>
                    </div>
                    <div className="text-center border-x border-[#342f18]">
                      <p className="text-[10px] uppercase text-slate-500 tracking-tighter">
                        AI Score
                      </p>
                      <p className="text-sm font-bold">
                        {primaryCar.aiScore > 0 ? primaryCar.aiScore : "—"}
                        {primaryCar.aiScore > 0 && <span className="text-[10px] text-slate-500">/100</span>}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] uppercase text-slate-500 tracking-tighter">
                        Trans
                      </p>
                      <p className="text-sm font-bold">{primaryCar.transmission}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Other Wishlisted Cars */}
        {!isLoading && vehicles.length > 1 && (
          <section className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold tracking-tight">
                More in Your Garage
              </h3>
              <span className="text-xs text-[#dab80b] font-bold px-2 py-0.5 bg-[#dab80b]/10 rounded">
                {vehicles.length} cars
              </span>
            </div>
            <div className="space-y-3">
              {vehicles.slice(1).map((car) => (
                <Link
                  key={car.id}
                  href={`/vehicle/${car.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#221f10] border border-[#342f18] active:scale-[0.98] transition-transform"
                >
                  <div className="w-20 h-14 rounded-lg overflow-hidden shrink-0 border border-[#342f18] relative">
                    {car.image ? (
                      <Image
                        src={car.image}
                        alt={car.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL={BLUR_DATA_URL}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MaterialIcon name="directions_car" className="text-slate-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">{car.name}</p>
                    <p className="text-[10px] text-slate-500">
                      {car.year} &bull; {car.km} km &bull; {car.fuel}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-extrabold text-[#dab80b]">{car.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Documents Vault */}
        {!isLoading && vehicles.length > 0 && (
          <section className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold tracking-tight">Documents Vault</h3>
              <button className="text-xs text-[#dab80b] font-bold">Manage All</button>
            </div>
            <div className="flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {DOCUMENTS.map((doc) => (
                <div
                  key={doc.title}
                  className="flex-none w-40 bg-[#221f10] border border-[#342f18] rounded-xl p-4 flex flex-col gap-3"
                >
                  <div className="size-10 rounded-lg bg-[#16150d] border border-[#342f18] flex items-center justify-center">
                    <MaterialIcon name={doc.icon} className="text-[#dab80b]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{doc.title}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{doc.desc}</p>
                  </div>
                  <button className="mt-2 w-full py-2 bg-[#dab80b]/10 rounded-lg text-[#dab80b] text-[10px] font-bold uppercase tracking-widest">
                    Open
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Premium Services */}
        <section className="mt-8 mb-10">
          <h3 className="text-lg font-bold tracking-tight mb-4">
            Premium Services
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/concierge"
              className="bg-[#221f10] border border-[#342f18] rounded-2xl p-4 flex items-center gap-3"
            >
              <MaterialIcon name="support_agent" className="text-[#dab80b]" />
              <span className="text-sm font-medium">Concierge</span>
            </Link>
            <Link
              href="/showroom"
              className="bg-[#221f10] border border-[#342f18] rounded-2xl p-4 flex items-center gap-3"
            >
              <MaterialIcon name="storefront" className="text-[#dab80b]" />
              <span className="text-sm font-medium">Showroom</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-[#16150d]/90 backdrop-blur-xl border-t border-[#342f18] px-6 pt-3 pb-8 z-[100] md:hidden">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex flex-col items-center gap-1 text-slate-500"
          >
            <MaterialIcon name="house" />
            <span className="text-[10px] font-bold tracking-wide">HOME</span>
          </Link>
          <Link
            href="/my-cars"
            className="flex flex-col items-center gap-1 text-[#dab80b]"
          >
            <MaterialIcon name="garage" fill />
            <span className="text-[10px] font-bold tracking-wide">GARAGE</span>
          </Link>
          <div className="relative -mt-10">
            <Link
              href="/showroom"
              className="size-14 rounded-full bg-[#dab80b] text-[#16150d] shadow-xl shadow-[#dab80b]/20 flex items-center justify-center border-4 border-[#16150d]"
            >
              <MaterialIcon name="search" className="text-3xl" />
            </Link>
          </div>
          <Link
            href="/concierge"
            className="flex flex-col items-center gap-1 text-slate-500"
          >
            <MaterialIcon name="smart_toy" />
            <span className="text-[10px] font-bold tracking-wide">AI</span>
          </Link>
          <Link
            href="/wishlist"
            className="flex flex-col items-center gap-1 text-slate-500"
          >
            <MaterialIcon name="favorite" />
            <span className="text-[10px] font-bold tracking-wide">SAVED</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
