import { defineConfig, devices } from '@playwright/test';

// Read from environment variable, default to localhost for local testing
const BASE_URL = process.env.BASE_URL || 'http://localhost:9002';

export default defineConfig({
  timeout: 30_000,
  testDir: './tests', // Point to the new tests directory
  
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
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],

  // Directory for test artifacts
  outputDir: 'qa/artifacts',

  // No webServer needed for post-deploy tests
  // webServer: { ... } 
});
