
import { NextRequest, NextResponse } from 'next/server';
import { runStudioAcceptanceOnce } from '@/lib/dadmin/test-runner';

// IMPORTANT:
// - No "use server" directive.
// - No other exports (no runtime, no dynamic, no types).

export async function POST(req: NextRequest) {
  try {
    // Optional: if the client sends a body, parse it,
    // but current logic can stay simple.
    const body = req.headers.get('content-type')?.includes('application/json')
      ? await req.json().catch(() => null)
      : null;

    const taskId =
      body && typeof body.taskId === 'string' ? body.taskId : 'DGF-405';

    // Run a single Studio acceptance run (existing logic encapsulated in the helper).
    const { runId } = await runStudioAcceptanceOnce({ taskId, triggerSource: 'studioSelftest' });

    return NextResponse.json(
      {
        ok: true,
        message: 'Studio acceptance selftest triggered.',
        runId,
        taskId: taskId ?? null,
      },
      { status: 200 },
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
