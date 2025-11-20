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

## 3. CMS & Data Layer

The data layer is designed to be robust and server-centric, minimizing client-side data fetching.

 <!-- Placeholder for a diagram -->

- **Firestore**: The single source of truth for all content. Documents are structured to match the content models (e.g., `pages/home`, `site/settings`).
- **`src/lib/firebase-admin.ts`**: A server-only module that initializes the Firebase Admin SDK, allowing trusted server-side access to Firestore.
- **`src/data/schemas.ts`**: Contains Zod schemas for all major Firestore documents. This is the **contract** for our data.
- **`src/lib/cms-server.ts`**: The primary data-fetching layer.
  - Contains functions like `getHomepage()`, `getSiteSettings()`, etc.
  - These functions are marked with `"use server"`.
  - They read directly from Firestore, parse the data with Zod schemas, and return it.
  - **This is the layer that Server Components should use.**
- **`src/lib/cms-api.ts`**: A server-side API facade.
  - It re-exports functions from `cms-server.ts` and Server Actions.
  - **Purpose**: To provide a stable, decoupled interface for our acceptance tests and any future backend services. Tests should import from `cms-api`, not `cms-server`.

## 4. Admin Panel & Data Mutations

All data modifications happen through the admin panel (`/dadmin`).

- **Client Components**: Admin pages are built with Client Components (e.g., `HomepageEditor.tsx`) to allow for interactivity and form state management.
- **Server Actions**: When a user saves a form, the Client Component calls a Server Action (e.g., `saveHomepageAction` in `src/app/dadmin/homepage/actions.ts`).
- **Action Logic**: The Server Action handles validation (using Zod) and calls the appropriate write function in `cms-server.ts` to update Firestore. It also triggers cache revalidation (`revalidatePath`) and writes an audit log.

This pattern keeps all mutation logic securely on the server and avoids exposing Firestore write access to the client.

## 5. Logging

- **`src/lib/dadmin/audit.ts`**: Provides a `logAdminAction` function.
- **Flow**: Any significant server-side operation (e.g., saving content, running a test) calls this function.
- **Storage**: Logs are written to the `auditLogs` collection in Firestore.
- **Viewing**: The `/dadmin/developer/logs` page displays these logs, providing observability into admin and system actions.

## 6. Testing

- **Acceptance Tests (`/tests/acceptance`)**:
  - These are **Node.js-only tests** run with Playwright's test runner but without a browser.
  - They test the data layer by directly importing and calling functions from `src/lib/cms-api.ts`.
  - **Example**: A test can call `saveHomepage`, then `getHomepage`, and assert that the data was updated correctly, validating the entire server-side data flow.
- **Smoke Tests (`/tests/smoke`)**:
  - These are lightweight browser-based tests that run against a deployed environment.
  - They check for critical, user-facing issues like console errors, missing elements, or broken links.
  - They are run manually via the `/dadmin/developer/predeploy` page as a final check before a production release.