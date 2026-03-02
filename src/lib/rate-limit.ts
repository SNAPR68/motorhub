/* Autovinci — In-Memory Rate Limiter
 * Simple sliding-window rate limit for public API routes.
 * In-memory: resets on Vercel cold start (acceptable for basic protection).
 */

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Cleanup every 5 minutes to prevent memory leak
let lastCleanup = Date.now();
function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < 300_000) return;
  lastCleanup = now;
  const cutoff = now - 60_000; // remove entries older than 1 minute
  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
    if (entry.timestamps.length === 0) store.delete(key);
  }
}

interface RateLimitConfig {
  maxRequests: number;  // max requests per window
  windowMs: number;     // window in milliseconds
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 30,
  windowMs: 60_000, // 30 requests per minute
};

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number; // timestamp when window resets
}

/** Check rate limit for a given key (usually IP or user ID) */
export function checkRateLimit(key: string, config = DEFAULT_CONFIG): RateLimitResult {
  cleanup();

  const now = Date.now();
  const windowStart = now - config.windowMs;

  if (!store.has(key)) {
    store.set(key, { timestamps: [] });
  }

  const entry = store.get(key)!;

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => t > windowStart);

  if (entry.timestamps.length >= config.maxRequests) {
    const oldestInWindow = entry.timestamps[0];
    return {
      allowed: false,
      remaining: 0,
      resetAt: oldestInWindow + config.windowMs,
    };
  }

  entry.timestamps.push(now);
  return {
    allowed: true,
    remaining: config.maxRequests - entry.timestamps.length,
    resetAt: now + config.windowMs,
  };
}

/** Get rate limit headers for the response */
export function rateLimitHeaders(result: RateLimitResult, config = DEFAULT_CONFIG): Record<string, string> {
  return {
    "X-RateLimit-Limit": config.maxRequests.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": Math.ceil(result.resetAt / 1000).toString(),
  };
}
