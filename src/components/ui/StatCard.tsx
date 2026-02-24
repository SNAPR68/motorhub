"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { MaterialIcon } from "@/components/MaterialIcon";

interface StatCardProps {
  icon: string;
  value: string;
  label: string;
  trend?: string;
  href?: string;
  className?: string;
}

export function StatCard({
  icon,
  value,
  label,
  trend,
  href,
  className,
}: StatCardProps) {
  const content = (
    <div
      className={cn(
        "glass-panel rounded-xl p-4 transition-all hover:border-primary/20",
        className
      )}
    >
      <div className="mb-2 text-primary">
        <MaterialIcon name={icon} className="text-[24px]" />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
        {label}
      </p>
      {trend && (
        <p className="mt-2 text-xs font-medium text-emerald-400">{trend}</p>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
