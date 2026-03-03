/* CaroBest — Smart AI Router
 * Routes AI requests to the optimal model based on query complexity.
 * Includes exponential backoff retry for transient failures.
 *
 * Complexity tiers:
 *   - SIMPLE: Classification, yes/no, short extraction -> gpt-4o-mini (fast, cheap)
 *   - MODERATE: Summaries, templates, short generation -> gpt-4o-mini (default)
 *   - COMPLEX: Multi-step reasoning, long generation, JSON schemas -> gpt-4o
 *
 * Retry policy:
 *   - 429 (rate limit): retry with exponential backoff (500ms, 1s, 2s)
 *   - 500/502/503: retry once with 1s delay
 *   - 400/401/403: no retry (client error)
 */

import { withCircuitBreaker } from "@/lib/ai-circuit-breaker";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export type QueryComplexity = "SIMPLE" | "MODERATE" | "COMPLEX";

interface AIRequestConfig {
  messages: Array<{ role: string; content: string }>;
  complexity?: QueryComplexity;
  responseFormat?: "json_object";
  maxTokens?: number;
  /** Override model selection */
  model?: string;
  /** Disable retry (for fire-and-forget calls that already have fallbacks) */
  noRetry?: boolean;
}

interface AIResponse {
  content: string | null;
  model: string;
  tokensUsed: number;
  latencyMs: number;
  retries: number;
}

const MODEL_MAP: Record<QueryComplexity, string> = {
  SIMPLE: "gpt-4o-mini",
  MODERATE: "gpt-4o-mini",
  COMPLEX: "gpt-4o",
};

const DEFAULT_MAX_TOKENS: Record<QueryComplexity, number> = {
  SIMPLE: 50,
  MODERATE: 150,
  COMPLEX: 500,
};

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 500;

/**
 * Auto-detect query complexity from message content.
 * Heuristics: JSON output + long system prompt = COMPLEX,
 * short classification prompt = SIMPLE, everything else = MODERATE.
 */
export function detectComplexity(config: AIRequestConfig): QueryComplexity {
  if (config.complexity) return config.complexity;

  const systemMsg = config.messages.find((m) => m.role === "system")?.content || "";
  const totalLength = config.messages.reduce((sum, m) => sum + m.content.length, 0);

  // Complex: JSON output, multi-step reasoning, or long prompts
  if (config.responseFormat === "json_object") return "COMPLEX";
  if (totalLength > 1000) return "COMPLEX";
  if (systemMsg.includes("step by step") || systemMsg.includes("analyze") || systemMsg.includes("compare")) return "COMPLEX";

  // Simple: short classification or extraction
  if (totalLength < 200) return "SIMPLE";
  if (systemMsg.includes("classify") || systemMsg.includes("label") || systemMsg.includes("extract")) return "SIMPLE";

  return "MODERATE";
}

/** Calculate exponential backoff delay with jitter */
function backoffDelay(attempt: number): number {
  const exponential = BASE_DELAY_MS * Math.pow(2, attempt);
  const jitter = Math.random() * 0.3 * exponential; // 0-30% jitter
  return Math.min(exponential + jitter, 8000); // cap at 8s
}

/** Check if an HTTP status code is retryable */
function isRetryableStatus(status: number): boolean {
  return status === 429 || status >= 500;
}

/**
 * Smart AI request with model routing + exponential backoff retry.
 * Wrapped in circuit breaker for cascading failure protection.
 */
export async function aiRequest(config: AIRequestConfig): Promise<AIResponse> {
  if (!OPENAI_API_KEY) {
    return { content: null, model: "none", tokensUsed: 0, latencyMs: 0, retries: 0 };
  }

  const complexity = detectComplexity(config);
  const model = config.model || MODEL_MAP[complexity];
  const maxTokens = config.maxTokens || DEFAULT_MAX_TOKENS[complexity];
  const maxRetries = config.noRetry ? 0 : MAX_RETRIES;

  const startTime = Date.now();
  let retries = 0;
  let lastError: Error | null = null;

  const makeRequest = async (): Promise<AIResponse> => {
    const result = await withCircuitBreaker("openai", async () => {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages: config.messages,
          ...(config.responseFormat ? { response_format: { type: config.responseFormat } } : {}),
          max_tokens: maxTokens,
        }),
      });

      if (!res.ok) {
        const error = new Error(`OpenAI ${res.status}: ${res.statusText}`) as Error & { status: number };
        (error as Error & { status: number }).status = res.status;
        throw error;
      }

      const data = await res.json();
      return {
        content: data.choices?.[0]?.message?.content?.trim() || null,
        model,
        tokensUsed: data.usage?.total_tokens || 0,
        latencyMs: Date.now() - startTime,
        retries,
      };
    });

    if (result === null) {
      // Circuit breaker is OPEN — immediate fallback
      return { content: null, model, tokensUsed: 0, latencyMs: Date.now() - startTime, retries };
    }

    return result;
  };

  // Retry loop with exponential backoff
  while (retries <= maxRetries) {
    try {
      return await makeRequest();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const status = (error as Error & { status?: number }).status;

      // Don't retry client errors (400, 401, 403)
      if (status && !isRetryableStatus(status)) {
        break;
      }

      if (retries < maxRetries) {
        const delay = backoffDelay(retries);
        await new Promise((r) => setTimeout(r, delay));
        retries++;
      } else {
        break;
      }
    }
  }

  // All retries exhausted — return null content
  console.error(`[AIRouter] Failed after ${retries} retries:`, lastError?.message);
  return { content: null, model, tokensUsed: 0, latencyMs: Date.now() - startTime, retries };
}

/**
 * Convenience: Simple classification call (auto-routes to gpt-4o-mini).
 */
export async function aiClassify(
  systemPrompt: string,
  input: string,
): Promise<string | null> {
  const result = await aiRequest({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: input },
    ],
    complexity: "SIMPLE",
    responseFormat: "json_object",
    maxTokens: 50,
  });
  return result.content;
}

/**
 * Convenience: Generate text (auto-detects complexity).
 */
export async function aiGenerate(
  systemPrompt: string,
  input: string,
  maxTokens?: number,
): Promise<string | null> {
  const result = await aiRequest({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: input },
    ],
    maxTokens,
  });
  return result.content;
}
