/* Autovinci — AI Circuit Breaker
 * Prevents cascading timeouts when OpenAI/Replicate are down.
 * After 3 consecutive failures in 5 min: circuit OPEN -> instant fallback.
 * After 30s: HALF-OPEN -> try one request.
 * On success: CLOSED -> resume normal.
 *
 * In-memory: resets on Vercel cold start (acceptable tradeoff).
 */

type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

interface CircuitConfig {
  failureThreshold: number;  // failures before opening
  resetTimeout: number;      // ms before trying again (half-open)
  windowMs: number;          // failure window
}

interface CircuitStats {
  state: CircuitState;
  failures: number;
  lastFailure: number;
  lastStateChange: number;
}

const DEFAULT_CONFIG: CircuitConfig = {
  failureThreshold: 3,
  resetTimeout: 30_000,  // 30 seconds
  windowMs: 300_000,     // 5 minutes
};

// Per-service circuit state (in-memory, resets on cold start)
const circuits = new Map<string, CircuitStats>();

function getCircuit(service: string): CircuitStats {
  if (!circuits.has(service)) {
    circuits.set(service, {
      state: "CLOSED",
      failures: 0,
      lastFailure: 0,
      lastStateChange: Date.now(),
    });
  }
  return circuits.get(service)!;
}

/** Check if a service call should be attempted */
export function canCall(service: string, config = DEFAULT_CONFIG): boolean {
  const circuit = getCircuit(service);
  const now = Date.now();

  if (circuit.state === "CLOSED") return true;

  if (circuit.state === "OPEN") {
    // Check if enough time passed to try again
    if (now - circuit.lastStateChange >= config.resetTimeout) {
      circuit.state = "HALF_OPEN";
      circuit.lastStateChange = now;
      return true; // allow one probe request
    }
    return false;
  }

  // HALF_OPEN: allow the probe request (already in progress)
  return true;
}

/** Record a successful call */
export function recordSuccess(service: string): void {
  const circuit = getCircuit(service);
  circuit.state = "CLOSED";
  circuit.failures = 0;
  circuit.lastStateChange = Date.now();
}

/** Record a failed call */
export function recordFailure(service: string, config = DEFAULT_CONFIG): void {
  const circuit = getCircuit(service);
  const now = Date.now();

  // Reset failure count if outside window
  if (now - circuit.lastFailure > config.windowMs) {
    circuit.failures = 0;
  }

  circuit.failures++;
  circuit.lastFailure = now;

  if (circuit.state === "HALF_OPEN") {
    // Probe failed -> back to OPEN
    circuit.state = "OPEN";
    circuit.lastStateChange = now;
  } else if (circuit.failures >= config.failureThreshold) {
    circuit.state = "OPEN";
    circuit.lastStateChange = now;
  }
}

/** Get current circuit state for monitoring */
export function getCircuitStatus(service: string): { state: CircuitState; failures: number } {
  const circuit = getCircuit(service);
  return { state: circuit.state, failures: circuit.failures };
}

/** Get all circuit statuses (for admin dashboard) */
export function getAllCircuitStatuses(): Record<string, { state: CircuitState; failures: number }> {
  const result: Record<string, { state: CircuitState; failures: number }> = {};
  for (const [service, stats] of circuits) {
    result[service] = { state: stats.state, failures: stats.failures };
  }
  return result;
}

/**
 * Wrap an AI service call with circuit breaker protection.
 * If circuit is OPEN, immediately returns null (caller should use fallback).
 * If call fails, records failure and returns null.
 * If call succeeds, records success and returns result.
 */
export async function withCircuitBreaker<T>(
  service: string,
  fn: () => Promise<T>,
  config = DEFAULT_CONFIG
): Promise<T | null> {
  if (!canCall(service, config)) {
    return null; // circuit OPEN -> use fallback
  }

  try {
    const result = await fn();
    recordSuccess(service);
    return result;
  } catch (error) {
    recordFailure(service, config);
    throw error; // re-throw so caller can catch and use fallback
  }
}
