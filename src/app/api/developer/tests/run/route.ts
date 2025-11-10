
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

// This is a stub for triggering a test run asynchronously.
// In a real implementation, this would likely trigger a cloud function,
// a CI/CD pipeline job, or a background worker.
export async function POST() {
  try {
    // For now, we immediately return a success response with a unique ID.
    // The actual test run would happen in the background.
    // The client will use Firestore listeners to observe the results.
    return NextResponse.json({
      ok: true,
      runId: crypto.randomUUID(),
      startedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[API /dev/tests/run] Error:', err);
    return NextResponse.json({ ok: false, error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}
