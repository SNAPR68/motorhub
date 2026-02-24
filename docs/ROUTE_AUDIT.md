# Autovinci Route Audit & Wiring Plan

## Executive Summary

**Total routes:** 52  
**Broken links:** 2 (404 targets)  
**Orphaned routes:** 6 (no inbound navigation)  
**Dead href (#):** 8+ placeholder links  

---

## 1. Broken Links (Fix Immediately)

| Source | Current href | Problem | Fix |
|-------|--------------|---------|-----|
| `DealerAppShell.tsx` | `/dashboard/settings` | 404 (no such route) | `/settings` |
| `page.tsx` (landing) | `/dashboard/leads` | 404 (route is `/leads`) | `/leads` |

---

## 2. Orphaned Routes (No Inbound App Navigation)

| Route | Suggested Entry Point |
|-------|------------------------|
| `/intelligence` | Dashboard stats, Analytics page |
| `/compare` | Inventory, Vehicle detail |
| `/interests` | Landing (#buy-car), Showroom |
| `/social-hub` | Dashboard, Settings |
| `/analytics` | Dashboard, Settings |
| `/onboarding/social` | After dealer login (first-time flow) |

---

## 3. Dead / Placeholder Links (`href="#"`)

| Page | Element | Fix |
|------|---------|-----|
| `inventory` | Showcase nav item | `/showroom` |
| `inventory` | Settings nav item | `/settings` |
| `showroom` | Settings nav item | `/login/buyer` (buyer settings) or `/interests` |
| `reservation` | Back link goes to `/vehicle/1` | Keep (OK) |
| `my-cars` | Documents, Warranty | Keep # for now (no pages) |
| `page.tsx` (landing) | Footer links, various | Keep # for now |

---

## 4. Route Map (Inbound Links)

| Route | Inbound From |
|-------|--------------|
| `/` | vip, interests, login/buyer, vip/confirmation, my-cars |
| `/alerts` | my-cars nav |
| `/analytics` | intelligence, performance, reports/monthly, stores/[id] |
| `/appointments` | leads/[id] |
| `/compare` | inventory (back only) — **needs inbound** |
| `/concierge` | showroom, concierge/discovery, wishlist, landing |
| `/concierge/discovery` | showcase |
| `/content-studio` | marketing, quick-draft, reel-editor, social-hub |
| `/dashboard` | intelligence, marketing, concierge, onboarding, social-hub, studio |
| `/handover` | my-cars |
| `/intelligence` | **ORPHANED** |
| `/interests` | **ORPHANED** (back to / only) |
| `/inventory` | dashboard, vehicle, wishlist, compare, my-cars nav |
| `/leads` | DealerAppShell |
| `/leads/[id]` | leads list, smart-reply, appointments |
| `/login/buyer` | landing, showroom, login/dealer |
| `/login/dealer` | landing, login/buyer |
| `/marketing` | content-studio, studio |
| `/my-cars` | service, alerts, handover, my-cars nav |
| `/onboarding/social` | **ORPHANED** (only self or dashboard) |
| `/performance` | analytics |
| `/plans` | settings, settings/billing |
| `/profit` | intelligence |
| `/quick-draft` | content-studio |
| `/reel-editor` | content-studio |
| `/reports/monthly` | analytics |
| `/reservation` | vehicle, showcase, storyboard |
| `/service` | my-cars, service/logistics |
| `/service/logistics` | service |
| `/settings` | stores, plans, notifications/history, settings/* |
| `/showcase/[id]` | showroom, interests, storyboard |
| `/showroom` | showcase, concierge/discovery |
| `/smart-reply` | leads/[id] |
| `/social-hub` | **ORPHANED** |
| `/stores` | settings, storyboard |
| `/stores/[id]` | stores |
| `/storyboard/[id]` | showcase |
| `/studio` | dashboard, DealerAppShell |
| `/vehicle/[id]` | inventory, dashboard, storyboard, virtual-tour, concierge |
| `/vip` | vip/rewards |
| `/vip/confirmation` | vip |
| `/vip/rewards` | vip |
| `/virtual-tour/[id]` | concierge/discovery |
| `/wishlist` | my-cars nav |

---

## 5. Backend / Data Roadmap (Phase 1)

For transitioning from prototype → production, start with **one vertical slice**.

### Recommended First Flow: Lead Management

**Why:** Core dealer value, clear data model, manageable scope.

| Step | Task | Tech |
|------|------|------|
| 1 | Add Auth | NextAuth.js + credentials or Google |
| 2 | DB + schema | Postgres (Vercel/Supabase) — `users`, `leads`, `vehicles` |
| 3 | API routes | `POST /api/leads`, `GET /api/leads`, `PATCH /api/leads/[id]` |
| 4 | Replace mock data | Fetch leads in `/leads`, `/leads/[id] from API |
| 5 | Wire smart-reply | Store AI replies via API |

### Schema (Minimal)

```sql
users (id, email, name, role)
leads (id, dealer_id, name, phone, vehicle_id, sentiment, source, created_at)
vehicles (id, dealer_id, name, price, images, ...)
```

### Auth Flow

- `/login/dealer` → NextAuth signIn → redirect `/dashboard`
- Protect `/dashboard`, `/leads`, `/studio`, etc. with middleware

---

## 6. Wiring Checklist (Completed)

- [x] DealerAppShell: `/dashboard/settings` → `/settings`
- [x] Landing: `/dashboard/leads` → `/leads`
- [x] Dashboard: Add links to Analytics, Intelligence, Social Hub; stats → inventory, leads, studio
- [x] Inventory: Showcase `#` → `/showroom`, Settings `#` → `/settings`; Compare + Studio links
- [x] Showroom: Settings `#` → `/interests`
- [x] Vehicle: Add Virtual Tour, Compare buttons
- [x] Landing "View All Cars" → `/inventory`; "Curated for You" → `/interests`
- [x] Landing "Get Free Valuation" → `/login/dealer`
- [x] Social Hub: Settings, Dashboard
- [x] Interests: Landing, Showroom (Settings nav)
- [x] Compare: Inventory car cards, Vehicle page
- [x] Onboarding: Settings → `/onboarding/social`
