# Security & Role-Based Access Control (RBAC)

This document outlines the security model for the Digifly application, including data access rules and user roles.

## 1. Core Security Principles

- **Server-Side Authority**: All write operations (create, update, delete) are handled exclusively by the server through **Server Actions**. The client-side application never writes directly to the database.
- **Public Data is Read-Only**: All content intended for the public website is world-readable to ensure fast, efficient rendering by Next.js Server Components.
- **Admin Panel Protection**: The `/dadmin` route group is protected by authentication.

## 2. Firestore Security Rules (`firestore.rules`)

The `firestore.rules` file is the single source of truth for database security. It defines who can read and write to different paths.

### Public Read Access
The following collections are world-readable to allow the frontend to render pages:
- `site/{docId}`: Global settings and navigation.
- `pages/{pageId}`: Content for singleton pages like home, about, etc.
- `cases/{caseId}`: Only documents where `published == true` are public.

### Admin-Only Write Access
- All write operations (`create`, `update`, `delete`) on the collections above are restricted to authenticated users with an admin role.
- The `isAdmin()` function in `firestore.rules` checks `request.auth.token.admin == true`.

### Protected Collections
- `auditLogs`: Can only be created by an authenticated user (i.e., the server) and read by admins. Updates and deletes are disallowed.
- `developerSettings`: Can only be read and written by admins.

## 3. User Roles & Authentication

The system is designed for two primary roles, although only the `admin` role is fully utilized at present.

- **`admin`**: A standard authenticated user who can access the `/dadmin` panel and perform content management tasks.
- **`superadmin`**: A user with elevated privileges, intended for accessing developer-only tools and sensitive settings.

### Authentication Flow

1.  **Login**: A user logs in via the `/dadmin/login` page.
2.  **ID Token**: Upon successful authentication with Firebase Auth, an ID token is sent to the `/api/admin/login` API route.
3.  **Session Cookie**: The server verifies the ID token and creates a secure, HTTP-only **session cookie**. This cookie is used to authenticate subsequent requests to the server and Server Actions.
4.  **Middleware**: The `src/middleware.ts` file intercepts all requests to `/dadmin/*`. If a valid session cookie is not present, it redirects the user to the login page.

### Setting a Superadmin

A superadmin role can be assigned to a user via a CLI script, which sets a custom claim on their Firebase Auth account.

**Command:**
```bash
tsx scripts/set-superadmin.ts <user@email.com>
```

This command uses the Firebase Admin SDK to set the `role: 'superadmin'` custom claim. This claim is then available in `request.auth.token` within Firestore security rules, allowing for more granular access control.
