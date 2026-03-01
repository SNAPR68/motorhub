"use client";

import { MaterialIcon } from "@/components/MaterialIcon";

interface ApiErrorStateProps {
  error: string | null;
  errorCode?: string | null;
  isRetrying?: boolean;
  onRetry?: () => void;
}

const ERROR_CONFIG: Record<string, { icon: string; title: string; description: string; color: string }> = {
  AUTH_REQUIRED: {
    icon: "lock",
    title: "Session Expired",
    description: "Please log in again to continue.",
    color: "#f59e0b",
  },
  FORBIDDEN: {
    icon: "block",
    title: "Access Denied",
    description: "You don't have permission for this feature.",
    color: "#ef4444",
  },
  NOT_FOUND: {
    icon: "search_off",
    title: "Not Found",
    description: "The requested resource could not be found.",
    color: "#94a3b8",
  },
  AI_UNAVAILABLE: {
    icon: "psychology_alt",
    title: "AI Temporarily Unavailable",
    description: "Using fallback mode. AI features will resume shortly.",
    color: "#8b5cf6",
  },
  SERVICE_UNAVAILABLE: {
    icon: "cloud_off",
    title: "Service Unavailable",
    description: "The service is temporarily down. Please try again.",
    color: "#f59e0b",
  },
  NETWORK_ERROR: {
    icon: "wifi_off",
    title: "Connection Lost",
    description: "Check your internet connection and try again.",
    color: "#ef4444",
  },
};

const DEFAULT_ERROR = {
  icon: "error_outline",
  title: "Something Went Wrong",
  description: "An unexpected error occurred.",
  color: "#ef4444",
};

export function ApiErrorState({ error, errorCode, isRetrying, onRetry }: ApiErrorStateProps) {
  if (!error) return null;

  const config = ERROR_CONFIG[errorCode || ""] || DEFAULT_ERROR;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: `${config.color}15` }}
      >
        <MaterialIcon name={config.icon} className="text-[28px]" style={{ color: config.color }} />
      </div>
      <h3 className="text-base font-semibold text-white mb-1">{config.title}</h3>
      <p className="text-sm text-slate-400 mb-4 max-w-xs">{config.description}</p>

      {isRetrying && (
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
          <div className="w-4 h-4 border-2 border-slate-600 border-t-[#2badee] rounded-full animate-spin" />
          Retrying...
        </div>
      )}

      {onRetry && !isRetrying && (
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
          style={{ background: "rgba(43,173,238,0.15)", border: "1px solid rgba(43,173,238,0.2)" }}
        >
          Try Again
        </button>
      )}

      {errorCode === "AUTH_REQUIRED" && (
        <a
          href="/login/dealer"
          className="mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ background: "rgba(43,173,238,0.15)", color: "#2badee", border: "1px solid rgba(43,173,238,0.2)" }}
        >
          Log In
        </a>
      )}
    </div>
  );
}
