
export default function QaRootDocsPage() {
  return (
    <main>
      <section>
        <h1>QA module documentation</h1>
        <p>
          This page is the main entry point for all documentation related to the quality assurance (QA) module. It provides an overview of the QA concept, the Firestore database structure for logging test runs, the planned API layer, and how it connects to the test documentation and the future QA user interface.
        </p>
      </section>

      <section>
        <h2>QA docs under /qw</h2>
        <p>
          All QA-related documentation is organized under the `/dadmin/developer/docs/qw/` path. This page serves as the high-level overview.
        </p>
        <ul>
          <li>Entry point: `/dadmin/developer/docs/qw` (this page) provides an overview of the QA database and API map.</li>
          <li>Tests documentation: `/dadmin/developer/docs/qw/tests` contains details about test runs and the future QA UI.</li>
          <li>Playwright acceptance docs: `/dadmin/developer/docs/pw` covers the technical implementation of the test layer.</li>
          <li>QA UI: `/dadmin/developer/qw/tests` will host the user interface for viewing test runs once it is fully implemented.</li>
        </ul>
      </section>

      <section>
        <h2>QA database map</h2>
        <p>
          All QA data is stored in Firestore to ensure a persistent and auditable record of test executions. The central collection is `qaRuns`.
        </p>
        <ul>
            <li>Collection: `qaRuns`</li>
            <li>Path: `qaRuns/{qaRunId}`</li>
            <li>Each document in this collection represents a single QA test run, such as an acceptance or smoke test suite.</li>
            <li>This structure is designed for reusability across both Digifly and Orderfly projects, maintaining a consistent data model.</li>
            <li>Core fields include:</li>
            <ul>
                <li>`runType`: The type of run (e.g., "acceptance").</li>
                <li>`taskId`: The associated task ID (e.g., "DGFPW-001", "DGF-123", "OF-203").</li>
                <li>`status`: The final status of the run ("passed" or "failed").</li>
                <li>`summary`: An object containing total, passed, and failed test counts.</li>
                <li>`errorSummary`: A brief overview of any failures for quick debugging.</li>
                <li>`startedAt`: A timestamp for when the run began.</li>
                <li>`finishedAt`: A timestamp for when the run completed.</li>
            </ul>
            <li>Future collections, such as `qaRuns/{qaRunId}/details`, may be added to store more verbose logs. Any such changes will be documented here.</li>
            <li>Standard queries will filter by `runType` and `taskId` and sort by `startedAt`. The required Firestore indexes are documented on the Playwright documentation page.</li>
        </ul>
      </section>

      <section>
        <h2>QA API map (planned)</h2>
        <p>
          There are currently no QA API endpoints implemented. This section outlines the plan for the future API, not existing functionality.
        </p>
        <ul>
          <li>
            A `POST` endpoint under an admin namespace will be created to trigger an acceptance run for a specific `taskId` and create a corresponding `qaRuns` document.
          </li>
          <li>
            A `GET` endpoint will be implemented to list QA runs, with support for filtering by `taskId` and `runType`. This will read from the `qaRuns` collection.
          </li>
          <li>
            Another `GET` endpoint will be available to fetch the details of a single QA run using its `qaRunId`, eventually returning the `errorSummary` or detailed logs.
          </li>
        </ul>
        <p>
          This API map will be updated with concrete routes and request/response signatures as they are built. This page will serve as the single source of truth for the QA database and API structure.
        </p>
      </section>
    </main>
  );
}
