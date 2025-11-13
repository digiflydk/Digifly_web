# CMS Data Flow Analysis

_Generated: 2024-11-20 • Digifly Web v1.3.37 • DGF-361_

## 1. Executive Summary

This document maps the flow of content management system (CMS) data from Firestore to the application's frontend and admin panels.

**Current Situation:**
The application uses a set of clearly defined Firestore documents and collections to manage site content. The primary data stores are `site/settings`, `site/navigation`, and the `pages` collection for singleton page content. The admin panel correctly reads from and writes to these locations via server actions. The public-facing site reads data server-side from these same sources.

**Main Findings:**
- **Centralized Data Model:** The application has successfully consolidated around a modern, centralized data structure. Legacy paths (`site/config`, `navigation/main`, etc.) are no longer actively used for rendering, though migration logic still exists in the seeding script to handle older database states.
- **Server-Side Data Flow:** All data fetching for both the admin panel and the public site now occurs on the server, primarily through `src/lib/cms-server.ts`. This is a robust pattern that avoids client-side permission issues.
- **Stable Schemas:** Data is consistently validated against Zod schemas defined in `src/data/schemas.ts`, ensuring type safety.

**Next Steps (Recommendation):**
The data flow is now stable and consistent. The next logical step is to perform a cleanup task to remove the legacy code and Firestore documents that are no longer in use. This will reduce complexity and prevent future confusion.

---

## 2. CMS Snapshots (for analysis)

To download the current CMS JSON snapshots used for debugging and analysis:

- Go to: **/dadmin → Developer → CMS Snapshots**
- Click “Download JSON” for the document you want:
  - Homepage: `cms-homepage.json`
  - Navigation: `cms-navigation.json`
  - Site settings: `cms-site.json`
  - Footer: `cms-footer.json`

You can also download a complete JSON dump of all key CMS documents via the link at **Developer → Download CMS JSON**.

These files are served directly from `DOCS/snapshots` and reflect the data used by the homepage, navigation, and layout.

---

## 3. Firestore Collections & Documents

### A. Collections Overview

| Collection | Document ID(s) | Purpose | Read/Write | Code References |
| :--- | :--- | :--- | :--- | :--- |
| `site` | `settings`, `navigation` | **Current primary store.** Global settings, SEO, navigation. | R/W | `cms-server.ts`, `dadmin/site-seo`, `dadmin/navigation` |
| `pages` | `home`, `about`, etc. | **Current primary store.** Content for singleton pages. | R/W | `cms-server.ts`, `dadmin/homepage` |
| `cases` | `{caseId}` | Case study content. | R/W | `cms-server.ts`, `dadmin/cases` |
| `auditLogs` | `{logId}` | Logs admin actions. | Write-only | `dadmin/audit.ts` |
| `admins` | `{uid}` | Admin user roles. | R/W | `auth/serverAuth.ts` |
| **`site`** | **`config`** | **(Legacy)** Old site settings. | Read-only | _(indirectly used by `readSiteSettings` as a fallback)_ |
| **`navigation`**| `main`, `footer` | **(Legacy)** Old navigation structure. | Read-only | `cms-seed.ts` (for migration) |


### B. Document Schemas (Main Fields)

#### `site/settings` (SiteSettings)
*JSON Snapshot: `DOCS/snapshots/site-settings.json`*
- `general.brandName`: `string`
- `general.logoUrl`: `string` (URL)
- `general.faviconUrl`: `string` (URL)
- `contact.email`, `phone`, `company`, `street`, etc.: `string`
- `hours.{day}.enabled`: `boolean` & `from`/`to`: `string`
- `seo.allowIndexing`: `boolean`
- `seo.defaultTitle`: `string`
- `seo.defaultDescription`: `string`
- `seo.ogImage`: `string` (URL)

#### `site/navigation` (Navigation)
*JSON Snapshot: `DOCS/snapshots/site-navigation.json`*
- `header`: `array` of `NavLink`
- `footer.columns[]`: `array` of `{ title: string; links: NavLink[] }`

#### `pages/home` (HomePage)
*JSON Snapshot: `DOCS/snapshots/pages-home.json`*
- `hero.slides[]`: `array` of `HeroSlide`
  - `heading`: `string`
  - `body`: `string`
  - `image`: `{ src: string; alt: string }`
  - `cta`: `CmsLink`
- `whatWeDo`: `{ enabled, title, body, image, cta }`
- `services`: `{ enabled, title, subtitle, items[] }`
- `featuredCases`: `array` of `string` (case study slugs)
- `cta`: `{ text, button: CmsLink }`

---

## 4. Route → Helper → Firestore Mapping

### A. Frontend (Public Site)

| Route | Component | Helpers | Firestore Read Path |
| :--- | :--- | :--- | :--- |
| `/` (Homepage) | `src/app/(site)/page.tsx` | `getHomepage()`, `getSiteSettings()` | `pages/home`, `site/settings` |
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

## 5. Issues & Inconsistencies

*No major inconsistencies were found in the current data flow.* The previous issues related to read/write mismatches have been resolved. The admin panel and public site now consistently use the same Firestore documents and server-side helpers.

- **Minor Redundancy:** The `cms-seed.ts` script contains logic to migrate from legacy navigation documents (`navigation/main`, `navigation/footer`) to the new `site/navigation` document. This is safe but will become obsolete once legacy paths are confirmed to be unused and deleted.
- **Footer Keys:** The React duplicate key warnings in the footer component have been addressed. The component now uses unique keys for rendering lists.

---

## 6. Proposed Cleanup Candidates

The following collections and files are candidates for deprecation or deletion in a future refactoring task. **No action should be taken yet.**

**Firestore Collections/Documents:**
- **`site/config`:** Legacy document for site settings. The app now reads from `site/settings`.
- **`navigation/main` & `navigation/footer`:** Legacy documents for navigation. The app now reads from the single `site/navigation` document.
- **`content/` collection:** Appears to be an entirely unused legacy structure.

**Code Files & Helpers:**
- **`scripts/migrate-site-config-to-settings.ts`:** This is a one-time migration script. Once data is confirmed to be in `site/settings`, this script is no longer needed.
- **`src/lib/dadmin/siteSeoRepo.ts`:** Contains fallback logic to read from `site/config`. Can be simplified to only read from `site/settings`.
- **`src/components/cms/forms/NavigationForm.tsx` & `HomepageForm.tsx`**: These appear to be obsolete and have been replaced by more robust editor components.
- **`src/lib/cms-public.ts`**: This file uses the client SDK. All data fetching is now handled server-side, making this file a candidate for deletion.
