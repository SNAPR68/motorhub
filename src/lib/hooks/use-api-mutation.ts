"use client";

/* Autovinci — Generic mutation hook with toast integration */

import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/Toast";

interface MutationOptions<TData, TInput> {
  mutationFn: (input: TInput) => Promise<TData>;
  onSuccess?: (data: TData) => void;
  onError?: (error: string) => void;
  successMessage?: string;
  errorMessage?: string;
}

interface MutationResult<TData, TInput> {
  mutate: (input: TInput) => Promise<TData | undefined>;
  isSubmitting: boolean;
  error: string | null;
  data: TData | null;
  reset: () => void;
}

export function useApiMutation<TData = unknown, TInput = void>(
  options: MutationOptions<TData, TInput>
): MutationResult<TData, TInput> {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TData | null>(null);
  const toast = useToast();

  const mutate = useCallback(
    async (input: TInput): Promise<TData | undefined> => {
      setIsSubmitting(true);
      setError(null);

      try {
        const result = await options.mutationFn(input);
        setData(result);

        if (options.successMessage) {
          toast.success(options.successMessage);
        }

        options.onSuccess?.(result);
        return result;
      } catch (err) {
        let message = options.errorMessage ?? "Something went wrong";

        if (err instanceof Error) {
          // Try to parse JSON error body from API response
          try {
            const parsed = JSON.parse(err.message);
            message = parsed.error ?? message;
          } catch {
            if (err.message && !err.message.includes("Failed to fetch")) {
              message = err.message;
            }
          }
        }

        setError(message);
        toast.error(message);
        options.onError?.(message);
        return undefined;
      } finally {
        setIsSubmitting(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options.mutationFn, options.successMessage, options.errorMessage, toast]
  );

  const reset = useCallback(() => {
    setError(null);
    setData(null);
    setIsSubmitting(false);
  }, []);

  return { mutate, isSubmitting, error, data, reset };
}
