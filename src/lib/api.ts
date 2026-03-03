/* CaroBest — Client-side API helpers
 *
 * Provides typed fetch wrappers for all API routes,
 * plus adapters to convert Prisma DB records into the
 * component-level types used by pages.
 */

import type { Vehicle, Lead } from "./types";

// ── Base Fetch ──

const BASE =
  typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_APP_URL || "";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) {
    // Pass JSON error body so useApi can extract error code
    try {
      const body = await res.json();
      throw new Error(JSON.stringify(body));
    } catch (e) {
      if (e instanceof Error && e.message.startsWith("{")) throw e;
      const code = res.status >= 500 ? "INTERNAL_ERROR"
                 : res.status === 401 ? "UNAUTHORIZED"
                 : res.status === 403 ? "FORBIDDEN"
                 : "UNKNOWN";
      throw new Error(JSON.stringify({ error: `API ${path}: ${res.status}`, code }));
    }
  }
  return res.json();
}

// ── Vehicle API ──

export async function fetchVehicles(params?: {
  category?: string;
  status?: string;
  search?: string;
  sort?: string;
  city?: string;
  brand?: string;
  limit?: number;
  offset?: number;
}) {
  const sp = new URLSearchParams();
  if (params?.category) sp.set("category", params.category);
  if (params?.status) sp.set("status", params.status);
  if (params?.search) sp.set("search", params.search);
  if (params?.sort) sp.set("sort", params.sort);
  if (params?.city) sp.set("city", params.city);
  if (params?.brand) sp.set("brand", params.brand);
  if (params?.limit) sp.set("limit", String(params.limit));
  if (params?.offset) sp.set("offset", String(params.offset));

  const qs = sp.toString();
  return apiFetch<{ vehicles: DbVehicle[]; total: number }>(
    `/api/vehicles${qs ? `?${qs}` : ""}`
  );
}

// ── Public Dealer Search ──

export interface PublicDealer {
  id: string;
  dealershipName: string;
  ownerName: string;
  city: string;
  state: string;
  phone: string | null;
  logo: string | null;
  plan: string;
  vehicleCount: number;
  address: string;
}

export async function fetchDealerSearch(params?: {
  city?: string;
  brand?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const sp = new URLSearchParams();
  if (params?.city) sp.set("city", params.city);
  if (params?.brand) sp.set("brand", params.brand);
  if (params?.search) sp.set("search", params.search);
  if (params?.limit) sp.set("limit", String(params.limit));
  if (params?.offset) sp.set("offset", String(params.offset));

  const qs = sp.toString();
  return apiFetch<{ dealers: PublicDealer[]; total: number }>(
    `/api/dealers/search${qs ? `?${qs}` : ""}`
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

// ── User Preferences (Buyer alert prefs) ──

export interface UserPreferences {
  emailPrefs: Record<string, boolean>;
  waPrefs: Record<string, boolean>;
  frequency: string;
  quietHours?: string;
  timezone?: string;
}

export async function fetchUserPreferences() {
  return apiFetch<UserPreferences>("/api/user/preferences");
}

export async function updateUserPreferences(data: Partial<UserPreferences>) {
  return apiFetch<UserPreferences>("/api/user/preferences", {
    method: "PUT",
    body: JSON.stringify(data),
  });
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
    avgDaysToSell?: number;
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

// ── Admin Dashboard APIs ──

export interface AdminDealer {
  id: string;
  dealershipName: string;
  email: string;
  ownerName: string;
  city: string;
  state: string;
  plan: string;
  vehicleCount: number;
  leadCount: number;
  closedWonCount: number;
  createdAt: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchAdminOverview(): Promise<any> {
  return apiFetch("/api/admin/overview");
}

export async function fetchAdminDealers(params?: { search?: string; plan?: string; city?: string }) {
  const qs = new URLSearchParams();
  if (params?.search) qs.set("search", params.search);
  if (params?.plan) qs.set("plan", params.plan);
  if (params?.city) qs.set("city", params.city);
  const query = qs.toString();
  return apiFetch<{ dealers: AdminDealer[]; total: number }>(`/api/admin/dealers${query ? `?${query}` : ""}`);
}

export async function updateDealerAdmin(dealerId: string, data: { plan?: string }) {
  return apiFetch<{ dealer: AdminDealer }>("/api/admin/dealers", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dealerId, ...data }),
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchAdminSubscriptions(): Promise<any> {
  return apiFetch("/api/admin/subscriptions");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchAdminServices(): Promise<any> {
  return apiFetch("/api/admin/services");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchAdminAnalytics(): Promise<any> {
  return apiFetch("/api/admin/analytics");
}

export async function fetchAdminVehicleModeration(params?: { tab?: string; search?: string }) {
  const qs = new URLSearchParams();
  if (params?.tab) qs.set("tab", params.tab);
  if (params?.search) qs.set("search", params.search);
  const query = qs.toString();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return apiFetch<any>(`/api/admin/vehicles/moderation${query ? `?${query}` : ""}`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function adminVehicleAction(vehicleId: string, action: string): Promise<any> {
  return apiFetch("/api/admin/vehicles/moderation", {
    method: "PATCH",
    body: JSON.stringify({ vehicleId, action }),
  });
}

export async function fetchAdminUsers(params?: { tab?: string; search?: string; limit?: number; offset?: number }) {
  const qs = new URLSearchParams();
  if (params?.tab) qs.set("tab", params.tab);
  if (params?.search) qs.set("search", params.search);
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.offset) qs.set("offset", String(params.offset));
  const query = qs.toString();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return apiFetch<any>(`/api/admin/users${query ? `?${query}` : ""}`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function reassignLead(leadId: string, newDealerProfileId: string): Promise<any> {
  return apiFetch("/api/admin/users/leads", {
    method: "PATCH",
    body: JSON.stringify({ leadId, newDealerProfileId }),
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function sendAdminBroadcast(data: { title: string; message: string; targetPlan: string }): Promise<any> {
  return apiFetch("/api/admin/broadcast", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function toggleDealerActive(dealerId: string, active: boolean): Promise<any> {
  return apiFetch("/api/admin/dealers/toggle", {
    method: "PATCH",
    body: JSON.stringify({ dealerId, active }),
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchAdminQuality(params?: { tab?: string; limit?: number; offset?: number }): Promise<any> {
  const qs = new URLSearchParams();
  if (params?.tab) qs.set("tab", params.tab);
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.offset) qs.set("offset", String(params.offset));
  const query = qs.toString();
  return apiFetch(`/api/admin/quality${query ? `?${query}` : ""}`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchAdminAlerts(): Promise<any> {
  return apiFetch("/api/admin/alerts");
}

// ── Buyer Inquiries (public, no auth required) ──

export async function submitInquiry(data: {
  vehicleId: string;
  buyerName: string;
  phone: string;
  email?: string;
  message?: string;
  type?: "GENERAL" | "TEST_DRIVE" | "CALL_BACK";
}) {
  return apiFetch<{ success: boolean; inquiryId: string }>("/api/inquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// ── Dealer Health Score, Benchmarks & Trends (Switching Cost) ──

export async function fetchHealthScore(): Promise<any> {
  return apiFetch("/api/analytics/health-score");
}

export async function fetchBenchmarks(): Promise<any> {
  return apiFetch("/api/analytics/benchmarks");
}

export async function fetchTrends(weeks = 12): Promise<any> {
  return apiFetch(`/api/analytics/trends?weeks=${weeks}`);
}

export async function fetchDataExport(): Promise<any> {
  return apiFetch("/api/analytics/export");
}

export async function fetchPublicDealerProfile(dealerId: string): Promise<any> {
  return apiFetch(`/api/dealers/${dealerId}/public`);
}

// ── Market Intelligence Feed ──

export async function fetchMarketFeed(): Promise<any> {
  return apiFetch("/api/intelligence/market-feed");
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

export async function fetchServiceBookings(type?: string) {
  const qs = type ? `?type=${type}` : "";
  return apiFetch<{
    bookings: Array<{
      id: string;
      type: string;
      status: string;
      plan: string | null;
      amount: number | null;
      details: Record<string, unknown>;
      scheduledAt: string | null;
      phone: string | null;
      email: string | null;
      city: string | null;
      createdAt: string;
      updatedAt: string;
    }>;
    total: number;
  }>(`/api/services/book${qs}`);
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

// ── Payments (Razorpay) ──

export interface PaymentOrder {
  orderId: string;
  amount: number;
  currency: string;
  key: string;
  plan: string;
  billing: string;
  demo?: boolean;
}

export async function createPaymentOrder(data: {
  plan: "STARTER" | "GROWTH" | "ENTERPRISE";
  billing: "monthly" | "annual";
}) {
  return apiFetch<PaymentOrder>("/api/payments/create-order", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function verifyPayment(data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  plan: "STARTER" | "GROWTH" | "ENTERPRISE";
  billing: "monthly" | "annual";
}) {
  return apiFetch<{ verified: boolean; plan: string; demo?: boolean }>(
    "/api/payments/verify",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

// ── Predictive Lead Scoring ──

export async function fetchLeadScore(leadId: string): Promise<{
  leadId: string;
  score: number;
  confidence: number;
  signals: Array<{ name: string; value: number; detail: string }>;
  predictedOutcome: "LIKELY_CONVERT" | "NEEDS_NURTURE" | "AT_RISK" | "COLD";
  suggestedAction: string;
}> {
  return apiFetch(`/api/leads/${leadId}/score`);
}

// ── Escrow API ──

export interface EscrowAccount {
  id: string;
  vehicleId: string;
  buyerId: string;
  dealerProfileId: string;
  amount: number;
  platformFee: number;
  status: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  paidAt: string | null;
  deliveredAt: string | null;
  releasedAt: string | null;
  refundedAt: string | null;
  disputeReason: string | null;
  expiresAt: string | null;
  createdAt: string;
  vehicle?: { id: string; name: string; priceDisplay: string; images: string[]; location: string };
  dealerProfile?: { dealershipName: string; city: string };
  transactions?: Array<{ id: string; type: string; debitAccount: string; creditAccount: string; amount: number; description: string | null; createdAt: string }>;
}

export async function createEscrow(vehicleId: string) {
  return apiFetch<{ escrowId: string; amount: number; platformFee: number; expiresAt: string; status: string }>(
    "/api/escrow",
    { method: "POST", body: JSON.stringify({ vehicleId }) },
  );
}

export async function fetchEscrows(status?: string) {
  const qs = status ? `?status=${status}` : "";
  return apiFetch<{ escrows: EscrowAccount[]; total: number }>(`/api/escrow${qs}`);
}

export async function fetchEscrow(id: string) {
  return apiFetch<{ escrow: EscrowAccount }>(`/api/escrow/${id}`);
}

export async function updateEscrow(id: string, action: string, extra?: Record<string, unknown>) {
  return apiFetch<{ escrow: EscrowAccount }>(`/api/escrow/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ action, ...extra }),
  });
}

// ── Auction API ──

export interface AuctionItem {
  id: string;
  vehicleId: string;
  dealerProfileId: string;
  startPrice: number;
  currentPrice: number;
  bidIncrement: number;
  status: string;
  startTime: string;
  endTime: string;
  winnerId: string | null;
  createdAt: string;
  vehicle?: { id: string; name: string; priceDisplay: string; images: string[]; location: string; year: number; km: string; fuel: string };
  dealerProfile?: { dealershipName: string; city: string };
  bids?: Array<{ id: string; amount: number; createdAt: string; dealerProfile: { dealershipName: string; city: string } }>;
  _count?: { bids: number };
}

export async function fetchAuctions(params?: { status?: string; dealerId?: string; limit?: number }) {
  const sp = new URLSearchParams();
  if (params?.status) sp.set("status", params.status);
  if (params?.dealerId) sp.set("dealerId", params.dealerId);
  if (params?.limit) sp.set("limit", String(params.limit));
  const qs = sp.toString();
  return apiFetch<{ auctions: AuctionItem[]; total: number }>(`/api/auctions${qs ? `?${qs}` : ""}`);
}

export async function fetchAuction(id: string) {
  return apiFetch<{ auction: AuctionItem }>(`/api/auctions/${id}`);
}

export async function createAuction(data: { vehicleId: string; startPrice: number; bidIncrement?: number; durationHours: number }) {
  return apiFetch<{ auction: AuctionItem }>("/api/auctions", { method: "POST", body: JSON.stringify(data) });
}

export async function placeBid(auctionId: string, amount: number) {
  return apiFetch<{ bid: { id: string; amount: number; createdAt: string } }>(
    `/api/auctions/${auctionId}/bids`,
    { method: "POST", body: JSON.stringify({ amount }) },
  );
}

export async function cancelAuction(auctionId: string) {
  return apiFetch<{ auction: AuctionItem }>(`/api/auctions/${auctionId}`, { method: "PATCH" });
}

// ── Finance API ──

export interface FinanceApp {
  id: string;
  type: string;
  status: string;
  provider: string | null;
  amount: number | null;
  tenure: number | null;
  interestRate: number | null;
  emi: number | null;
  downPayment: number | null;
  createdAt: string;
  vehicle?: { id: string; name: string; priceDisplay: string; images: string[] } | null;
}

export async function fetchFinanceApplications(type?: string) {
  const qs = type ? `?type=${type}` : "";
  return apiFetch<{ applications: FinanceApp[]; total: number }>(`/api/finance${qs}`);
}

export async function createFinanceApplication(data: {
  vehicleId?: string;
  type: "LOAN" | "INSURANCE";
  amount?: number;
  tenure?: number;
  downPayment?: number;
  applicantDetails: {
    fullName: string;
    phone: string;
    email?: string;
    income?: number;
    employment?: "SALARIED" | "SELF_EMPLOYED" | "BUSINESS";
    panCard?: string;
    city?: string;
  };
}) {
  return apiFetch<{ application: FinanceApp }>("/api/finance", { method: "POST", body: JSON.stringify(data) });
}

// ── Health Check ──

export async function fetchHealthCheck(): Promise<{
  status: "healthy" | "degraded" | "critical";
  timestamp: string;
  version: string;
  uptime: string;
  checks: Record<string, { status: string; detail?: string }>;
  metrics: Record<string, unknown>;
}> {
  return apiFetch("/api/health");
}
