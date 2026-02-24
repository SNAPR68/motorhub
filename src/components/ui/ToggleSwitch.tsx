"use client";

import { cn } from "@/lib/utils";

interface ToggleSwitchProps {
  active: boolean;
  onChange: () => void;
  className?: string;
}

export function ToggleSwitch({ active, onChange, className }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      onClick={onChange}
      className={cn("toggle-switch", active && "active", className)}
    />
  );
}
