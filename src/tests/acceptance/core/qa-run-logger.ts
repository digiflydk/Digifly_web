// src/tests/acceptance/core/qa-run-logger.ts
import { saveQaRunToFirestore, type QaRunRecord } from './qa-firestore';

export function logQaRunStub(details: { taskId: string; status: string }) {
  // Placeholder for future Firestore QA run logging
  return {
    ok: true,
    received: details,
  };
}

export async function logQaRunToFirestore(details: QaRunRecord) {
  return saveQaRunToFirestore(details);
}
