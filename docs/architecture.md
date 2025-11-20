# Digifly System Architecture

This document provides a high-level overview of the technical architecture of the Digifly web application.

## 1. Core Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Hosting**: Firebase App Hosting
- **Database**: Firestore (via Firebase Admin SDK on the server)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Schema Validation**: Zod
- **Testing**: Playwright (for Node.js acceptance tests and UI smoke tests)

## 2. Application Structure (App Router)

The application uses the Next.js App Router, which enables a clear separation between Server Components and Client Components.

- **/src/app/(site)/**: Contains routes for the public-facing website. Pages here are primarily Server Components that fetch data and pass it to Client Components for rendering.
- **/src/app/dadmin/**: Contains routes for the admin panel. Pages are Server Components, but they render Client Components (forms, editors) that use Server Actions for mutations.
- **/src/app/api/**: Contains API routes, primarily for the public CMS data and admin panel actions.

## 3. CMS & Data Layer: A Server-Centric Approach

The data layer is designed to be robust and server-centric, minimizing client-side data fetching and keeping secrets and direct database access off the client.

- **Firestore**: The single source of truth for all content. Documents are structured to match the content models (e.g., `pages/home`, `site/settings`).
- **`src/lib/firebase/admin.ts`**: A server-only module that initializes the Firebase Admin SDK, allowing trusted server-side access to Firestore. It reads credentials from environment variables.
- **`src/data/schemas.ts`**: Contains Zod schemas for all major Firestore documents. This is the **contract** for our data, ensuring type safety and validation at the point of read and write.
- **`src/lib/cms-server.ts`**: The primary data-fetching and writing layer.
  - Contains functions like `getHomepage()`, `saveHomepage()`, `getSiteSettings()`, etc.
  - These functions are marked with `"use server"`.
  - They read from and write directly to Firestore, parse the data with Zod schemas, and return it.
  - **This is the ONLY layer that should directly communicate with the database.**

## 4. Admin Panel & Data Mutations

All data modifications happen through the admin panel (`/dadmin`).

- **Client Components**: Admin pages are built with Client Components (e.g., `HomepageEditor.tsx`) to allow for interactivity and form state management using React Hook Form.
- **Server Actions**: When a user saves a form, the Client Component calls a Server Action (e.g., `saveHomepageAction` in `src/app/dadmin/homepage/actions.ts`).
- **Action Logic**: The Server Action handles validation (using Zod schemas from `src/data/schemas.ts`) and calls the appropriate write function in `cms-server.ts` to update Firestore. It also triggers cache revalidation (`revalidatePath`) and writes an audit log.

This pattern keeps all mutation logic securely on the server and avoids exposing Firestore write access or complex business logic to the client.

## 5. Logging and Observability

- **`src/lib/dadmin/audit.ts`**: Provides a central `logAdminAction` function for recording significant events.
- **Flow**: Any important server-side operation (e.g., saving a page, running a test, a page view) calls this function with a structured payload.
- **Storage**: Logs are written to the `auditLogs` collection in Firestore.
- **Viewing**: The `/dadmin/developer/logs` page provides a real-time stream of these logs, offering crucial visibility into system behavior for debugging.

## 6. Caching Strategy

- **Data Fetching**: Data fetching in Server Components uses `unstable_noStore()` to ensure fresh data is retrieved from Firestore on each request. This is suitable for a CMS where content changes need to be reflected quickly.
- **API Routes**: Public API routes use `Cache-Control: 'no-store'` to prevent caching.
- **Next.js Caching**: `revalidatePath()` is used in Server Actions to bust Next.js's data and full-route caches after a write operation, ensuring the public site updates.
