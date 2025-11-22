
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
      <p>Digifly uses Playwright for automated testing. There are two layers: an existing browser-based QA setup in /qa, and a new Node-only acceptance test layer for server-side validation.</p>
      
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
            <li>Acceptance test files must be located in `src/tests/acceptance` and follow the `<feature>.acceptance.spec.ts` pattern. For example, `homepage.acceptance.spec.ts` or `playwright-module.acceptance.spec.ts`.</li>
            <li>Every test or suite of tests must be linked to a unique task ID, such as `DGFPW-001` or `DGF-480`. This ID must appear in the test or suite title.</li>
            <li>Including the task ID allows for targeted runs using filters, for example, running all tests for a specific task with `--grep "DGFPW-001"`.</li>
            <li>The same task ID is used consistently across the workflow: in the Studio task, the test titles, and the QA run documents in Firestore, creating a clear trace from task to test to result.</li>
            <li>This naming convention applies to all projects where the module is used, with only the task prefix changing (e.g., `OF-203` for an Orderfly task).</li>
        </ul>
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
