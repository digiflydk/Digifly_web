import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './',
  timeout: 60_000,
  retries: 0,
  use: {
    baseURL: process.env.SITE_URL || 'https://studio--studio-9863436583-e36f9.us-central1.hosted.app',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    { name: 'Desktop Chrome', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile Safari',  use: { ...devices['iPhone 13'] } },
  ],
  reporter: [['list'], ['html', { outputFolder: 'qa-report', open: 'never' }]],
});
