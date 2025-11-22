
import type { Metadata } from 'next';
import { buildSeo } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
    return await buildSeo({
      title: 'QA Tests & Runs',
      description: 'Overview of automated quality assurance test runs.',
    });
}

export default function QaTestsPage() {
  return (
    <main>
      <section>
        <h1>QA tests & runs</h1>
        <p>This page provides the UI for viewing QA runs, including acceptance tests and smoke tests. The data below is currently static placeholder content.</p>
      </section>

      <section>
        <h2>What you see here</h2>
        <ul>
          <li>This is a prototype UI to illustrate the future test reporting interface.</li>
          <li>In a later version, this page will read live data from the `qaRuns` collection in Firestore.</li>
          <li>It will support filtering by run type (e.g., `acceptance`) and `taskId`.</li>
          <li>This UI is conceptually linked to the documentation under `/dadmin/developer/docs/qw/tests` and `/dadmin/developer/docs/pw`.</li>
        </ul>
      </section>

      <section>
        <h2>Latest QA runs (placeholder data)</h2>
        <table>
          <thead>
            <tr>
              <th>Task ID</th>
              <th>Run type</th>
              <th>Status</th>
              <th>Started at</th>
              <th>Finished at</th>
              <th>Summary</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>DGFPW-001</td>
              <td>acceptance</td>
              <td>passed</td>
              <td>2025-11-22T10:15:00Z</td>
              <td>2025-11-22T10:15:05Z</td>
              <td>4 passed / 0 failed</td>
            </tr>
            <tr>
              <td>DGF-480</td>
              <td>acceptance</td>
              <td>failed</td>
              <td>2025-11-22T09:30:00Z</td>
              <td>2025-11-22T09:30:12Z</td>
              <td>1 passed / 1 failed</td>
            </tr>
            <tr>
              <td>DGF-406</td>
              <td>acceptance</td>
              <td>passed</td>
              <td>2025-11-21T18:00:00Z</td>
              <td>2025-11-21T18:00:03Z</td>_
              <td>1 passed / 0 failed</td>
            </tr>
             <tr>
              <td>SMOKE-CI</td>
              <td>smoke</td>
              <td>passed</td>
              <td>2025-11-21T17:55:00Z</td>
              <td>2025-11-21T17:56:10Z</td>
              <td>12 passed / 0 failed</td>
            </tr>
          </tbody>
        </table>
        <p>In the future, clicking a row will open a detailed view showing logs and error summaries based on the `errorSummary` field from the `qaRuns` documents in Firestore. For now, this table is a static illustration of the layout.</p>
      </section>
    </main>
  );
}
