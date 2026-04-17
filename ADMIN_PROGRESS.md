# HVACR Admin Panel — Build Progress

Tracking doc for porting the admin panel from `acrorefrigerationnext` into `hvacrnext`. Update at the end of each session.

## Decisions

- **Fresh Supabase** at `kxhmxqtxlsyezkmzdjyk.supabase.co` (env already set in `.env.local`). Schema must be scaffolded.
- **Trimmed to 9 sections** (vs Acro's 20). Dropped: posts, services, projects, locations, pricing, testimonials, legal, maintenance, portal.
- **No shadcn / react-hook-form / zod.** Plain HTML + existing Tailwind 4 theme tokens (`background`, `card`, `primary`, `accent`, `border`, `destructive`). Keeps deps minimal.
- **Route group refactor** — public pages move to `app/(site)/` with their own layout holding `Navbar`/`Footer`. Root `app/layout.tsx` becomes `<html>/<body>` + fonts only, so `/admin` doesn't inherit the site chrome.
- **Stack:** Next 16.2.3 / React 19.2.4 — per `AGENTS.md`, check `node_modules/next/dist/docs/` before writing Next-specific code.

## Sections

| Group   | Section    | Notes                            |
| ------- | ---------- | -------------------------------- |
| Content | Home       | Placeholder dashboard in Phase 1 |
| Content | Brands     |                                  |
| Content | Industries |                                  |
| Engage  | Messages   | Contact form submissions         |
| Engage  | FAQs       |                                  |
| People  | Careers    | Job postings + applications      |
| People  | Users      | Admin-only                       |
| Admin   | Settings   |                                  |
| Admin   | Logs       | Activity log viewer              |

---

## Phase 1 — Foundation (auth shell + empty sidebar)

Goal: user can log in, see the sidebar with 9 sections, land on the Home placeholder. No section CRUD yet.

### Refactor

- [x] Create `app/(site)/layout.tsx` with Navbar/Footer + `pt-[72px]`
- [x] Move into `app/(site)/`: `page.tsx`, `about/`, `brands/`, `careers/`, `contact/`, `not-found.tsx`
- [x] Slim `app/layout.tsx` to fonts + `<html>/<body>` + globals.css

### Deps

- [x] `npm install @supabase/ssr @supabase/supabase-js`

### Libs

- [x] `lib/supabase/server.ts`
- [x] `lib/supabase/client.ts`
- [x] `lib/supabase/admin.ts`
- [x] `lib/supabase/logging.ts`
- [x] `lib/rbac.ts` — trimmed 9-section permission map

### Middleware

- [x] `middleware.ts` — auth guard + `x-pathname` header, matcher `/admin/:path*`

### Admin shell

- [x] `app/admin/layout.tsx`
- [x] `app/admin/page.tsx` (redirect to default)
- [x] `app/admin/AdminSidebar.tsx`
- [x] `app/admin/actions.ts` (signOut)
- [x] `app/admin/loading.tsx`
- [x] `app/admin/login/page.tsx`
- [x] `app/admin/home/page.tsx` (placeholder)

### Supabase schema

- [x] `supabase/setup.sql` — `user_profiles` + `activity_logs` + RLS + indexes
- [x] `supabase/README.md` — bootstrap instructions
- [x] **You:** run `setup.sql` in Supabase SQL editor
- [x] **You:** create first admin user in dashboard + insert `user_profiles` row (see `supabase/README.md`)

### Verify

- [x] `npx tsc --noEmit` passes (clean type-check after refactor)
- [x] `npm run dev` — `/` still renders normally with Navbar/Footer
- [x] `/admin` redirects to `/admin/login` when logged out
- [x] Login with first admin → lands on `/admin/home` with sidebar visible
- [x] Sign-out returns to `/admin/login`

---

## Phase 2 — Core sections (CRUD)

Build out the sections the client actually needs first. Order TBD — suggested:

- [x] Messages (read-only, contact form inbox)
- [x] FAQs (CRUD, simple)
- [x] Brands (CRUD + image upload)
- [x] Industries (CRUD + image upload)
- [x] Careers (job postings CRUD + applications inbox)

Each section typically needs: `page.tsx` (list/table), `[id]/page.tsx` (edit), `new/page.tsx` (create), `<Section>Client.tsx` (interactive list), `<Section>Editor.tsx` (form), and its own Supabase table + RLS.

---

## Phase 3 — Remaining

- [x] Home (dashboard with live section counts)
- [x] Users (admin-only — invite/role/permissions management)
- [x] Settings (site-wide key/value config)
- [x] Logs (activity log viewer with action + section filters)

---

## Session log

### Session 1 — 2026-04-17

- Explored Acro admin structure (20 sections, RBAC, Supabase SSR).
- Agreed on trimmed 9-section scope and phased approach.
- Wrote this progress doc.
- **Shipped Phase 1 code:**
  - Route-group refactor (`app/(site)/` holds public pages, `app/layout.tsx` slimmed to fonts).
  - Installed `@supabase/ssr`, `@supabase/supabase-js`.
  - Libs: `lib/supabase/{server,client,admin,logging}.ts`, `lib/rbac.ts` (9-section permission map).
  - `middleware.ts` auth guard with `x-pathname` header.
  - Admin shell: `layout`, `page`, `AdminSidebar`, `actions`, `loading`, `login`, `home` (placeholder dashboard).
  - `supabase/setup.sql` + `supabase/README.md` with bootstrap steps.
  - `npx tsc --noEmit` passes cleanly.
- **Next session:** user runs `setup.sql` + creates first admin, we smoke-test the shell in browser, then start Phase 2 — first section likely Messages or FAQs.

### Session 2 — 2026-04-17

- User confirmed setup.sql was run and first admin user created (Phase 1 complete).
- **Shipped Phase 2 — Messages:**
  - `supabase/messages.sql` — messages table + RLS (public insert, admin CRUD).
  - `app/(site)/contact/actions.ts` — `submitContactForm` server action wires contact form to DB.
  - Updated `ContactForm.tsx` — async submit calls server action, shows loading/error states.
  - `app/admin/messages/page.tsx` + `MessagesClient.tsx` + `actions.ts` — inbox with All/Unread filter, expand-in-place accordion, mark-as-read on expand, delete with confirm.
  - `npx tsc --noEmit` passes cleanly.
- **Next session:** FAQs (CRUD — simplest section to build next), then Brands/Industries (with image upload).
- **You still need to:** run `supabase/messages.sql` in Supabase SQL editor.

### Session 3 — 2026-04-17

- **Shipped Phase 2 — FAQs:**
  - `supabase/faqs.sql` — faqs table + RLS + auto-updated_at trigger.
  - `app/admin/faqs/actions.ts` — server actions: create, update, delete, reorder.
  - `app/admin/faqs/page.tsx` — server component list with Add FAQ button.
  - `app/admin/faqs/FaqsClient.tsx` — interactive list with drag-to-reorder, publish toggle, inline delete confirm.
  - `app/admin/faqs/FaqEditor.tsx` — shared create/edit form with publish toggle.
  - `app/admin/faqs/new/page.tsx` + `app/admin/faqs/[id]/page.tsx` — create and edit routes.
  - `npx tsc --noEmit` passes cleanly.
- **You still need to:** run `supabase/faqs.sql` in Supabase SQL editor.
- **Next session:** Brands (CRUD + image upload), then Industries.

### Session 4 — 2026-04-18

- **Shipped Phase 2 — Brands:**
  - `supabase/brands.sql` — brands table + RLS + auto-updated_at trigger + `brand-logos` Storage bucket + storage RLS.
  - `next.config.ts` — added Supabase storage hostname to `images.remotePatterns`.
  - `app/admin/brands/actions.ts` — server actions: create, update, delete, reorder.
  - `app/admin/brands/page.tsx` — server component list with Add Brand button.
  - `app/admin/brands/BrandsClient.tsx` — drag-to-reorder, publish toggle, logo thumbnail, inline delete confirm.
  - `app/admin/brands/BrandEditor.tsx` — create/edit form with logo upload (client-side Supabase Storage upload → URL saved in DB), image preview, replace/clear, slug auto-generation.
  - `app/admin/brands/new/page.tsx` + `app/admin/brands/[id]/page.tsx` — create and edit routes.
  - `npx tsc --noEmit` passes cleanly.
- **You still need to:** run `supabase/brands.sql` in Supabase SQL editor.
- **Next session:** Industries (same pattern as Brands), then Careers.

### Session 5 — 2026-04-18

- **Shipped Phase 2 — Industries:**
  - `supabase/industries.sql` — industries table + RLS + auto-updated_at trigger + `industry-images` Storage bucket + storage RLS.
  - `app/admin/industries/actions.ts` — server actions: create, update, delete, reorder.
  - `app/admin/industries/page.tsx` — server component list with Add Industry button.
  - `app/admin/industries/IndustriesClient.tsx` — drag-to-reorder, publish toggle, image thumbnail, inline delete confirm.
  - `app/admin/industries/IndustryEditor.tsx` — create/edit form with image upload, slug auto-generation.
  - `app/admin/industries/new/page.tsx` + `app/admin/industries/[id]/page.tsx` — create and edit routes.
  - `npx tsc --noEmit` passes cleanly.
- **You still need to:** run `supabase/industries.sql` in Supabase SQL editor.
- **Next session:** Careers (job postings CRUD + applications inbox).

### Session 6 — 2026-04-18

- **Fixed:** sidebar empty + navigation broken — middleware and layout were both using anon Supabase client to fetch `user_profiles`, which failed silently under RLS. Switched both to `createAdminClient()` (service role). Also requires `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.
- **Shipped Phase 2 — Careers:**
  - `supabase/careers.sql` — `job_postings` + `job_applications` tables, RLS, updated_at trigger.
  - `app/admin/careers/actions.ts` — server actions: create/update/delete/reorder job postings + mark-read/delete applications.
  - `app/admin/careers/page.tsx` — server component fetching both tables in parallel.
  - `app/admin/careers/CareersClient.tsx` — tabbed UI: "Job Postings" (drag-to-reorder, publish toggle, edit, delete) + "Applications" (accordion inbox, unread badge, mark-read on expand, delete).
  - `app/admin/careers/JobPostingEditor.tsx` — create/edit form with title, location, employment type (select), description, publish toggle.
  - `app/admin/careers/new/page.tsx` + `app/admin/careers/[id]/page.tsx` — create and edit routes.
  - `npx tsc --noEmit` passes cleanly.
- **You still need to:** run `supabase/careers.sql` in Supabase SQL editor.
- **Phase 2 complete.** Next: Phase 3 — Home dashboard, Users, Settings, Logs.

### Session 7 — 2026-04-18

- **Shipped Phase 3 — all four remaining sections:**
  - **Home:** upgraded placeholder to live dashboard — parallel count queries for brands, industries, messages (unread badge), FAQs, and careers (unread apps badge).
  - **Logs:** `app/admin/logs/page.tsx` + `LogsClient.tsx` — fetches last 200 activity_logs via admin client, filterable by action (create/update/delete/login/logout) and section, entry count shown.
  - **Settings:** `supabase/settings.sql` (site_settings key/value table, public read + admin write RLS, seeded defaults) + `app/admin/settings/{page,SettingsClient,actions}.ts` — grouped form (General, Contact, Social) with upsert save.
  - **Users:** `app/admin/users/{page,UsersClient,UserEditor,actions}.ts` + `new/` + `[id]/` — lists all auth users joined with profiles, role badge, edit/delete; invite sends email via `auth.admin.inviteUserByEmail` and inserts profile; edit form has role toggle + permission checkboxes + presets.
  - `npx tsc --noEmit` passes cleanly.
- **You still need to:** run `supabase/settings.sql` in Supabase SQL editor.
- **Phase 3 complete. Admin panel fully built.**

<!-- Add a new entry each session. Keep it short: what shipped, what's next. -->
