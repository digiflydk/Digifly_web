
import type { Metadata } from 'next';
import { buildSeo } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
    return await buildSeo({
      title: 'Playwright & Acceptance Testing',
      description: 'Documentation for automated testing in Digifly Studio.',
    });
}

export default function PlaywrightDocsPage() {
  return (
    <main>
      <h1>Playwright & Acceptance Testing</h1>
      <section>
        <h2>Overview</h2>
        <ul>
          <li>Playwright is used to run automated tests against the Digifly platform.</li>
          <li>The existing QA setup, located in /qa, consists of browser-based tests for UI, SEO, and general smoke testing.</li>
          <li>A new Node-only acceptance testing layer, located in src/tests/acceptance, runs within the Studio environment.</li>
          <li>Acceptance tests validate server-side logic, data contracts, and API integrity.</li>
        </ul>
      </section>

      <section>
        <h2>Test types & principles</h2>
        <p>Digifly uses two different categories of Playwright tests:</p>
        <ul>
          <li>
            <p>Browser-based QA tests located in the /qa directory. These tests run in a real browser and cover UI behaviour, SEO checks, rendering, navigation flows, and smoke testing used in CI.</p>
          </li>
          <li>
            <p>Node-only acceptance tests located in src/tests/acceptance. These tests run inside the Studio environment without a browser and target server-side logic such as CMS read/write, Firestore data integrity, and API contracts.</p>
          </li>
        </ul>
        <p>Acceptance tests follow strict rules:</p>
        <ul>
          <li>No browser or UI interactions.</li>
          <li>No use of Playwright page or browser fixtures.</li>
          <li>Tests must call the Digifly CMS/API/server action layer directly.</li>
          <li>Tests must validate data shape, persistent writes, and correct API behaviour.</li>
          <li>Every acceptance test must reference a task ID (e.g. DGFPW-001).</li>
          <li>Each test run is logged in Firestore as a QA run.</li>
        </ul>
        <p>Acceptance tests do not validate:</p>
        <ul>
          <li>UI rendering or layout issues.</li>
          <li>Client-side JavaScript behaviour.</li>
          <li>Browser compatibility.</li>
          <li>Animations, transitions, or styles.</li>
        </ul>
      </section>

      <section>
        <h2>File structure</h2>
        <p>The project organizes test files into distinct directories based on their purpose.</p>
        <ul>
          <li>The root playwright.config.ts file configures all Playwright projects, including both browser-based QA and Node-only acceptance tests.</li>
          <li>The /qa directory contains the existing suite of browser-based tests for UI, SEO, and CI smoke checks.</li>
          <li>The /tests directory holds legacy or generic tests and coexists with the other testing layers.</li>
          <li>The new Node-only acceptance tests are located under src/tests/acceptance, organized by feature. This directory also contains a core subfolder for shared helpers and environment setup.</li>
        </ul>
        <p>This organized structure is designed to be portable and can be replicated in other projects like Orderfly.</p>
      </section>

      <section>
        <h2>Naming & task IDs</h2>
        <p>All acceptance tests must follow a consistent naming convention to ensure traceability and enable targeted test runs.</p>
        <ul>
            <li>Acceptance test files must be located in src/tests/acceptance and follow the feature.acceptance.spec.ts pattern. For example, homepage.acceptance.spec.ts or playwright-module.acceptance.spec.ts.</li>
            <li>Every test or suite of tests must be linked to a unique task ID, such as DGFPW-001 or DGF-480. This ID must appear in the test or suite title.</li>
            <li>Including the task ID in the title allows for targeted runs using filters, for example, running all tests for a specific task with --grep DGFPW-001.</li>
            <li>The same task ID is used consistently across the workflow: in the Studio task, the test titles, and the QA run documents in Firestore, creating a clear trace from task to test to result.</li>
        </ul>
        <p>This naming convention applies to all projects where the module is used, with only the task prefix changing (e.g. OF-203 for an Orderfly task).</p>
      </section>

      <section>
        <h2>QA workflow & roles</h2>
        <p>Digifly uses a four-role model to ensure quality and consistency:</p>
        <ul>
            <li>PM: Defines the task goal, but not the technical implementation, specs, or architecture.</li>
            <li>ChatGPT: Designs the full technical solution, creates the Studio-spec, assigns task IDs, and prepares prompts for Codex.</li>
            <li>Studio: Implements the task exactly as specified, modifying only the listed files without making independent architectural decisions.</li>
            <li>Codex: Reviews the implementation for quality, structure, and safety, returning a PASS or FAIL without writing code itself.</li>
        </ul>
        <p>The workflow is linear: PM → ChatGPT → Studio → Codex → Studio (fix) → Codex (final PASS).</p>
        <ul>
            <li>Acceptance tests are tied to DGFPW task IDs and run in a Node-only environment, as Studio cannot run browsers.</li>
            <li>They validate server-side logic like CMS read/write, API contracts, data models, and Firestore consistency.</li>
            <li>They do not validate UI, browser behavior, or client-side scripts.</li>
            <li>All test runs will be accessible in the /dadmin/developer/tests interface in a future update.</li>
        </ul>
        <p>This QA workflow is standard for Digifly and will be reused in other projects like Orderfly, where only the task ID prefix changes.</p>
      </section>

      <section>
        <h2>QA runs & Firestore schema</h2>
        <p>QA runs are stored in a Firestore collection named qaRuns. Each document represents a single run of one or more acceptance tests.</p>
        <ul>
            <li>runType: A string indicating the type of run, such as "acceptance" or "smoke".</li>
            <li>taskId: The ID of the task associated with the tests (e.g., DGFPW-001, DGF-406, OF-203).</li>
            <li>status: The status of the run, for example, "running", "passed", or "failed".</li>
            <li>summary: An object containing aggregated information about the run, such as the total number of tests, passed, and failed counts.</li>
            <li>errorSummary: An array or object with high-level information about any failures, like which test failed and a short error message.</li>
            <li>startedAt: A timestamp indicating when the QA run began.</li>
            <li>finishedAt: A timestamp indicating when the QA run completed.</li>
        </ul>
        <p>This qaRuns collection provides full traceability from a task ID to its automated tests and their last run result. The schema is designed to support a future interface at /dadmin/developer/tests for viewing and filtering test runs. Index details for Firestore will be documented in a later task.</p>
        <p>This schema is also designed for reusability across projects. When the Playwright module is used in other applications like Orderfly, the same collection structure can be adopted, with only the task ID prefixes changing.</p>
      </section>

      <section>
        <h2>Firestore indexes for QA runs</h2>
        <p>To enable efficient querying of QA runs, a Firestore composite index is required. Queries that filter on both runType and taskId while sorting by startedAt will be rejected by Firestore without this index.</p>
        <ul>
          <li>Collection: qaRuns</li>
          <li>Fields to index:</li>
          <li>1. runType (Ascending)</li>
          <li>2. taskId (Ascending)</li>
          <li>3. startedAt (Descending)</li>
        </ul>
        <p>This index allows the future /dadmin/developer/tests page to quickly filter runs by type or by a specific task ID, sorted by the most recent runs first.</p>
        <p>The same index structure should be applied in any project reusing this module, such as Orderfly. Additional indexes may be needed if new filtering or sorting patterns are introduced.</p>
      </section>
      
      <section>
        <h2>How to write an acceptance test</h2>
        <p>This section outlines the process for creating a new Node-only acceptance test. These tests are critical for validating server-side logic without requiring a browser environment, making them ideal for the Studio workflow.</p>
        <ul>
          <li>Tests must run in a Node-only environment.</li>
          <li>They must validate CMS read/write operations via the server actions layer.</li>
          <li>They check API return shapes and data integrity in Firestore.</li>
          <li>Tests must clean up after themselves, ensuring data is restored to its original state.</li>
          <li>Acceptance tests do not test UI or browser behaviour. They do not use a real browser, page interactions, clicks, navigation, or DOM validation.</li>
        </ul>
        <p>The file for a new acceptance test should be placed in src/tests/acceptance and named according to the feature it covers, for example, homepage.acceptance.spec.ts.</p>
        <p>The steps to create a new test are:</p>
        <ul>
          <li>1. Identify the Studio task ID (e.g., DGFPW-001-10).</li>
          <li>2. Create a new file in src/tests/acceptance/ named after the feature.</li>
          <li>3. Add a test suite title that includes the task ID.</li>
          <li>4. Add at least one test title that includes the task ID.</li>
          <li>5. Use the CMS API layer (e.g., functions from src/lib/cms-api.ts) to read and write data.</li>
          <li>6. Validate the data shape, persistence, and correctness.</li>
          <li>7. Restore any modified data to its original state, typically in a finally block to ensure cleanup even if a test fails.</li>
          <li>8. Confirm that the test can be filtered using --grep with its task ID.</li>
        </ul>
        <p>A typical test follows a simple template: the suite title includes the task ID, and the test flow involves reading existing data, modifying a field with a unique value, saving it, reading it again to assert the change, and finally, restoring the original data.</p>
        <p>Conceptually, each test run will create a qaRuns document in Firestore, linking the Studio task to the test execution via the shared task ID. This provides a clear, traceable audit trail from task to implementation to validation. The logging mechanism for this will be implemented in a future task.</p>
        <p>This testing methodology is designed for reusability. It can be ported to other projects like Orderfly, where only the API paths and task ID prefixes would need to be adjusted.</p>
      </section>
      
      <section>
        <h2>Role in the QA flow</h2>
        <p>PM → ChatGPT → Studio → Codex, with acceptance tests tied to DGFPW task IDs and logged as QA runs in Firestore.</p>
      </section>

      <section>
        <h2>Planned content</h2>
        <p>This page will be expanded to cover:</p>
        <ul>
          <li>Playwright acceptance test file/project structure.</li>
          <li>Naming conventions for test files and task identifiers.</li>
          <li>Firestore schema for qaRuns and required indexes.</li>
          <li>How to write a new acceptance test for a task.</li>
          <li>Guidance on reusing the Playwright module (e.g., Orderfly).</li>
        </ul>
      </section>
    </main>
  );
}
