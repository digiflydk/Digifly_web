# Firestore Collections Overview

This document outlines the primary Firestore collections and their schemas as used in the Digifly Studio application, based on the paths defined in `src/lib/constants.ts`.

## 1. `site`

This is a collection for singleton documents that hold global configuration.

### Document: `site/settings`
- **Description**: Stores all global site settings, including branding, contact information, business hours, and default SEO values.
- **Read By**: `getSiteSettings()` in `lib/cms-server.ts`. Used by the root layout and all pages for SEO fallbacks.
- **Written By**: `saveSiteSettingsAction` (Server Action) via the form in `/dadmin/site-seo`.
- **Zod Schema**: `SiteSettingsSchema` in `src/data/schemas.ts`.

### Document: `site/navigation`
- **Description**: A single document containing the link structures for the main header and the site footer.
- **Read By**: `getNavigation()` in `lib/cms-server.ts`. Used by the root layout's `<Header>` and `<Footer>`.
- **Written By**: `saveNavigationAction` (Server Action) via the editor in `/dadmin/navigation`.
- **Zod Schema**: `NavigationSchema` in `src/data/schemas.ts`.

## 2. `pages`

A collection where each document represents a "singleton" page with unique content. The document ID is the page's slug.

### Document: `pages/home`
- **Description**: Contains all content specific to the homepage, including the hero, "What We Do" section, services, and CTAs.
- **Read By**: `getHomepage()` in `lib/cms-server.ts`. Used by `src/app/(site)/page.tsx`.
- **Written By**: `saveHomepageAction` (Server Action) via the editor in `/dadmin/homepage`.
- **Zod Schema**: `HomepageSchema` in `src/data/schemas.ts`.

### Other Page Documents (e.g., `pages/about`, `pages/services`)
- **Description**: Contain content for other specific, non-dynamic pages.
- **Read By**: `getPageBySlug()` and specific helpers like `getAboutPage()`.
- **Written By**: (Future implementation) Admin forms for each page.
- **Zod Schema**: `AboutPageSchema`, `ServicesPageSchema`, etc.

## 3. `cases`

A collection where each document is a separate case study.

### Document: `cases/{caseId}`
- **Description**: Represents a single portfolio case study.
- **Read By**:
  - `getCases()` lists all published cases for the `/cases` index page.
  - `getCaseBySlug()` fetches a single document for the `/cases/[slug]` detail page.
- **Written By**: `createCaseAction`, `updateCaseAction`, `deleteCaseAction` via the admin panel at `/dadmin/cases`.
- **Zod Schema**: `CaseSchema` in `src/data/schemas.ts`.

## 4. `auditLogs`

A collection for logging administrative and system actions for observability.

### Document: `auditLogs/{logId}`
- **Description**: A log entry created whenever a significant server-side action occurs (e.g., saving a page, running a test).
- **Read By**: The `/dadmin/developer/logs` page, which listens for real-time updates.
- **Written By**: The `logAdminAction` helper in `src/lib/dadmin/audit.ts`, called from various Server Actions.
- **Zod Schema**: No strict Zod schema, but follows the `AuditLog` TypeScript type.

## 5. `admins` (For Future Use)

This collection is defined in `firestore.rules` but is not currently used for gating access in the application logic. It is intended for a future role-based access control (RBAC) system.

### Document: `admins/{uid}`
- **Description**: Stores the role for a given Firebase Auth user UID.
- **Key Fields**:
  - `role` (string, e.g., "admin" or "superadmin")
