
# 🔧 Build & Development Guidelines (Digifly Studio)

These rules keep our Firebase + Next.js project stable in App Hosting and prevent common build breaks.

## 1. Admin SDK and Scripts
- Never import `"server-only"` in any file used by `scripts/` or `tsx` scripts.  
- All scripts that call Firebase Admin (like `cms:seed`) must **exit safely** if admin credentials aren’t available — not crash.  
- CI doesn’t have `.env` values, so scripts must run with empty creds and skip work gracefully.

## 2. Firestore and Client Code
- Client pages must **not call Firestore directly**.  
  - Use server actions or API routes instead.  
  - If a collection is empty or restricted, return empty defaults instead of crashing.
- Developer routes (`/dadmin/developer/*`) should never depend on auth or roles.

## 3. Buttons and Links
- The `<Button>` component must never use `href` directly.  
  - Use `<Button asChild><a href="/path">Label</a></Button>`  
  - The build guard fails if you use `href` on `Button`.

## 4. `"use server"` Files
- Server-action files can **only** export `async` functions.  
  - No objects, JSX, or constants.  
  - The preflight script checks this before every build.

## 5. SEO & Site Settings
- Only one “Site Title” field exists in **General** tab.  
- SEO tab handles meta and OpenGraph defaults only.  
- Live SEO Preview appears **only** inside SEO tab.  
- All inputs use controlled values to avoid React warnings.

## 6. Developer Tools
- `/dadmin/developer/docs` shows documentation from `/docs/*.md`.  
- `/dadmin/developer/tests` runs tests and prints a JSON report.  
- Both must work without login and fail gracefully if no data.

## 7. Build Guards
These checks run automatically during `npm run build`:
1. No `<Button href=...>`
2. No invalid `"use server"` exports
3. Safe seeding (no crashes if missing creds)
4. Type checks before final Next.js build

If any of these fail, fix the offending file before retrying deploy.

## 8. Environment Variables
- Studio must **never edit `.env`** automatically.  
- Only the owner updates `.env` manually.  
- Guards and no-op patterns make CI safe even with empty `.env`.

## 9. Pre-deploy Checklist & QA-gate
This automated check runs before any deployment to ensure stability.

### Guard Checks (npm run predeploy:guard)
- **No `<Button href>`:** Ensures all buttons intended as links use the proper `asChild` prop with an `<a>` tag.
- **No `server-only` in scripts:** Prevents build-time scripts from importing server-only code.
- **Valid `use server` exports:** Ensures files with `"use server"` only export async functions.
- **No deprecated keys:** Checks for outdated Firestore keys like `siteTitle`, `brand.logo.src`, etc.

### Type Safety (npm run predeploy:typecheck)
- Runs `tsc --noEmit` to catch any TypeScript errors.

### Schema Validation (npm run predeploy:qa)
- Runs `scripts/predeploy/validate-schema.ts` to verify that `siteDefaults` and `emptySiteSettings` align with the master `SiteSettingsSchema`.
- Confirms `manifest.ts` reads the correct keys (`settings.general.brandName`).

### Command Chain
The main command `npm run predeploy` executes all checks in sequence:
1. `cms:seed` (safe no-op if no creds)
2. `predeploy:guard`
3. `predeploy:typecheck`
4. `predeploy:qa`
5. `scripts/predeploy/report.ts` (generates `public/dev/reports/predeploy.json`)

If any step fails, the process will exit with a non-zero code, blocking the deployment and generating a report with the failure details.

### Failure Types to Catch
- "Missing named export from module" (e.g. importing `{ CaseDoc }` when not exported)
- "Default vs named component import mismatch" (e.g. `Doc` vs default `DocCard`)
- "Passing props to a component that doesn’t accept them" (e.g. `<AdminShell user={...}>`)
- "Wrong form field paths vs schema" (e.g. `siteTitle` instead of `general.brandName`)
- "Ensure contact object is complete" in default data structures.
- "Require `@types/lodash` to satisfy TS" for modules using it.
- "Page components must fetch and pass required props (e.g. `initialData`)"
- "Missing npm scripts referenced by predeploy (e.g. predeploy:guard, predeploy:typecheck). Ensure they exist in package.json before deploy."
