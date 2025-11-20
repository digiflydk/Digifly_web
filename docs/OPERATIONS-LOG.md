# Operations Log

This log tracks significant architectural decisions, schema changes, and important debugging outcomes for the Digifly Studio project.

---

## 2025-11-20 — Documentation Pack (DGF-481)
- **Description**: Created a full developer documentation package to reflect the current state of the Digifly Studio application architecture, data flow, and development processes. This provides a single source of truth for new and existing developers.
- **Files Affected**:
  - `/docs/README.md`
  - `/docs/architecture.md`
  - `/docs/FILE-MAP.md`
  - `/docs/api-overview.md`
  - `/docs/firestore-collections-overview.md`
  - `/docs/firestore-schema.md`
  - `/docs/data-flow.md`
  - `/docs/data-communication.md`
  - `/docs/performance-indexes.md`
  - `/docs/security-rbac.md`
  - `/docs/TROUBLESHOOTING-QUICK.md`
- **Version**: 1.3.147

---

## 2025-11-18 — Homepage Hero Data Flow Fix (DGF-474 to DGF-479)
- **Description**: A series of debugging and refactoring tasks to fix an issue where homepage content saved in the CMS was not appearing on the public site. The root cause was identified as a client-server boundary violation, where server components were incorrectly trying to import and execute client-side utility functions.
- **Outcome**:
  - The data flow was corrected to strictly enforce that data fetching and mapping for server components occur only on the server.
  - Client components now receive raw data as props and handle their own view-specific logic.
  - Added structured audit logging for CMS read/write operations to provide clear visibility into the data flow for future debugging.
- **Files Affected**:
  - `src/app/(site)/page.tsx`
  - `src/lib/cms-api.ts`
  - `src/lib/cms-server.ts`
  - `src/lib/hero-style-utils.ts`
  - `src/lib/dadmin/audit.ts`
- **Version**: 1.3.145
