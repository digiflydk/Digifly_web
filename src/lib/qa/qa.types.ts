
import type { FieldValue } from 'firebase-admin/firestore';

export type QARunStatus = 'queued' | 'running' | 'passed' | 'failed' | 'error' | 'timedout';
export type QARunType = 'acceptance' | 'predeploy';
export type QATrigger = 'manual' | 'studio' | 'studioDebug';

export interface QARun {
  id: string;
  status: QARunStatus;
  runType: QARunType;
  taskId?: string | null;
  requestedBy: string;
  startedAt: FieldValue | Date;
  finishedAt?: FieldValue | Date;
  environment?: 'studio' | 'test' | 'prod';
  triggeredBy: QATrigger;
  commit?: string;
  totals?: { passed: number; failed: number; flaky: number; skipped: number; total: number };
  durationMs?: number;
  reportUrl?: string; 
  artifactUrl?: string;
  workflowRunId?: number;
  errorMessage?: string;
  errorSummary?: Array<{
    testTitle: string;
    message: string;
  }>;
}
