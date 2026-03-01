/* Autovinci — Standardized API Error Handling
 * Every API route uses: throw new ApiError(...) + handleApiError() in catch
 * Classifies: validation, auth, not-found, DB, AI, generic errors
 */

import { NextResponse } from "next/server";

export type ErrorCode =
  | "VALIDATION_ERROR"
  | "AUTH_REQUIRED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "DB_ERROR"
  | "AI_UNAVAILABLE"
  | "SERVICE_UNAVAILABLE"
  | "INTERNAL_ERROR";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: ErrorCode,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Convenience constructors
export const Errors = {
  validation: (message: string, details?: unknown) =>
    new ApiError(400, "VALIDATION_ERROR", message, details),
  authRequired: (message = "Authentication required") =>
    new ApiError(401, "AUTH_REQUIRED", message),
  forbidden: (message = "Access denied") =>
    new ApiError(403, "FORBIDDEN", message),
  notFound: (entity: string) =>
    new ApiError(404, "NOT_FOUND", `${entity} not found`),
  conflict: (message: string) =>
    new ApiError(409, "CONFLICT", message),
  dbError: (message = "Database operation failed") =>
    new ApiError(500, "DB_ERROR", message),
  aiUnavailable: (message = "AI service temporarily unavailable") =>
    new ApiError(502, "AI_UNAVAILABLE", message),
  serviceUnavailable: (message: string) =>
    new ApiError(503, "SERVICE_UNAVAILABLE", message),
  internal: (message = "Internal server error") =>
    new ApiError(500, "INTERNAL_ERROR", message),
};

/** Unified error handler for all API catch blocks */
export function handleApiError(error: unknown, context?: string): NextResponse {
  // Known ApiError
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message, code: error.code, ...(error.details ? { details: error.details } : {}) },
      { status: error.statusCode }
    );
  }

  // Zod validation errors
  if (error && typeof error === "object" && "issues" in error) {
    const issues = (error as { issues: Array<{ path: (string | number)[]; message: string }> }).issues;
    return NextResponse.json(
      { error: "Validation failed", code: "VALIDATION_ERROR", details: issues.map((i) => `${i.path.join(".")}: ${i.message}`) },
      { status: 400 }
    );
  }

  // Prisma known request errors
  if (error && typeof error === "object" && "code" in error) {
    const prismaError = error as { code: string; meta?: { target?: string[] } };
    if (prismaError.code === "P2002") {
      const fields = prismaError.meta?.target?.join(", ") || "field";
      return NextResponse.json(
        { error: `Duplicate ${fields}`, code: "CONFLICT" },
        { status: 409 }
      );
    }
    if (prismaError.code === "P2025") {
      return NextResponse.json(
        { error: "Record not found", code: "NOT_FOUND" },
        { status: 404 }
      );
    }
  }

  // Generic fallback
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error(`[API${context ? ` ${context}` : ""}]`, message);
  return NextResponse.json(
    { error: "Internal server error", code: "INTERNAL_ERROR" },
    { status: 500 }
  );
}
