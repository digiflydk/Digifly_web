
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';
import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import type { QARun } from '@/lib/qa/qa.types';
import { FieldValue } from 'firebase-admin/firestore';
import { headers } from 'next/headers';

const isDev = process.env.NODE_ENV !== 'production';
const allowRuns = process.env.ALLOW_TEST_RUNS === 'true';

// Very basic admin check placeholder - replace with your actual auth logic
async function isAdmin() {
    // In a real app, this would verify a JWT, session, or role claim
    const h = headers();
    return h.get('x-admin-secret') === process.env.ADMIN_SECRET;
}

export async function POST(req: Request) {
  if (!isDev && !allowRuns) {
    return NextResponse.json({ ok: false, error: 'Test runs are disabled in this environment.' }, { status: 403 });
  }

  // Replace with actual authentication check
  // if (!await isAdmin()) {
  //   return NextResponse.json({ ok: false, error: 'Unauthorized.' }, { status: 401 });
  // }

  const db = await getDb();
  const runRef = db.collection('qa_runs').doc();
  
  const initialData: Partial<QARun> = {
    status: 'queued',
    requestedBy: 'admin', // Replace with actual user ID/email
    startedAt: FieldValue.serverTimestamp(),
    environment: 'studio',
  };
  
  await runRef.set(initialData);

  // Do not await this, let it run in the background
  runPlaywrightAndSave(runRef.id).catch(async (e) => {
    console.error(`[Test Run ${runRef.id}] Execution failed:`, e);
    await runRef.update({
      status: 'error',
      errorMessage: e.message || String(e),
      finishedAt: FieldValue.serverTimestamp(),
    });
  });

  return NextResponse.json({ ok: true, runId: runRef.id });
}


async function runPlaywrightAndSave(runId: string) {
  const db = await getDb();
  const runRef = db.collection('qa_runs').doc(runId);

  await runRef.update({ status: 'running' });

  const resultsPath = path.join(process.cwd(), 'test-results', 'results.json');
  await fs.mkdir(path.dirname(resultsPath), { recursive: true }).catch(() => {});
  
  const startTime = Date.now();

  const child = spawn('npx', ['playwright', 'test', '--reporter=json'], {
    stdio: 'pipe', // use pipe to capture stdout/stderr
    shell: true,
    env: { ...process.env, PW_JSON_OUTPUT_NAME: resultsPath }
  });

  let stdout = '';
  let stderr = '';
  child.stdout.on('data', (data) => stdout += data.toString());
  child.stderr.on('data', (data) => stderr += data.toString());

  const exitCode = await new Promise<number>((resolve) => {
    child.on('close', resolve);
  });
  
  const durationMs = Date.now() - startTime;

  try {
    const resultsJson = await fs.readFile(resultsPath, 'utf-8');
    const results = JSON.parse(resultsJson);

    const stats = results.stats;
    const summary: Partial<QARun> = {
      status: stats.failures > 0 ? 'failed' : 'passed',
      finishedAt: FieldValue.serverTimestamp(),
      totals: {
        total: stats.tests.length,
        passed: stats.passes,
        failed: stats.failures,
        skipped: stats.skips,
      },
      durationMs,
    };
    await runRef.update(summary);
  } catch (e: any) {
    console.error(`[Test Run ${runId}] Failed to parse or save results:`, e);
    console.error('Playwright stdout:', stdout);
    console.error('Playwright stderr:', stderr);
    await runRef.update({
      status: 'error',
      errorMessage: `Failed to process test results. Exit code: ${exitCode}. Error: ${e.message}`,
      finishedAt: FieldValue.serverTimestamp(),
      durationMs,
    });
  }
}
