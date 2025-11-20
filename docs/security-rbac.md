# Security & Role-Based Access Control (RBAC)

This document outlines the security model for the Digifly Studio application, including data access rules and the current authentication flow.

## 1. Core Security Principles

- **Server-Side Authority**: All write operations (create, update, delete) are handled exclusively by the server through **Server Actions**. The client-side application never writes directly to the database.
- **Public Data is Read-Only**: All content intended for the public website is world-readable via Firestore rules to ensure fast, efficient rendering by Next.js Server Components.
- **Admin Panel Protection**: The entire `/dadmin` route group is protected by authentication middleware.

## 2. Firestore Security Rules (`firestore.rules`)

The `firestore.rules` file is the single source of truth for database security. It defines who can read and write to different paths.

### Public Read Access
The following collections are world-readable to allow the frontend to render pages:
- `site/{docId}`: Global settings and navigation.
- `pages/{pageId}`: Content for singleton pages like `home`, `about`, etc.
- `cases/{caseId}`: Only documents where `published == true` are public.

### Admin-Only Write Access
- All write operations (`create`, `update`, `delete`) on the collections above are restricted to authenticated users.
- The `isAdmin()` function in `firestore.rules` simply checks if `request.auth != null`, as the middleware handles protecting the `/dadmin` panel itself.

### Protected Collections
- `auditLogs`: Can only be created by an authenticated user (i.e., the server via a Server Action) and read by an authenticated admin. Updates and deletes are disallowed.

## 3. User Roles & Authentication

The system is designed for two primary roles, although only the `admin` role is fully utilized in the application logic at present.

- **`admin`**: A standard authenticated user who can access the `/dadmin` panel and perform content management tasks. In the current `firestore.rules`, any authenticated user is treated as an admin for write purposes.
- **`superadmin`**: A user with elevated privileges, intended for accessing developer-only tools (`/dadmin/developer/*`). This role is checked in the `dadmin/layout.tsx` file.

### Authentication Flow

1.  **Login Attempt**: A user navigates to `/dadmin/login` and submits their credentials.
2.  **ID Token Verification**: The form POSTs to `/api/admin/login`. This route uses the Firebase Admin SDK to verify the user's ID token.
3.  **Session Cookie**: Upon successful verification, the server creates a secure, HTTP-only **session cookie** (`digifly_session`) and sets it on the user's browser.
4.  **Middleware Check**: For every subsequent request to a `/dadmin/*` route, the `src/middleware.ts` file intercepts the request. It checks for the presence and validity of the session cookie.
5.  **Redirect**: If a valid session cookie is not found, the middleware redirects the user back to the login page.

### Setting a Superadmin

A superadmin role can be assigned to a user via a CLI script, which sets a custom claim on their Firebase Auth account.

**Command:**
```bash
tsx scripts/set-superadmin.ts <user@email.com>
```

This command uses the Firebase Admin SDK to set the `role: 'superadmin'` custom claim. This claim is then available in the user's token and can be checked on the server to grant access to developer-only sections.
