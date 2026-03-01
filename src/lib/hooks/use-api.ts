/* Autovinci — useApi hook for client-side data fetching
 * Features: auto-retry on 5xx, error code extraction, retry state
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseApiResult<T> {
  data: T | null;
  error: string | null;
  errorCode: string | null;
  isLoading: boolean;
  isRetrying: boolean;
  refetch: () => void;
}

const MAX_RETRIES = 1;
const RETRY_DELAY = 2000;

export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = []
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const retryCount = useRef(0);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setErrorCode(null);
    retryCount.current = 0;

    const attempt = async (): Promise<void> => {
      try {
        const result = await fetcher();
        setData(result);
        setIsRetrying(false);
      } catch (err) {
        // Extract error code from API response
        let code: string | null = null;
        let message = "Failed to fetch data";

        if (err instanceof Error) {
          message = err.message;
          // Try to parse JSON error body from apiFetch
          try {
            const parsed = JSON.parse(message);
            if (parsed.code) code = parsed.code;
            if (parsed.error) message = parsed.error;
          } catch {
            // Not JSON — check for network errors
            if (message === "Failed to fetch" || message.includes("NetworkError")) {
              code = "NETWORK_ERROR";
              message = "Connection lost";
            }
          }
        }

        // Auto-retry on 5xx or network errors (once)
        const isRetryable = !code || code === "INTERNAL_ERROR" || code === "DB_ERROR" || code === "NETWORK_ERROR";
        if (isRetryable && retryCount.current < MAX_RETRIES) {
          retryCount.current++;
          setIsRetrying(true);
          await new Promise((r) => setTimeout(r, RETRY_DELAY));
          return attempt();
        }

        setError(message);
        setErrorCode(code);
        setIsRetrying(false);
      } finally {
        setIsLoading(false);
      }
    };

    await attempt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, errorCode, isLoading, isRetrying, refetch: fetchData };
}
