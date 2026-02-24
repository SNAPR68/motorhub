"use client";

import { useEffect } from "react";
import { WishlistProvider } from "@/context/WishlistContext";
import { CompareProvider } from "@/context/CompareContext";
import { useAuthStore } from "@/lib/stores";
import { initPostHog } from "@/lib/posthog";
import { ToastContainer } from "@/components/ui/Toast";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
}

function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog();

    // Register service worker in production
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // SW registration failed — non-critical
      });
    }
  }, []);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AnalyticsProvider>
      <AuthInitializer>
        <WishlistProvider>
          <CompareProvider>
            {children}
            <ToastContainer />
          </CompareProvider>
        </WishlistProvider>
      </AuthInitializer>
    </AnalyticsProvider>
  );
}
