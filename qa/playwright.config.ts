import { defineConfig, devices } from '@playwright/test';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

export default defineConfig({
  testDir: __dirname,
  timeout: 30_000,
  retries: 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'public/qa-report', open: 'never' }]
  ],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'off',
  },
  projects: [
    { name: 'Desktop Chrome', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile Safari',  use: { ...devices['Mobile Safari'] } },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    env: {
        NODE_ENV: "production",
        // ensure Next does NOT try to use a custom config path from env
        NEXT_CONFIG_FILE: "",
    },
    timeout: 120_000,
  },
});
