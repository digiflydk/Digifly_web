# CMS Data Flow Analysis

_Generated: 2024-11-20 • Digifly Web v1.3.27 • DGF-356_

## 1. Executive Summary

This document maps the flow of content management system (CMS) data from Firestore to the application's frontend and admin panels.

**Current Situation:**
The application has several overlapping and partially legacy data structures in Firestore, leading to confusion and bugs. Key data like site settings, navigation, and page content are stored in multiple places. The admin panel correctly uses a modern, centralized data structure (`site/settings`, `pages/home`), but some frontend components still read from older, deprecated paths (`site/config`, `navigation/main`).

**Main Problems:**
- **Read/Write Mismatch:** The primary issue causing data not to appear is that the admin panel saves to one document (e.g., `site/settings`), while parts of the public site read from another (e.g., `site/config`).
- **Data Redundancy:** There are multiple collections for navigation (`navigation/` and `site/navigation`) and site settings (`site/config` and `site/settings`).
- **Legacy Code:** Several helper functions and components are still pointing to old Firestore paths.

**Next Steps (Recommendation):**
A follow-up refactoring task is needed to:
1.  Consolidate all data reads and writes to a single source of truth for each data type (e.g., `site/settings`, `pages/home`, `site/navigation`).
2.  Delete the legacy Firestore documents and collections (`site/config`, `navigation/main`, `navigation/footer`).
3.  Remove the now-redundant data fetching and sanitization logic from the codebase.

---

## 2. Firestore Collections & Documents

### A. Collections Overview

| Collection | Document ID(s) | Purpose | Read/Write | Code References |
| :--- | :--- | :--- | :--- | :--- |
| `site` | `settings`, `navigation` | **Current primary store.** Global settings, SEO, navigation. | R/W | `cms-server.ts`, `dadmin/site-seo`, `dadmin/navigation` |
| `pages` | `home`, `about`, etc. | **Current primary store.** Content for singleton pages. | R/W | `cms-server.ts`, `dadmin/homepage` |
| `cases` | `{caseId}` | Case study content. | R/W | `cms-server.ts`, `dadmin/cases` |
| `auditLogs` | `{logId}` | Logs admin actions. | Write-only | `dadmin/audit.ts` |
| `admins` | `{uid}` | Admin user roles. | R/W | `auth/serverAuth.ts` |
| **`site`** | **`config`** | **(Legacy)** Old site settings. | Read-only | _(indirectly used by `readSiteSettings`)_ |
| **`navigation`**| `main`, `footer` | **(Legacy)** Old navigation structure. | Read-only | `cms-seed.ts` (for migration) |

### B. Document Schemas (Main Fields)

#### `site/settings` (SiteSettings)
- `general.brandName`: `string`
- `general.logoUrl`: `string` (URL)
- `general.faviconUrl`: `string` (URL)
- `contact.email`: `string`
- `contact.phone`: `string`
- `contact.company`: `string`
- `contact.street`, `zip`, `city`, `country`: `string`
- `hours.{day}.enabled`: `boolean`
- `hours.{day}.from`: `string` (time, e.g., "09:00")
- `hours.{day}.to`: `string`
- `seo.allowIndexing`: `boolean`
- `seo.defaultTitle`: `string`
- `seo.defaultDescription`: `string`
- `seo.ogImage`: `string` (URL)
- `seo.canonicalBase`: `string` (URL)

#### `pages/home` (HomePage)
- `hero.slides[]`: `array` of `HeroSlide`
  - `heading`: `string`
  - `body`: `string`
  - `image`: `{ src: string; alt: string }`
  - `cta`: `CmsLink`
- `whatWeDo`: `{ enabled, title, body, image, cta }`
- `services`: `{ enabled, title, subtitle, items[] }`
- `featuredCases`: `array` of `string` (case study slugs)
- `cta`: `{ text, button: CmsLink }`

#### `site/navigation` (Navigation)
- `header`: `array` of `NavLink`
- `footer.columns[]`: `array` of `{ title: string; links: NavLink[] }`

---

## 3. Route → Helper → Firestore Mapping

### A. Frontend (Public Site)

| Route | Component | Helpers | Firestore Read Path |
| :--- | :--- | :--- | :--- |
| `/` (Homepage) | `src/app/(site)/page.tsx` | `getHomepage()` | `pages/home` |
| Layout (All) | `src/app/(site)/layout.tsx` | `getNavigation()`, `getSiteSettings()` | `site/navigation`, `site/settings` |
| `/about` | `src/app/(site)/about/page.tsx` | `getAboutPage()` | `pages/about` |
| `/services` | `src/app/(site)/services/page.tsx`| `getServicesPage()` | `pages/services` |
| `/cases` | `src/app/(site)/cases/page.tsx`| `getCases()` | `cases` collection |
| `/cases/[slug]` | `src/app/(site)/cases/[slug]/page.tsx`| `getCaseBySlug()` | `cases` collection |

### B. Admin (dadmin)

| Route | Component | Server Action | Firestore Write Path |
| :--- | :--- | :--- | :--- |
| `/dadmin/homepage` | `.../homepage/page.tsx` | `saveHomepageAction` | `pages/home` |
| `/dadmin/navigation` | `.../navigation/page.tsx` | `saveNavigationAction` | `site/navigation` |
| `/dadmin/site-seo` | `.../site-seo/page.tsx` | `saveSiteSettingsAction` | `site/settings` |
| `/dadmin/cases` | `.../cases/page.tsx` | `createCase`, `updateCase`, `deleteCase` | `cases` collection |

---

## 4. Issues & Inconsistencies

1.  **Read/Write Mismatch (Primary Issue):**
    - The admin panel (`/dadmin/site-seo`) correctly writes all site settings to `site/settings`.
    - However, the global `RootLayout` in `src/app/layout.tsx` reads settings from `readSiteSettings` in `src/lib/dadmin/siteSeoRepo.ts`, which contains logic to fall back to the legacy `site/config` document if `site/settings` is missing. This explains why changes might not appear if the new document isn't fully populated. The homepage saving issue was a code bug, but this underlying data split is a major risk.

2.  **Multiple Collections for Same Concept:**
    - **Navigation:** The codebase references two main locations: `site/navigation` (the new, single document) and the legacy `navigation/{main,footer}` documents. The `cms-seed` script contains logic to migrate from the old structure to the new one, but the old documents may still exist in Firestore, causing confusion. The frontend now correctly reads from `site/navigation`.
    - **Site Settings:** Data is split between `site/settings` (new) and `site/config` (legacy). The `migrate-site-config-to-settings.ts` script was created to handle this but may not have been run or might not cover all edge cases.

3.  **Fields Mismatch (Schema vs. UI):**
    - **CTA Links:** The `CmsLinkSchema` was recently updated to be more flexible. Previously, it strictly required a link target, causing validation to fail across the app (e.g., Hero slides) if a CTA button had a label but no destination. This was a major source of save/load failures and has now been corrected.

4.  **Unused/Legacy Fields in Firestore:**
    - The `site/settings` document may contain old top-level fields like `siteTitle` and `tagline` that are now nested under the `general` and `seo` objects. The data defaults and schemas have been updated, but Firestore documents might still have this old data, which is now ignored.

5.  **Permission/Rules Risks:**
    - The Firestore rules are simple and generally allow public reads for `site`, `pages`, and `navigation` collections. Writes are restricted to admins. This is a safe setup.
    - There are no client-side writes from the admin panel anymore; all data modifications go through Server Actions, which use the Firebase Admin SDK. This mitigates the risk of permission-denied errors that might have occurred with direct client-side writes.

---

## 5. Proposed Cleanup Candidates

The following collections and files are candidates for deprecation or deletion in a future refactoring task. **No action should be taken yet.**

**Firestore Collections/Documents:**
- **`site/config`:** Legacy document for site settings. All logic should be consolidated to read exclusively from `site/settings`.
- **`navigation/main`:** Legacy document. Should be deleted.
- **`navigation/footer`:** Legacy document. Should be deleted.
- **`content/` collection:** Appears to be an entirely unused legacy structure. No code references it.

**Code Files & Helpers:**
- **`scripts/migrate-site-config-to-settings.ts`:** This is a one-time migration script. Once data is confirmed to be in `site/settings`, this script is no longer needed.
- **`src/lib/dadmin/siteSeoRepo.ts`:** The logic here contains fallbacks to read from legacy paths. It should be simplified to only read from `site/settings`.
- **`src/components/cms/forms/NavigationForm.tsx`**: This appears to be an older, unused version of the navigation editor. The current one is at `src/app/dadmin/navigation/NavEditor.tsx`.
- **`src/components/cms/forms/HomepageForm.tsx`**: Obsolete file, replaced by `HomepageEditor.tsx`.
- **`src/lib/cms-public.ts`**: This file uses the client SDK to fetch data. All data fetching is now handled server-side via `cms-server.ts`. This file is a candidate for deletion.
