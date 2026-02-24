"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { MaterialIcon } from "@/components/MaterialIcon";
import { Badge } from "@/components/ui/Badge";
import { BLUR_DATA_URL } from "@/lib/car-images";
import { STATUS_DISPLAY } from "@/lib/constants";
import type { Vehicle } from "@/lib/types";

type CardVariant = "inventory" | "showcase" | "compact";

interface VehicleCardProps {
  vehicle: Vehicle;
  variant?: CardVariant;
  isWishlisted?: boolean;
  onToggleWishlist?: (id: string) => void;
  onAddCompare?: (id: string) => void;
  className?: string;
}

export function VehicleCard({
  vehicle,
  variant = "inventory",
  isWishlisted,
  onToggleWishlist,
  onAddCompare,
  className,
}: VehicleCardProps) {
  const status = STATUS_DISPLAY[vehicle.status];

  // ── Compact variant (horizontal card for dashboards/lists) ──
  if (variant === "compact") {
    return (
      <Link
        href={`/showcase/${vehicle.id}`}
        className={cn(
          "flex items-center gap-4 rounded-xl glass-panel p-3 transition-all active:scale-[0.98]",
          className
        )}
      >
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={vehicle.image}
            alt={vehicle.name}
            fill
            sizes="112px"
            className="object-cover"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
          {vehicle.aiTag && (
            <div className="absolute top-1.5 left-1.5">
              <MaterialIcon name="auto_awesome" className="text-[14px] text-[#7C3AED]" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-400 font-semibold tracking-wide">
            {vehicle.year} Model
          </p>
          <h3 className="font-bold text-white truncate">{vehicle.name}</h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm font-light text-white">
              {vehicle.price}
            </span>
            {vehicle.badge && (
              <Badge variant="pill" label={vehicle.badge} />
            )}
          </div>
        </div>
      </Link>
    );
  }

  // ── Showcase variant (wide 21:9 for wishlist) ──
  if (variant === "showcase") {
    return (
      <div className={cn("group relative flex flex-col gap-4", className)}>
        <Link
          href={`/showcase/${vehicle.id}`}
          className="relative aspect-[21/9] w-full overflow-hidden rounded-xl shadow-lg"
        >
          <Image
            src={vehicle.image}
            alt={vehicle.name}
            fill
            sizes="(max-width: 430px) 100vw, 430px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {vehicle.aiTag && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-primary/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
              <MaterialIcon name="auto_awesome" className="text-[14px]" />
              AI Verified
            </div>
          )}
        </Link>

        {onToggleWishlist && (
          <button
            type="button"
            onClick={() => onToggleWishlist(vehicle.id)}
            className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/20 backdrop-blur-md"
          >
            <MaterialIcon
              name="favorite"
              fill={isWishlisted}
              className={cn(
                "text-[20px] transition-colors",
                isWishlisted ? "text-primary" : "text-white"
              )}
            />
          </button>
        )}

        <div className="flex flex-col gap-1 px-1">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-xl font-bold tracking-tight text-slate-100">
              {vehicle.year} {vehicle.name}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span className="font-bold text-slate-200">{vehicle.price}</span>
            <span className="flex items-center gap-1 text-emerald-400 text-xs">
              AI Score: {vehicle.aiScore}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 uppercase tracking-widest font-semibold">
            {vehicle.km} km &bull; {vehicle.fuel} &bull; {vehicle.transmission}
          </p>
        </div>
      </div>
    );
  }

  // ── Inventory variant (default, full card with gradient overlay) ──
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl shadow-2xl transition-transform active:scale-[0.98]",
        className
      )}
    >
      <Link
        href={`/showcase/${vehicle.id}`}
        className="relative aspect-[4/5] w-full overflow-hidden"
      >
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          fill
          sizes="(max-width: 430px) 100vw, 430px"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />

        <div className="absolute top-4 left-4 z-10 flex gap-2">
          {vehicle.aiTag && <Badge variant="ai" label="AI Enhanced" />}
          {status && (
            <Badge
              variant="status"
              label={status.label}
              color={status.color}
              dotColor={status.dot}
            />
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-1">
          <p className="text-slate-400 text-xs font-semibold tracking-[0.2em] uppercase">
            {vehicle.year} Model
          </p>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            {vehicle.name}
          </h3>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-white text-xl font-light">
                {vehicle.price}
              </span>
              <span className="text-slate-500 text-[10px] font-medium tracking-wide">
                {vehicle.km} km &bull; {vehicle.fuel}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {onAddCompare && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onAddCompare(vehicle.id);
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full glass-panel border border-white/10 transition-all hover:border-primary/40 active:scale-95"
                >
                  <MaterialIcon name="compare" className="text-[18px] text-slate-300" />
                </button>
              )}
              {onToggleWishlist && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onToggleWishlist(vehicle.id);
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full glass-panel border border-white/10 transition-all hover:border-primary/40 active:scale-95"
                >
                  <MaterialIcon
                    name="favorite"
                    fill={isWishlisted}
                    className={cn(
                      "text-[18px] transition-colors",
                      isWishlisted ? "text-primary" : "text-slate-300"
                    )}
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
