
export const PLAYBOOK_CONTENT = `
# DIGIFLY ENGINEERING PLAYBOOK (v1.0.3)

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

### 3.1 Test numbering and naming (DGF-419)
- Every acceptance test is linked to a Studio task ID (\`DGF-xxx\`).
- The test suite title and at least one test title must contain the task ID to enable filtering.
- Acceptance test files should follow this convention for clarity:
  - \`src/tests/acceptance/{feature}.acceptance.spec.ts\`
- The “Current Task ID” field in \`/dadmin/developer/tests\` is used as a filter (\`--grep\`), so only relevant tests run.
- QA runs store \`taskId\` so we can trace:
  - Task → Tests → QA run → Logs.

### 3.2 DGF-413: Regression tests in Studio (no browser)
- **Why?** The Studio environment cannot reliably run a real browser for Playwright tests.
- **What?** The "acceptance" test pipeline now runs Node.js-only regression tests that directly test core backend logic like CMS save/read functions.
- **Where?** These tests live in \`src/tests/acceptance\` and are named like \`*.acceptance.spec.ts\`.
- **How?** They must not use Playwright's \`page\` or \`browser\` fixtures. They run via the existing Studio selftest flow and provide fast feedback on core logic.

## 4. Acceptance Testing Template (DGF-406 pattern)

### 4.1 Purpose
This is the standard template for:
- Feature-level acceptance tests in Studio (runType: "acceptance").
- Automatic selftests after a Studio task is implemented.
- Reuse across projects (Digifly, Orderfly, etc.).

### 4.2 Core principles
- One feature/task → one or more Node-only acceptance tests.
- Tests run in Studio environment (no browser, no React UI).
- Tests call the same server/CMS API as the real app.
- Each test run is stored in Firestore and visible in \`/dadmin/developer/tests\`.
- Every test is tagged with its \`taskId\` (e.g., "DGF-406") in the test title.

### 4.3 Example: DGF-406 — Homepage read/write acceptance
- **Scope:** Validate that homepage content can be read, updated (e.g., hero heading), read back with the new value, and retains its expected data shape.
- **Test Style:** Node-only, using \`@playwright/test\` for \`test\` and \`expect\`. It uses a shared CMS API wrapper (\`@/lib/cms-api\`) with \`getHomepage()\` and \`saveHomepage(payload)\`.
- **Flow:**
  1. Read current homepage (\`getHomepage()\`) to create a backup.
  2. In a \`try...finally\` block, write an updated payload with a unique marker in \`hero.slides[0].heading\`.
  3. Save the payload via \`saveHomepage(updatedPayload)\`.
  4. Read it again and assert that the new heading matches the marker.
  5. In the \`finally\` block, restore the original homepage data.

### 4.4 File & Project Structure
- **Playwright Project:** The \`acceptance\` project in \`playwright.config.ts\` is configured to be Node-only.
  - \`testDir\`: "src/tests/acceptance"
  - \`testMatch\`: "*.acceptance.spec.ts"
- **UI Tests:** Browser-based UI tests live in \`src/tests/ui\` and are run by a separate CI process, not by Studio selftests.
- **File Naming:** Acceptance tests for a task should live at \`src/tests/acceptance/<feature>.acceptance.spec.ts\`.
- **Test Naming:** Test and suite titles must include the task ID (e.g., 'DGF-406') to allow for targeted runs via \`--grep\`.

### 4.5 Test Logging & Run Documents
- Every run is stored in the \`qaRuns\` Firestore collection.
- Each document includes: \`id\`, \`taskId\`, \`status\`, \`summary\`, \`errorSummary\`, and timestamps.
- The \`/dadmin/developer/tests\` page reads this collection to display results. A successful run for DGF-406 would look like:
\`\`\`json
{
  "taskId": "Dgf-406",
  "status": "passed",
  "summary": { "total": 2, "passed": 2, "failed": 0, ... },
  "errorSummary": []
}
\`\`\`

### 4.6 Reusing the Template (Orderfly, etc.)
- For each new feature (e.g., OF-203), create a corresponding Node-only acceptance test.
- Tag tests with the new task ID.
- Use the app’s own server/API layer as the single source of truth.
- This creates a consistent mental model and makes migration to full CI easier.


## 5. Logging & Observability

All important API routes must log: request, response, path, actor, and timestamp. Logs are stored under \`/dadmin/developer/logs\` and must have an enable/disable toggle.

## 6. Firestore Usage

- Collections must be explicitly defined.
- Each collection must have a schema, allowed fields, and defined read/write rules.
- No ad-hoc collections.

## 7. CMS/API Contract Rules

- Every CMS save must be logged.
- API must validate shape.
- Frontend must consume the exact same structure.
- Any mismatch is a bug.

## 8. Versioning Rules

Every change increments the app version and, if relevant, the Playbook version. Footer example: \`Version: 1.3.89 • DGF-428\`

## 9. Studio Behaviour Rules

- **May not:** Touch unlisted files, introduce new dependencies, change Firestore structure, modify routes unexpectedly, or invent new APIs.
- **Must:** Follow instructions exactly, update acceptance tests, and update documentation.
`;
