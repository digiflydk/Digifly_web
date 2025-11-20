# Firestore Collections Overview

This document outlines the primary Firestore collections and their schemas as used in the Digifly Studio application.

## 1. `site`

This is a collection for singleton documents that hold global configuration.

### Document: `site/settings`
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

### Document: `site/navigation`
- **Description**: A single document containing the link structures for the main header and the site footer.
- **Read By**: `getNavigation()` in `lib/cms-server.ts`. Used by the root layout.
- **Written By**: `saveNavigationAction` (Server Action) via the editor in `/dadmin/navigation`.
- **Zod Schema**: `NavigationSchema` in `src/data/schemas.ts`.
- **Key Fields**:
  - `header` (array of `NavLink`)
  - `footer.columns` (array of objects with `title` and `links`)

## 2. `pages`

A collection where each document represents a "singleton" page with unique content. The document ID is the page's slug.

### Document: `pages/home`
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

### Document: `cases/{caseId}`
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

A collection for logging administrative and system actions for observability.

### Document: `auditLogs/{logId}`
- **Description**: A log entry created whenever a significant action occurs (e.g., saving a page, running a test).
- **Read By**: The `/dadmin/developer/logs` page, which listens for real-time updates.
- **Written By**: The `logAdminAction` helper in `src/lib/dadmin/audit.ts`, called from various Server Actions.
- **Key Fields**:
  - `action` (string, e.g., "homepage.save")
  - `status` ("ok" | "error" | "info")
  - `ts` (Firestore Timestamp)
  - `actorEmail` (string, identifies the user or system)
  - `payloadSummary` (string, a brief description of the event)

## 5. `developerSettings`

A collection for storing developer-specific configurations.

### Document: `developerSettings/logging`
- **Description**: Controls which audit log actions are enabled or disabled.
- **Read By**: `getLogSettings()` in `lib/dadmin/audit.ts`.
- **Written By**: The `LoggingSettings` component in the admin developer panel.
- **Key Fields**:
    - `enabled` (boolean, master switch)
    - `actions` (map of `AdminAction` to boolean)
