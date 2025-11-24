
import type { Metadata } from 'next';
import { buildSeo } from "@/lib/seo";
import { getDb } from '@/lib/firebase-admin';
import Link from 'next/link';

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

type SearchParams = {
  taskId?: string;
  status?: string;
};

async function getQaRuns(searchParams: SearchParams = {}): Promise<QaRun[]> {
    const db = await getDb();
    if (!db) {
        throw new Error("Firestore database is not available.");
    }

    let query: FirebaseFirestore.Query = db.collection('qaRuns');

    if (searchParams.taskId) {
        query = query.where('taskId', '==', searchParams.taskId);
    }
    if (searchParams.status) {
        query = query.where('status', '==', searchParams.status);
    }
    
    const snapshot = await query.orderBy('startedAt', 'desc').limit(20).get();

    if (snapshot.empty) {
        return [];
    }

    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            taskId: data.taskId,
            runType: data.runType,
            status: data.status,
            startedAt: String(data.startedAt ?? ''),
            finishedAt: String(data.finishedAt ?? ''),
            summary: data.summary,
        } as QaRun;
    });
}

export default async function QaTestsPage({ searchParams }: { searchParams?: SearchParams }) {
    let runs: QaRun[] = [];
    let error: string | null = null;
    const taskId = searchParams?.taskId || 'All';
    const status = searchParams?.status || 'All';

    try {
        runs = await getQaRuns(searchParams);
    } catch (e: any) {
        error = e.message || "An unknown error occurred while fetching QA runs.";
        console.error(error);
    }

  return (
    <main>
      <section>
        <h1>QA tests & runs</h1>
        <p>This UI shows QA runs from the 'qaRuns' Firestore collection, which are created by the Playwright acceptance test suite.</p>
      </section>

      <section>
        <h2>Current filters</h2>
        <p>Task ID: {taskId}</p>
        <p>Status: {status}</p>
      </section>

      {error ? (
        <section>
            <h2>Error</h2>
            <p>Unable to load QA runs right now.</p>
        </section>
      ) : runs.length === 0 ? (
        <section>
            <h2>Latest QA runs</h2>
            <p>No matching QA runs found. Run the acceptance suite to create more runs or adjust your filters.</p>
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
                <th>Details</th>
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
                        <td>
                           <Link href={`/dadmin/developer/qw/tests/${run.id}`}>View</Link>
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
