# Digifly Studio Platform Blueprint

This document is the high-level conceptual blueprint for the Digifly Studio platform. Its purpose is to provide a clear, top-down understanding of the project's philosophy, structure, and core mechanics.

## 1. Product Philosophy

Digifly Studio is a **CMS-driven website builder** designed for rapid development, secure content management, and a simple developer experience. It is not a generic, multi-tenant SaaS but a powerful, single-instance platform for building and managing a specific Digifly web property.

The core principles are:
- **Server-Centric Authority**: All business logic, data mutation, and secret management happens on the server. The client is for presentation only.
- **Data-Driven UI**: Content, navigation, and even design tokens are managed in the CMS (Firestore) and flow into the UI, not hardcoded.
- **Developer Experience First**: The architecture prioritizes clear boundaries, type safety (with Zod), and automated checks to make development fast and safe.

## 2. The 5-Layer Architecture

The entire system is built on a 5-layer architecture that enforces a one-way data flow for reads and a secure, action-based flow for writes.

1.  **Firestore**: The single source of truth.
2.  **`cms-server.ts`**: The exclusive data access layer. It's the only module that touches Firestore, using the Firebase Admin SDK.
3.  **`cms-api.ts`**: A stable, server-side facade used exclusively by Node.js acceptance tests to validate the data layer.
4.  **Server Components**: Next.js pages that fetch data from `cms-server.ts`.
5.  **Client Components**: UI components that only receive data via props.

This strict separation prevents common bugs, such as client-side code trying to access server-only dependencies.

## 3. Content & Data Model

The content model is designed to be simple and map directly to the website's structure.

- **Global Configuration (`site/` collection)**:
  - `site/settings`: Contains global brand info, contact details, business hours, and default SEO settings.
  - `site/navigation`: A single document that defines the links for the header and footer.
- **Singleton Pages (`pages/` collection)**:
  - Each document represents a unique page (e.g., `pages/home`, `pages/about`).
  - The `Homepage` document is the most complex, containing structured content for the hero, "What We Do" section, services, and featured cases.
- **Collections (`cases/` collection)**:
  - Each document in the `cases` collection represents a single case study.

All data is validated against **Zod schemas** defined in `src/data/schemas.ts`, ensuring data integrity from the database to the UI. Default data structures are provided in `src/data/defaults.ts` to ensure the site can always render, even with an empty database.

## 4. The Admin Panel & Developer Tools

- **Admin Panel (`/dadmin`)**: A secure area for managing all site content. All data mutations are handled by **Server Actions**, which call the write functions in `cms-server.ts`.
- **Developer Tools (`/dadmin/developer`)**: A suite of tools for maintainers:
  - **Playwright Tests**: Run and view results from Node.js-only acceptance tests.
  - **Audit Logs**: A real-time stream of important server-side events.
  - **API & Schema Docs**: Live documentation generated from the codebase.

## 5. Development & QA Workflow

The platform is designed for a safe and efficient development lifecycle.

- **Build Guards**: Automated scripts that run before `next build` to catch common errors, such as invalid imports or incorrect component usage.
- **Pre-deploy QA**: Manual smoke tests that can be run against a staging environment to catch critical UI bugs before a production release.
- **Acceptance Tests**: Node.js-level tests that validate the data layer's integrity after every code change made by Studio.

This multi-layered approach ensures that changes are validated at the code, build, and runtime levels, leading to more stable releases.
