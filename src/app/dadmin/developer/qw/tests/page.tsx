
import type { Metadata } from 'next';
import { buildSeo } from "@/lib/seo";
import { getDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
    return await buildSeo({
      title: 'QA Tests & Runs',
      description: 'Overview of automated quality assurance test runs.',
    });
}

type QaRun = {
  id: string;
  taskId: string;
  runType: string;
  status: string;
  startedAt: string;
  finishedAt: string;
  summary?: {
    total: number;
    passed: number;
    failed: number;
  };
};

async function getQaRuns(): Promise<QaRun[]> {
    const db = await getDb();
    if (!db) {
        throw new Error("Firestore database is not available.");
    }

    const snapshot = await db.collection('qaRuns')
                             .orderBy('startedAt', 'desc')
                             .limit(20)
                             .get();

    if (snapshot.empty) {
        return [];
    }

    return snapshot.docs.map(doc => {
        const data = doc.data();
        // Ensure timestamps are strings for rendering
        return {
            id: doc.id,
            taskId: data.taskId,
            runType: data.runType,
            status: data.status,
            startedAt: new Date(data.startedAt).toISOString(),
            finishedAt: new Date(data.finishedAt).toISOString(),
            summary: data.summary,
        } as QaRun;
    });
}

export default async function QaTestsPage() {
    let runs: QaRun[] = [];
    let error: string | null = null;

    try {
        runs = await getQaRuns();
    } catch (e: any) {
        error = e.message || "An unknown error occurred while fetching QA runs.";
        console.error(error);
    }

  return (
    <main>
      <section>
        <h1>QA tests & runs</h1>
        <p>This UI shows the latest QA runs recorded in the 'qaRuns' Firestore collection. Runs are created automatically by the Playwright acceptance test suite.</p>
      </section>

      {error ? (
        <section>
            <h2>Error</h2>
            <p>Unable to load QA runs right now.</p>
        </section>
      ) : runs.length === 0 ? (
        <section>
            <h2>Latest QA runs</h2>
            <p>No QA runs have been recorded yet. Run the acceptance suite to create QA runs.</p>
        </section>
      ) : (
        <section>
            <h2>Latest QA runs</h2>
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
                {runs.map(run => (
                    <tr key={run.id}>
                        <td>{run.taskId}</td>
                        <td>{run.runType}</td>
                        <td>{run.status}</td>
                        <td>{run.startedAt}</td>
                        <td>{run.finishedAt}</td>
                        <td>
                            {run.summary 
                                ? `${run.summary.passed} passed / ${run.summary.failed} failed`
                                : 'N/A'
                            }
                        </td>
                    </tr>
                ))}
            </tbody>
            </table>
            <p>These rows are read from the 'qaRuns' collection in Firestore. New runs are created by the Playwright acceptance tests.</p>
        </section>
      )}
    </main>
  );
}
