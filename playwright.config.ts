import { defineConfig, devices } from '@playwright/test';

// Read from environment variable, default to localhost for local testing
const BASE_URL = process.env.BASE_URL || 'http://localhost:9002';

export default defineConfig({
  timeout: 30_000,
  
  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 1 : 0,

  // Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],
    ['junit', { outputFile: 'qa/report/junit.xml' }],
    ['html', { outputFolder: 'qa/report/html', open: 'never' }],
  ],
  
  use: {
    baseURL: BASE_URL,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    // Existing browser-based QA projects
    { name: 'chromium', testDir: './qa/tests', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', testDir: './qa/tests', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', testDir: './qa/tests', use: { ...devices['Desktop Safari'] } },
    
    // New Node-only Acceptance project
    {
      name: 'acceptance',
      testDir: 'src/tests/acceptance',
      testMatch: '*.acceptance.spec.ts',
    },
  ],

  // Directory for test artifacts
  outputDir: 'qa/artifacts',
});
