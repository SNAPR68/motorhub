"use client";

import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MaterialIcon } from "@/components/MaterialIcon";
import { useToastStore, type ToastType } from "@/lib/stores/toast-store";

/* ── Icon & colour mapping ── */

const TOAST_STYLES: Record<ToastType, { icon: string; color: string; bg: string }> = {
  success: { icon: "check_circle", color: "text-emerald-400", bg: "border-emerald-500/30" },
  error:   { icon: "error",        color: "text-red-400",     bg: "border-red-500/30" },
  info:    { icon: "info",         color: "text-blue-400",    bg: "border-blue-500/30" },
};

/* ── Toast Container (mount once in Providers) ── */

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  return (
    <div className="fixed bottom-28 left-0 right-0 z-[80] mx-auto flex max-w-lg flex-col-reverse items-center gap-2 px-4 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const style = TOAST_STYLES[toast.type];
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              onClick={() => removeToast(toast.id)}
              className={cn(
                "pointer-events-auto flex w-full items-center gap-3 rounded-xl border px-4 py-3",
                "bg-[#101622]/95 backdrop-blur-md shadow-lg shadow-black/30 cursor-pointer",
                style.bg
              )}
            >
              <MaterialIcon name={style.icon} fill className={cn("text-xl shrink-0", style.color)} />
              <p className="flex-1 text-sm font-medium text-slate-100 leading-snug">{toast.message}</p>
              <MaterialIcon name="close" className="text-base text-slate-500 shrink-0" />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/* ── useToast hook ── */

export function useToast() {
  const addToast = useToastStore((s) => s.addToast);

  const success = useCallback(
    (message: string) => addToast({ message, type: "success" }),
    [addToast]
  );

  const error = useCallback(
    (message: string) => addToast({ message, type: "error" }),
    [addToast]
  );

  const info = useCallback(
    (message: string) => addToast({ message, type: "info" }),
    [addToast]
  );

  return { success, error, info };
}
