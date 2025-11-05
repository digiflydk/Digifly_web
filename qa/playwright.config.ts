import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: { baseURL: 'http://127.0.0.1:3000' },
  webServer: {
    command: 'npx next start -p 3000',
    port: 3000,
    timeout: 120_000,
    reuseExistingServer: false
  },
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]]
});
