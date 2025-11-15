
import { NextRequest, NextResponse } from 'next/server';
import { runStudioAcceptanceOnce } from '@/lib/dadmin/test-runner';

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ ok: false, error: 'This endpoint is not available in production.' }, { status: 403 });
  }

  try {
    const body = req.headers.get('content-type')?.includes('application/json')
      ? await req.json().catch(() => null)
      : null;

    const taskId =
      body && typeof body.taskId === 'string' && body.taskId.trim().length > 0
        ? body.taskId.trim()
        : null;

    // The runner is async but we don't await it here, we let it run in the background.
    // The client will see the result via the real-time Firestore listener.
    runStudioAcceptanceOnce({ taskId, triggerSource: 'studioSelftest' }).catch(e => {
        // Log the error but don't cause the API to fail, as the runner handles its own error state.
        console.error(`[studio-acceptance-selftest] Background run failed: ${e.message}`);
    });

    return NextResponse.json(
      {
        ok: true,
        message: 'Studio acceptance selftest queued.',
        taskId: taskId ?? null,
      },
      { status: 202 }, // 202 Accepted
    );
  } catch (error: any) {
    console.error('studio-acceptance-selftest error', error);

    return NextResponse.json(
      {
        ok: false,
        message: 'Failed to trigger Studio acceptance selftest.',
        error: error?.message ?? 'Unknown error',
      },
      { status: 500 },
    );
  }
}
