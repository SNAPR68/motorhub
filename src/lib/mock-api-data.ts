/* Autovinci — Mock API Data (Dealer profiles, stores, team, dashboard stats) */

import type {
  AuthUser,
  DealerProfile,
  StoreLocation,
  TeamMember,
} from "./auth-types";

// ── Mock Users ──

export const MOCK_DEALER_USER: AuthUser = {
  id: "dealer-001",
  name: "Rajesh Malhotra",
  email: "rajesh@autovinci.in",
  role: "dealer",
  avatar: "https://lh3.googleusercontent.com/a/default-user",
  dealershipName: "Malhotra Auto Gallery",
  dealershipId: "mag-delhi-01",
};

export const MOCK_BUYER_USER: AuthUser = {
  id: "buyer-001",
  name: "Amit Verma",
  email: "amit.verma@gmail.com",
  role: "buyer",
  avatar: "https://lh3.googleusercontent.com/a/default-user",
};

// ── Mock Credentials (for login API stub) ──

export const MOCK_CREDENTIALS = [
  { email: "rajesh@autovinci.in", password: "dealer123", role: "dealer" as const, user: MOCK_DEALER_USER },
  { email: "amit.verma@gmail.com", password: "buyer123", role: "buyer" as const, user: MOCK_BUYER_USER },
] as const;

// ── Dealer Profile ──

export const MOCK_DEALER_PROFILE: DealerProfile = {
  dealershipName: "Malhotra Auto Gallery",
  dealershipId: "mag-delhi-01",
  gstin: "07AAACM1234A1Z5",
  phone: "+91 11 4567 8900",
  address: "Plot 24, Sector 18, Dwarka",
  city: "New Delhi",
  state: "Delhi",
  logoUrl: "https://lh3.googleusercontent.com/a/default-user",
  plan: "growth",
};

// ── Stores ──

export const MOCK_STORES: StoreLocation[] = [
  {
    id: "store-dwarka",
    name: "Dwarka Flagship",
    address: "Plot 24, Sector 18, Dwarka, New Delhi 110075",
    city: "New Delhi",
    phone: "+91 11 4567 8900",
    manager: "Rajesh Malhotra",
    vehicleCount: 42,
    status: "active",
  },
  {
    id: "store-gurgaon",
    name: "Gurgaon Hub",
    address: "Tower B, Ground Floor, DLF Cyber City, Gurgaon 122002",
    city: "Gurgaon",
    phone: "+91 124 456 7890",
    manager: "Priya Kapoor",
    vehicleCount: 28,
    status: "active",
  },
  {
    id: "store-noida",
    name: "Noida Express",
    address: "A-12, Sector 62, Noida 201301",
    city: "Noida",
    phone: "+91 120 345 6789",
    manager: "Vikram Singh",
    vehicleCount: 19,
    status: "active",
  },
];

// ── Team ──

export const MOCK_TEAM: TeamMember[] = [
  {
    id: "team-1",
    name: "Rajesh Malhotra",
    role: "Owner",
    email: "rajesh@autovinci.in",
    avatar: "https://lh3.googleusercontent.com/a/default-user",
    joinedAt: "2024-01-15",
    status: "active",
  },
  {
    id: "team-2",
    name: "Priya Kapoor",
    role: "Sales Manager",
    email: "priya.k@autovinci.in",
    avatar: "https://lh3.googleusercontent.com/a/default-user",
    joinedAt: "2024-03-01",
    status: "active",
  },
  {
    id: "team-3",
    name: "Vikram Singh",
    role: "Inventory Lead",
    email: "vikram.s@autovinci.in",
    avatar: "https://lh3.googleusercontent.com/a/default-user",
    joinedAt: "2024-06-15",
    status: "active",
  },
  {
    id: "team-4",
    name: "Aisha Patel",
    role: "Marketing",
    email: "aisha.p@autovinci.in",
    avatar: "https://lh3.googleusercontent.com/a/default-user",
    joinedAt: "2025-01-10",
    status: "invited",
  },
];

// ── Dashboard Stats ──

export const MOCK_DASHBOARD_STATS = {
  totalVehicles: 89,
  activeLeads: 24,
  monthlySales: 12,
  revenue: "₹ 1.86 Cr",
  avgDaysToSell: 18,
  conversionRate: "32%",
  aiRepliesSent: 156,
  socialReach: "45.2K",
};
