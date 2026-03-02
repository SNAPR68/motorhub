/* Autovinci — Health Check Endpoint
 * Returns system health status for monitoring services (UptimeRobot, Vercel, etc.)
 *
 * Checks:
 * - Database connectivity (Prisma ping)
 * - AI circuit breaker status
 * - Error spike detector status
 * - Memory usage
 * - Uptime
 *
 * Returns 200 if healthy, 503 if degraded, 500 if critical.
 * No auth required — designed for external monitoring tools.
 */

import { NextResponse } from "next/server";
import { getAllCircuitStatuses } from "@/lib/ai-circuit-breaker";
import { getErrorStats } from "@/lib/error-spike-detector";

export const dynamic = "force-dynamic";

const startTime = Date.now();

export async function GET() {
  const checks: Record<string, { status: "ok" | "degraded" | "down"; detail?: string }> = {};
  let overallStatus: "healthy" | "degraded" | "critical" = "healthy";

  // 1. Database connectivity
  try {
    const { db } = await import("@/lib/db");
    await db.$queryRaw`SELECT 1`;
    checks.database = { status: "ok" };
  } catch (error) {
    checks.database = { status: "down", detail: error instanceof Error ? error.message : "Connection failed" };
    overallStatus = "critical";
  }

  // 2. AI circuit breakers
  const circuits = getAllCircuitStatuses();
  const openCircuits = Object.entries(circuits).filter(([, s]) => s.state === "OPEN");
  if (openCircuits.length > 0) {
    checks.ai_services = {
      status: "degraded",
      detail: `Open circuits: ${openCircuits.map(([name]) => name).join(", ")}`,
    };
    if (overallStatus === "healthy") overallStatus = "degraded";
  } else {
    checks.ai_services = { status: "ok" };
  }

  // 3. Error rate
  const errorStats = getErrorStats();
  if (errorStats.spikeActive) {
    checks.error_rate = {
      status: "degraded",
      detail: `${errorStats.last5min} errors in last 5 min`,
    };
    if (overallStatus === "healthy") overallStatus = "degraded";
  } else {
    checks.error_rate = {
      status: "ok",
      detail: `${errorStats.last5min} errors in last 5 min`,
    };
  }

  // 4. Memory usage
  const memUsage = process.memoryUsage();
  const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
  const heapPercent = Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100);
  if (heapPercent > 90) {
    checks.memory = { status: "degraded", detail: `${heapUsedMB}/${heapTotalMB}MB (${heapPercent}%)` };
    if (overallStatus === "healthy") overallStatus = "degraded";
  } else {
    checks.memory = { status: "ok", detail: `${heapUsedMB}/${heapTotalMB}MB (${heapPercent}%)` };
  }

  // 5. Uptime
  const uptimeMs = Date.now() - startTime;
  const uptimeHours = Math.round(uptimeMs / (1000 * 60 * 60) * 10) / 10;

  const httpStatus = overallStatus === "critical" ? 500 : overallStatus === "degraded" ? 503 : 200;

  return NextResponse.json(
    {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "dev",
      uptime: `${uptimeHours}h`,
      checks,
      metrics: {
        errorRate: {
          last1min: errorStats.last1min,
          last5min: errorStats.last5min,
          topRoutes: errorStats.topRoutes,
        },
        circuitBreakers: circuits,
      },
    },
    { status: httpStatus }
  );
}
