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
    <main className="prose prose-lg max-w-none">
      <h1>Playwright &amp; Acceptance Testing</h1>
      <p>
        Digifly uses Playwright for automated end-to-end and acceptance testing. The testing framework is divided into two distinct layers: an existing browser-based QA suite for UI and regression testing, and a new Node.js-only acceptance testing layer designed to run in the Studio environment to validate server-side logic and data integrity without a browser.
      </p>

      <section>
        <h2>Overview</h2>
        <ul>
          <li>Playwright is used to run automated tests against the Digifly platform.</li>
          <li>The existing QA setup, located in <strong>/qa</strong>, consists of browser-based tests for UI, SEO, and general smoke testing. These are primarily used for continuous integration and manual quality assurance checks.</li>
          <li>A new Node-only acceptance testing layer, located in <strong>src/tests/acceptance</strong>, is being introduced to run within the Studio environment, focusing on server-side logic without a browser dependency.</li>
          <li>Acceptance tests are designed to validate server-side logic, data contracts, and API integrity, ensuring core functionality remains stable.</li>
        </ul>
      </section>

      <section>
        <h2>Testing layers in Digifly</h2>
        <h3>a) Existing QA layer (browser-based)</h3>
        <p>
          The project includes a QA folder at <strong>/qa</strong> containing a suite of browser-based Playwright tests. These tests are responsible for verifying the user interface, checking SEO-related metadata, and performing smoke tests to ensure basic application functionality in a real browser environment. They are a critical part of our CI/CD pipeline and pre-deployment checks.
        </p>

        <h3>b) New acceptance layer (Node-only)</h3>
        <p>
          We are introducing a Node-only acceptance test layer that will live in <strong>src/tests/acceptance</strong>. These tests are executed in the Studio environment without a browser, allowing them to focus exclusively on server-side concerns. This layer is designed to test CMS functionality, API endpoints, server actions, and data contracts to ensure the backend is behaving as expected.
        </p>
      </section>

      <section>
        <h2>Role in the QA flow</h2>
        <p>
          Playwright tests are an integral part of the development lifecycle, which follows a structured flow from planning to deployment. The PM defines a task, which is then designed by AI and implemented by Studio. After implementation, Codex reviews the code. Acceptance tests, tied to a specific task ID (e.g., DGFPW-xxx), are written to verify the implementation. Each test run is recorded as a QA run in Firestore, providing a clear audit trail of quality assurance activities.
        </p>
      </section>

      <section>
        <h2>Planned content</h2>
        <p>This documentation page will be expanded in future tasks to include more detailed information, such as:</p>
        <ul>
          <li>The file and project structure for Playwright acceptance tests.</li>
          <li>Naming conventions for test files and task identifiers.</li>
          <li>The detailed Firestore schema for `qaRuns` and any required indexes.</li>
          <li>A step-by-step guide on how to write a new acceptance test for a given task.</li>
          <li>Guidance on how to reuse the Playwright module in other projects, such as Orderfly.</li>
        </ul>
      </section>
    </main>
  );
}
