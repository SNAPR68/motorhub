/* Autovinci — JWT Auth Utilities (Web Crypto API, no external deps) */

import { cookies } from "next/headers";
import type { AuthTokenPayload, AuthUser, UserRole } from "./auth-types";

const COOKIE_NAME = "autovinci_token";
const TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 days in seconds

// ── Base64url helpers ──

function base64urlEncode(data: Uint8Array): string {
  let binary = "";
  for (const byte of data) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecode(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function textToBase64url(text: string): string {
  return base64urlEncode(new TextEncoder().encode(text));
}

// ── Crypto Key ──

async function getSigningKey(): Promise<CryptoKey> {
  const secret = process.env.JWT_SECRET ?? "autovinci-dev-fallback-key";
  const keyData = new TextEncoder().encode(secret);
  return crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

// ── Create Token ──

export async function createToken(payload: Omit<AuthTokenPayload, "iat" | "exp">): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: AuthTokenPayload = {
    ...payload,
    iat: now,
    exp: now + TOKEN_EXPIRY,
  };

  const header = textToBase64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = textToBase64url(JSON.stringify(fullPayload));
  const signingInput = `${header}.${body}`;

  const key = await getSigningKey();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(signingInput)
  );

  return `${signingInput}.${base64urlEncode(new Uint8Array(signature))}`;
}

// ── Verify Token ──

export async function verifyToken(token: string): Promise<AuthTokenPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, body, sig] = parts;
    const signingInput = `${header}.${body}`;

    const key = await getSigningKey();
    const signatureBytes = base64urlDecode(sig);

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes.buffer as ArrayBuffer,
      new TextEncoder().encode(signingInput)
    );

    if (!valid) return null;

    const payload: AuthTokenPayload = JSON.parse(
      new TextDecoder().decode(base64urlDecode(body))
    );

    // Check expiry
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

// ── Cookie Management ──

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TOKEN_EXPIRY,
  });
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAuthFromCookies(): Promise<AuthTokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// ── Get Token String (for middleware) ──

export function getTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}

// ── Build AuthUser from payload ──

export function payloadToUser(
  payload: AuthTokenPayload,
  extra?: { name?: string; avatar?: string; dealershipName?: string; dealershipId?: string }
): AuthUser {
  return {
    id: payload.sub,
    name: extra?.name ?? "User",
    email: payload.email,
    role: payload.role as UserRole,
    avatar: extra?.avatar,
    dealershipName: extra?.dealershipName,
    dealershipId: extra?.dealershipId,
  };
}
