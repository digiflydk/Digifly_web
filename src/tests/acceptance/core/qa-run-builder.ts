// src/tests/acceptance/core/qa-run-builder.ts

type QaRunInput = {
  taskId: string;
  status: string;
};

type QaRunSummary = {
  total: number;
  passed: number;
  failed: number;
};

type QaRunObject = {
  taskId: string;
  status: string;
  startedAt: string;
  finishedAt: string;
  summary: QaRunSummary;
  errorSummary: any[];
  runType: "acceptance";
};

/**
 * Builds a standardized QA run object.
 * This is a preliminary step before writing to Firestore.
 */
export function buildQaRunObject(input: QaRunInput): QaRunObject {
  const now = new Date().toISOString();
  return {
    runType: "acceptance",
    taskId: input.taskId,
    status: input.status,
    startedAt: now,
    finishedAt: now, // In a real scenario, this would be set at the end.
    summary: {
      total: 1,
      passed: input.status === 'passed' ? 1 : 0,
      failed: input.status === 'failed' ? 1 : 0,
    },
    errorSummary: [],
  };
}
