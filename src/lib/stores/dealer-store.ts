/* Autovinci — Dealer Zustand Store */

import { create } from "zustand";
import type { DealerProfile, StoreLocation, TeamMember } from "../auth-types";

interface DealerState {
  profile: DealerProfile | null;
  stores: StoreLocation[];
  team: TeamMember[];
  isLoading: boolean;
}

interface DealerActions {
  fetchProfile: () => Promise<void>;
  fetchStores: () => Promise<void>;
  fetchTeam: () => Promise<void>;
  updateProfile: (updates: Partial<DealerProfile>) => void;
}

export const useDealerStore = create<DealerState & DealerActions>((set) => ({
  // ── State ──
  profile: null,
  stores: [],
  team: [],
  isLoading: false,

  // ── Actions ──

  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        set({ profile: data.dealerProfile ?? null, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  fetchStores: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/stores");
      if (res.ok) {
        const data = await res.json();
        set({ stores: data.stores ?? [], isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  fetchTeam: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/stores");
      if (res.ok) {
        const data = await res.json();
        set({ team: data.team ?? [], isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  updateProfile: (updates) =>
    set((s) => ({
      profile: s.profile ? { ...s.profile, ...updates } : null,
    })),
}));
