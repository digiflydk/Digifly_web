

import type { FieldValue } from 'firebase-admin/firestore';

export type QARunStatus = 'queued' | 'running' | 'passed' | 'failed' | 'error' | 'timedout';
export type QARunType = 'acceptance' | 'predeploy';
export type QATrigger = 'manual' | 'studio' | 'studioDebug' | 'studioSelftest' | 'predeploySmoke' | 'autoAcceptance';
export type AcceptanceSuiteId = 'homepage-cms-core' | 'hero-banner-colors';
export type AcceptanceSuiteTag = '@suite:homepage-cms-core' | '@suite:hero-banner-colors';


export interface QARun {
  id: string;
  status: QARunStatus;
  runType: QARunType;
  suiteId?: AcceptanceSuiteId | null;
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
  tests?: Array<{
    title: string;
    status: 'passed' | 'failed' | 'skipped';
    durationMs?: number;
  }>;
}
