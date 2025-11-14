
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';
import { logAdminAction } from '@/lib/dadmin/audit';
import { FieldValue } from 'firebase-admin/firestore';
import type { QARun } from '@/lib/qa/qa.types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ ok: false, error: 'This endpoint is not available in production.' }, { status: 403 });
  }

  const startedAt = new Date();
  let runId = 'unknown';

  try {
    const db = await getDb();
    
    const runData: Omit<QARun, 'id'> = {
      taskId: "DGF-390",
      runType: "acceptance",
      environment: "test",
      triggeredBy: "manual",
      status: "running",
      startedAt: FieldValue.serverTimestamp() as any, // Let Firestore set the time
      requestedBy: 'debug_user',
    };

    const runRef = await db.collection('qaRuns').add(runData);
    runId = runRef.id;

    await logAdminAction({
        action: 'playwright.run', // Reusing for consistency
        status: 'ok',
        path: `qaRuns/${runId}`,
        payloadSummary: 'Triggered debug acceptance run'
    });

    // Simulate work
    await new Promise(res => setTimeout(res, 300));
    
    const finishedAt = new Date();
    await runRef.update({
        status: "passed",
        finishedAt: FieldValue.serverTimestamp(),
        durationMs: finishedAt.getTime() - startedAt.getTime(),
        summary: { total: 1, passed: 1, failed: 0, skipped: 0, flaky: 0 },
    });

    return NextResponse.json({ ok: true, runId });

  } catch (err: any) {
    console.error(`[debug-acceptance] Failed to create run ${runId}`, err);
    await logAdminAction({
      action: 'playwright.run',
      status: 'error',
      path: runId !== 'unknown' ? `qaRuns/${runId}` : undefined,
      errorMessage: err.message,
    });
    return NextResponse.json({ ok: false, error: 'Failed to create debug run.' }, { status: 500 });
  }
}
