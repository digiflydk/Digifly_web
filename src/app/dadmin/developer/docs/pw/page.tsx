
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
      <p>Digifly uses Playwright for automated testing. There are two layers: an existing browser-based QA setup in /qa, and a new Node-only acceptance test layer that we are introducing.</p>
      
      <section>
        <h2>Overview</h2>
        <ul>
          <li>Playwright is used to run automated tests against the Digifly platform.</li>
          <li>Existing QA setup lives in /qa (UI, SEO, smoke, etc.).</li>
          <li>The engineering playbook defines a Node-only acceptance testing layer powered by Playwright that runs in the Studio environment and does not use a real browser.</li>
          <li>Acceptance tests validate server side logic and data integrity, not the UI.</li>
        </ul>
      </section>

      <section>
        <h2>Testing layers</h2>
        <p>Digifly uses two different categories of Playwright tests:</p>
        <ul>
          <li>
            <p>Browser-based QA tests located in the /qa directory. These tests run in a real browser and cover UI behaviour, SEO checks, rendering, navigation flows, and smoke testing used in CI.</p>
          </li>
          <li>
            <p>Node-only acceptance tests located in src/tests/acceptance. These tests run inside the Studio environment without a browser and target server-side logic such as CMS read/write, Firestore data integrity, and API contracts.</p>
          </li>
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
          <li>The root `playwright.config.ts` file configures all Playwright projects, including both browser-based QA and Node-only acceptance tests.</li>
          <li>The `/qa` directory contains the existing suite of browser-based tests for UI, SEO, and CI smoke checks.</li>
          <li>The `/tests` directory holds legacy or generic tests and coexists with the other testing layers.</li>
          <li>The new Node-only acceptance tests are located under `src/tests/acceptance`, organized by feature (e.g., `cases.acceptance.spec.ts`). This directory also contains a `core` subfolder for shared helpers and environment setup.</li>
        </ul>
        <p>This organized structure is designed to be portable and can be replicated in other projects like Orderfly.</p>
      </section>
      
      <section>
        <h2>Naming & task IDs</h2>
        <p>All acceptance tests must follow a consistent naming convention to ensure traceability and enable targeted test runs.</p>
        <ul>
          <li>Acceptance test files must be located in `src/tests/acceptance` and follow the `&lt;feature&gt;.acceptance.spec.ts` pattern. For example, `homepage.acceptance.spec.ts` or `playwright-module.acceptance.spec.ts`.</li>
          <li>Every test or suite of tests must be linked to a unique task ID, such as `DGFPW-001` or `DGF-480`. This ID must appear in the test or suite title.</li>
          <li>Including the task ID in the title allows for targeted runs using filters, for example, running all tests for a specific task with `--grep "DGFPW-001"`.</li>
          <li>The same task ID is used consistently across the workflow: in the Studio task, the test titles, and the QA run documents in Firestore, creating a clear trace from task to test to result.</li>
        </ul>
        <p>This naming convention applies to all projects where the module is used, with only the task prefix changing (e.g. `OF-203` for an Orderfly task).</p>
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
          <li>All test runs will be accessible in the `/dadmin/developer/tests` interface in a future update.</li>
        </ul>
        <p>This QA workflow is standard for Digifly and will be reused in other projects like Orderfly, where only the task ID prefix changes.</p>
      </section>

      <section>
        <h2>QA runs & Firestore schema</h2>
        <p>QA runs are stored in a Firestore collection named `qaRuns`. Each document represents a single run of one or more acceptance tests.</p>
        <ul>
            <li>runType: A string indicating the type of run, such as "acceptance" or "smoke".</li>
            <li>taskId: The ID of the task associated with the tests (e.g., DGFPW-001, DGF-406, OF-203).</li>
            <li>status: The status of the run, for example, "running", "passed", or "failed".</li>
            <li>summary: An object containing aggregated information about the run, such as the total number of tests, passed, and failed counts.</li>
            <li>errorSummary: An array or object with high-level information about any failures, like which test failed and a short error message.</li>
            <li>startedAt: A timestamp indicating when the QA run began.</li>
            <li>finishedAt: A timestamp indicating when the QA run completed.</li>
        </ul>
        <p>This `qaRuns` collection provides full traceability from a task ID to its automated tests and their results. The schema is designed to support a future interface at /dadmin/developer/tests for viewing and filtering test runs. Index details for Firestore will be documented in a later task.</p>
        <p>This schema is also designed for reusability across projects. When the Playwright module is used in other applications like Orderfly, the same collection structure can be adopted, with only the task ID prefixes changing.</p>
      </section>

      <section>
        <h2>Firestore indexes for QA runs</h2>
        <p>To enable efficient querying of QA runs, a Firestore composite index is required. Without it, queries that filter by one field and order by another will fail.</p>
        <ul>
          <li>Collection: `qaRuns`</li>
          <li>Fields to index:</li>
          <li>1. `runType` (Ascending)</li>
          <li>2. `taskId` (Ascending)</li>
          <li>3. `startedAt` (Descending)</li>
        </ul>
        <p>This index allows the future `/dadmin/developer/tests` page to quickly filter runs by type (e.g., "acceptance") or by a specific task ID, sorted by the most recent runs first. The same index structure should be applied in any project reusing this module, such as Orderfly.</p>
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
