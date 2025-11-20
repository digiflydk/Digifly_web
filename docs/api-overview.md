# Digifly Studio API Overview

This document provides an overview of the public, read-only API endpoints available in the Digifly Studio application. These are primarily for internal utilities, debugging, and potential third-party integrations. The frontend application fetches data server-side and does not call these endpoints directly.

## 1. Core Principles

- **Base URL**: `/api/cms/`
- **Caching**: All public CMS endpoints have caching disabled (`Cache-Control: no-store`) to ensure fresh data is always served.
- **Validation**: All data returned is validated against Zod schemas defined in `src/data/schemas.ts`.

---

## 2. Implemented Endpoints

### `/api/cms/[[...slug]]/route.ts`
This is a dynamic route handler that serves most of the public CMS content.

#### `GET /api/cms/pages/home`
- **Description**: Returns the complete content document for the homepage.
- **Firestore Path**: `pages/home`
- **Zod Schema**: `HomepageSchema`
- **Used By**: `getHomepage()` helper.

#### `GET /api/cms/pages/{slug}`
- **Description**: Returns content for a specific singleton page, like "about" or "services".
- **Firestore Path**: `pages/{slug}`
- **Zod Schema**: `AboutPageSchema`, `ServicesPageSchema`, etc. (mapped internally).
- **Used By**: `getPageBySlug()` helper.

#### `GET /api/cms/navigation`
- **Description**: Fetches the navigation structure for both the main header and the site footer.
- **Firestore Path**: `site/navigation`
- **Zod Schema**: `NavigationSchema`
- **Used By**: `getNavigation()` helper.

#### `GET /api/cms/cases`
- **Description**: Retrieves a list of all **published** case studies.
- **Firestore Path**: `cases` (collection)
- **Zod Schema**: `z.array(CaseSchema)`
- **Used By**: `/cases` index page.

#### `GET /api/cms/cases?slug={slug}`
- **Description**: Fetches a single case study by its unique slug.
- **Firestore Path**: `cases` (collection query `where('slug', '==', slug)`)
- **Zod Schema**: `CaseSchema`
- **Used By**: Dynamic case study detail pages (`/cases/[slug]`).

---

## 3. Developer & Health Endpoints

#### `GET /api/_health`
- **Description**: A simple health check to confirm the Next.js server is running.

#### `GET /api/health/firebase`
- **Description**: Checks the connection to the Firebase Admin SDK and returns the project ID if successful.

#### `GET /api/developer/*`
- **Description**: A set of utility endpoints for development and debugging, accessible from the `/dadmin/developer/*` pages. These include endpoints to download documentation, view API maps, and trigger test runs. They are not intended for general consumption.
