# Digifly Homepage Data Flow

This document outlines the end-to-end data flow for updating and displaying content on the homepage.

## 1. The Write Flow (Admin Panel)

This flow describes what happens when an admin saves content in `/dadmin/homepage`.

1.  **User Interaction (Client)**
    - An admin modifies a field in the `HomepageEditor` Client Component.
    - The user clicks the "Save Homepage" button.

2.  **Server Action Invocation (Client → Server)**
    - The form's `onSubmit` handler calls `saveHomepageAction(data)`, which is a Server Action defined in `src/app/dadmin/homepage/actions.ts`.
    - The form data (`payload`) is sent to the server.

3.  **Data Validation & Processing (Server)**
    - The `saveHomepageAction` receives the payload.
    - It delegates to `saveHomepageInCmsActions` in `src/lib/server/cms-actions.ts`.
    - This function first fetches the existing document from Firestore to perform a deep merge, ensuring no fields are accidentally deleted.
    - The merged data is then parsed and validated against the `HomepageSchema` from `src/data/schemas.ts`. If validation fails, an error is thrown.

4.  **Firestore Write (Server)**
    - If validation succeeds, the function calls `db.doc('pages/home').set(...)` to write the complete, validated data to Firestore, overwriting the existing document.

5.  **Audit Logging & Cache Revalidation (Server)**
    - After a successful write, `logAdminAction` is called to create a record in the `auditLogs` collection.
    - `revalidatePath('/')` is called to invalidate the Next.js cache for the homepage, ensuring the next visitor sees the new content.

## 2. The Read Flow (Public Homepage)

This flow describes what happens when a user visits the public homepage (`/`).

1.  **Page Request (Client → Server)**
    - A user's browser requests the homepage route.

2.  **Data Fetching (Server Component)**
    - The `HomePage` Server Component in `src/app/(site)/page.tsx` executes on the server.
    - It calls the `getHomepage()` helper function from `src/lib/cms-server.ts`.

3.  **Firestore Read (Server)**
    - `getHomepage()` uses the Firebase Admin SDK to fetch the document from `pages/home` in Firestore.
    - If the document doesn't exist, it falls back to `defaultHomepage`.

4.  **Data Validation & Sanitization (Server)**
    - The raw data from Firestore is passed to `sanitizeHomepage` to ensure structural integrity (e.g., array lengths).
    - The sanitized data is then parsed with `HomepageSchema.safeParse()`. If parsing fails, a warning is logged, but the "best-effort" sanitized data is still returned to prevent a page crash.

5.  **Logging (Server)**
    - The fetched data is logged via `logHomepageHeroSnapshot` for debugging purposes.

6.  **Props Passed to Client Component (Server → Client)**
    - The `HomePage` Server Component renders the `<Hero>`, `<WhatWeDo>`, etc., components.
    - The fetched and processed data (e.g., `page.hero.slides[0]`) is passed as props to these Client Components.

7.  **Rendering (Client)**
    - The `Hero` Client Component receives the raw slide data.
    - Inside the component, `mapHeroSlideToViewModel` is called to transform the data into a final view model (e.g., calculating overlay colors).
    - The browser renders the final HTML with the live CMS content.