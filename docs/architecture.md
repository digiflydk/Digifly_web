# Digifly Studio System Architecture

This document provides a high-level overview of the technical architecture of the Digifly Studio web application, focusing on the real, implemented system.

## 1. Core Technology Stack

- **Framework**: Next.js (App Router)
- **Hosting**: Firebase App Hosting
- **Database**: Firestore (via Firebase Admin SDK on the server)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Schema Validation**: Zod
- **Testing**: Playwright (for Node.js acceptance tests and UI smoke tests)

## 2. The 5-Layer System: A Server-Centric Data Flow

Digifly Studio is built on a 5-layer, server-centric architecture that strictly separates concerns to ensure security, maintainability, and performance.

**`Firestore` ↔ `cms-server.ts` ↔ `cms-api.ts` ↔ `Server Component` → `Client Component`**

### Layer 1: Firestore (The Source of Truth)
- All application content, configuration, and logs are stored in Firestore.
- It is the single, canonical source of truth.
- Access is governed by `firestore.rules`, which allows public reads for content collections and restricts writes to authenticated admin actions.

### Layer 2: `cms-server.ts` (The Data Access Layer)
- **Responsibility**: This is the **only** module in the application that directly communicates with Firestore.
- It uses the Firebase Admin SDK (`firebase-admin`), which is why it can *only* run on the server.
- It contains all data fetching (`get...`) and writing (`save...`, `update...`, `delete...`) logic.
- All data read from Firestore is immediately parsed and validated against Zod schemas from `src/data/schemas.ts`. This prevents malformed data from propagating through the application.

### Layer 3: `cms-api.ts` (The Testable Facade)
- **Responsibility**: This module provides a stable, server-side API for our internal tools, primarily the **Node.js-only acceptance tests**.
- It re-exports functions from `cms-server.ts` and Server Actions.
- **Crucial Rule**: The frontend application (Server Components) should import directly from `cms-server.ts`, while tests should import from `cms-api.ts`. This decouples the testing suite from the raw implementation details.

### Layer 4: Server Components (The Data Fetchers)
- **Responsibility**: These are the Next.js pages located in `src/app/(site)/`.
- As Server Components, they execute on the server and are responsible for fetching the data needed for a specific route.
- They call data-fetching functions directly from `cms-server.ts` (e.g., `const page = await getHomepage();`).
- They then pass the fetched data down to Client Components as props.

### Layer 5: Client Components (The Renderers)
- **Responsibility**: These are the UI components in `src/components/` responsible for rendering HTML and handling user interactions.
- They receive all their data as props from a parent Server Component.
- **Crucial Rule**: Client Components **must not** import `cms-server.ts` or any other server-only code. Doing so will pull server-side dependencies (like `firebase-admin`) into the client bundle and cause a build failure.

## 3. Data Mutations: The Server Action Flow

All data writes are handled securely through Server Actions.

1.  **Admin UI**: An admin interacts with a form in a Client Component (e.g., `HomepageEditor.tsx`).
2.  **Server Action Call**: On submit, the form calls a Server Action (e.g., `saveHomepageAction`).
3.  **Action Execution**: The Server Action, which runs only on the server, validates the payload and calls the appropriate write function in `cms-server.ts`.
4.  **Firestore Write**: `cms-server.ts` writes the data to Firestore.
5.  **Cache Revalidation**: The Server Action calls `revalidatePath()` to invalidate the Next.js cache, ensuring the public site is updated.

## 4. Caching Strategy

- **Data Fetching**: All data-fetching functions in `cms-server.ts` use `unstable_noStore()` to opt out of Next.js's Data Cache. This ensures that every request fetches the latest content from Firestore, which is critical for a CMS.
- **Route Rendering**: `export const dynamic = 'force-dynamic'` is used on pages to ensure they are always server-rendered on-demand.
- **API Routes**: Public API endpoints in `src/app/api/cms/` use a `Cache-Control: 'no-store'` header to prevent client-side or CDN caching.
- **Write Revalidation**: After any write operation, Server Actions call `revalidatePath('/')` or a more specific path to purge the Next.js Full Route Cache and Data Cache, forcing a fresh render on the next visit.
