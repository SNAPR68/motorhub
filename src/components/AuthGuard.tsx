"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "dealer" | "buyer";
  fallbackUrl?: string;
}

/**
 * Client-side auth guard for protected pages.
 * Middleware handles the server-side redirect, but this provides
 * a smoother UX with loading state for client-side navigations.
 */
export function AuthGuard({
  children,
  requiredRole = "dealer",
  fallbackUrl = "/login/dealer",
}: AuthGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(fallbackUrl);
    }
    if (!isLoading && isAuthenticated && requiredRole && user?.role !== requiredRole) {
      router.push(fallbackUrl);
    }
  }, [isLoading, isAuthenticated, user, requiredRole, router, fallbackUrl]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-[#0a0e14]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          <p className="text-xs font-medium uppercase tracking-widest text-white/40">
            Authenticating
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Role mismatch
  if (requiredRole && user?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
