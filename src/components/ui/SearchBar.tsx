"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { MaterialIcon } from "@/components/MaterialIcon";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  variant?: "dark" | "light";
  className?: string;
}

export function SearchBar({
  placeholder = "Search vehicles...",
  value,
  onChange,
  variant = "dark",
  className,
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl px-4 py-3 transition-all",
        variant === "dark"
          ? cn(
              "glass-effect",
              focused && "border-primary/40 bg-white/10"
            )
          : cn(
              "border border-slate-200 bg-white",
              focused && "border-primary ring-2 ring-primary/10"
            ),
        className
      )}
    >
      <MaterialIcon
        name="search"
        className={cn(
          "text-[20px] shrink-0",
          variant === "dark" ? "text-slate-400" : "text-slate-400"
        )}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className={cn(
          "flex-1 bg-transparent text-sm outline-none placeholder:text-slate-500",
          variant === "dark" ? "text-white" : "text-slate-900"
        )}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-slate-400 hover:text-slate-200"
        >
          <MaterialIcon name="close" className="text-[18px]" />
        </button>
      )}
    </div>
  );
}
