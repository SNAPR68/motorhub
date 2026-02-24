"use client";

import { cn } from "@/lib/utils";
import { MaterialIcon } from "@/components/MaterialIcon";
import type { Vehicle } from "@/lib/types";

interface VehicleSpecsGridProps {
  vehicle: Vehicle;
  variant?: "dark" | "light";
  cols?: 3 | 4;
  className?: string;
}

const SPEC_ICONS: Record<string, string> = {
  km: "speed",
  fuel: "local_gas_station",
  year: "calendar_month",
  transmission: "settings",
  power: "bolt",
  mileage: "trending_up",
};

export function VehicleSpecsGrid({
  vehicle,
  variant = "dark",
  cols = 3,
  className,
}: VehicleSpecsGridProps) {
  const specs = [
    { key: "km", label: "Kilometers", value: vehicle.km },
    { key: "fuel", label: "Fuel", value: vehicle.fuel },
    { key: "transmission", label: "Transmission", value: vehicle.transmission },
    { key: "power", label: "Power", value: vehicle.power },
    { key: "mileage", label: "Mileage", value: vehicle.mileage },
    { key: "year", label: "Year", value: String(vehicle.year) },
  ];

  return (
    <div
      className={cn(
        "grid gap-6",
        cols === 3 ? "grid-cols-3" : "grid-cols-4",
        className
      )}
    >
      {specs.slice(0, cols === 3 ? 6 : 8).map((spec) => {
        const iconName = SPEC_ICONS[spec.key] || "speed";
        return (
          <div key={spec.key} className="flex flex-col items-center gap-2">
            <MaterialIcon
              name={iconName}
              className={cn(
                "text-[28px]",
                variant === "dark"
                  ? "text-primary/80"
                  : "text-primary"
              )}
            />
            <div className="text-center">
              <p
                className={cn(
                  "text-[10px] uppercase tracking-widest font-medium",
                  variant === "dark" ? "text-slate-500" : "text-slate-400"
                )}
              >
                {spec.label}
              </p>
              <p
                className={cn(
                  "text-sm font-medium mt-0.5",
                  variant === "dark" ? "text-white" : "text-slate-900"
                )}
              >
                {spec.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
