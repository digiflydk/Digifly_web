
export type QARunStatus = 'queued' | 'running' | 'passed' | 'failed' | 'error' | 'timedout';
export type QARunType = 'acceptance' | 'predeploy';

export interface QARun {
  id?: string;
  status: QARunStatus;
  runType: QARunType;
  taskId?: string | null;
  requestedBy: string;
  startedAt?: FirebaseFirestore.Timestamp;
  finishedAt?: {
    seconds: number;
    nanoseconds: number;
  };
  environment?: 'studio' | 'test' | 'prod';
  commit?: string;
  totals?: { passed: number; failed: number; flaky: number; skipped: number; total: number };
  durationMs?: number;
  reportUrl?: string; 
  artifactUrl?: string;
  workflowRunId?: number;
  errorMessage?: string;
}
