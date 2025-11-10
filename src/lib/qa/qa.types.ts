
export type QARunStatus = 'queued' | 'running' | 'passed' | 'failed';

export interface QARun {
  id?: string;
  status: QARunStatus;
  requestedBy: string;
  startedAt?: FirebaseFirestore.Timestamp;
  finishedAt?: FirebaseFirestore.Timestamp;
  commit?: string;
  totals?: { passed: number; failed: number; skipped: number; total: number };
  artifactUrl?: string;
  workflowRunId?: number;
}
