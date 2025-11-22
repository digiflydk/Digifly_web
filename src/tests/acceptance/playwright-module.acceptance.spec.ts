// src/tests/acceptance/playwright-module.acceptance.spec.ts

import { test, expect } from '@playwright/test';
import { initAcceptanceEnv } from './core/test-env';
import { buildQaRunObject } from './core/qa-run-builder';

test.describe('DGFPW-001 — Playwright acceptance harness', () => {
  test('DGFPW-001-12 — should build a valid QA run object', async () => {
    const env = initAcceptanceEnv();
    expect(env).toBeDefined();

    const run = buildQaRunObject({
      taskId: 'DGFPW-001',
      status: 'passed',
    });

    expect(run.taskId).toBe('DGFPW-001');
    expect(run.status).toBe('passed');
    expect(run.summary.passed).toBe(1);
    expect(run.summary.total).toBe(1);
  });
});
