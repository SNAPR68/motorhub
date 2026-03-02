/**
 * Centralized plan limits and feature gating configuration.
 *
 * All tier enforcement logic reads from this file.
 * Pricing amounts are in INR paise (multiply by 100).
 */

export type PlanKey = "FREE" | "STARTER" | "GROWTH" | "ENTERPRISE";

// ---------------------------------------------------------------------------
// Pricing (INR paise)
// ---------------------------------------------------------------------------

export const PLAN_PRICES: Record<
  Exclude<PlanKey, "FREE">,
  { monthly: number; annual: number }
> = {
  STARTER: {
    monthly: 199900, // INR 1,999
    annual: 199900 * 10, // INR 19,990 (2 months free)
  },
  GROWTH: {
    monthly: 499900, // INR 4,999
    annual: 499900 * 10, // INR 49,990 (2 months free)
  },
  ENTERPRISE: {
    monthly: 1499900, // INR 14,999
    annual: 1499900 * 10, // INR 1,49,990 (2 months free)
  },
};

// ---------------------------------------------------------------------------
// Quota limits (-1 = unlimited)
// ---------------------------------------------------------------------------

export interface PlanLimits {
  vehicles: number;
  leadsPerMonth: number;
  aiCallsPerMonth: number;
  photoEditsPerMonth: number;
  videoScriptsPerMonth: number;
  teamMembers: number;
  analyticsRetentionDays: number;
  stores: number;
}

export const PLAN_LIMITS: Record<PlanKey, PlanLimits> = {
  FREE: {
    vehicles: 5,
    leadsPerMonth: 20,
    aiCallsPerMonth: 10,
    photoEditsPerMonth: 0,
    videoScriptsPerMonth: 0,
    teamMembers: 1,
    analyticsRetentionDays: 7,
    stores: 1,
  },
  STARTER: {
    vehicles: 25,
    leadsPerMonth: 100,
    aiCallsPerMonth: 50,
    photoEditsPerMonth: 20,
    videoScriptsPerMonth: 0,
    teamMembers: 2,
    analyticsRetentionDays: 30,
    stores: 1,
  },
  GROWTH: {
    vehicles: 100,
    leadsPerMonth: -1,
    aiCallsPerMonth: 200,
    photoEditsPerMonth: 100,
    videoScriptsPerMonth: 30,
    teamMembers: 5,
    analyticsRetentionDays: 90,
    stores: 3,
  },
  ENTERPRISE: {
    vehicles: -1,
    leadsPerMonth: -1,
    aiCallsPerMonth: -1,
    photoEditsPerMonth: -1,
    videoScriptsPerMonth: -1,
    teamMembers: -1,
    analyticsRetentionDays: -1, // unlimited
    stores: -1,
  },
};

// ---------------------------------------------------------------------------
// Feature flags per plan
// ---------------------------------------------------------------------------

export interface PlanFeatures {
  // AI content
  aiDescriptions: boolean;
  aiQuickDraft: boolean;
  aiCreativeSuggestions: boolean;
  aiNotificationEnhance: boolean;

  // AI leads
  aiSentiment: boolean;
  aiSmartReply: boolean;
  aiAutoReply: boolean;
  aiFollowUps: boolean;
  agentMemory: boolean;

  // AI media
  photoBackgroundRemoval: boolean;
  photoMoodApplication: boolean;
  reelScriptGeneration: boolean;
  reelTTS: boolean;
  cinemaExports: boolean;

  // Analytics & intelligence
  advancedAnalytics: boolean;
  benchmarks: boolean;
  healthScore: boolean;
  intelligenceBasic: boolean;
  intelligenceFull: boolean;
  dataExport: boolean;

  // Communication
  whatsappIntegration: boolean;
  bulkMessaging: boolean;

  // Marketing
  socialHub: boolean;
  campaignTools: boolean;
  autoPosting: boolean;

  // Management
  leadAssignment: boolean;
  multiStore: boolean;
  teamRoles: boolean;
  apiAccess: boolean;
  customBranding: boolean;

  // Virtual tour
  virtualTour360: boolean;
  interiorViewer: boolean;

  // Public profile
  publicBadge: "none" | "gold" | "platinum";
  removeBranding: boolean;
}

export const PLAN_FEATURES: Record<PlanKey, PlanFeatures> = {
  FREE: {
    aiDescriptions: true,
    aiQuickDraft: false,
    aiCreativeSuggestions: false,
    aiNotificationEnhance: false,
    aiSentiment: false,
    aiSmartReply: false,
    aiAutoReply: false,
    aiFollowUps: false,
    agentMemory: false,
    photoBackgroundRemoval: false,
    photoMoodApplication: false,
    reelScriptGeneration: false,
    reelTTS: false,
    cinemaExports: false,
    advancedAnalytics: false,
    benchmarks: false,
    healthScore: false,
    intelligenceBasic: false,
    intelligenceFull: false,
    dataExport: false,
    whatsappIntegration: false,
    bulkMessaging: false,
    socialHub: false,
    campaignTools: false,
    autoPosting: false,
    leadAssignment: false,
    multiStore: false,
    teamRoles: false,
    apiAccess: false,
    customBranding: false,
    virtualTour360: false,
    interiorViewer: false,
    publicBadge: "none",
    removeBranding: false,
  },
  STARTER: {
    aiDescriptions: true,
    aiQuickDraft: true,
    aiCreativeSuggestions: false,
    aiNotificationEnhance: false,
    aiSentiment: true,
    aiSmartReply: false,
    aiAutoReply: false,
    aiFollowUps: false,
    agentMemory: false,
    photoBackgroundRemoval: true,
    photoMoodApplication: false,
    reelScriptGeneration: false,
    reelTTS: false,
    cinemaExports: false,
    advancedAnalytics: false,
    benchmarks: false,
    healthScore: false,
    intelligenceBasic: false,
    intelligenceFull: false,
    dataExport: false,
    whatsappIntegration: false,
    bulkMessaging: false,
    socialHub: false,
    campaignTools: false,
    autoPosting: false,
    leadAssignment: false,
    multiStore: false,
    teamRoles: false,
    apiAccess: false,
    customBranding: false,
    virtualTour360: true,
    interiorViewer: false,
    publicBadge: "none",
    removeBranding: true,
  },
  GROWTH: {
    aiDescriptions: true,
    aiQuickDraft: true,
    aiCreativeSuggestions: true,
    aiNotificationEnhance: true,
    aiSentiment: true,
    aiSmartReply: true,
    aiAutoReply: true,
    aiFollowUps: true,
    agentMemory: true,
    photoBackgroundRemoval: true,
    photoMoodApplication: true,
    reelScriptGeneration: true,
    reelTTS: true,
    cinemaExports: false,
    advancedAnalytics: true,
    benchmarks: true,
    healthScore: true,
    intelligenceBasic: true,
    intelligenceFull: false,
    dataExport: false,
    whatsappIntegration: true,
    bulkMessaging: false,
    socialHub: true,
    campaignTools: true,
    autoPosting: false,
    leadAssignment: true,
    multiStore: false,
    teamRoles: true,
    apiAccess: false,
    customBranding: false,
    virtualTour360: true,
    interiorViewer: true,
    publicBadge: "gold",
    removeBranding: true,
  },
  ENTERPRISE: {
    aiDescriptions: true,
    aiQuickDraft: true,
    aiCreativeSuggestions: true,
    aiNotificationEnhance: true,
    aiSentiment: true,
    aiSmartReply: true,
    aiAutoReply: true,
    aiFollowUps: true,
    agentMemory: true,
    photoBackgroundRemoval: true,
    photoMoodApplication: true,
    reelScriptGeneration: true,
    reelTTS: true,
    cinemaExports: true,
    advancedAnalytics: true,
    benchmarks: true,
    healthScore: true,
    intelligenceBasic: true,
    intelligenceFull: true,
    dataExport: true,
    whatsappIntegration: true,
    bulkMessaging: true,
    socialHub: true,
    campaignTools: true,
    autoPosting: true,
    leadAssignment: true,
    multiStore: true,
    teamRoles: true,
    apiAccess: true,
    customBranding: true,
    virtualTour360: true,
    interiorViewer: true,
    publicBadge: "platinum",
    removeBranding: true,
  },
};

// ---------------------------------------------------------------------------
// Display metadata
// ---------------------------------------------------------------------------

export interface PlanDisplay {
  key: PlanKey;
  name: string;
  tagline: string;
  monthlyPrice: string;
  annualPrice: string;
  annualSavings: string;
  badge: string | null;
  popular: boolean;
  features: string[];
}

export const PLAN_DISPLAY: PlanDisplay[] = [
  {
    key: "FREE",
    name: "Free",
    tagline: "Get started, zero cost",
    monthlyPrice: "0",
    annualPrice: "0",
    annualSavings: "",
    badge: null,
    popular: false,
    features: [
      "5 Vehicle Listings",
      "20 Leads / month",
      "AI Descriptions (10/mo)",
      "Basic Dashboard",
      "7-Day Analytics",
      "Email Support",
    ],
  },
  {
    key: "STARTER",
    name: "Starter",
    tagline: "For independent dealers",
    monthlyPrice: "1,999",
    annualPrice: "19,990",
    annualSavings: "3,998",
    badge: null,
    popular: false,
    features: [
      "25 Vehicle Listings",
      "100 Leads / month",
      "AI Descriptions + Drafts (50/mo)",
      "AI Sentiment Analysis",
      "Background Removal (20/mo)",
      "360 Virtual Tour",
      "30-Day Analytics",
      "2 Team Members",
    ],
  },
  {
    key: "GROWTH",
    name: "Growth",
    tagline: "For growing dealerships",
    monthlyPrice: "4,999",
    annualPrice: "49,990",
    annualSavings: "9,998",
    badge: "Gold Dealer",
    popular: true,
    features: [
      "100 Vehicle Listings",
      "Unlimited Leads",
      "All AI Tools (200/mo)",
      "Auto-Reply + Smart Reply",
      "Full Photo Studio (100/mo)",
      "Video Tools (30/mo)",
      "360 Tour + Interior Viewer",
      "90-Day Analytics + Benchmarks",
      "Health Score (Public)",
      "Market Intelligence",
      "WhatsApp Integration",
      "Social Hub + Campaigns",
      "5 Team Members",
      "Priority Support",
    ],
  },
  {
    key: "ENTERPRISE",
    name: "Enterprise",
    tagline: "For large dealership chains",
    monthlyPrice: "14,999",
    annualPrice: "1,49,990",
    annualSavings: "29,998",
    badge: "Platinum Dealer",
    popular: false,
    features: [
      "Unlimited Vehicles",
      "Unlimited Leads",
      "Unlimited AI Calls",
      "Unlimited Photo & Video",
      "Full DemandPulse Intelligence",
      "Cinema Exports (4K)",
      "Data Export (CSV/PDF)",
      "API Access",
      "Multi-Store Management",
      "Unlimited Team + RBAC",
      "Custom Branding",
      "Dedicated Account Manager",
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Check if a quota allows the action (-1 = unlimited) */
export function isWithinQuota(limit: number, currentUsage: number): boolean {
  if (limit === -1) return true;
  return currentUsage < limit;
}

/** Get plan limits for a given plan key */
export function getLimits(plan: PlanKey): PlanLimits {
  return PLAN_LIMITS[plan] ?? PLAN_LIMITS.FREE;
}

/** Get plan features for a given plan key */
export function getFeatures(plan: PlanKey): PlanFeatures {
  return PLAN_FEATURES[plan] ?? PLAN_FEATURES.FREE;
}

/** Check if a specific feature is available on a plan */
export function hasFeature(
  plan: PlanKey,
  feature: keyof PlanFeatures,
): boolean {
  const features = getFeatures(plan);
  const value = features[feature];
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value !== "none";
  return false;
}

/** Get the minimum plan required for a feature */
export function minimumPlanFor(feature: keyof PlanFeatures): PlanKey {
  const order: PlanKey[] = ["FREE", "STARTER", "GROWTH", "ENTERPRISE"];
  for (const plan of order) {
    if (hasFeature(plan, feature)) return plan;
  }
  return "ENTERPRISE";
}
