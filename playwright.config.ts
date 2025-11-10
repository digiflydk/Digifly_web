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
  reporter: [['html', { outputFolder: 'qa/report' }], ['line']],
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
