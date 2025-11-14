
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';
import { getCurrentUser } from '@/lib/auth/serverAuth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// This is a simplified endpoint to create a "pending" run.
// In a real scenario, this would trigger a CI job.
export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getDb();
    const runRef = await db.collection('qaRuns').add({
      status: 'queued',
      runType: 'predeploy',
      taskId: 'PREDEPLOY_SMOKE',
      requestedBy: user.uid,
      startedAt: new Date(),
      environment: 'test',
      triggeredBy: 'manual',
    });

    return NextResponse.json({ ok: true, runId: runRef.id });

  } catch (err: any) {
    console.error('[API /dev/tests/run] Error:', err);
    return NextResponse.json({ ok: false, error: err?.message ?? 'An unknown error occurred.' }, { status: 500 });
  }
}
