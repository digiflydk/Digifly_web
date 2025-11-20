# Firestore Collections Overview

This document outlines the primary Firestore collections and their schemas as used in the Digifly application.

## 1. `site`

This is a collection for singleton documents that hold global configuration.

### `site/settings`
- **Description**: Stores all global site settings, including branding, contact information, and default SEO values.
- **Read By**: `getSiteSettings()` in `lib/cms-server.ts`. Used by the root layout and all pages for SEO fallbacks.
- **Written By**: `saveSiteSettingsAction` (Server Action) via the form in `/dadmin/site-seo`.
- **Zod Schema**: `SiteSettingsSchema` in `src/data/schemas.ts`.
- **Key Fields**:
  - `general.brandName` (string, required)
  - `general.logoUrl` (string, optional)
  - `seo.defaultTitle` (string, optional)
  - `seo.defaultDescription` (string, optional)
  - `contact.email` (string, optional)

### `site/navigation`
- **Description**: A single document containing the link structures for the main header and the footer.
- **Read By**: `getNavigation()` in `lib/cms-server.ts`. Used by the root layout.
- **Written By**: `saveNavigationAction` (Server Action) via the editor in `/dadmin/navigation`.
- **Zod Schema**: `NavigationSchema` in `src/data/schemas.ts`.
- **Key Fields**:
  - `header` (array of `NavLink`)
  - `footer.columns` (array of objects with `title` and `links`)

## 2. `pages`

A collection where each document represents a "singleton" page with unique content.

### `pages/home`
- **Description**: Contains all content specific to the homepage.
- **Read By**: `getHomepage()` in `lib/cms-server.ts`. Used by `src/app/(site)/page.tsx`.
- **Written By**: `saveHomepageAction` (Server Action) via the editor in `/dadmin/homepage`.
- **Zod Schema**: `HomepageSchema` in `src/data/schemas.ts`.
- **Key Fields**:
  - `hero.slides` (array of `HeroSlide`)
  - `whatWeDo` (object)
  - `services.items` (array)
  - `featuredCases` (array of strings - case study slugs)

## 3. `cases`

A collection where each document is a separate case study.

### `cases/{caseId}`
- **Description**: Represents a single portfolio case study.
- **Read By**:
  - `getCases()` lists all published cases for `/cases`.
  - `getCaseBySlug()` fetches a single document for `/cases/[slug]`.
- **Written By**: `createCaseAction`, `updateCaseAction`, `deleteCaseAction` via the admin panel at `/dadmin/cases`.
- **Zod Schema**: `CaseSchema` in `src/data/schemas.ts`.
- **Key Fields**:
  - `slug` (string, required, unique)
  - `title` (string, required)
  - `published` (boolean)
  - `excerpt` (string, optional)
  - `content` (string, HTML/Markdown)

## 4. `auditLogs`

A collection for logging administrative and system actions.

### `auditLogs/{logId}`
- **Description**: A log entry created whenever a significant action occurs (e.g., saving a page, running a test).
- **Read By**: The `/dadmin/developer/logs` page.
- **Written By**: The `logAdminAction` helper in `src/lib/dadmin/audit.ts`, called from various Server Actions.
- **Zod Schema**: No strict Zod schema, but follows the `AuditLog` TypeScript type.
- **Key Fields**:
  - `action` (string, e.g., "homepage.save")
  - `status` ("ok" | "error")
  - `ts` (Timestamp)
  - `actorEmail` (string)
  - `payloadSummary` (string)

## 5. `admins` (Legacy/Future Use)

This collection is defined in `firestore.rules` but is not currently used for gating access in the application logic, which relies on a simple session check. It is intended for role-based access control.

### `admins/{uid}`
- **Description**: Stores the role for a given Firebase Auth user UID.
- **Key Fields**:
  - `role` (string, e.g., "admin" or "superadmin")