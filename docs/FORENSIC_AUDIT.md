# Autovinci — Forensic Project Audit

> **Generated:** February 2026  
> **Purpose:** Complete project structure, tech stack, user journeys, and built vs. needs building vs. broken status.

---

## 1. Project Structure (Forensic Order)

```
autovinci-web/
├── .claude/                      # Claude IDE config
│   ├── launch.json
│   ├── settings.local.json
│   └── worktrees/
├── .git/                         # Version control
├── .next/                        # Next.js build output (generated)
├── docs/                         # Documentation
│   ├── ROUTE_AUDIT.md           # Route wiring & dead links
│   └── FORENSIC_AUDIT.md        # This file
├── node_modules/                 # Dependencies (generated)
├── prisma/                       # Database schema & migrations
│   ├── schema.prisma            # 13 models: User, DealerProfile, Vehicle, Lead, etc.
│   └── seed.ts                  # Seed script
├── prisma.config.ts              # Prisma config
├── public/                       # Static assets
│   └── manifest.json            # PWA manifest
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── api/                 # API routes
│   │   │   ├── ai/              # AI endpoints (quick-draft, smart-reply)
│   │   │   ├── analytics/       # Dashboard funnel/stats
│   │   │   ├── auth/            # Login, logout, callback, me, signup
│   │   │   ├── dealer/          # Profile, team
│   │   │   ├── leads/           # CRUD + messages
│   │   │   ├── notifications/  # Notifications API
│   │   │   ├── stores/          # Store CRUD
│   │   │   ├── vehicles/        # Vehicle CRUD
│   │   │   ├── wishlist/        # Wishlist API
│   │   │   └── upload/          # Image upload
│   │   ├── alerts/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── appointments/page.tsx
│   │   ├── compare/
│   │   │   ├── page.tsx         # Compare cars
│   │   │   ├── studio/page.tsx
│   │   │   └── technical/page.tsx
│   │   ├── concierge/
│   │   │   ├── page.tsx         # AI concierge chat
│   │   │   ├── discovery/page.tsx
│   │   │   └── dossier/page.tsx
│   │   ├── content-studio/
│   │   │   ├── page.tsx
│   │   │   └── advanced/page.tsx
│   │   ├── dashboard/
│   │   │   ├── layout.tsx       # DealerAppShell wrapper
│   │   │   ├── page.tsx
│   │   │   ├── executive/page.tsx
│   │   │   ├── luxury/page.tsx
│   │   │   ├── error.tsx
│   │   │   └── loading.tsx
│   │   ├── handover/
│   │   │   ├── page.tsx
│   │   │   └── auth/page.tsx
│   │   ├── intelligence/
│   │   │   ├── page.tsx
│   │   │   ├── acquisitions/page.tsx
│   │   │   └── charts/page.tsx
│   │   ├── interests/page.tsx
│   │   ├── inventory/
│   │   │   ├── page.tsx
│   │   │   ├── error.tsx
│   │   │   └── loading.tsx
│   │   ├── leads/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/page.tsx
│   │   │   ├── error.tsx
│   │   │   └── loading.tsx
│   │   ├── login/
│   │   │   ├── buyer/page.tsx
│   │   │   └── dealer/page.tsx
│   │   ├── marketing/
│   │   │   ├── page.tsx
│   │   │   └── cinema/page.tsx
│   │   ├── my-cars/page.tsx
│   │   ├── notifications/
│   │   │   ├── customizer/page.tsx
│   │   │   ├── delivery/page.tsx
│   │   │   └── history/page.tsx
│   │   ├── onboarding/social/page.tsx
│   │   ├── performance/page.tsx
│   │   ├── plans/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── profit/page.tsx
│   │   ├── quick-draft/page.tsx
│   │   ├── reel-editor/page.tsx
│   │   ├── reports/monthly/page.tsx
│   │   ├── reservation/
│   │   │   ├── page.tsx
│   │   │   └── commit/page.tsx
│   │   ├── service/
│   │   │   ├── page.tsx
│   │   │   └── logistics/page.tsx
│   │   ├── settings/
│   │   │   ├── page.tsx         # Settings hub
│   │   │   ├── ai-permissions/page.tsx
│   │   │   ├── assets/page.tsx
│   │   │   ├── automation/page.tsx
│   │   │   ├── billing/page.tsx
│   │   │   ├── brand-voice/page.tsx
│   │   │   ├── notifications/page.tsx
│   │   │   ├── permissions/page.tsx
│   │   │   ├── team/page.tsx
│   │   │   └── loading.tsx
│   │   ├── showcase/[id]/page.tsx
│   │   ├── showroom/page.tsx
│   │   ├── smart-reply/page.tsx
│   │   ├── social-hub/page.tsx
│   │   ├── stores/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/page.tsx
│   │   │   └── loading.tsx
│   │   ├── storyboard/[id]/page.tsx
│   │   ├── studio/
│   │   │   ├── page.tsx
│   │   │   ├── creative/page.tsx
│   │   │   └── editor/page.tsx
│   │   ├── terms/page.tsx
│   │   ├── vehicle/[id]/
│   │   │   ├── page.tsx
│   │   │   └── not-found.tsx
│   │   ├── vip/
│   │   │   ├── page.tsx
│   │   │   ├── confirmation/page.tsx
│   │   │   ├── preferences/page.tsx
│   │   │   ├── rewards/page.tsx
│   │   │   └── showroom/page.tsx
│   │   ├── virtual-tour/
│   │   │   ├── [id]/page.tsx
│   │   │   └── viewer/[id]/page.tsx
│   │   ├── wishlist/page.tsx
│   │   ├── landing/page.tsx
│   │   ├── page.tsx             # Home (marketplace)
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── providers.tsx
│   │   ├── error.tsx
│   │   ├── global-error.tsx
│   │   ├── not-found.tsx
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── ui/
│   │   │   ├── BottomSheet.tsx
│   │   │   ├── FilterPills.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── ToggleSwitch.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── GlassButton.tsx
│   │   │   └── Skeleton.tsx
│   │   ├── AuthGuard.tsx
│   │   ├── BuyerBottomNav.tsx
│   │   ├── BuyerPageLayout.tsx
│   │   ├── DealerAppShell.tsx
│   │   ├── DealerBottomNav.tsx
│   │   ├── DealerPageLayout.tsx
│   │   ├── ImageUploader.tsx
│   │   ├── LeadCard.tsx
│   │   ├── MaterialIcon.tsx
│   │   ├── PageHeader.tsx
│   │   ├── VehicleCard.tsx
│   │   ├── VehicleJsonLd.tsx
│   │   └── VehicleSpecsGrid.tsx
│   ├── context/
│   │   ├── CompareContext.tsx
│   │   └── WishlistContext.tsx
│   ├── generated/
│   │   └── prisma/               # Prisma client (generated)
│   ├── lib/
│   │   ├── hooks/
│   │   │   ├── use-api.ts
│   │   │   └── use-api-mutation.ts
│   │   ├── stores/
│   │   │   ├── auth-store.ts
│   │   │   ├── dealer-store.ts
│   │   │   ├── toast-store.ts
│   │   │   ├── ui-store.ts
│   │   │   └── index.ts
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   └── middleware.ts
│   │   ├── api.ts
│   │   ├── auth-guard.ts
│   │   ├── auth-types.ts
│   │   ├── auth.legacy.ts
│   │   ├── car-images.ts
│   │   ├── constants.ts
│   │   ├── db.ts
│   │   ├── mock-api-data.ts
│   │   ├── mock-data.ts
│   │   ├── posthog.ts
│   │   ├── types.ts
│   │   ├── utils.ts
│   │   └── validation.ts
│   └── middleware.ts
├── stitch/                       # 75+ design screens (source of truth)
│   ├── autovinci_luxury_landing_page/
│   ├── dealer_portal_login/
│   ├── buyer_portal_login/
│   ├── dealer_executive_dashboard_1/
│   ├── premium_inventory_collection/
│   ├── ai_content_studio_editor_1/
│   ├── ... (70+ more stitch folders)
│   └── (each: code.html, screen.png)
├── next.config.ts
├── next-env.d.ts
├── package.json
├── package-lock.json
├── PRD.md
├── README.md
├── sentry.client.config.ts
├── sentry.server.config.ts
├── sentry.edge.config.ts
├── tsconfig.json
├── vercel.json
└── .env.local                   # (gitignored) Env vars
```

---

## 2. Tech Stack (Inbuilt)

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16.1.6 (App Router) |
| **Language** | TypeScript 5, React 19.2.3 |
| **Styling** | Tailwind CSS v4, PostCSS |
| **Database** | PostgreSQL (Supabase) + Prisma 7.4.1 |
| **Auth** | Supabase Auth (email, Google) |
| **State** | Zustand 5 |
| **Animation** | Framer Motion 12 |
| **Monitoring** | Sentry 10 |
| **Analytics** | PostHog |
| **Icons** | Material Symbols Outlined (Google Fonts) |
| **Validation** | Zod 4 |
| **Utilities** | clsx, tailwind-merge |

**Fonts (loaded):** Noto Serif, Noto Sans, Manrope, Newsreader, Inter, Space Grotesk, Playfair Display, Material Symbols Outlined

---

## 3. Dealer User Journey

```
Landing (/) ──► Dealer Portal CTA
                     │
                     ▼
              /login/dealer ──► Supabase Auth
                     │
                     ▼
              /dashboard (DealerAppShell)
                     │
    ┌────────────────┼────────────────┬────────────────┐
    ▼                ▼                ▼                ▼
Dashboard        Inventory        [Studio FAB]      Leads         Settings
/dashboard       /inventory       /studio          /leads        /settings
    │                │                │                │              │
    ├─► Reports      ├─► Vehicle       ├─► Content      ├─► Lead       ├─► Team
    │   /reports/    │   /vehicle/[id] │   /content-    │   /leads/    │   /settings/team
    │   monthly      │                │   studio       │   [id]       │
    ├─► Messages     ├─► Studio       ├─► Reel Editor  ├─► Smart      ├─► Billing
    │   /leads       │   /studio      │   /reel-editor │   Reply      │   /settings/billing
    ├─► Schedule     ├─► Compare      ├─► Quick Draft │   /smart-    ├─► Notifications
    │   /appointments│   /compare     │   /quick-draft │   reply      │   /settings/notifications
    └─► Market       └─► Showroom     └─► Marketing    └─► Appts      └─► Permissions, etc.
        /marketing      /showroom        /marketing       /appointments

Secondary dealer routes:
  /stores, /stores/[id], /analytics, /intelligence, /performance, /profit,
  /plans, /social-hub, /onboarding/social
  /notifications/history, /notifications/delivery, /notifications/customizer
  /settings/automation, /settings/brand-voice, /settings/assets, /settings/ai-permissions
```

**Bottom Nav (DealerAppShell):** Dashboard | Inventory | **[+ Studio]** | Leads | Settings

---

## 4. Buyer User Journey

```
Landing (/) ──► Private Showroom CTA
                     │
                     ▼
              /showroom (browse vehicles)
                     │
    ┌────────────────┼────────────────┬────────────────┐
    ▼                ▼                ▼                ▼
  Home            Cars             Search           Certified        Account
  /               /showroom        /showroom?q=     /showroom        /login/buyer
    │                │                │                │
    ├─► Concierge    ├─► Vehicle      ├─► Concierge    ├─► Wishlist   ├─► VIP
    │   /concierge   │   /vehicle/    │   /concierge   │   /wishlist  │   /vip
    │                │   [id]         │                │
    ├─► Showroom     ├─► Showcase     ├─► Discovery    ├─► Compare    ├─► My Cars
    │   /showroom    │   /showcase/   │   /concierge/  │   /compare    │   /my-cars
    │                │   [id]         │   discovery    │
    └─► Interests    ├─► Reservation  ├─► Virtual Tour ├─► Concierge  ├─► Handover
        /interests   │   /reservation │   /virtual-    │   /concierge  │   /handover
                     │                │   tour/[id]    │
                     ├─► Storyboard   └─► Handover     └─► Alerts
                     │   /storyboard/     /handover       /alerts
                     │   [id]
                     └─► Service
                         /service
```

**Bottom Nav (Buyer):** Home | Cars | Search | Certified | Account

---

## 5. What’s Built vs. Needs Building vs. Broken

### 5.1 Built (Functional / API-connected)

| Area | Routes / Features |
|------|-------------------|
| **Auth** | Supabase login (buyer & dealer), callback, `/api/auth/*` |
| **Home** | `/` — marketplace home, hero carousel, search, trusted stats |
| **Login** | `/login/buyer`, `/login/dealer` — stitch-aligned UIs |
| **Showroom** | `/showroom` — browse vehicles from DB |
| **Vehicle** | `/vehicle/[id]` — detail, wishlist, compare, concierge, reservation |
| **Inventory** | `/inventory` — dealer listings |
| **Leads** | `/leads`, `/leads/[id]` — CRUD + messages API |
| **Dashboard** | `/dashboard` — stats, recent listings, links to reports/appointments |
| **Studio** | `/studio` — AI enhancer (before/after UI) |
| **Settings** | `/settings`, `/settings/team` — team management (API) |
| **Concierge** | `/concierge` — chat with keyword-based search |
| **Wishlist** | `/wishlist` — wishlist API |
| **Compare** | `/compare` — compare vehicles (client state) |
| **Reservation** | `/reservation`, `/reservation/commit` |
| **VIP** | `/vip`, `/vip/confirmation`, `/vip/preferences`, `/vip/rewards`, `/vip/showroom` |
| **Handover** | `/handover`, `/handover/auth` |
| **Service** | `/service`, `/service/logistics` |
| **Stores** | `/stores`, `/stores/[id]` — API |
| **API** | vehicles, leads, wishlist, analytics/dashboard, dealer/profile, dealer/team, auth, upload |

### 5.2 Needs Building (UI present, backend/features missing)

| Area | Status | Notes |
|------|--------|------|
| **AI Photo Studio** | Static UI | No Stable Diffusion / Replicate wiring |
| **AI Reel Editor** | Static UI | No FFmpeg, TTS, video models |
| **AI Creative Director** | Static UI | No mood-board / style-transfer API |
| **Smart Reply** | Static UI | API exists; WhatsApp Business not wired |
| **Quick Draft** | Static UI | API exists; vehicle auto-fill partial |
| **Notification Customizer** | Static UI | No template editor backend |
| **Razorpay** | Schema only | Subscription model exists; payment not wired |
| **Vector search** | Not implemented | Concierge uses keyword search, not pgvector |
| **Multi-language** | Not implemented | Hindi/Tamil/Telugu etc. for concierge |

### 5.3 Broken / Issues

| Issue | Location | Fix |
|-------|----------|-----|
| **Broken nav links** | Some pages still use `#` | Replace with real routes |
| **Orphaned routes** | `/intelligence`, `/interests`, `/social-hub`, `/analytics`, `/onboarding/social` | Add entry links from dashboard/settings |
| **Material Symbols** | Font loaded via Google Fonts; may fail in poor network | Fallback to Lucide if icons show as text |
| **`/landing` vs `/`** | PRD expects `/landing`; app uses `/` as main landing | Clarify: `/` = marketplace or separate `/landing` |
| **DealerAppShell scope** | Only wraps `/dashboard/*` | `/inventory`, `/leads`, `/settings` have their own navs |

### 5.4 Stitch Alignment

- **~75 stitch designs** in `stitch/`
- **~22 LIVE** (API-connected)
- **~22 STATIC** (UI done, no full backend)
- **~21 MISSING** (no page yet) — see `PRD.md` table

---

## 6. Quick Reference

| Command | Purpose |
|--------|---------|
| `npm run dev` | Local dev at http://localhost:3000 |
| `npm run build` | Prisma generate + Next.js build |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Open Prisma Studio |

---

*For route-level wiring details, see `docs/ROUTE_AUDIT.md`.*  
*For page-by-page PRD status, see `PRD.md`.*
