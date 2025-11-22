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
        <ul>
          <li>Existing browser QA in /qa (UI, SEO, smoke tests in CI/CD).</li>
          <li>New Node-only acceptance layer in src/tests/acceptance (server-side CMS/API coverage in Studio).</li>
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
