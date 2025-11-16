
import { NextRequest, NextResponse } from 'next/server';
import { runStudioAcceptanceOnce } from '@/lib/dadmin/test-runner';
import type { AcceptanceSuiteId } from '@/lib/dadmin/tests/acceptance-suites';

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ ok: false, error: 'This endpoint is not available in production.' }, { status: 403 });
  }

  try {
    const body = req.headers.get('content-type')?.includes('application/json')
      ? await req.json().catch(() => null)
      : null;

    const suiteId =
      body && typeof body.suiteId === 'string' && body.suiteId.trim().length > 0
        ? (body.suiteId.trim() as AcceptanceSuiteId)
        : null;

    // Run a single Studio acceptance run.
    // Do not await this, as it runs in the background.
    runStudioAcceptanceOnce({ suiteId, triggerSource: 'studioSelftest' });

    return NextResponse.json(
      {
        ok: true,
        message: 'Studio acceptance selftest triggered.',
        suiteId: suiteId,
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
