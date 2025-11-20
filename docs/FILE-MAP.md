# Digifly Project File Map

This document provides an overview of the key directories and files in the project.

## 1. High-Level Structure

- **/src/app/**: The core of the Next.js application, using the App Router.
- **/src/components/**: Reusable React components.
- **/src/lib/**: Core application logic, helpers, and server-side code.
- **/src/data/**: Schemas and default data for the CMS.
- **/src/hooks/**: Custom React hooks.
- **/src/styles/**: Global CSS and styling.
- **/tests/**: Playwright tests.
- **/scripts/**: Build-time and utility scripts.
- **/docs/**: Project documentation (like this file).

---

## 2. `src/app` - Routing & Pages

This directory defines all routes for the application.

- **/src/app/(site)/**: Routes for the public-facing website.
  - `layout.tsx`: The main layout for the public site, including `<Header>` and `<Footer>`. It fetches global data like navigation and site settings.
  - `page.tsx`: The homepage component. It fetches homepage-specific data from the CMS.
  - `cases/[slug]/page.tsx`: A dynamic route for individual case study pages.
- **/src/app/dadmin/**: All routes related to the CMS admin panel.
  - `layout.tsx`: The shell for the admin panel, including the `Sidebar` and `Topbar`. It also handles authentication checks.
  - `page.tsx`: The admin dashboard.
  - `homepage/page.tsx`: The server page that renders the editor for homepage content.
  - `**/actions.ts`: **Server Actions**. These files contain server-side functions that are called from Client Components to mutate data (e.g., save a form).
- **/src/app/api/**: API routes.
  - `/api/cms/**`: Public, read-only endpoints that expose CMS data. These are less used now in favor of direct server-side data fetching.
  - `/api/admin/**`: Protected API routes used internally by the admin panel for tasks like login.

---

## 3. `src/lib` - Core Application Logic

This is the most critical directory for application logic.

- **`src/lib/cms-server.ts`**:
  - **Responsibility**: The primary data-fetching and writing layer. **This is the ONLY file that should directly interact with Firestore.**
  - **Details**: Contains functions like `getHomepage`, `saveHomepage`, `getSiteSettings`. These functions use the Firebase Admin SDK.
- **`src/lib/cms-api.ts`**:
  - **Responsibility**: A server-side facade that re-exports functions from `cms-server.ts` and Server Actions.
  - **Details**: Its main purpose is to provide a stable, Node.js-compatible entry point for our **Playwright acceptance tests**. Application code (like pages) should prefer importing directly from `cms-server.ts`.
- **`src/lib/server/cms-actions.ts`**:
    - **Responsibility**: Contains the canonical implementations of Server Actions (e.g., `saveHomepageAction`).
    - **Relationship**: These functions are typically wrapped by more specific action files in the `/app/dadmin` directory.
- **`src/lib/firebase/admin.ts`**:
  - **Responsibility**: Initializes the Firebase Admin SDK for server-side use. It is only imported by `cms-server.ts`.
- **`src/lib/firebase-client.ts`**:
    - **Responsibility**: Initializes the client-side Firebase SDK for browser-based features like authentication.
- **`src/data/schemas.ts`**:
  - **Responsibility**: Defines all **Zod schemas** (e.g., `HomepageSchema`, `SiteSettingsSchema`). This is the data contract for the entire application.
- **`src/data/defaults.ts`**:
    - **Responsibility**: Provides default data objects used for seeding the database and as fallbacks when CMS data is missing.
- **`src/lib/types.ts`**:
  - **Responsibility**: Defines TypeScript types inferred from the Zod schemas (e.g., `type HomePage = z.infer<typeof HomepageSchema>`).

---

## 4. How Modules Relate: The Data Flow

- A **Page** (Server Component, e.g., `/app/(site)/page.tsx`)
- needs data, so it calls a function from **`cms-server.ts`** (e.g., `getHomepage`).
- `cms-server.ts` uses the Firebase Admin SDK from **`firebase/admin.ts`** to fetch a document from **Firestore**.
- The raw data is validated against a schema from **`data/schemas.ts`**.
- The validated data is returned to the Page and passed as props to a **Client Component** (e.g., `/components/sections/hero.tsx`) for rendering.

- An **Admin Form** (Client Component, e.g., `HomepageEditor.tsx`)
- needs to save data, so it calls a **Server Action** (e.g., `saveHomepageAction` from `/app/dadmin/homepage/actions.ts`).
- The Server Action validates the data and calls a write function in **`cms-server.ts`**, which updates **Firestore**.
