/* Autovinci — UI Zustand Store */

import { create } from "zustand";

type Theme = "dark" | "light" | "system";
type SortOption = "newest" | "price_asc" | "price_desc" | "popular" | "ai_score";

interface UIState {
  sidebarOpen: boolean;
  theme: Theme;
  searchQuery: string;
  activeFilters: Record<string, string[]>;
  sortBy: SortOption;
}

interface UIActions {
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: Theme) => void;
  setSearchQuery: (query: string) => void;
  setFilter: (key: string, values: string[]) => void;
  clearFilters: () => void;
  setSortBy: (sort: SortOption) => void;
}

export const useUIStore = create<UIState & UIActions>((set) => ({
  // ── State ──
  sidebarOpen: false,
  theme: "dark",
  searchQuery: "",
  activeFilters: {},
  sortBy: "newest",

  // ── Actions ──

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  setTheme: (theme) => set({ theme }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setFilter: (key, values) =>
    set((s) => ({
      activeFilters: { ...s.activeFilters, [key]: values },
    })),

  clearFilters: () => set({ activeFilters: {}, searchQuery: "" }),

  setSortBy: (sort) => set({ sortBy: sort }),
}));
