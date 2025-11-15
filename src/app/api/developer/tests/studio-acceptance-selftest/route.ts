
import { NextResponse, NextRequest } from 'next/server';
import { logAdminAction } from '@/lib/dadmin/audit';
import { runStudioAcceptanceOnce } from '@/lib/dadmin/test-runner';

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ ok: false, error: 'This endpoint is not available in production.' }, { status: 403 });
  }
  
  let runId: string | undefined;

  try {
    const body = await req.json().catch(() => ({}));
    const taskId = body.taskId || 'DGF-403'; 

    const result = await runStudioAcceptanceOnce({
      taskId,
      triggerSource: "studioSelftest",
    });
    runId = result.runId;

    return NextResponse.json({ ok: true, runId });

  } catch (err: any) {
    console.error(`[studio-acceptance-selftest] Failed to run test`, err);
    await logAdminAction({
      action: 'playwright.acceptance.studio.error',
      status: 'error',
      runId: runId,
      errorMessage: `Selftest endpoint failed: ${err.message}`,
    });
    return NextResponse.json({ ok: false, error: 'Failed to trigger Studio acceptance selftest.' }, { status: 500 });
  }
}
