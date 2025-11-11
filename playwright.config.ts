import { defineConfig, devices } from '@playwright/test';

const baseURL =
  process.env.E2E_BASE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'http://localhost:3000';

export default defineConfig({
  timeout: 30_000,
  testDir: './tests',
  expect: { timeout: 5_000 },
  retries: 0,
  reporter: [['html', { outputFolder: 'playwright-report' }], ['line']],
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'predeploy',
      testDir: './tests/smoke',
      testMatch: /predeploy\.spec\.ts/,
      timeout: 30_000,
      retries: 0,
      use: {
        baseURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        headless: true,
        screenshot: 'off',
        video: 'off',
        trace: 'off',
      },
    },
  ],
});
