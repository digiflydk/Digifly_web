# Digifly CMS API Contract

This document outlines the structure, endpoints, and usage of the public, read-only CMS API for the Digifly website.

## Overview

The frontend application reads all content (text, images, navigation, design tokens) from a set of stable, cached API endpoints. This decouples the frontend from the underlying data source (Firestore) and ensures a consistent data contract.

The base URL for the CMS API is configured via the `NEXT_PUBLIC_CMS_BASE_URL` environment variable, which defaults to `/api/cms`.

### Key Principles
- **Read-Only**: The API only supports `GET` requests. All content is managed directly in Firestore.
- **Cached**: Endpoints use `s-maxage=60` and `stale-while-revalidate=300` to ensure fast responses while allowing content to update periodically.
- **Validated**: All data is validated against Zod schemas on both the server (API) and client (fetchers) to prevent malformed data from breaking the UI.

---

## Firestore ↔ API Mapping

| Firestore Path (Collection/Doc) | API Endpoint (`GET`)  | Description                                 |
| ------------------------------- | --------------------- | ------------------------------------------- |
| `content/settings/design`       | `/api/cms/design`     | Global design tokens (colors, fonts, etc.). |
| `content/navigation`            | `/api/cms/navigation` | Header and footer navigation links.         |
| `content/home`                  | `/api/cms/home`       | All content for the homepage.               |
| `services/{serviceId}`          | `/api/cms/services`   | A list of all services.                     |
| `cases/{caseId}`                | `/api/cms/cases`      | A list of all case studies.                 |

---

## API Endpoints & Examples

### Health Check

- **Endpoint**: `GET /api/cms/health`
- **Description**: A simple health check to confirm the API is running.
- **Response**:
  ```json
  {
    "ok": true,
    "ts": 1672531200000
  }
  ```

### Design Tokens

- **Endpoint**: `GET /api/cms/design`
- **Description**: Returns the global design tokens.
- **Response Example**:
  ```json
  {
    "version": "1.2.0",
    "colors": {
      "black": "#000000",
      "graphite": "#2B2B2B",
      // ... more colors
    },
    "fonts": {
      "headline": "Space Grotesk",
      "body": "Inter"
    },
    // ... more tokens
  }
  ```

### Navigation

- **Endpoint**: `GET /api/cms/navigation`
- **Description**: Returns header and footer navigation structures.
- **Response Example**:
  ```json
  {
    "header": [
      { "label": "About", "href": "/about" },
      { "label": "Services", "href": "/services" }
    ],
    "footer": {
      "columns": [
        {
          "title": "Company",
          "links": [
            { "label": "About Us", "href": "/about" }
          ]
        }
      ]
    }
  }
  ```

---

## How to Add or Modify a Field

To add or modify a content field, follow these steps to ensure the contract remains consistent:

1.  **Update Firestore**: Add or change the field in the relevant Firestore document.
2.  **Update Zod Schema**: Modify the corresponding schema in `src/lib/cms-schemas.ts` to reflect the change. This is critical for validation.
3.  **Update TypeScript Type**: Update the type in `src/lib/cms-types.ts` to match the Zod schema.
4.  **Update OpenAPI Spec**: Update `openapi/cms.yaml` to document the new field.
5.  **Consume in Frontend**: Use the new field in your React components.
