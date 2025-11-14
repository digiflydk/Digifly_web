import { defineConfig, devices } from '@playwright/test';

const baseURL =
  process.env.E2E_BASE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'http://localhost:3000';

export default defineConfig({
  timeout: 30_000,
  testDir: './tests',
  expect: { timeout: 5_000 },
  retries: process.env.CI ? 1 : 0, // Retry on CI
  workers: process.env.CI ? 1 : undefined, // Opt out of parallel tests on CI
  reporter: [
    ['list'],
    ['html', { outputFolder: 'qa/report/html', open: 'never' }],
    ['json', { outputFile: 'qa/report/results.json' }],
    ['junit', { outputFile: 'qa/report/junit.xml' }],
  ],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    {
      name: 'predeploy-smoke',
      testDir: './tests/smoke',
      testMatch: /predeploy\.spec\.ts/,
      retries: 0,
    },
  ],
  outputDir: 'qa/artifacts',
});
