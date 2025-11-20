# Data Communication Rules

To maintain a secure, maintainable, and server-centric architecture, the Digifly Studio project follows strict rules for how different parts of the application communicate.

## Core Principle: Server is the Single Source of Truth

The server holds all business logic, data fetching/writing capabilities, and secrets. The client is responsible only for presenting data and capturing user input.

---

## The 4 Key Layers

1.  **Firestore**: The raw data store. No component or page should ever access this directly, except through `cms-server.ts`.
2.  **`cms-server.ts`**: The **ONLY** module in the application that is allowed to import the Firebase Admin SDK and communicate directly with Firestore. It contains all `get...` and `save...` functions. It is marked as `"use server"`.
3.  **Server Actions (`/dadmin/.../actions.ts`)**: Secure functions that live on the server and are callable from Client Components. Their only job is to handle input, call `cms-server.ts` to perform writes, and handle cache revalidation.
4.  **Frontend (Server & Client Components)**: The UI layer.

## Communication Rules

### Rule 1: Frontend Reads Data via Server Components

- **Public Site Pages** (`/app/(site)/**/*.tsx`) are **Server Components**.
- They **MUST** fetch data by calling functions from `src/lib/cms-server.ts` (e.g., `getHomepage()`).
- They then pass this data as props to Client Components for rendering.

```tsx
// Correct: src/app/(site)/page.tsx
import { getHomepage } from '@/lib/cms-server'; // OK: Server Component importing server-only function
import Hero from '@/components/sections/hero';

export default async function Page() {
  const page = await getHomepage();
  return <Hero data={page.hero} />; // Pass data as props
}
```

- **Client Components** (`/components/**/*.tsx`) **MUST NOT** import from `cms-server.ts`. They only receive data through props.

### Rule 2: Frontend Writes Data via Server Actions

- **Admin Panel Forms** are **Client Components** (e.g., `HomepageEditor.tsx`).
- To save data, they **MUST** call a **Server Action** (e.g., `saveHomepageAction`).
- The Server Action handles the actual database write by calling a function from `cms-server.ts`.

```tsx
// Correct: Admin form calling a Server Action
"use client";
import { saveHomepageAction } from '@/app/dadmin/homepage/actions';

function MyForm() {
  const handleSave = async (data) => {
    await saveHomepageAction(data); // OK: Client Component calling a Server Action
  };
  // ...
}
```

### Rule 3: `cms-api.ts` is for Tests and Non-Next.js Environments Only

- `src/lib/cms-api.ts` is a facade that re-exports functions from `cms-server.ts`.
- **Its primary purpose is to provide a stable, Node.js-compatible entry point for our Playwright acceptance tests.**
- The frontend application **SHOULD NOT** import from this file. It should use `cms-server.ts` directly from Server Components.

### Anti-Patterns (What to Avoid)

- **NEVER** `import { getDb } from '@/lib/firebase/admin'` from anywhere except `cms-server.ts` or other designated server-only utility files.
- **NEVER** have a Client Component import a function from `cms-server.ts`. This will cause a build error because it pulls server code into the client bundle.
- **NEVER** perform a direct Firestore read or write from a Client Component. Always use a Server Action for writes.
