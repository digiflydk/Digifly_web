# Digifly Studio Project Documentation

Welcome to Digifly Studio! This document is the starting point for understanding the application's architecture, data flow, and development practices.

## 1. What is Digifly Studio?

Digifly Studio is a modern, CMS-driven web application built on a robust and scalable technology stack. Its core purpose is to provide a dynamic public-facing website where all content—from text and images to navigation and design—is managed through a secure admin panel.

**Tech Stack:**
- **Framework**: Next.js (App Router)
- **Database**: Firebase Firestore
- **Styling**: Tailwind CSS with shadcn/ui
- **Deployment**: Firebase App Hosting
- **Testing**: Playwright for Node.js acceptance and UI smoke tests
- **Mutations**: Server Actions

## 2. Core Architecture: The Data Flow

The application follows a clear, server-centric data flow to ensure security and performance.

**`Firestore`** ↔ **`cms-server.ts`** ↔ **`cms-api.ts`** ↔ **`Server Component`** → **`Client Component`**

1.  **Firestore**: The single source of truth for all data (e.g., documents in `site/`, `pages/`, `cases/`).
2.  **`cms-server.ts`**: The only part of the app that communicates directly with Firestore using the Firebase Admin SDK. It contains all data fetching and writing logic.
3.  **`cms-api.ts`**: A server-side facade that re-exports functions from `cms-server.ts`. Its purpose is to provide a stable, testable entry point for Node.js acceptance tests.
4.  **Server Components**: Next.js pages (e.g., `src/app/(site)/page.tsx`) are Server Components. They are responsible for fetching data for a route using the helpers in `cms-server.ts`.
5.  **Client Components**: UI components (e.g., `Hero.tsx`) are Client Components. They receive data as props from Server Components and are responsible for rendering and user interaction.

## 3. Getting Started

### Running the Project Locally

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Set Up Environment**:
    - Copy the `.env.local.example` file to a new file named `.env.local`.
    - Fill in the required Firebase project credentials. Your `FIREBASE_SERVICE_ACCOUNT_JSON` should be a base64-encoded string.
3.  **Seed the Database**:
    - Run the seeding script to populate your local Firestore with default content from `src/data/defaults.ts`.
    ```bash
    npm run cms:seed
    ```
4.  **Run the Development Server**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002`.

### Admin Panel Access
- The admin panel is at `/dadmin`.
- In a production environment, this route is protected by authentication. For local development, authentication can be disabled by setting `ADMIN_AUTH_DISABLED=true` in your `.env.local` file.

## 4. Documentation Index

- **[Blueprint](./blueprint.md)**: The high-level conceptual model of the Digifly Studio platform.
- **[Architecture Overview](./architecture.md)**: A deep dive into the technical system architecture.
- **[File Map](./FILE-MAP.md)**: A guide to the project's file and folder structure.
- **[Data Flow](./data-flow.md)**: A step-by-step breakdown of how data moves through the app.
- **[Data Communication Rules](./data-communication.md)**: Rules for how different parts of the app communicate.
- **[API Overview](./api-overview.md)**: Details on the public-facing CMS API endpoints.
- **[Firestore Collections](./firestore-collections-overview.md)**: An overview of the database collections.
- **[Firestore Schema](./firestore-schema.md)**: Detailed breakdown of the data schemas.
- **[Build & Deployment Guidelines](./build-guidelines.md)**: Rules for stable builds and deployments.
- **[Operations Log](./OPERATIONS-LOG.md)**: A log of major architectural changes and decisions.
- **[Troubleshooting Guide](./TROUBLESHOOTING-QUICK.md)**: Quick fixes for common development issues.
- **[Security & RBAC](./security-rbac.md)**: Information on the application's security model.
- **[Performance & Indexes](./performance-indexes.md)**: Notes on Firestore indexes.
- **[Project Management Templates](./PM-KICKOFF-TEMPLATE.md)**: Templates for planning new tasks.
