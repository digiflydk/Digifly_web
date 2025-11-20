# Digifly CMS API Contract

This document outlines the structure, endpoints, and usage of the public, read-only CMS API for the Digifly website.

## Overview

The frontend application reads all content (text, images, navigation, design tokens) from a set of stable, cached API endpoints. This decouples the frontend from the underlying data source (Firestore) and ensures a consistent data contract.

The base URL for the CMS API is configured via the `NEXT_PUBLIC_CMS_BASE_URL` environment variable, which defaults to `/api/cms`.

### Key Principles
- **Read-Only**: The public API only supports `GET` requests. All content is managed directly in Firestore via Server Actions in the admin panel.
- **Server-Side Consumption**: Frontend pages (Server Components) consume data via helpers in `src/lib/cms-server.ts`. These helpers fetch data directly from Firestore on the server.
- **Validated**: All data is validated against Zod schemas in `src/data/schemas.ts` on both the server (API) and client (fetchers) to prevent malformed data from breaking the UI.

---

## Firestore ↔ API Mapping

| Firestore Path (Collection/Doc) | API Endpoint (`GET`)  | Description                                 |
| ------------------------------- | --------------------- | ------------------------------------------- |
| `site/settings`                 | `/api/cms/site`       | Global site settings (branding, SEO).       |
| `site/navigation`               | `/api/cms/navigation` | Header and footer navigation links.         |
| `pages/home`                    | `/api/cms/pages/home` | All content for the homepage.               |
| `pages/{slug}`                  | `/api/cms/pages/{slug}` | Content for other singleton pages (about, etc). |
| `cases` collection              | `/api/cms/cases`      | A list of all published case studies.       |
| `cases/{id}`                    | `/api/cms/cases/{id}` | A single case study by its document ID.     |

---

## API Endpoints & Examples

### Health Check

- **Endpoint**: `GET /api/_health`
- **Description**: A simple health check to confirm the API is running.
- **Response**:
  ```json
  {
    "ok": true,
    "ts": 1672531200000
  }
  ```

### Site Settings

- **Endpoint**: `GET /api/cms/site`
- **Description**: Returns global site settings.
- **Response Example**:
  ```json
  {
    "general": { "brandName": "Digifly", "logoUrl": "...", "faviconUrl": "..." },
    "seo": { "defaultTitle": "...", "defaultDescription": "..." }
  }
  ```

### Navigation

- **Endpoint**: `GET /api/cms/navigation`
- **Description**: Returns header and footer navigation structures.
- **Response Example**:
  ```json
  {
    "header": [
      { "id": "...", "link": { "label": "Services", "type": "internal", "internalRef": "services" } }
    ],
    "footer": {
      "columns": [
        { "title": "Company", "links": [ { "id": "...", "link": { "label": "About", "type": "internal", "internalRef": "about" } } ] }
      ]
    }
  }
  ```

---

## How to Add or Modify a Field

To add or modify a content field, follow these steps to ensure the contract remains consistent:

1.  **Update Firestore**: Add or change the field in the relevant Firestore document.
2.  **Update Zod Schema**: Modify the corresponding schema in `src/data/schemas.ts` to reflect the change. This is critical for validation.
3.  **Update TypeScript Type**: Modify the corresponding type in `src/lib/types.ts` to match the Zod schema.
4.  **Update Admin Form**: If the field is editable, add it to the relevant form in `src/app/dadmin`.
5.  **Consume in Frontend**: Use the new field in your React components, ensuring data is passed from the server component (page) to the client component.