/* Autovinci — Sentry Client-Side Configuration */

import * as Sentry from "@sentry/nextjs";

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,

    // Performance monitoring
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

    // Session replay (capture 10% of sessions, 100% on error)
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Only send errors from our domain
    allowUrls: [/autovinci\.com/, /autovinci\.vercel\.app/, /localhost/],

    // Ignore common browser noise
    ignoreErrors: [
      "ResizeObserver loop",
      "Non-Error exception captured",
      "Non-Error promise rejection captured",
      /Loading chunk .* failed/,
      /ChunkLoadError/,
    ],

    integrations: [
      Sentry.replayIntegration(),
      Sentry.browserTracingIntegration(),
    ],
  });
}
