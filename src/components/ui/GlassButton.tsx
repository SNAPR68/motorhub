"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type ButtonVariant = "glass" | "primary" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface GlassButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

const variantClasses: Record<ButtonVariant, string> = {
  glass:
    "glass-effect text-white hover:bg-white/10 active:scale-95",
  primary:
    "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-95",
  outline:
    "border border-slate-600 text-slate-200 hover:border-primary hover:text-primary active:scale-95",
};

export function GlassButton({
  variant = "glass",
  size = "md",
  icon,
  children,
  href,
  onClick,
  className,
  disabled,
}: GlassButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-bold transition-all",
    sizeClasses[size],
    variantClasses[variant],
    disabled && "opacity-50 pointer-events-none",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {icon}
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes} disabled={disabled}>
      {icon}
      {children}
    </button>
  );
}
