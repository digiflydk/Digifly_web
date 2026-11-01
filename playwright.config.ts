import { defineConfig, devices } from "@playwright/test";
const baseURL = process.env.BASE_URL || "http://localhost:9002";
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: "list",
  use: { baseURL, trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // Server lifecycle is owned by the preview coordinator. Never start a second server.
});
