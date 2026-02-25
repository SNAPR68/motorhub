/* Autovinci — Shared TypeScript Interfaces */

// ── Vehicle ──

export type VehicleStatus = "available" | "in_review" | "sold" | "reserved";

export interface VehicleSpec {
  key: string;
  label: string;
  value: string;
}

export interface VehicleFeature {
  key: string;
  label: string;
  available: boolean;
}

export interface Vehicle {
  id: string;
  name: string;
  year: number;
  price: string;
  priceNumeric: number;
  image: string;
  status: VehicleStatus;
  statusColor: string;
  aiTag: boolean;
  aiScore: number;
  km: string;
  fuel: string;
  transmission: string;
  engine: string;
  power: string;
  mileage: string;
  location: string;
  owner: string;
  badge?: string | null;
  category: "suv" | "sedan" | "hatchback" | "ev" | "luxury";
  features: VehicleFeature[];
  gallery: string[];
  /** Index into gallery[] that the dealer marked as the 360° panoramic image. null = none set. */
  panoramaImageIdx: number | null;
}

// ── Lead ──

export type SentimentLevel = "hot" | "warm" | "cool";

export interface Lead {
  id: string;
  name: string;
  source: string;
  sourceColor: string;
  sentiment: number;
  sentimentLabel: SentimentLevel;
  car: string;
  carImage: string;
  time: string;
  message: string;
  phone?: string;
  location?: string;
  budget?: string;
}

export interface TimelineMessage {
  id: number;
  role: "ai" | "user";
  text: string;
  time: string;
  type: "auto" | "manual";
}

// ── Chat / Concierge ──

export interface ChatMessage {
  id: number;
  role: "ai" | "user";
  text: string;
  car?: {
    name: string;
    price: string;
    specs: string;
    image: string;
  };
}

// ── Navigation ──

export interface NavItem {
  icon: string;
  label: string;
  href: string;
  active?: boolean;
}

// ── Dashboard ──

export interface DashboardStat {
  icon: string;
  value: string;
  label: string;
  href: string;
  trend?: string;
}

export interface Activity {
  title: string;
  desc: string;
  time: string;
  type: "success" | "warning" | "info" | "auto";
}

// ── Filters ──

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterCategory {
  label: string;
  key: string;
  options: FilterOption[];
}

// ── Wishlist ──

export interface WishlistItem {
  vehicleId: string;
  addedAt: number;
}

// ── Ownership ──

export interface OwnedCar {
  id: string;
  name: string;
  vin: string;
  image: string;
  purchaseDate: string;
  warranty: string;
  nextService: string;
  insurance: string;
  km: string;
}

// ── Showroom ──

export interface ShowroomSlide {
  id: string;
  name: string;
  subtitle: string;
  edition: string;
  image: string;
  desc: string;
}
