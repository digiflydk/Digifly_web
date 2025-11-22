// src/tests/acceptance/playwright-module.acceptance.spec.ts

import { test, expect } from '@playwright/test';
import { initAcceptanceEnv } from './core/test-env';

test.describe('DGFPW-001 — Playwright acceptance harness', () => {
  test('DGFPW-001 — should initialise acceptance environment', async () => {
    const env = initAcceptanceEnv();
    expect(env).toBeDefined();
  });
});
