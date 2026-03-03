/* CaroBest — Constants & Navigation */

import type { NavItem, FilterCategory } from "./types";

// ── Buyer Bottom Nav (matches stitch: home, directions_car, search, verified_user, account_circle) ──

export const BUYER_NAV_ITEMS: NavItem[] = [
  { icon: "home", label: "Home", href: "/" },
  { icon: "fiber_new", label: "New Cars", href: "/new-cars" },
  { icon: "directions_car", label: "Used Cars", href: "/used-cars" },
  { icon: "compare_arrows", label: "Compare", href: "/compare" },
  { icon: "account_circle", label: "My Account", href: "/my-account" },
];

// ── Dealer Bottom Nav (matches stitch: dashboard, inventory, leads, ai_tasks, account) ──

export const DEALER_NAV_ITEMS: NavItem[] = [
  { icon: "dashboard", label: "Dashboard", href: "/dashboard" },
  { icon: "inventory_2", label: "Inventory", href: "/inventory" },
  { icon: "auto_awesome", label: "Studio", href: "/studio" },
  { icon: "group", label: "Leads", href: "/leads" },
  { icon: "settings", label: "Settings", href: "/settings" },
];

// ── My Cars Nav ──

export const MY_CARS_NAV_ITEMS: NavItem[] = [
  { icon: "home", label: "Home", href: "/" },
  { icon: "search", label: "Search", href: "/inventory" },
  { icon: "directions_car", label: "My Cars", href: "/my-cars" },
  { icon: "favorite", label: "Wishlist", href: "/wishlist" },
  { icon: "notifications", label: "Alerts", href: "/alerts" },
];

// ── Vehicle Categories (Landing Page) ──

export const VEHICLE_CATEGORIES = [
  { label: "SUV", value: "suv", icon: "🚙" },
  { label: "Sedan", value: "sedan", icon: "🚗" },
  { label: "Hatchback", value: "hatchback", icon: "🏎️" },
  { label: "Electric", value: "ev", icon: "⚡" },
] as const;

// ── Inventory Filters ──

export const INVENTORY_FILTERS: FilterCategory[] = [
  {
    label: "Fuel Type",
    key: "fuel",
    options: [
      { label: "All", value: "" },
      { label: "Petrol", value: "Petrol" },
      { label: "Diesel", value: "Diesel" },
      { label: "Electric", value: "Electric" },
    ],
  },
  {
    label: "Transmission",
    key: "transmission",
    options: [
      { label: "All", value: "" },
      { label: "Automatic", value: "Automatic" },
      { label: "Manual", value: "Manual" },
      { label: "CVT", value: "CVT" },
    ],
  },
  {
    label: "Price Range",
    key: "price",
    options: [
      { label: "All", value: "" },
      { label: "Under \u20B910L", value: "0-1000000" },
      { label: "\u20B910L - 20L", value: "1000000-2000000" },
      { label: "Above \u20B920L", value: "2000000-99999999" },
    ],
  },
  {
    label: "Year",
    key: "year",
    options: [
      { label: "All", value: "" },
      { label: "2024", value: "2024" },
      { label: "2023", value: "2023" },
      { label: "2022", value: "2022" },
      { label: "2021 & older", value: "2021" },
    ],
  },
];

// ── Sort Options ──

export const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest First", value: "newest" },
  { label: "AI Score", value: "ai_score" },
] as const;

// ── Lead Filter Tabs ──

export const LEAD_FILTERS = ["New", "Follow-up", "Test Drive", "Closed"];

// ── Quick Actions (Dashboard) ──

export const DASHBOARD_QUICK_LINKS = [
  { label: "Analytics", href: "/analytics" },
  { label: "Intelligence", href: "/intelligence" },
  { label: "Social Hub", href: "/social-hub" },
  { label: "Reports", href: "/reports/monthly" },
] as const;

// ── Status Display Map ──

export const STATUS_DISPLAY: Record<
  string,
  { label: string; color: string; dot: string }
> = {
  available: { label: "Available", color: "text-emerald-400", dot: "bg-emerald-500" },
  in_review: { label: "In Review", color: "text-amber-400", dot: "bg-amber-500" },
  sold: { label: "Sold", color: "text-red-400", dot: "bg-red-500" },
  reserved: { label: "Reserved", color: "text-blue-400", dot: "bg-blue-500" },
};

// ── Sentiment Display Map ──

export const SENTIMENT_DISPLAY: Record<
  string,
  { label: string; color: string; bg: string; dot: string }
> = {
  hot: { label: "HOT", color: "text-red-500", bg: "bg-red-500/10", dot: "bg-red-500" },
  warm: { label: "WARM", color: "text-amber-500", bg: "bg-amber-500/10", dot: "bg-amber-500" },
  cool: { label: "COOL", color: "text-slate-400", bg: "bg-slate-500/10", dot: "bg-slate-400" },
};
