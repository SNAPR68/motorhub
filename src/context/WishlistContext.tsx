"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { addToWishlist, removeFromWishlist, fetchWishlist } from "@/lib/api";

interface WishlistState {
  ids: string[];
  synced: boolean;
}

type WishlistAction =
  | { type: "TOGGLE"; id: string }
  | { type: "HYDRATE"; ids: string[] }
  | { type: "MARK_SYNCED" };

const STORAGE_KEY = "autovinci_wishlist";

function reducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case "TOGGLE": {
      const exists = state.ids.includes(action.id);
      const ids = exists
        ? state.ids.filter((id) => id !== action.id)
        : [...state.ids, action.id];
      return { ...state, ids };
    }
    case "HYDRATE":
      return { ...state, ids: action.ids, synced: true };
    case "MARK_SYNCED":
      return { ...state, synced: true };
    default:
      return state;
  }
}

interface WishlistContextValue {
  wishlistIds: string[];
  isWishlisted: (id: string) => boolean;
  toggleWishlist: (id: string) => void;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { ids: [], synced: false });

  // Hydrate from API first, fallback to localStorage
  useEffect(() => {
    let cancelled = false;

    async function loadWishlist() {
      try {
        const data = await fetchWishlist();
        if (!cancelled) {
          const vehicleIds = (data.wishlists ?? [])
            .map((w: { vehicle: { id: string } }) => w.vehicle?.id)
            .filter(Boolean);
          dispatch({ type: "HYDRATE", ids: vehicleIds });
          // Also update localStorage
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicleIds));
          } catch (e) { console.warn("localStorage write failed:", e); }
        }
      } catch {
        // API failed (probably not logged in), use localStorage
        if (!cancelled) {
          try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
              dispatch({ type: "HYDRATE", ids: JSON.parse(stored) });
            } else {
              dispatch({ type: "MARK_SYNCED" });
            }
          } catch (e) {
            console.warn("localStorage read failed:", e);
            dispatch({ type: "MARK_SYNCED" });
          }
        }
      }
    }

    loadWishlist();
    return () => { cancelled = true; };
  }, []);

  // Persist to localStorage whenever ids change (after initial sync)
  useEffect(() => {
    if (!state.synced) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.ids));
    } catch (e) { console.warn("localStorage write failed:", e); }
  }, [state.ids, state.synced]);

  const isWishlisted = useCallback(
    (id: string) => state.ids.includes(id),
    [state.ids]
  );

  const toggleWishlist = useCallback(
    (id: string) => {
      const wasWishlisted = state.ids.includes(id);
      dispatch({ type: "TOGGLE", id });

      // Fire-and-forget API call
      if (wasWishlisted) {
        removeFromWishlist(id).catch(() => {});
      } else {
        addToWishlist(id).catch(() => {});
      }
    },
    [state.ids]
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds: state.ids,
        isWishlisted,
        toggleWishlist,
        wishlistCount: state.ids.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
