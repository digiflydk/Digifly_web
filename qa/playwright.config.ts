import { defineConfig, devices } from '@playwright/test';
import path from 'path';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
const projectRoot = path.resolve(__dirname, '..');

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
    port: PORT,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
    cwd: projectRoot, // ensure .next is discovered at the repo root
    env: {
        NODE_ENV: "production",
    },
  },
});
