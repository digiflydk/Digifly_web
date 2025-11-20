# Digifly Studio Data Flow

This document outlines the end-to-end data flow for both reading and writing content, from an admin's action to a visitor viewing the page.

## 1. The Write Flow (Admin Panel)

This flow describes what happens when an admin saves content in `/dadmin/homepage`.

1.  **User Interaction (Client)**
    - An admin modifies a form field in a Client Component (e.g., `HomepageEditor.tsx`).
    - The user clicks the "Save" button.

2.  **Server Action Invocation (Client → Server)**
    - The form's `onSubmit` handler calls a **Server Action** (e.g., `saveHomepageAction`).
    - The form data is securely sent from the client to the server-side function.

3.  **Data Validation & Write (Server)**
    - The Server Action receives the payload.
    - It uses a **Zod schema** from `src/data/schemas.ts` to validate the incoming data. If invalid, it throws an error.
    - It calls a write function in **`src/lib/cms-server.ts`** (e.g., `updateHomepage`).
    - The `cms-server.ts` function uses the **Firebase Admin SDK** to write the validated data to the correct document in Firestore (e.g., `pages/home`).

4.  **Audit Logging & Cache Revalidation (Server)**
    - After a successful write, the Server Action calls `logAdminAction` to create a record in the `auditLogs` collection for observability.
    - `revalidatePath('/')` is called to invalidate the Next.js cache, ensuring visitors see the updated content.

## 2. The Read Flow (Public Homepage)

This flow describes what happens when a user visits the public homepage (`/`).

1.  **Page Request (Client → Server)**
    - A user's browser requests the homepage route (`/`).

2.  **Data Fetching (Server Component)**
    - The `HomePage` **Server Component** in `src/app/(site)/page.tsx` executes on the server.
    - It calls the `getHomepage()` helper function from `src/lib/cms-server.ts`.

3.  **Firestore Read & Validation (Server)**
    - `getHomepage()` uses the Firebase Admin SDK to fetch the document from `pages/home` in Firestore.
    - The raw data is immediately parsed with the `HomepageSchema` from `src/data/schemas.ts`. If parsing fails, it falls back to default data to prevent a page crash and logs a warning.

4.  **Props Passed to Client Component (Server → Client)**
    - The `HomePage` Server Component renders the necessary **Client Components** (e.g., `<Hero>`, `<WhatWeDo>`).
    - The fetched and validated data is passed down as props. For example, `page.hero` is passed to `<Hero data={page.hero} />`.

5.  **Rendering (Client)**
    - The Client Components receive the data as props.
    - They may perform final view-specific mapping (e.g., converting colors, resolving links) via helpers in `src/lib/hero-style-utils.ts` or `src/lib/links.ts`.
    - The browser renders the final HTML with the live CMS content.
