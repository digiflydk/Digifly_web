# Digifly Studio: Data Communication Rules

To maintain a secure, maintainable, and server-centric architecture, the Digifly Studio project follows strict rules for how different parts of the application communicate.

## Core Principle: Server is the Single Source of Truth

The server holds all business logic, data fetching/writing capabilities, and secrets. The client is responsible only for presenting data and capturing user input.

---

## The 4 Key Layers

1.  **Firestore**: The raw data store.
2.  **`cms-server.ts`**: The **Data Access Layer**. It's the only module allowed to communicate directly with Firestore. Marked as `"use server"`.
3.  **`cms-api.ts`**: A **Testable Facade**. A server-side module that re-exports functions from `cms-server.ts` to provide a stable entry point for Node.js tests.
4.  **Frontend**: The UI layer, composed of Server Components and Client Components.

---

## Communication Rules: The Right Way

### ✅ Rule 1: Frontend Reads Data via Server Components
- **Server Components** (`/app/(site)/**/*.tsx`) **MUST** fetch data by calling functions directly from `src/lib/cms-server.ts`.
- They then pass this data as props to Client Components for rendering.

```tsx
// Correct: /app/(site)/page.tsx (Server Component)
import { getHomepage } from '@/lib/cms-server'; // OK: Server Component importing a server-only function.
import Hero from '@/components/sections/hero';    // A Client Component.

export default async function Page() {
  const pageResult = await getHomepage();
  const page = pageResult.ok ? pageResult.data : null;
  
  // Pass the raw data as props to the client.
  return <Hero data={page.hero} />; 
}
```

### ✅ Rule 2: Frontend Writes Data via Server Actions
- **Client Components** in the admin panel (`/dadmin`) **MUST** call a **Server Action** to save data.
- The Server Action handles validation and calls a write function in `cms-server.ts`.

```tsx
// Correct: Admin form calling a Server Action
"use client";
import { saveHomepageAction } from '@/app/dadmin/homepage/actions';

function MyForm() {
  const handleSave = async (data) => {
    // Calling a Server Action is safe from the client.
    await saveHomepageAction(data); 
  };
  // ...
}
```

### ✅ Rule 3: Tests Use the `cms-api.ts` Facade
- **Node.js acceptance tests** in `tests/acceptance/` **MUST** import from `src/lib/cms-api.ts`.
- This ensures tests are decoupled from the raw implementation and test the same interface the app would use if it had an internal API.

---

## Anti-Patterns: What to Avoid

### ❌ Anti-Pattern 1: Client Component Importing Server Code
- A Client Component **MUST NOT** import from `cms-server.ts` or `firebase-admin`. This will cause a build error by pulling server-only code into the client bundle.

```tsx
// WRONG: A Client Component trying to fetch its own data.
"use client";
import { getHomepage } from '@/lib/cms-server'; // <-- THIS WILL BREAK THE BUILD

export default function Hero() {
  // ... this component should receive data via props, not fetch it.
}
```

### ❌ Anti-Pattern 2: Frontend App Code Importing from `cms-api.ts`
- The application's frontend (Server and Client Components) **SHOULD NOT** import from `cms-api.ts`. That file is a facade specifically for the testing environment.
- **App Code**: Use `cms-server.ts` for data fetching in Server Components.
- **Test Code**: Use `cms-api.ts` for data operations in tests.
