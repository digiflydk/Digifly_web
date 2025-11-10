

export type QARunStatus = 'queued' | 'running' | 'passed' | 'failed' | 'error';

export interface QARun {
  id?: string;
  status: QARunStatus;
  requestedBy: string;
  startedAt?: FirebaseFirestore.Timestamp;
  finishedAt?: FirebaseFirestore.Timestamp;
  environment?: 'studio' | 'deployed';
  commit?: string;
  totals?: { passed: number; failed: number; skipped: number; total: number };
  durationMs?: number;
  reportUrl?: string; 
  workflowRunId?: number;
  errorMessage?: string;
}
