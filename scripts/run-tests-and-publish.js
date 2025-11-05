// Runs Playwright, ALWAYS uploads HTML report to GCS, echoes a URL, and exits with the same code.
import { spawn } from 'node:child_process';
import { publishToGCS } from './upload-to-gcs.js';
import { existsSync } from 'node:fs';
import { cpSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const REPORT_DIR = 'playwright-report';

function run(cmd, args, opts = {}) {
  return new Promise((resolve) => {
    const p = spawn(cmd, args, { stdio: 'inherit', shell: true, ...opts });
    p.on('close', (code) => resolve(code ?? 1));
  });
}

(async () => {
  // Ensure browser installed
  let code = await run('npx', ['playwright', 'install', 'chromium']);
  if (code !== 0) process.exit(code);

  // Run tests
  code = await run('playwright', ['test', '-c', 'qa/playwright.config.ts']);

  // Upload report to GCS even if failed
  if (!existsSync(REPORT_DIR)) {
    console.warn('[qa] No report directory found; skipping upload.');
  } else {
    const buildStamp = new Date().toISOString().replace(/[:.]/g, '-');
    const gcsUrl = await publishToGCS(REPORT_DIR, buildStamp);
    if (gcsUrl) {
      console.log(`[qa] Playwright report uploaded: ${gcsUrl}`);
    } else {
      console.warn('[qa] Failed to upload Playwright report to GCS.');
    }
  }

  // On PASS: also copy report into build output to publish at /qa-report
  if (code === 0) {
    try {
      // Next 15 standalone public folder
      const target = path.join('.next', 'standalone', 'public', 'qa-report');
      mkdirSync(target, { recursive: true });
      cpSync(REPORT_DIR, target, { recursive: true });
      console.log('[qa] Published report to /qa-report/index.html (will be live after deploy)');
    } catch (e) {
      console.warn('[qa] Could not publish local report to /qa-report:', e.message);
    }
  }

  // Exit with same code as Playwright (0=pass, nonzero=fail)
  process.exit(code);
})();
