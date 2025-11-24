
import { getDb } from '@/lib/firebase-admin';
import type { Metadata } from 'next';
import { buildSeo } from "@/lib/seo";

export const dynamic = 'force-dynamic';

type PageProps = { params: { qaRunId: string } };

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
  errorSummary?: unknown[];
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    return await buildSeo({
      title: `QA Run: ${params.qaRunId}`,
      description: `Details for QA run ${params.qaRunId}.`,
    });
}

async function getQaRun(id: string): Promise<QaRun | null> {
    const db = await getDb();
    if (!db) {
        throw new Error("Firestore database is not available.");
    }
    const docRef = db.collection('qaRuns').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
        return null;
    }
    
    const data = docSnap.data();
    return {
        id: docSnap.id,
        taskId: data?.taskId || 'N/A',
        runType: data?.runType || 'N/A',
        status: data?.status || 'N/A',
        startedAt: String(data?.startedAt ?? ''),
        finishedAt: String(data?.finishedAt ?? ''),
        summary: data?.summary,
        errorSummary: data?.errorSummary,
    };
}

export default async function QaRunDetailPage({ params }: PageProps) {
    let run: QaRun | null = null;
    let error: string | null = null;

    try {
        run = await getQaRun(params.qaRunId);
    } catch (e: any) {
        error = e.message || "An unknown error occurred.";
    }

    if (error) {
        return (
            <main>
                <section>
                    <h1>Error loading QA run</h1>
                    <p>Unable to load QA run right now.</p>
                </section>
            </main>
        );
    }
    
    if (!run) {
        return (
            <main>
                <section>
                    <h1>QA run not found</h1>
                    <p>No QA run was found for the requested ID.</p>
                </section>
            </main>
        );
    }

    return (
        <main>
            <section>
                <h1>QA run details</h1>
                <p>This page shows detailed information for a single QA run stored in the qaRuns collection.</p>
            </section>
            
            <section>
                <h2>Metadata</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Field</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>Task ID</td><td>{run.taskId}</td></tr>
                        <tr><td>Run type</td><td>{run.runType}</td></tr>
                        <tr><td>Status</td><td>{run.status}</td></tr>
                        <tr><td>Started at</td><td>{run.startedAt}</td></tr>
                        <tr><td>Finished at</td><td>{run.finishedAt}</td></tr>
                    </tbody>
                </table>
            </section>
            
            <section>
                <h2>Summary</h2>
                {run.summary ? (
                    <table>
                        <thead>
                            <tr><th>Metric</th><th>Value</th></tr>
                        </thead>
                        <tbody>
                            <tr><td>Total</td><td>{run.summary.total}</td></tr>
                            <tr><td>Passed</td><td>{run.summary.passed}</td></tr>
                            <tr><td>Failed</td><td>{run.summary.failed}</td></tr>
                        </tbody>
                    </table>
                ) : (
                    <p>No summary information is available for this run.</p>
                )}
            </section>

            <section>
                <h2>Error summary</h2>
                {run.errorSummary && run.errorSummary.length > 0 ? (
                    <table>
                        <thead>
                            <tr><th>Details</th></tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    {JSON.stringify(run.errorSummary, null, 2)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                ) : (
                    <p>No errors were recorded for this run.</p>
                )}
            </section>

            <section>
                <p>This data comes from qaRuns/{run.id}. QA runs are created by the Playwright acceptance tests.</p>
            </section>
        </main>
    );
}
