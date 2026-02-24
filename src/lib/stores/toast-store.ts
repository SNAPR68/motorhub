/* Autovinci — Toast Notification Zustand Store */

import { create } from "zustand";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

interface ToastState {
  toasts: Toast[];
}

interface ToastActions {
  addToast: (opts: { message: string; type?: ToastType; duration?: number }) => void;
  removeToast: (id: string) => void;
}

let counter = 0;

export const useToastStore = create<ToastState & ToastActions>((set, get) => ({
  toasts: [],

  addToast: ({ message, type = "info", duration = 3000 }) => {
    const id = `toast-${++counter}-${Date.now()}`;
    const toast: Toast = { id, message, type, duration };

    set((s) => ({
      toasts: [...s.toasts.slice(-2), toast], // max 3
    }));

    setTimeout(() => {
      get().removeToast(id);
    }, duration);
  },

  removeToast: (id) =>
    set((s) => ({
      toasts: s.toasts.filter((t) => t.id !== id),
    })),
}));
