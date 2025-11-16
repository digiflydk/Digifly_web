// scripts/run-acceptance.ts

import { spawnSync } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
import {
  ACCEPTANCE_SUITES,
  type AcceptanceSuiteId,
  type AcceptanceSuite,
} from '../src/lib/dadmin/tests/acceptance-suites';
import type { QARun } from '../src/lib/qa/qa.types';
import { PLAYWRIGHT_ACCEPTANCE_JSON_REPORT_PATH } from '@/lib/dadmin/playwright-constants';

function findSuiteByArg(arg: string): { suite: AcceptanceSuite | null; type: 'id' | 'tag' | null } {
  if (arg.startsWith('@suite:')) {
    const suite = ACCEPTANCE_SUITES.find(s => s.tag === arg);
    return { suite: suite || null, type: 'tag' };
  }
  const suite = ACCEPTANCE_SUITES.find(s => s.id === arg);
  return { suite: suite || null, type: 'id' };
}

async function parsePlaywrightReport(reportPath: string): Promise<QARun> {
  const defaultSummary = { passed: 0, failed: 0, flaky: 0, skipped: 0, total: 0 };
  try {
    const content = await fs.readFile(reportPath, 'utf8');
    const report = JSON.parse(content);

    const summary = report.stats ?? defaultSummary;
    const tests: QARun['tests'] = [];
    const errorSummary: QARun['errorSummary'] = [];
    
    const traverseSuites = (suites: any[]) => {
      for (const suite of suites) {
        for (const spec of suite.specs ?? []) {
          for (const test of spec.tests ?? []) {
            const result = test.results[0]; // Take the first result
            tests.push({
              title: `${spec.title} › ${test.title}`,
              status: result.status,
              durationMs: result.duration,
            });
            if (result.status === 'failed' || result.status === 'timedOut') {
              errorSummary.push({
                testTitle: `${spec.title} › ${test.title}`,
                message: result.error?.message?.split('\n')[0] ?? 'Test failed',
              });
            }
          }
        }
        if (suite.suites) {
          traverseSuites(suite.suites);
        }
      }
    };
    
    traverseSuites(report.suites ?? []);

    return {
      status: (summary.failed + summary.flaky) > 0 ? 'failed' : 'passed',
      totals: summary,
      tests,
      errorSummary,
    } as QARun;
  } catch (error) {
    console.warn("Could not read or parse Playwright report, using default summary.", error);
    return {
      status: 'error',
      totals: defaultSummary,
      tests: [],
      errorSummary: [{ testTitle: 'Test Runner Error', message: 'Failed to parse Playwright JSON report.' }],
    } as QARun;
  }
}

async function run() {
  const suiteArg = process.argv[2];
  if (!suiteArg) {
    console.error('Usage: tsx scripts/run-acceptance.ts <suiteId_or_suiteTag>');
    process.exit(1);
  }

  const { suite, type } = findSuiteByArg(suiteArg);

  if (!suite) {
    console.error(`Error: Suite not found for argument "${suiteArg}"`);
    process.exit(1);
  }
  
  const reportPath = path.join(process.cwd(), PLAYWRIGHT_ACCEPTANCE_JSON_REPORT_PATH);
  try {
    await fs.unlink(reportPath).catch(() => {}); // ignore if not found
  } catch {}


  const args = ['playwright', 'test', 'tests/acceptance', '--reporter=json', `--output=${path.dirname(reportPath)}`];
  if (type === 'tag' || type === 'id') {
    args.push('--grep', suite.tag);
  }

  console.log(`Running suite: ${suite.title} (tag: ${suite.tag})`);
  
  const result = spawnSync('npx', args, {
    stdio: 'inherit',
    env: { ...process.env, PW_JSON_OUTPUT_NAME: reportPath },
  });
  
  const reportData = await parsePlaywrightReport(reportPath);
  
  console.log("\n--- Acceptance Run Summary ---");
  console.log(JSON.stringify({
    suiteId: suite.id,
    taskId: suite.tag, // For now, taskId is the tag
    ...reportData,
  }, null, 2));

  process.exit(result.status ?? 1);
}

run();
