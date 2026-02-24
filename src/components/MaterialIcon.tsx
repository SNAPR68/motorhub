"use client";

import type { CSSProperties } from "react";

/**
 * Material Symbols Outlined — stitch design system
 */
export function MaterialIcon({
  name,
  className = "",
  fill = false,
  style,
}: {
  name: string;
  className?: string;
  fill?: boolean;
  style?: CSSProperties;
}) {
  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      style={{
        fontFamily: "'Material Symbols Outlined'",
        ...(fill ? { fontVariationSettings: "'FILL' 1" } : {}),
        ...style,
      }}
    >
      {name}
    </span>
  );
}
