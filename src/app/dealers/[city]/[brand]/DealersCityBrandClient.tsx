"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";
import { BuyerAppShell } from "@/components/BuyerAppShell";
import { useApi } from "@/lib/hooks/use-api";
import { fetchDealerSearch } from "@/lib/api";
import type { PublicDealer } from "@/lib/api";
import { capitalize } from "@/lib/seo";

export default function DealersCityBrandClient({
  city,
  brand,
}: {
  city: string;
  brand: string;
}) {
  const cityName = capitalize(city);
  const brandName = capitalize(brand);

  const { data, isLoading } = useApi(
    () => fetchDealerSearch({ city, brand, limit: 20 }),
    [city, brand]
  );
  const dealers: PublicDealer[] = data?.dealers ?? [];

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
              href={`/dealers/${city}`}
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
                {brandName} Dealers in {cityName}
              </h1>
              <p className="text-[11px] text-slate-500">
                {isLoading ? "Loading..." : `${dealers.length} showrooms found`}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        {/* Brand banner */}
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
            <p className="text-sm font-bold text-white">
              {brandName} Authorized Dealers
            </p>
            <p className="text-[11px] text-slate-400">
              Official showrooms in {cityName}
            </p>
          </div>
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl p-4 border animate-pulse"
                style={{
                  background: "rgba(255,255,255,0.035)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex gap-3">
                  <div className="h-11 w-11 rounded-xl bg-white/10" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-40 bg-white/10 rounded" />
                    <div className="h-3 w-24 bg-white/10 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dealer cards */}
        {!isLoading && (
          <div className="space-y-3">
            {dealers.map((dealer) => (
              <div
                key={dealer.id}
                className="rounded-2xl overflow-hidden border p-4 transition-all hover:border-white/12"
                style={{
                  background: "rgba(255,255,255,0.035)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl shrink-0"
                      style={{ background: "rgba(16,185,129,0.12)" }}
                    >
                      <MaterialIcon
                        name="storefront"
                        className="text-[22px]"
                        style={{ color: "#10b981" }}
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[14px] font-bold text-white truncate">
                        {dealer.dealershipName}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <MaterialIcon name="directions_car" className="text-[13px] text-blue-400" />
                        <span className="text-[11px] font-bold text-blue-400">
                          {dealer.vehicleCount} vehicles
                        </span>
                      </div>
                    </div>
                  </div>
                  {(dealer.plan === "ENTERPRISE" || dealer.plan === "GROWTH") && (
                    <span
                      className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0"
                      style={{
                        background: "rgba(245,158,11,0.12)",
                        color: "#f59e0b",
                      }}
                    >
                      Verified
                    </span>
                  )}
                </div>

                {/* Address */}
                {(dealer.address || dealer.city) && (
                  <div className="flex items-center gap-1.5 mt-3">
                    <MaterialIcon
                      name="location_on"
                      className="text-[14px] text-slate-500 shrink-0"
                    />
                    <p className="text-[11px] text-slate-400">
                      {dealer.address ? `${dealer.address}, ` : ""}{cityName}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <Link
                    href={`/dealers/profile/${dealer.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl text-[11px] font-semibold text-white"
                    style={{ background: "#3B82F6" }}
                  >
                    <MaterialIcon name="visibility" className="text-[15px]" />
                    View Details
                  </Link>
                  {dealer.phone && (
                    <a
                      href={`tel:${dealer.phone}`}
                      className="flex items-center justify-center gap-1.5 h-9 rounded-xl px-4 text-[11px] font-semibold border"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        borderColor: "rgba(255,255,255,0.1)",
                        color: "#94a3b8",
                      }}
                    >
                      <MaterialIcon name="call" className="text-[15px]" />
                      Call
                    </a>
                  )}
                </div>
              </div>
            ))}

            {dealers.length === 0 && (
              <div className="text-center py-12">
                <MaterialIcon name="storefront" className="text-[48px] text-slate-600 mb-3" />
                <p className="text-slate-400 text-sm">
                  No {brandName} dealers found in {cityName} yet.
                </p>
                <Link href={`/dealers/${city}`} className="text-blue-400 text-xs mt-2 inline-block">
                  View all dealers in {cityName}
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
    </BuyerAppShell>
  );
}
