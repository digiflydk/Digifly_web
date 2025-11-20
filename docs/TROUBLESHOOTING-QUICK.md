# Quick Troubleshooting Guide

This guide provides solutions for common issues encountered during development.

---

### 1. CMS changes not appearing on the public site.

**Symptom:** You saved a change in `/dadmin` (e.g., updated the hero title), but the live site still shows the old content.

**Cause:** This is almost always a caching issue or a data flow mismatch.

**Solutions:**
1.  **Hard Refresh:** Perform a hard refresh in your browser (Cmd+Shift+R or Ctrl+Shift+R) to bypass the local browser cache.
2.  **Check the Data Flow:**
    - Is the page a Server Component or a Client Component?
    - **Server Components** should fetch data directly from `src/lib/cms-server.ts`.
    - **Client Components** should receive data as props from a parent Server Component.
    - **Anti-Pattern:** A Client Component should **never** import a data-fetching function from `cms-server.ts` or `cms-api.ts`.
3.  **Verify Firestore Path:** Check the `cms-server.ts` function to ensure it's reading from the correct Firestore document path (e.g., `pages/home`, not a legacy path).
4.  **Check for `revalidatePath()`**: Ensure the Server Action that saves the data calls `revalidatePath('/')` or the relevant path to invalidate Next.js's server-side cache.

---

### 2. Build fails with "Module not found: Can't resolve 'child_process'" or similar.

**Symptom:** The `npm run build` or `npm run dev` command fails with an error indicating a Node.js-specific module cannot be resolved.

**Cause:** A Client Component is importing a module that is marked as `"use server"` or depends on the Firebase Admin SDK. This pulls server-only code into the client bundle, which is not allowed.

**Solution:**
1.  **Trace the Import:** The error message will show an import trace. Find the Client Component at the top of that trace.
2.  **Create a Server Action:** Move the server-side logic into a Server Action file (e.g., `src/app/dadmin/my-feature/actions.ts`). Mark the file with `'use server'`.
3.  **Call the Action:** Update the Client Component to import and call the new Server Action instead of the server-side function.

---

### 3. Build Guard Fails: `<Button href>` or Invalid `use server` Exports

**Symptom:** The build process exits with an error from `predeploy:guard`.

**Solutions:**
- **`<Button href>` error**:
  - **Why?** The `<Button>` component does not accept an `href` prop. This causes accessibility and routing issues.
  - **Fix:** Wrap the `<a>` tag inside the button and use the `asChild` prop.
    ```diff
    - <Button href="/path">Click</Button>
    + <Button asChild><a href="/path">Click</a></Button>
    ```
    Alternatively, use the `<ButtonLink>` component if appropriate.
- **Invalid `use server` exports**:
  - **Why?** Files marked with `'use server'` can only export asynchronous functions.
  - **Fix:** Move any non-function exports (constants, types, objects) to a separate file that does not have the `'use server'` directive.

---

### 4. How to Interpret QA Reports

- **Acceptance Tests (`/dadmin/developer/tests`)**:
  - These are Node.js tests that validate backend logic.
  - If one fails, it means there's a regression in the data layer (e.g., a save operation no longer works or returns the wrong shape).
  - Check the error message in the "Error Summary" section of the run details.
- **Pre-deploy Smoke Tests (`/dadmin/developer/predeploy`)**:
  - These are browser-based tests.
  - A failure indicates a critical UI issue on the live site, such as a missing element, a console error, or a broken link.
  - View the full HTML report to see screenshots and detailed error traces.
