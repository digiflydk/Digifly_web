
export default function QaDocsPage() {
  return (
    <main>
      <h1>QA module &amp; tests overview</h1>
      <p>
        This page provides a central overview of the QA module, including acceptance tests,
        the Firestore data structures used for logging test runs, and links to related
        documentation. It serves as the entry point for understanding how automated quality
        assurance is handled in the Digifly platform, connecting closely with the Playwright
        documentation.
      </p>

      <section>
        <h2>Docs under /qw/</h2>
        <p>
          All documentation related to the quality assurance (QA) module and test reporting is
          organized under the `/dadmin/developer/docs/qw/` path. This page serves as the main
          entry point for this documentation.
        </p>
        <ul>
          <li>Overview of the QA module and its components.</li>
          <li>Detailed Firestore structure for storing test run data.</li>
          <li>A reference to the Playwright acceptance testing documentation, which is available under `/dadmin/developer/docs/pw`.</li>
        </ul>
      </section>

      <section>
        <h2>QA tests UI under /qw/</h2>
        <p>
          A user interface for viewing QA test results is planned for a future release. This
          interface will allow developers to see which tests exist, review the history of
          acceptance test runs, and inspect pass/fail statuses directly within the admin panel.
          This page will serve as the official documentation for that upcoming UI.
        </p>
        <p>
          When the QA tests UI is implemented, it will be available under /dadmin/developer/qw/tests.
        </p>
      </section>

      <section>
        <h2>Database structure &amp; Firestore paths</h2>
        <p>
          All QA-related data is stored in Firestore to provide a persistent, auditable record
          of test executions. The primary collection for this is `qaRuns`.
        </p>
        <ul>
          <li>
            The `qaRuns` collection, located at the path `qaRuns/{qaRunId}`, stores a document for each individual QA test run (e.g., an acceptance test suite execution).
          </li>
          <li>
            Each document contains the following fields: `runType` (e.g., 'acceptance'), `taskId` (e.g., 'DGFPW-001'), `status` ('passed' or 'failed'), a `summary` object with total, passed, and failed counts, an `errorSummary` for quick debugging, and `startedAt` and `finishedAt` timestamps.
          </li>
          <li>
            Future collections, such as `qaRunDetails`, may be introduced to store more verbose logs or detailed error information if necessary. Any such additions will be documented here.
          </li>
        </ul>
        <p>
          This Firestore structure is designed to be reusable across both the Digifly and Orderfly projects, ensuring a consistent QA data model. All queries against this data will be based on the `runType`, `taskId`, and `startedAt` fields, as documented on the Playwright documentation page.
        </p>
      </section>

      <section>
        <h2>Relation to Playwright acceptance tests</h2>
        <p>
          The implementation details for Playwright acceptance tests are documented under `/dadmin/developer/docs/pw`. The QA module documentation under this `/qw/` path focuses on the higher-level overview, data structures, and the user interface for displaying test results.
        </p>
        <p>
          The `qaRuns` collection in Firestore serves as the critical link between the tests executed by Playwright and the UI that will display the results, connecting everything via the shared `taskId`.
        </p>
      </section>
    </main>
  );
}
