
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// If the UI uses POST, provide POST handler
export async function POST() {
  try {
    // TODO: replace with real runner or stub
    // Simulate a short run and return a JSON report shell
    const report = {
      ok: true,
      status: 'ok',
      startedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString(),
      summary: {
        total: 3,
        passed: 3,
        failed: 0,
        flaky: 0,
        skipped: 0,
      },
      artifacts: {
        htmlReportUrl: '/dadmin/developer/tests', // stable landing
        rawJson: {
          suites: [],
        },
      },
    };
    return NextResponse.json(report, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: 'run-failed', message: String(err?.message ?? err) }, { status: 500 });
  }
}

// Optional GET handler if the client uses GET
export async function GET() {
  return NextResponse.json({ error: 'use POST' }, { status: 405 });
}
