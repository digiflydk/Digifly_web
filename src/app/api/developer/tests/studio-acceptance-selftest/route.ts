
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

    const tag =
      body && typeof body.tag === 'string' && body.tag.trim().length > 0
        ? body.tag.trim()
        : null;

    // Run a single Studio acceptance run (existing logic encapsulated in the helper).
    // Do not await this, as it runs in the background.
    // The runner uses the tag to find the corresponding taskId from the suite registry
    runStudioAcceptanceOnce({ taskId: tag, triggerSource: 'studioSelftest' });

    return NextResponse.json(
      {
        ok: true,
        message: 'Studio acceptance selftest triggered.',
        tag: tag,
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
