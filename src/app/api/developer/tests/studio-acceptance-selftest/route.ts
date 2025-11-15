
import { NextRequest, NextResponse } from 'next/server';
import { runStudioAcceptanceOnce } from '@/lib/dadmin/test-runner';

// IMPORTANT:
// - No "use server" directive.
// - No other exports (no runtime, no dynamic, no types).

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

    // Run a single Studio acceptance run (existing logic encapsulated in the helper).
    // This function runs in the background, we don't await it.
    runStudioAcceptanceOnce({ taskId, triggerSource: 'studioSelftest' });

    return NextResponse.json(
      {
        ok: true,
        message: 'Studio acceptance selftest triggered.',
        taskId: taskId,
      },
      { status: 202 } // 202 Accepted, as the process is running in the background.
    );
  } catch (error: any) {
    console.error('studio-acceptance-selftest error', error);

    return NextResponse.json(
      {
        ok: false,
        message: 'Failed to trigger Studio acceptance selftest.',
        error: error?.message ?? 'Unknown error',
      },
      { status: 500 }
    );
  }
}
