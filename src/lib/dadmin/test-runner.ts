
"use server";
import "server-only";

import { getDb } from "@/lib/firebase/admin";
import { logAdminAction } from "./audit";
import type { QARun, QARunTrigger, AcceptanceSuiteId } from "../qa/qa.types";
import { FieldValue } from "firebase-admin/firestore";
import fs from "fs/promises";
import path from "path";
import { PLAYWRIGHT_ACCEPTANCE_JSON_REPORT_PATH } from "./playwright-constants";
import { spawn } from "child_process";
import { ACCEPTANCE_SUITES } from "./tests/acceptance-suites";

type RunOptions = {
  suiteId: AcceptanceSuiteId | null;
  triggerSource?: QARunTrigger;
};

// --- START: DGF-412 Playwright JSON Report Parsing Logic ---

type PlaywrightTestResult = {
  workerIndex: number;
  status: 'passed' | 'failed' | 'timedOut' | 'skipped' | 'interrupted';
  duration: number;
  error?: {
    message?: string;
    stack?: string;
    value?: string;
  };
  attachments: any[];
  stdout: any[];
  stderr: any[];
  retry: number;
  startTime: string;
};

type PlaywrightTest = {
  title: string;
  ok: boolean;
  expectedStatus: string;
  timeout: number;
  annotations: any[];
  projectName: string;
  results: PlaywrightTestResult[];
  status: 'expected' | 'unexpected' | 'flaky' | 'skipped';
};

type PlaywrightSpec = {
  title: string;
  file: string;
  line: number;
  column: number;
  tests: PlaywrightTest[];
};

type PlaywrightSuite = {
  title: string;
  file: string;
  specs: PlaywrightSpec[];
  suites?: PlaywrightSuite[];
};

type PlaywrightJsonReport = {
  config: any;
  suites: PlaywrightSuite[];
  errors: any[];
  stats: any;
};

type ParsedReport = {
  summary: QARun['totals'];
  tests: QARun['tests'];
  errorSummary: QARun['errorSummary'];
  status: QARun['status'];
};

function parsePlaywrightJsonReport(filePath: string, reportContent: string): ParsedReport {
  try {
    const report: PlaywrightJsonReport = JSON.parse(reportContent);
    const summary: Required<NonNullable<QARun['totals']>> = {
      total: 0,
      passed: 0,
      failed: 0,
      flaky: 0,
      skipped: 0,
    };
    const tests: Required<NonNullable<QARun['tests']>> = [];
    const errorSummary: Required<NonNullable<QARun['errorSummary']>> = [];

    function traverseSuites(suites: PlaywrightSuite[]) {
      for (const suite of suites) {
        if (suite.specs) {
          for (const spec of suite.specs) {
            for (const test of spec.tests) {
              summary.total++;
              const result = test.results[0]; // Using the first result for simplicity
              tests.push({
                title: `${spec.title} › ${test.title}`,
                status: result.status === 'timedOut' ? 'failed' : result.status,
                durationMs: result.duration,
              });

              if (test.status === 'expected' || test.status === 'passed') {
                summary.passed++;
              } else if (test.status === 'unexpected' || test.status === 'failed') {
                summary.failed++;
                errorSummary.push({
                  testTitle: `${spec.title} › ${test.title}`,
                  message: result.error?.message?.split('\n')[0] ?? 'Test failed without a message.',
                });
              } else if (test.status === 'flaky') {
                summary.flaky++;
              } else if (test.status === 'skipped') {
                summary.skipped++;
              }
            }
          }
        }
        if (suite.suites) {
          traverseSuites(suite.suites);
        }
      }
    }

    traverseSuites(report.suites ?? []);
    
    if (report.errors.length > 0) {
      summary.failed += report.errors.length;
      summary.total += report.errors.length;
      report.errors.forEach(e => errorSummary.push({ testTitle: "Global Error", message: e.message || e.value || 'An unknown error occurred during test setup.' }));
    }
    
    if (summary.total === 0 && errorSummary.length === 0) {
        return {
            status: 'error',
            summary,
            tests,
            errorSummary: [{ testTitle: 'Test Discovery', message: 'No tests were found by Playwright for the "acceptance" project.' }],
        };
    }

    const status: QARun['status'] = (summary.failed ?? 0) > 0 || (summary.flaky ?? 0) > 0 ? 'failed' : 'passed';

    return { summary, errorSummary, tests, status };
  } catch (error: any) {
    console.error("Failed to parse Playwright JSON report:", error);
    return {
      status: 'error',
      summary: { total: 0, passed: 0, failed: 0, skipped: 0, flaky: 0 },
      tests: [],
      errorSummary: [
        {
          testTitle: "Report Parsing Error",
          message: `Could not parse JSON report at ${filePath}: ${error.message}`,
        },
      ],
    };
  }
}
// --- END: DGF-412 ---


async function removeOldReport() {
    const reportPath = path.resolve(process.cwd(), PLAYWRIGHT_ACCEPTANCE_JSON_REPORT_PATH);
    try {
        await fs.unlink(reportPath);
    } catch {
        // ignore if file does not exist
    }
}

async function runPlaywrightAcceptance(suiteId: AcceptanceSuiteId | null): Promise<{
  exitCode: number;
  stdout: string;
  stderr: string;
}> {
  const suite = suiteId ? ACCEPTANCE_SUITES.find(s => s.id === suiteId) : null;
  const grepArg = suite ? ['--grep', suite.tag] : [];
  
  const args = ['playwright', 'test', '--project=acceptance', ...grepArg];

  return new Promise((resolve, reject) => {
    const child = spawn('npx', args, {
      shell: process.platform === 'win32',
      env: {
        ...process.env,
        PLAYWRIGHT_JSON_OUTPUT_NAME: PLAYWRIGHT_ACCEPTANCE_JSON_REPORT_PATH,
      },
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('error', (error) => {
      reject(error);
    });

    child.on('close', (code) => {
      resolve({ exitCode: code ?? 1, stdout, stderr });
    });
  });
}


export async function runStudioAcceptanceOnce({
  suiteId,
  triggerSource = 'studioSelftest',
}: RunOptions): Promise<{ runId: string }> {
  const db = await getDb();
  let runId = "unknown";
  const startedAt = new Date();

  const suite = suiteId ? ACCEPTANCE_SUITES.find(s => s.id === suiteId) : null;
  const taskId = suite ? suite.tag : null;

  const runData: Omit<QARun, "id"> = {
    taskId,
    suiteId: suiteId,
    runType: "acceptance",
    environment: "test",
    triggeredBy: triggerSource,
    status: "running",
    startedAt: FieldValue.serverTimestamp() as any,
  };

  const runRef = await db.collection("qaRuns").add(runData);
  runId = runRef.id;

  await logAdminAction({
    action: "playwright.acceptance.studio.start",
    status: "ok",
    path: `qaRuns/${runId}`,
    taskId: suiteId,
  });

  const reportPath = path.resolve(process.cwd(), PLAYWRIGHT_ACCEPTANCE_JSON_REPORT_PATH);

  try {
    await removeOldReport();
    
    const { exitCode, stderr } = await runPlaywrightAcceptance(suiteId);
    
    if (exitCode !== 0 && exitCode !== 1) {
        throw new Error(`Playwright process exited with code ${exitCode}. Stderr: ${stderr.slice(0, 500)}`);
    }

    let parsedResult: ParsedReport;
    try {
        const reportContent = await fs.readFile(reportPath, "utf-8");
        parsedResult = parsePlaywrightJsonReport(reportPath, reportContent);
    } catch (readError: any) {
        parsedResult = {
            status: "error",
            summary: { total: 0, passed: 0, failed: 0, skipped: 0, flaky: 0 },
            tests: [],
            errorSummary: [{
                testTitle: "Playwright Execution Error",
                message: `Playwright run finished, but the report file was not found. Stderr: ${stderr.slice(0, 500)}`,
            }],
        };
    }
    
    const finishedAt = new Date();

    await runRef.update({
      status: parsedResult.status,
      totals: parsedResult.summary,
      tests: parsedResult.tests,
      errorSummary: parsedResult.errorSummary,
      finishedAt: FieldValue.serverTimestamp(),
      durationMs: finishedAt.getTime() - startedAt.getTime(),
    });

    await logAdminAction({
      action: "playwright.acceptance.studio.finish",
      status: parsedResult.status,
      path: `qaRuns/${runId}`,
      taskId: suiteId,
      payloadSummary: `Result: ${parsedResult.summary?.passed}/${parsedResult.summary?.total} passed.`,
    });

  } catch (e: any) {
    console.error(`[runStudioAcceptanceOnce] Error for runId ${runId}:`, e);
    const finishedAt = new Date();
    await runRef.update({ 
      status: "error", 
      errorMessage: e.message, 
      finishedAt: FieldValue.serverTimestamp(),
      durationMs: finishedAt.getTime() - startedAt.getTime(),
    });
    await logAdminAction({
      action: "playwright.acceptance.studio.error",
      status: "error",
      path: `qaRuns/${runId}`,
      taskId: suiteId,
      errorMessage: e.message,
    });
    throw e;
  }

  return { runId };
}
