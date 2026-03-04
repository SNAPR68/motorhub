"use client";

import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerAppShell } from "@/components/BuyerAppShell";
import { useApi } from "@/lib/hooks/use-api";
import { fetchVehicles, adaptVehicle } from "@/lib/api";
import { BLUR_DATA_URL } from "@/lib/car-images";
import { capitalize } from "@/lib/seo";

export default function UsedCarsCityBrandClient({
  city,
  brand,
}: {
  city: string;
  brand: string;
}) {
  const cityName = capitalize(city);
  const brandName = capitalize(brand);

  const { data, isLoading } = useApi(
    () => fetchVehicles({ status: "AVAILABLE", city, brand, limit: 20 }),
    [city, brand]
  );
  const vehicles = (data?.vehicles ?? []).map(adaptVehicle);

  return (
    <BuyerAppShell>
    <div
      className="min-h-dvh w-full "
      style={{ background: "#0A1628", color: "#e2e8f0" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-white/5"
        style={{
          background: "rgba(10,22,40,0.97)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href={`/used-cars/${city}`}
              className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <MaterialIcon
                name="arrow_back"
                className="text-[20px] text-slate-300"
              />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-white">
                {brandName} Used Cars in {cityName}
              </h1>
              <p className="text-[11px] text-slate-500">
                {isLoading ? "Loading..." : `${vehicles.length} listings found`}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Brand highlight */}
      <div className="max-w-lg mx-auto px-4 pt-4">
        <div
          className="rounded-2xl p-4 border flex items-center gap-4"
          style={{
            background: "rgba(59,130,246,0.06)",
            borderColor: "rgba(59,130,246,0.15)",
          }}
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl shrink-0"
            style={{ background: "rgba(59,130,246,0.15)" }}
          >
            <MaterialIcon
              name="verified"
              className="text-[24px]"
              style={{ color: "#3B82F6" }}
            />
          </div>
          <div>
            <p className="text-sm font-bold text-white">{brandName}</p>
            <p className="text-[11px] text-slate-400">
              Verified listings in {cityName} &middot; Inspected &amp; certified
            </p>
          </div>
        </div>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <main className="max-w-lg mx-auto px-4 pt-4">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex rounded-2xl overflow-hidden border animate-pulse"
                style={{
                  background: "rgba(255,255,255,0.035)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                <div className="w-36 h-28 bg-white/5" />
                <div className="flex-1 p-3 space-y-2">
                  <div className="h-3 w-16 bg-white/10 rounded" />
                  <div className="h-4 w-28 bg-white/10 rounded" />
                  <div className="h-3 w-20 bg-white/10 rounded" />
                  <div className="h-5 w-24 bg-white/10 rounded" />
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* Listings */}
      {!isLoading && (
        <main className="max-w-lg mx-auto px-4 pt-4">
          <div className="space-y-3">
            {vehicles.map((car) => (
              <Link
                key={car.id}
                href={`/vehicle/${car.id}`}
                className="flex rounded-2xl overflow-hidden border transition-all active:scale-[0.99] hover:border-white/12"
                style={{
                  background: "rgba(255,255,255,0.035)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                {/* Image */}
                <div
                  className="relative w-36 shrink-0 flex items-center justify-center"
                  style={{
                    minHeight: "120px",
                    background: "rgba(255,255,255,0.04)",
                  }}
                >
                  {car.image ? (
                    <Image
                      src={car.image}
                      alt={car.name}
                      fill
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                      sizes="144px"
                    />
                  ) : (
                    <MaterialIcon
                      name="directions_car"
                      className="text-[36px] text-slate-700"
                    />
                  )}
                  <span
                    className="absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white"
                    style={{ background: "rgba(16,185,129,0.9)" }}
                  >
                    {car.owner}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                  <div>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                      {brandName}
                    </p>
                    <h3 className="text-[13px] font-bold text-white leading-tight truncate">
                      {car.name}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {car.year} &middot; {car.km}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 my-2">
                    {[car.fuel, car.transmission].map((val) => (
                      <span
                        key={val}
                        className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-slate-400 border"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          borderColor: "rgba(255,255,255,0.08)",
                        }}
                      >
                        {val}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-black text-white">
                      {car.price}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {car.location || cityName}
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            {vehicles.length === 0 && (
              <div className="text-center py-12">
                <MaterialIcon name="directions_car" className="text-[48px] text-slate-600 mb-3" />
                <p className="text-slate-400 text-sm">
                  No used {brandName} cars in {cityName} yet.
                </p>
                <Link href={`/used-cars/${city}`} className="text-blue-400 text-xs mt-2 inline-block">
                  View all used cars in {cityName}
                </Link>
              </div>
            )}
          </div>
        </main>
      )}
    </div>
    </BuyerAppShell>
  );
}
