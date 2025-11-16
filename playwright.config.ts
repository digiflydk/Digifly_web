
import { defineConfig, devices } from "@playwright/test";
import { PLAYWRIGHT_ACCEPTANCE_JSON_REPORT_PATH } from "./src/lib/dadmin/playwright-constants";

const baseURL =
  process.env.E2E_BASE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000";

const acceptanceGrep = process.env.TASK_ID ? new RegExp(process.env.TASK_ID, 'i') : undefined;

export default defineConfig({
  timeout: 30_000,
  testDir: "./tests",
  expect: { timeout: 5_000 },
  retries: process.env.CI ? 1 : 0, // Retry on CI
  workers: process.env.CI ? 1 : undefined, // Opt out of parallel tests on CI
  reporter: [
    ["list"],
    ["html", { outputFolder: "qa/report/html", open: "never" }],
    // Use the shared constant for the acceptance JSON report
    ["json", { outputFile: PLAYWRIGHT_ACCEPTANCE_JSON_REPORT_PATH }],
    ["junit", { outputFile: "qa/report/junit.xml" }],
  ],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { 
      name: "chromium", 
      use: { ...devices["Desktop Chrome"] } 
    },
    {
      name: "predeploy",
      testDir: "./tests/smoke",
      testMatch: /predeploy\\.spec\\.ts/,
      retries: 0,
    },
    {
      name: "acceptance",
      grep: acceptanceGrep,
    },
    {
      name: 'ui',
      testDir: 'tests/ui',
      testMatch: /.*\\.ui\\.spec\\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  outputDir: "qa/artifacts",
});
