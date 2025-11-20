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

---

## 2. `src/app` - Routing & Pages

- **/src/app/(site)/**: Routes for the public-facing website.
  - `page.tsx`: The homepage.
  - `layout.tsx`: The main layout for the public site, including header and footer.
  - `/[slug]/page.tsx`: Dynamic routes for pages like `/about`, `/services`.
- **/src/app/dadmin/**: Routes for the CMS admin panel.
  - `layout.tsx`: The shell for the admin panel, including sidebar and topbar.
  - `page.tsx`: The admin dashboard.
  - `**/actions.ts`: Server Actions used by client components in the admin panel.
- **/src/app/api/**: API routes.
  - `/api/cms/[[...slug]]/route.ts`: The main public-facing, read-only CMS API.
  - `/api/admin/**`: Protected API routes for the admin panel.

---

## 3. `src/lib` - Core Logic

This is the most critical directory for application logic.

- **/src/lib/cms-server.ts**:
  - **Responsibility**: The primary data-fetching layer for Server Components.
  - **Details**: Contains functions like `getHomepage`, `getSiteSettings`, `getCases`. These functions directly access Firestore using the **Firebase Admin SDK**. They are marked with `"use server"` and are the single source of truth for fetching data on the server.

- **/src/lib/cms-api.ts**:
  - **Responsibility**: A server-side facade for CMS operations, intended for use by tests and other server modules.
  - **Details**: It re-exports functions from `cms-server.ts` and server actions. This provides a stable, testable interface for the backend, decoupling tests from the raw server implementations. **Client components should NOT import from this file.**

- **/src/lib/dadmin/**:
  - `audit.ts`: Contains the `logAdminAction` helper for writing to the `auditLogs` collection in Firestore.

- **/src/lib/firebase-admin.ts**:
  - **Responsibility**: Initializes the Firebase Admin SDK for server-side use. It reads credentials from environment variables.

- **/src/lib/schemas.ts** & **src/data/schemas.ts**:
  - **Responsibility**: Defines the Zod schemas for all major data structures (HomePage, SiteSettings, etc.). This enforces data consistency.
  - **Flow**: `cms-server.ts` uses these schemas to parse data read from Firestore. Admin forms use them for validation.

- **/src/lib/types.ts**:
  - **Responsibility**: Defines TypeScript types inferred from the Zod schemas. Used throughout the application for type safety.

---

## 4. `src/components` - UI

- **/src/components/ui/**: Core, unstyled UI primitives from `shadcn/ui`.
- **/src/components/layout/**: Major layout components like `Header`, `Footer`, `Container`.
- **/src/components/sections/**: Components that render major sections of a page, such as `Hero`, `Services`, `CasesGrid`. These are typically Client Components that receive data as props.
- **/src/components/cms/**: Components used within the `/dadmin` panel, primarily forms and editors.

---

## 5. Data Flow Summary

1.  **Read (Public Site)**: `Page (Server Component)` → `getHomepage()` in `cms-server.ts` → `getDb()` from `firebase-admin` → Reads Firestore → `ZodSchema.parse()` → Returns data to page.
2.  **Write (Admin Panel)**: `Editor (Client Component)` → Calls `saveHomepageAction()` (Server Action) → `saveHomepageInternal()` in `cms-server.ts` → `getDb()` → Writes to Firestore.
3.  **Audit Log**: Any Server Action that performs a write operation calls `logAdminAction` from `lib/dadmin/audit.ts`.