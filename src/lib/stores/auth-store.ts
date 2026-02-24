/* Autovinci — Auth Zustand Store (Supabase) */

import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import type { AuthUser, UserRole } from "../auth-types";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  loginWithGoogle: (redirectTo?: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  // ── State ──
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // ── Actions ──

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        set({
          isLoading: false,
          error: error.message || "Login failed. Check your credentials.",
        });
        return false;
      }

      // Fetch user profile from our API
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        set({
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return true;
      }

      // Auth succeeded but no profile yet — still authenticated
      const { data: { user: supaUser } } = await supabase.auth.getUser();
      set({
        user: supaUser ? {
          id: supaUser.id,
          name: supaUser.user_metadata?.name ?? supaUser.email?.split("@")[0] ?? "User",
          email: supaUser.email ?? "",
          role: (supaUser.user_metadata?.role as UserRole) ?? "buyer",
          avatar: supaUser.user_metadata?.avatar_url,
        } : null,
        isAuthenticated: !!supaUser,
        isLoading: false,
        error: null,
      });
      return !!supaUser;
    } catch {
      set({
        isLoading: false,
        error: "Network error. Please try again.",
      });
      return false;
    }
  },

  loginWithGoogle: async (redirectTo) => {
    set({ isLoading: true, error: null });
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback${redirectTo ? `?redirect=${redirectTo}` : ""}`,
        },
      });
      if (error) {
        set({ isLoading: false, error: error.message });
      }
      // Note: doesn't set isLoading=false on success — page redirects to Google
    } catch {
      set({ isLoading: false, error: "Failed to start Google sign-in." });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore — clear client state anyway
    }
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const supabase = createClient();
      const { data: { user: supaUser } } = await supabase.auth.getUser();

      if (!supaUser) {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      // Try to get full profile from API
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        set({
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        // Fallback: use Supabase user data directly
        set({
          user: {
            id: supaUser.id,
            name: supaUser.user_metadata?.name ?? supaUser.email?.split("@")[0] ?? "User",
            email: supaUser.email ?? "",
            role: (supaUser.user_metadata?.role as UserRole) ?? "buyer",
            avatar: supaUser.user_metadata?.avatar_url,
          },
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
