// src/tests/acceptance/core/qa-firestore.ts
import { getDb } from '@/lib/firebase-admin';

export type QaRunRecord = {
  taskId: string;
  status: string;
  runType: string;
  summary: {
    total: number;
    passed: number;
    failed: number;
  };
  errorSummary: unknown[];
  startedAt: string;
  finishedAt: string;
};

export async function saveQaRunToFirestore(run: QaRunRecord): Promise<{ ok: boolean; error?: string }> {
  try {
    const db = await getDb();
    if (!db) {
        throw new Error("Firestore database is not available. Check service account credentials.");
    }
    await db.collection('qaRuns').add(run);
    return { ok: true };
  } catch (e: any) {
    console.error("[saveQaRunToFirestore] Failed to write QA run:", e.message);
    return { ok: false, error: e.message };
  }
}
