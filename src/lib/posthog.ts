/* Autovinci — PostHog Analytics Client */

import posthog from "posthog-js";

let posthogInitialized = false;

export function initPostHog() {
  if (posthogInitialized) return;
  if (typeof window === "undefined") return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

  if (!key) return;

  posthog.init(key, {
    api_host: host,
    person_profiles: "identified_only",
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true,

    // Respect user privacy
    respect_dnt: true,
    opt_out_capturing_by_default: false,

    // Performance
    loaded: (ph) => {
      if (process.env.NODE_ENV === "development") {
        ph.debug();
      }
    },
  });

  posthogInitialized = true;
}

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  posthog.identify(userId, traits);
}

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  posthog.capture(event, properties);
}

export function resetUser() {
  if (typeof window === "undefined") return;
  posthog.reset();
}

// Pre-defined event helpers
export const analytics = {
  vehicleViewed: (vehicleId: string, vehicleName: string) =>
    trackEvent("vehicle_viewed", { vehicle_id: vehicleId, vehicle_name: vehicleName }),

  vehicleCreated: (vehicleId: string) =>
    trackEvent("vehicle_created", { vehicle_id: vehicleId }),

  leadCreated: (leadId: string, source: string) =>
    trackEvent("lead_created", { lead_id: leadId, source }),

  messageSent: (leadId: string) =>
    trackEvent("message_sent", { lead_id: leadId }),

  wishlistToggled: (vehicleId: string, added: boolean) =>
    trackEvent("wishlist_toggled", { vehicle_id: vehicleId, added }),

  searchPerformed: (query: string, resultCount: number) =>
    trackEvent("search_performed", { query, result_count: resultCount }),

  filterApplied: (filterType: string, filterValue: string) =>
    trackEvent("filter_applied", { filter_type: filterType, filter_value: filterValue }),

  appointmentCreated: (appointmentId: string) =>
    trackEvent("appointment_created", { appointment_id: appointmentId }),

  loginCompleted: (method: string) =>
    trackEvent("login_completed", { method }),

  signupCompleted: (role: string) =>
    trackEvent("signup_completed", { role }),
};
