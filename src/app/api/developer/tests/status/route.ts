
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

// This is a stub for fetching the latest test status.
// In a real implementation, this might read from a file or a cache.
// For this app, the client uses a direct Firestore listener, making this redundant for now.
export async function GET() {
  try {
    return NextResponse.json({
      ok: true,
      lastRunAt: null,
      lastResult: null,
      reportUrl: null,
    });
  } catch (err: any) {
    console.error('[API /dev/tests/status] Error:', err);
    return NextResponse.json({ ok: false, error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}
