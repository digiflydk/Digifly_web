
export const PLAYBOOK_CONTENT = `
# DIGIFLY ENGINEERING PLAYBOOK (v1.0.1)

## 1. Architecture Principles

- **CMS → API → Firestore → UI** is the single source of truth flow.
- Each part must have a **strict contract**.
- No magic. Nothing implicit. All fields defined explicitly.
- No internal imports from libraries (Playwright internals, Next internals, etc.)


## 2. Task Structure (Studio Tickets)

Every task must have:
1.  **ID — Title**
2.  **Files**
3.  **Changes**
4.  **Business rules**
5.  **Definition of Done**
6.  **Footer: version + ID**

Task content must be precise, file-safe, and limited in scope.

## 3. Testing Strategy

### A. Acceptance Tests (Node-level Regression)
- Runs automatically after Studio completes a task.
- Stored in \`/dadmin/developer/tests\`
- Reports stored in Firestore under \`qaRuns\`.
- **Important (DGF-413)**: These tests run in a Node.js-only environment and **do not use a browser**. They validate server-side logic (e.g., CMS read/write actions) and data integrity, not the UI.

### B. Predeploy Smoke Tests
- Triggered manually by user before pressing Publish.
- Validate full system integrity (this might involve a browser in other environments).

### C. Playwright Test Design
- Each task defines acceptance test cases.
- Studio implements tests.
- No internal Playwright APIs allowed.

### 3.1 Test numbering and naming
- Every acceptance test is linked to a Studio task ID (\`DGF-xxx\`).
- The **numeric part** of the task ID is the test ID.
  - Example: task \`DGF-406\` → test ID \`406\`.
- Acceptance test files must follow this convention:
  - \`tests/acceptance/{id}-{short-description}.spec.ts\`
  - Example: \`tests/acceptance/406-homepage-hero.spec.ts\`
- QA runs store \`taskId\` so we can trace:
  - Task → Tests → QA run → Logs.
- When using \`/dadmin/developer/tests\`, always set the “Current Task ID” to the DGF ID of the task you're validating.

### 3.2 DGF-413: Regression tests in Studio (no browser)
- **Why?** The Studio environment cannot reliably run a real browser for Playwright tests.
- **What?** The "acceptance" test pipeline now runs Node.js-only regression tests that directly test core backend logic like CMS save/read functions.
- **Where?** These tests live in \`/tests/acceptance\` and are named like \`*.regression.acceptance.spec.ts\`.
- **How?** They must not use Playwright's \`page\` or \`browser\` fixtures. They run via the existing Studio selftest flow and provide fast feedback on core logic.
- **Future:** Full browser-based UI tests can be reintroduced later via a different CI environment (e.g., GitHub Actions) that can reliably launch browsers.

## 4. Logging & Observability

All important API routes must log:
- request
- response
- path
- actor
- timestamp

Logs stored under \`/dadmin/developer/logs\`
Must have enable/disable toggle per module.


## 5. Firestore Usage

- Collections must be explicitly defined.
- Each collection must have: schema, allowed fields, allowed writes/reads.
- No ad-hoc collections.

## 6. CMS/API Contract Rules

- Every CMS save must be logged.
- API must validate shape.
- Frontend must consume exact same structure.
- Any mismatch is a bug.

## 7. Versioning Rules

Every change increments:
- App version
- Playbook version (when relevant)


Footer example: \`Version: 1.3.74 • DGF-404\`

## 8. Studio Behaviour Rules

Studio may not:
- Touch files not listed in “Files”
- Introduce new dependencies
- Change Firestore structure
- Modify other routes unexpectedly
- Invent new APIs


Studio must:
- Follow instructions exactly
- Update acceptance tests
- Update documentation


## 9. Documentation Discipline

All new features require documentation in:
- \`/dadmin/developer/docs/core\`
- \`/dadmin/developer/docs/technical\`
- \`/dadmin/developer/docs/other\`

Always update documentation when learning something new.
`;
