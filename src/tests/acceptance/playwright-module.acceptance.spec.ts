// src/tests/acceptance/playwright-module.acceptance.spec.ts

import { test, expect } from '@playwright/test';
import { initAcceptanceEnv } from './core/test-env';
import { buildQaRunObject } from './core/qa-run-builder';
import { logQaRunStub, logQaRunToFirestore } from './core/qa-run-logger';
import { buildQaSummary } from './core/qa-summary';

test.describe('DGFPW-001 — Playwright acceptance harness', () => {

  test('DGFPW-001-10 — should initialise acceptance environment', async () => {
    const env = initAcceptanceEnv();
    expect(env).toBeDefined();
  });

  test('DGFPW-001-11 — should call the QA run logger stub', async () => {
    const result = logQaRunStub({
      taskId: 'DGFPW-001',
      status: 'passed',
    });
    expect(result.ok).toBe(true);
    expect(result.received.taskId).toBe('DGFPW-001');
  });
  
  test('DGFPW-001-12 — should build a valid QA run object', async () => {
    const run = buildQaRunObject({
      taskId: 'DGFPW-001',
      status: 'passed',
    });

    expect(run.taskId).toBe('DGFPW-001');
    expect(run.status).toBe('passed');
    expect(run.summary.passed).toBe(1);
    expect(run.summary.total).toBe(1);
  });

  test('DGFPW-001-13 — should build a correct QA summary', async () => {
    const summary = buildQaSummary([
      { passed: true },
      { passed: true },
      { passed: false }
    ]);
    expect(summary.total).toBe(3);
    expect(summary.passed).toBe(2);
    expect(summary.failed).toBe(1);
  });

  test('DGFPW-001-18 — should write a QA run to Firestore', async () => {
    const run = buildQaRunObject({
      taskId: 'DGFPW-001',
      status: 'passed',
    });
    const result = await logQaRunToFirestore(run);
    expect(result.ok).toBe(true);
  });
});
