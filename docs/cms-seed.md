
# CMS Seeding Script (`cms-seed`)

This document explains the purpose and usage of the CMS seeding script located at `scripts/cms-seed.ts`.

## What It Does

The `cms:seed` script is an essential part of the application's build and deployment process. Its primary purpose is to ensure that the Firestore database contains a valid, minimal set of content documents required for the site to build and run without errors.

Key features:

- **Idempotent:** The script can be run safely multiple times. It will only create documents that are missing and will fill in missing fields on existing documents without overwriting user-entered data.
- **Resilient:** It does not fail the build if a non-critical document is malformed. Instead, it logs a warning and uses safe defaults.
- **Schema-driven:** It uses Zod schemas defined in `src/lib/schemas` to validate and clean the data before writing it to Firestore.
- **Bootstrapping:** Running this script on a completely empty Firestore database will populate it with the baseline content needed to render the entire site.

The script populates the following:
- `site/settings`: Global site title, SEO defaults, brand info.
- `navigation/main`, `navigation/footer`: Header and footer menu links.
- `pages/home`, `pages/about`, etc.: Content for singleton pages.
- `cases/{slug}`: A default set of case studies if the collection is empty.

## How to Run It

The script is automatically run as part of the `npm run build` process, defined in `package.json`.

To run it manually, use the following command from the project root:

```bash
npm run cms:seed
```

### Expected Output

When you run the script, you will see console output indicating which documents are being "upserted" (created or updated).

**On a clean database:**
```
[SEED] Starting CMS data seed...
[SEED] Upserting: site/settings
[SEED] Upserting: navigation/main
...
[SEED] Creating case: autostream-ai
...
[SEED] CMS data seed complete ✅
```

**On a subsequent run (idempotent):**
```
[SEED] Starting CMS data seed...
[SEED] Upserting: site/settings
[SEED] Upserting: navigation/main
...
[SEED] CMS data seed complete ✅
```
(No "Creating case" messages will appear if they already exist).

## Guarantee

This script guarantees that the Firebase App Hosting build process will always have the necessary CMS documents to successfully build the application, even when starting from a fresh Firestore instance.
