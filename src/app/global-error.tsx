"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          background: "#0a0c10",
          color: "#e2e8f0",
          fontFamily: "'Manrope', sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "2rem",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: "#ef4444" }}>
              error
            </span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
            Something went wrong
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
            We encountered an unexpected error. Our team has been notified and is looking into it.
          </p>
          <button
            onClick={reset}
            style={{
              background: "#137fec",
              color: "white",
              border: "none",
              padding: "12px 32px",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
