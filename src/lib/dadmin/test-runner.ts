
"use server";
import "server-only";

import { getDb } from "@/lib/firebase/admin";
import { logAdminAction } from "./audit";
import type { QARun, QARunTrigger } from "../qa/qa.types";
import { FieldValue } from "firebase-admin/firestore";
import fs from "fs/promises";
import path from "path";
import { PLAYWRIGHT_ACCEPTANCE_JSON_REPORT_PATH } from "./playwright-constants";
import { spawn } from "child_process";

type RunOptions = {
  taskId: string | null;
  triggerSource: QARunTrigger;
};

type PlaywrightJsonReport = {
  stats: {
    total: number;
    expected: number;
    unexpected: number;
    flaky: number;
    skipped: number;
    duration: number;
  };
  suites?: {
    title: string;
    specs: {
      title: string;
      tests: {
        results: {
          status: string;
          error?: { message: string };
        }[];
      }[];
    }[];
  }[];
  tests?: {
    titlePath: () => string[];
    title: string;
    outcome: 'failed' | 'passed' | 'skipped' | 'unexpected';
    results: { error?: { message: string } }[]
  }[];
};

async function removeOldReport() {
    const reportPath = path.resolve(process.cwd(), PLAYWRIGHT_ACCEPTANCE_JSON_REPORT_PATH);
    try {
        await fs.unlink(reportPath);
    } catch {
        // ignore if file does not exist
    }
}

async function runPlaywrightAcceptance(taskId: string | null): Promise<{
  exitCode: number;
  stdout: string;
  stderr: string;
}> {
  const args = ['playwright', 'test', '--project=acceptance'];

  return new Promise((resolve, reject) => {
    const child = spawn('npx', args, {
      shell: process.platform === 'win32',
      env: {
        ...process.env,
        DGF_TASK_ID: taskId ?? '',
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


async function parsePlaywrightJsonReport(
  filePath: string
): Promise<{ summary: QARun["summary"]; errorSummary: QARun["errorSummary"]; status: QARun["status"] }> {
  let reportContent: string;
  let fileMissing = false;
  try {
    reportContent = await fs.readFile(filePath, "utf-8");
  } catch (error) {
    fileMissing = true;
    console.error(`[parsePlaywrightJsonReport] Report file not found at ${filePath}`);
    return {
      status: "error",
      summary: { total: 0, passed: 0, failed: 0, skipped: 0, flaky: 0 },
      errorSummary: [
        {
          testTitle: "Report Generation",
          message: `Acceptance JSON report not found at ${filePath}.`,
        },
      ],
    };
  }

  try {
    const report: PlaywrightJsonReport = JSON.parse(reportContent);

    const summary: QARun['summary'] = {
      total: report.stats?.total ?? 0,
      passed: report.stats?.expected ?? 0,
      failed: report.stats?.unexpected ?? 0,
      flaky: report.stats?.flaky ?? 0,
      skipped: report.stats?.skipped ?? 0,
    };

    const errorSummary: QARun["errorSummary"] = [];
    if (report.tests) {
        report.tests.forEach(test => {
            if (test.outcome === 'failed' || test.outcome === 'unexpected') {
                 errorSummary.push({
                    testTitle: test.titlePath().join(' › '),
                    message: test.results[0]?.error?.message?.split('\n')[0] ?? 'Test failed without message',
                });
            }
        })
    } else if (report.suites) { // older playwright json format
        report.suites.forEach((suite) => {
          suite.specs.forEach((spec) => {
            spec.tests.forEach((test) => {
              test.results.forEach((result) => {
                if (
                  result.status === "failed" ||
                  result.status === "timedOut" ||
                  result.status === "interrupted"
                ) {
                  errorSummary.push({
                    testTitle: `${suite.title} › ${spec.title}`,
                    message: result.error?.message?.split("\n")[0] ?? "Unknown error",
                  });
                }
              });
            });
          });
        });
    }

    const status: QARun["status"] = (summary.failed ?? 0) > 0 || (summary.flaky ?? 0) > 0 ? "failed" : "passed";

    return { summary, errorSummary, status };
  } catch (error: any) {
    console.error("Failed to parse Playwright JSON report:", error);
    return {
      status: "error",
      summary: { total: 0, passed: 0, failed: 0, skipped: 0, flaky: 0 },
      errorSummary: [
        {
          testTitle: "Report Parsing",
          message: `Could not read or parse JSON report at ${filePath}: ${error.message}`,
        },
      ],
    };
  }
}

export async function runStudioAcceptanceOnce({
  taskId,
  triggerSource = 'studioSelftest',
}: RunOptions): Promise<{ runId: string }> {
  const db = await getDb();
  let runId = "unknown";
  const startedAt = new Date();

  const effectiveTaskId = taskId ?? null;

  const runData: Omit<QARun, "id"> = {
    taskId: effectiveTaskId,
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
    taskId: effectiveTaskId,
  });

  const reportPath = path.resolve(process.cwd(), PLAYWRIGHT_ACCEPTANCE_JSON_REPORT_PATH);

  try {
    await removeOldReport();
    
    const { exitCode, stderr } = await runPlaywrightAcceptance(effectiveTaskId);
    
    // exitCode 1 means tests failed, which is not a system error.
    if (exitCode !== 0 && exitCode !== 1) {
        throw new Error(`Playwright process exited with code ${exitCode}. Stderr: ${stderr.slice(0, 500)}`);
    }

    const parsedResult = await parsePlaywrightJsonReport(reportPath);
    const finishedAt = new Date();

    await runRef.update({
      status: parsedResult.status,
      summary: parsedResult.summary,
      errorSummary: parsedResult.errorSummary,
      finishedAt: FieldValue.serverTimestamp(),
      durationMs: finishedAt.getTime() - startedAt.getTime(),
    });

    await logAdminAction({
      action: "playwright.acceptance.studio.finish",
      status: parsedResult.status,
      path: `qaRuns/${runId}`,
      taskId: effectiveTaskId,
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
      taskId: effectiveTaskId,
      errorMessage: e.message,
    });
    throw e;
  }

  return { runId };
}
