/* Autovinci — Auth & Dealer TypeScript Interfaces */

// ── Roles ──

export type UserRole = "buyer" | "dealer";

// ── Auth User ──

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  dealershipName?: string;
  dealershipId?: string;
}

// ── JWT ──

export interface AuthTokenPayload {
  sub: string;
  role: UserRole;
  email: string;
  iat: number;
  exp: number;
}

// ── Login ──

export interface LoginRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

// ── Dealer Profile ──

export interface DealerProfile {
  dealershipName: string;
  dealershipId: string;
  gstin: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  logoUrl: string;
  plan: "starter" | "growth" | "enterprise";
}

// ── Store / Multi-location ──

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  manager: string;
  vehicleCount: number;
  status: "active" | "inactive";
}

// ── Team ──

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  joinedAt: string;
  status: "active" | "invited" | "inactive";
}
