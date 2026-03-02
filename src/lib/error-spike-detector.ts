/* Autovinci — Error Spike Detector
 * Monitors API error rates in sliding windows.
 * When error rate crosses threshold, fires admin alert.
 *
 * In-memory tracking (resets on cold start):
 * - 1-minute rolling window of error counts
 * - 5-minute rolling window for sustained spike detection
 * - Deduplication: only alerts once per spike (cooldown period)
 */

import { db } from "@/lib/db";

interface ErrorBucket {
  timestamp: number;
  count: number;
  routes: Map<string, number>;
}

interface SpikeAlert {
  route: string;
  errorsInWindow: number;
  windowMinutes: number;
  triggeredAt: Date;
}

const BUCKET_SIZE_MS = 60_000; // 1 minute buckets
const SHORT_WINDOW = 5; // 5 buckets = 5 minutes
const SPIKE_THRESHOLD = 10; // 10+ errors in 5 minutes = spike
const ROUTE_SPIKE_THRESHOLD = 5; // 5+ errors on same route in 5 minutes
const ALERT_COOLDOWN_MS = 15 * 60_000; // 15 minute cooldown between alerts

// In-memory state
const buckets: ErrorBucket[] = [];
let lastAlertTime = 0;

/** Get or create the current minute bucket */
function getCurrentBucket(): ErrorBucket {
  const now = Date.now();
  const bucketTime = Math.floor(now / BUCKET_SIZE_MS) * BUCKET_SIZE_MS;

  if (buckets.length === 0 || buckets[buckets.length - 1].timestamp !== bucketTime) {
    const bucket: ErrorBucket = { timestamp: bucketTime, count: 0, routes: new Map() };
    buckets.push(bucket);

    // Prune old buckets (keep last 10 minutes)
    while (buckets.length > 10) {
      buckets.shift();
    }

    return bucket;
  }

  return buckets[buckets.length - 1];
}

/** Record an error occurrence */
export function recordError(route: string): void {
  const bucket = getCurrentBucket();
  bucket.count++;
  bucket.routes.set(route, (bucket.routes.get(route) || 0) + 1);

  // Check for spike (fire-and-forget)
  checkForSpike().catch(() => {});
}

/** Get errors in the last N minutes */
function getErrorsInWindow(minutes: number): { total: number; byRoute: Map<string, number> } {
  const cutoff = Date.now() - minutes * 60_000;
  const byRoute = new Map<string, number>();
  let total = 0;

  for (const bucket of buckets) {
    if (bucket.timestamp >= cutoff) {
      total += bucket.count;
      for (const [route, count] of bucket.routes) {
        byRoute.set(route, (byRoute.get(route) || 0) + count);
      }
    }
  }

  return { total, byRoute };
}

/** Check if we're experiencing an error spike */
async function checkForSpike(): Promise<void> {
  const now = Date.now();

  // Respect cooldown
  if (now - lastAlertTime < ALERT_COOLDOWN_MS) return;

  const window = getErrorsInWindow(SHORT_WINDOW);

  const spikes: SpikeAlert[] = [];

  // Global spike
  if (window.total >= SPIKE_THRESHOLD) {
    spikes.push({
      route: "ALL",
      errorsInWindow: window.total,
      windowMinutes: SHORT_WINDOW,
      triggeredAt: new Date(),
    });
  }

  // Per-route spikes
  for (const [route, count] of window.byRoute) {
    if (count >= ROUTE_SPIKE_THRESHOLD) {
      spikes.push({
        route,
        errorsInWindow: count,
        windowMinutes: SHORT_WINDOW,
        triggeredAt: new Date(),
      });
    }
  }

  if (spikes.length === 0) return;

  lastAlertTime = now;

  // Send admin notification
  try {
    const admins = await db.user.findMany({
      where: { email: { in: [process.env.ADMIN_EMAIL ?? "admin@autovinci.com"] } },
      select: { id: true },
      take: 3,
    });

    const routeBreakdown = [...window.byRoute.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([r, c]) => `${r}: ${c}`)
      .join(", ");

    for (const admin of admins) {
      await db.notification.create({
        data: {
          userId: admin.id,
          title: "Error Spike Detected",
          message: `${window.total} errors in the last ${SHORT_WINDOW} minutes. Top routes: ${routeBreakdown}`,
          type: "SYSTEM",
        },
      });
    }

    // Log as platform event
    await db.platformEvent.create({
      data: {
        type: "API_ERROR",
        entityType: "System",
        entityId: "error-spike",
        metadata: {
          total: window.total,
          windowMinutes: SHORT_WINDOW,
          topRoutes: Object.fromEntries([...window.byRoute.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)),
          triggeredAt: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    console.error("[ErrorSpike] Failed to send alert:", error instanceof Error ? error.message : error);
  }
}

/** Get current error rate stats (for health check / admin dashboard) */
export function getErrorStats(): {
  last1min: number;
  last5min: number;
  topRoutes: Array<{ route: string; count: number }>;
  spikeActive: boolean;
} {
  const oneMin = getErrorsInWindow(1);
  const fiveMin = getErrorsInWindow(5);

  const topRoutes = [...fiveMin.byRoute.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([route, count]) => ({ route, count }));

  return {
    last1min: oneMin.total,
    last5min: fiveMin.total,
    topRoutes,
    spikeActive: fiveMin.total >= SPIKE_THRESHOLD,
  };
}
