/* Autovinci — Client-side API helpers
 *
 * Provides typed fetch wrappers for all API routes,
 * plus adapters to convert Prisma DB records into the
 * component-level types used by pages.
 */

import type { Vehicle, Lead } from "./types";

// ── Base Fetch ──

const BASE = process.env.NEXT_PUBLIC_APP_URL || "";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) throw new Error(`API ${path}: ${res.status}`);
  return res.json();
}

// ── Vehicle API ──

export async function fetchVehicles(params?: {
  category?: string;
  status?: string;
  search?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}) {
  const sp = new URLSearchParams();
  if (params?.category) sp.set("category", params.category);
  if (params?.status) sp.set("status", params.status);
  if (params?.search) sp.set("search", params.search);
  if (params?.sort) sp.set("sort", params.sort);
  if (params?.limit) sp.set("limit", String(params.limit));
  if (params?.offset) sp.set("offset", String(params.offset));

  const qs = sp.toString();
  return apiFetch<{ vehicles: DbVehicle[]; total: number }>(
    `/api/vehicles${qs ? `?${qs}` : ""}`
  );
}

export async function fetchVehicle(id: string) {
  return apiFetch<{ vehicle: DbVehicle }>(`/api/vehicles/${id}`);
}

// ── Lead API ──

export async function fetchLeads(params?: {
  status?: string;
  sentiment?: string;
  search?: string;
  limit?: number;
}) {
  const sp = new URLSearchParams();
  if (params?.status) sp.set("status", params.status);
  if (params?.sentiment) sp.set("sentiment", params.sentiment);
  if (params?.search) sp.set("search", params.search);
  if (params?.limit) sp.set("limit", String(params.limit));

  const qs = sp.toString();
  return apiFetch<{ leads: DbLead[]; total: number }>(
    `/api/leads${qs ? `?${qs}` : ""}`
  );
}

export async function fetchLead(id: string) {
  return apiFetch<{ lead: DbLead; timeline: DbLeadMessage[] }>(
    `/api/leads/${id}`
  );
}

// ── Dashboard API ──

export async function fetchDashboard() {
  return apiFetch<{
    stats: Record<string, unknown>;
    activities: DbActivity[];
    recentLeads: DbLead[];
  }>("/api/analytics/dashboard");
}

// ── Analytics Funnel API ──

export interface FunnelStage {
  stage: string;
  count: number;
  conversion: number;
}

export interface FunnelData {
  funnel: FunnelStage[];
  sentiment: { hot: number; warm: number; cool: number; total: number };
  statusBreakdown: Record<string, number>;
  totalLeads: number;
}

export async function fetchFunnel() {
  return apiFetch<FunnelData>("/api/analytics/funnel");
}

// ── Concierge Chat API ──

export interface ConciergeVehicle {
  id: string;
  name: string;
  year: number;
  price: string;
  image: string;
  fuel: string;
  km: string;
}

export interface ConciergeResponse {
  response: {
    text: string;
    vehicles?: ConciergeVehicle[];
  };
}

export async function sendConciergeMessage(
  message: string,
  history?: { role: "user" | "assistant"; content: string }[]
) {
  return apiFetch<ConciergeResponse>("/api/concierge/chat", {
    method: "POST",
    body: JSON.stringify({ message, history }),
  });
}

// ── Store API ──

export async function fetchStores() {
  return apiFetch<{
    stores: DbStore[];
    team: DbTeamMember[];
    total: number;
  }>("/api/stores");
}

export async function fetchStore(id: string) {
  return apiFetch<{ store: DbStore }>(`/api/stores/${id}`);
}

// ── Wishlist API ──

export async function fetchWishlist() {
  return apiFetch<{
    wishlists: Array<{ vehicle: DbVehicle }>;
    vehicles: DbVehicle[];
    total: number;
  }>("/api/wishlist");
}

export async function addToWishlist(vehicleId: string) {
  return apiFetch<{ wishlist: unknown }>("/api/wishlist", {
    method: "POST",
    body: JSON.stringify({ vehicleId }),
  });
}

export async function removeFromWishlist(vehicleId: string) {
  return apiFetch<{ deleted: boolean }>(
    `/api/wishlist?vehicleId=${vehicleId}`,
    { method: "DELETE" }
  );
}

// ── Appointments API ──

export async function fetchAppointments(status?: string) {
  const qs = status ? `?status=${status}` : "";
  return apiFetch<{ appointments: DbAppointment[]; total: number }>(
    `/api/appointments${qs}`
  );
}

// ── AI Description Generator ──

export async function generateVehicleDescription(vehicleId: string) {
  return apiFetch<{ description: string; generated: boolean }>(
    "/api/ai/description",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vehicleId }),
    }
  );
}

// ── AI Valuation ──

export interface ValuationResponse {
  estimatedPrice: number;
  low: number;
  high: number;
  marketLow: number;
  marketHigh: number;
  offer: number;
  depreciationRate?: number;
  marketDemand?: string;
  factors?: { name: string; impact: string; positive: boolean }[];
  generated?: boolean;
}

export async function getAIValuation(params: {
  brand: string;
  model: string;
  year: string;
  km: string;
  fuel: string;
  transmission: string;
  owner: string;
  city: string;
  condition: string;
}) {
  return apiFetch<ValuationResponse>("/api/ai/valuation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
}

// ── AI Sentiment Analysis ──

export interface SentimentResponse {
  sentiment: "HOT" | "WARM" | "COOL";
  confidence: number;
  reasoning: string;
  suggestedAction: string;
  generated?: boolean;
}

export async function analyzeLeadSentiment(leadId: string) {
  return apiFetch<SentimentResponse>("/api/ai/sentiment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ leadId }),
  });
}

// ── Panorama / Virtual Tour ──

export async function setPanoramaImage(vehicleId: string, panoramaImageIdx: number | null) {
  return apiFetch<{ vehicle: { id: string; panoramaImageIdx: number | null }; panoramaImageIdx: number | null }>(
    `/api/vehicles/${vehicleId}/panorama`,
    {
      method: "PATCH",
      body: JSON.stringify({ panoramaImageIdx }),
    }
  );
}

// ── Notifications API ──

export async function fetchNotifications() {
  return apiFetch<{
    notifications: DbNotification[];
    total: number;
    unreadCount: number;
  }>("/api/notifications");
}

// ── Current User (Buyer or Dealer) ──

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  dealershipName?: string;
  dealershipId?: string;
}

export async function fetchCurrentUser() {
  return apiFetch<{ user: CurrentUser; dealerProfile: Record<string, unknown> | null }>(
    "/api/auth/me"
  );
}

// ── Dealer Profile ──

export async function fetchDealerProfile() {
  return apiFetch<{
    profile: Record<string, unknown>;
    user: Record<string, unknown>;
  }>("/api/dealer/profile");
}

// ── Dealer Team ──

export async function fetchDealerTeam() {
  return apiFetch<{
    team: DbTeamMember[];
    total: number;
  }>("/api/dealer/team");
}

// ── Analytics Performance ──

export interface PerformanceData {
  inventory: { total: number; sold: number; available: number; reserved: number; soldRate: number };
  leads: { total: number; closedWon: number; hot: number; warm: number; cool: number; conversionRate: number };
  revenue: { total: number; display: string; avgPrice: number; avgPriceDisplay: string };
  ai: { repliesSent: number };
  topVehicles: Array<{ id: string; name: string; price: number; priceDisplay: string; status: string; aiScore: number | null; image: string | null }>;
}

export async function fetchPerformance() {
  return apiFetch<PerformanceData>("/api/analytics/performance");
}

// ── Analytics Reports ──

export interface ReportsData {
  period: { month: string; year: number };
  summary: {
    leads: number; leadGrowth: number;
    salesVolume: number; salesGrowth: number;
    conversionRate: number; conversionGrowth: number;
    revenue: string; totalRevenue: string;
    totalVehicles: number;
  };
  breakdown: { sources: Record<string, number>; statuses: Record<string, number> };
  activities: DbActivity[];
}

export async function fetchReports() {
  return apiFetch<ReportsData>("/api/analytics/reports");
}

// ═══════════════════════════════════════════════
// DB RECORD TYPES (what the API returns)
// ═══════════════════════════════════════════════

export interface DbVehicle {
  id: string;
  name: string;
  year: number;
  price: number;
  priceDisplay: string;
  status: string;
  category: string;
  fuel: string;
  transmission: string;
  engine: string;
  power: string;
  mileage: string;
  km: string;
  location: string;
  owner: string;
  badge: string | null;
  aiScore: number | null;
  panoramaImageIdx: number | null;
  images: string[];
  features: Array<{ key: string; label: string; available: boolean }> | null;
  createdAt: string;
  store?: { name: string; city: string } | null;
  dealerProfile?: {
    dealershipName: string;
    dealershipId: string;
    city: string;
    phone: string | null;
    logoUrl: string | null;
  } | null;
}

export interface DbLead {
  id: string;
  buyerName: string;
  source: string;
  sentiment: number;
  sentimentLabel: string;
  message: string | null;
  phone: string | null;
  email: string | null;
  location: string | null;
  budget: string | null;
  status: string;
  createdAt: string;
  vehicle?: {
    id: string;
    name: string;
    priceDisplay: string;
    images: string[];
  } | null;
  _count?: { messages: number };
}

export interface DbLeadMessage {
  id: string;
  role: string;
  text: string;
  type: string;
  createdAt: string;
}

export interface DbActivity {
  id: string;
  title: string;
  description: string;
  type: string;
  createdAt: string;
}

export interface DbStore {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string | null;
  manager: string | null;
  status: string;
  vehicleCount?: number;
  _count?: { vehicles: number };
}

export interface DbTeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatarUrl: string | null;
  status: string;
  joinedAt: string;
}

export interface DbAppointment {
  id: string;
  buyerName: string;
  buyerPhone: string | null;
  scheduledAt: string;
  duration: number;
  status: string;
  location: string | null;
  notes: string | null;
  lead?: { id: string; buyerName: string; phone: string | null; sentimentLabel: string } | null;
  vehicle?: { id: string; name: string; priceDisplay: string; images: string[] } | null;
}

export interface DbNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

// ═══════════════════════════════════════════════
// ADAPTERS — Convert DB records to page-level types
// ═══════════════════════════════════════════════

const STATUS_COLOR_MAP: Record<string, string> = {
  AVAILABLE: "bg-emerald-500",
  IN_REVIEW: "bg-amber-500",
  RESERVED: "bg-blue-500",
  SOLD: "bg-slate-500",
  ARCHIVED: "bg-slate-700",
};

const SOURCE_COLOR_MAP: Record<string, string> = {
  WEBSITE: "bg-blue-500",
  FACEBOOK: "bg-indigo-500",
  INSTAGRAM: "bg-pink-500",
  WHATSAPP: "bg-green-500",
  WALKIN: "bg-amber-500",
  REFERRAL: "bg-purple-500",
  OTHER: "bg-slate-500",
};

/** Convert a DB vehicle record to the page-component Vehicle type */
export function adaptVehicle(v: DbVehicle): Vehicle {
  return {
    id: v.id,
    name: v.name,
    year: v.year,
    price: v.priceDisplay,
    priceNumeric: v.price,
    image: v.images[0] || "",
    status: v.status.toLowerCase() as Vehicle["status"],
    statusColor: STATUS_COLOR_MAP[v.status] || "bg-slate-500",
    aiTag: (v.aiScore ?? 0) >= 90,
    aiScore: v.aiScore ?? 0,
    km: v.km,
    fuel: v.fuel.charAt(0) + v.fuel.slice(1).toLowerCase(),
    transmission: v.transmission.charAt(0) + v.transmission.slice(1).toLowerCase(),
    engine: v.engine,
    power: v.power,
    mileage: v.mileage,
    location: v.location,
    owner: v.owner,
    badge: v.badge,
    category: v.category.toLowerCase() as Vehicle["category"],
    features: v.features ?? [],
    gallery: v.images.length > 0 ? v.images : [v.images[0] || ""],
    panoramaImageIdx: v.panoramaImageIdx ?? null,
  };
}

/** Convert a DB lead record to the page-component Lead type */
export function adaptLead(l: DbLead): Lead {
  const ago = timeAgo(l.createdAt);
  return {
    id: l.id,
    name: l.buyerName,
    source: l.source.charAt(0) + l.source.slice(1).toLowerCase(),
    sourceColor: SOURCE_COLOR_MAP[l.source] || "bg-slate-500",
    sentiment: l.sentiment,
    sentimentLabel: l.sentimentLabel.toLowerCase() as Lead["sentimentLabel"],
    car: l.vehicle?.name ?? "No vehicle",
    carImage: l.vehicle?.images?.[0] ?? "",
    time: ago,
    message: l.message ?? "",
    phone: l.phone ?? undefined,
    location: l.location ?? undefined,
    budget: l.budget ?? undefined,
  };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ── New Car Catalog API ──

export interface ApiBrand {
  id: string;
  slug: string;
  name: string;
  logo: string;
  color: string;
  popular: boolean;
  modelCount: number;
}

export interface ApiCarModel {
  id: string;
  slug: string;
  brand: { slug: string; name: string; logo: string; color: string };
  name: string;
  fullName: string;
  category: string;
  image: string;
  startingPrice: number;
  startingPriceDisplay: string;
  rating: number;
  reviewCount: number;
  year: number;
  fuelTypes: string[];
  transmissions: string[];
  mileage: string;
  engine: string;
  power: string;
  seating: number;
  bodyType: string;
  popular: boolean;
  tag: string | null;
  variantCount: number;
}

export interface ApiCarModelDetail extends Omit<ApiCarModel, "variantCount"> {
  gallery: string[];
  pros: string[];
  cons: string[];
  variants: ApiCarVariant[];
}

export interface ApiCarVariant {
  id: string;
  name: string;
  fuel: string;
  transmission: string;
  exShowroom: number;
  exShowroomDisplay: string;
}

export async function fetchCarBrands() {
  return apiFetch<{ brands: ApiBrand[] }>("/api/cars/brands");
}

export async function fetchCarModels(params?: {
  brand?: string;
  category?: string;
  popular?: boolean;
  minPrice?: number;
  maxPrice?: number;
  fuel?: string;
  q?: string;
  limit?: number;
  offset?: number;
}) {
  const sp = new URLSearchParams();
  if (params?.brand) sp.set("brand", params.brand);
  if (params?.category) sp.set("category", params.category);
  if (params?.popular) sp.set("popular", "true");
  if (params?.minPrice) sp.set("minPrice", String(params.minPrice));
  if (params?.maxPrice) sp.set("maxPrice", String(params.maxPrice));
  if (params?.fuel) sp.set("fuel", params.fuel);
  if (params?.q) sp.set("q", params.q);
  if (params?.limit) sp.set("limit", String(params.limit));
  if (params?.offset) sp.set("offset", String(params.offset));

  const qs = sp.toString();
  return apiFetch<{ models: ApiCarModel[]; total: number }>(
    `/api/cars/models${qs ? `?${qs}` : ""}`
  );
}

export async function fetchCarModel(brand: string, model: string) {
  return apiFetch<{
    model: ApiCarModelDetail;
    relatedModels: Array<{
      slug: string;
      name: string;
      fullName: string;
      image: string;
      startingPriceDisplay: string;
      rating: number;
    }>;
  }>(`/api/cars/${brand}/${model}`);
}

// ── Service Bookings (RC Transfer, Inspection, Swap, Cross-State) ──

export interface ServiceBookingResponse {
  id: string;
  type: string;
  status: string;
  plan: string | null;
  createdAt: string;
}

export async function createServiceBooking(data: {
  type: "RC_TRANSFER" | "INSPECTION" | "SWAP" | "CROSS_STATE";
  plan?: string;
  amount?: string;
  details: Record<string, unknown>;
  scheduledAt?: string;
  phone?: string;
  email?: string;
  city?: string;
}) {
  return apiFetch<ServiceBookingResponse>("/api/services/book", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// ── Dealer Preferences (automation, assets, notifications) ──

export interface DealerPreferences {
  automation: Record<string, boolean>;
  assets: Record<string, boolean>;
  notifications: Record<string, boolean>;
}

export async function fetchDealerPreferences() {
  return apiFetch<DealerPreferences>("/api/dealer/preferences");
}

export async function updateDealerPreferences(
  data: Partial<DealerPreferences>,
) {
  return apiFetch<DealerPreferences>("/api/dealer/preferences", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
