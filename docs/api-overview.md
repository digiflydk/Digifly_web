# Digifly API Overview

This document provides an overview of the primary API endpoints available in the Digifly application.

## 1. Public CMS API

These endpoints are designed for public, read-only consumption, though they are primarily used for internal utilities and debugging rather than direct frontend fetching, as the app favors server-side data loading.

- **Base URL**: `/api/cms/`
- **Caching**: All public CMS endpoints have caching disabled (`Cache-Control: no-store`) to ensure fresh data is always served.

---

### `/api/cms/site`

- **Method**: `GET`
- **Description**: Retrieves the global site settings, including branding (logo, favicon), default SEO metadata, and contact information.
- **Firestore Path**: `site/settings`
- **Zod Schema**: `SiteSettingsSchema`
- **Used By**: Root layout (`/src/app/layout.tsx`) for metadata and design tokens.

### `/api/cms/navigation`

- **Method**: `GET`
- **Description**: Fetches the navigation structure for both the main header and the site footer.
- **Firestore Path**: `site/navigation`
- **Zod Schema**: `NavigationSchema`
- **Used By**: `Header` and `Footer` components via the root layout.

### `/api/cms/pages/home`

- **Method**: `GET`
- **Description**: Returns the complete content document for the homepage.
- **Firestore Path**: `pages/home`
- **Zod Schema**: `HomepageSchema`
- **Used By**: Homepage (`/src/app/(site)/page.tsx`).

### `/api/cms/cases`

- **Method**: `GET`
- **Description**: Retrieves a list of all **published** case studies.
- **Firestore Path**: `cases` (collection)
- **Zod Schema**: `z.array(CaseSchema)`
- **Used By**: `/cases` index page.

### `/api/cms/cases/[slug]`

- **Method**: `GET`
- **Description**: Fetches a single case study by its unique slug.
- **Firestore Path**: `cases` (collection query `where('slug', '==', slug)`)
- **Zod Schema**: `CaseSchema`
- **Used By**: Dynamic case study detail pages (`/cases/[slug]`).

## 2. Admin API

These endpoints are used by the `/dadmin` panel and are protected by authentication middleware.

- **Base URL**: `/api/admin/`

---

### `/api/admin/login`

- **Method**: `POST`
- **Description**: Authenticates a user by verifying a Firebase Auth ID token and creates a secure, HTTP-only session cookie.
- **Used By**: The login form at `/dadmin/login`.

### `/api/admin/logout`

- **Method**: `POST`
- **Description**: Clears the session cookie to log the user out.
- **Used By**: The logout button in the admin panel.

### `/api/admin/site`

- **Method**: `POST`
- **Description**: This is the endpoint that the `saveSiteSettingsAction` Server Action calls behind the scenes to update the `site/settings` document. It is not intended for direct client-side use.

### `/api/admin/navigation`

- **Method**: `POST`
- **Description**: The endpoint for the `saveNavigationAction` Server Action to update the `site/navigation` document.

## 3. Developer & Debug APIs

These are utility endpoints for development and debugging, accessible from `/dadmin/developer/*`.

- `/api/dev/predeploy`: Runs pre-deploy smoke tests.
- `/api/dev/tests/run`: Triggers a new test run.
- `/api/developer/cms-dump`: Downloads a complete JSON dump of key CMS documents.
