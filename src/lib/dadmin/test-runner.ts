
"use server";
import "server-only";

import { getDb } from "@/lib/firebase-admin";
import { logAdminAction } from "./audit";
import type { QARun } from "../qa/qa.types";
import { FieldValue } from "firebase-admin/firestore";
import fs from "fs/promises";
import path from "path";
import { PLAYWRIGHT_ACCEPTANCE_JSON_REPORT_PATH } from "./playwright-constants";
import { test, expect } from '@playwright/test';
// DGF-398: Import the runner from Playwright's internal API.
import { runTests } from '@playwright/test/lib/runner';

type RunOptions = {
  taskId: string | null;
  triggerSource: "studio" | "studioDebug";
};

// Simplified JSON report structure from Playwright
type PlaywrightJsonReport = {
  stats: {
    total: number;
    expected: number;
    unexpected: number;
    flaky: number;
    skipped: number;
    duration: number;
  };
  suites: {
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
};

async function parsePlaywrightJsonReport(
  filePath: string
): Promise<{ summary: QARun["summary"]; errorSummary: QARun["errorSummary"]; status: QARun["status"] }> {
  let reportContent: string;
  try {
    reportContent = await fs.readFile(filePath, "utf-8");
  } catch (error) {
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

    const summary = {
      total: report.stats.total,
      passed: report.stats.expected,
      failed: report.stats.unexpected,
      flaky: report.stats.flaky,
      skipped: report.stats.skipped,
    };

    const errorSummary: QARun["errorSummary"] = [];
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
                message: result.error?.message.split("\n")[0] ?? "Unknown error",
              });
            }
          });
        });
      });
    });

    const status: QARun["status"] =
      summary.failed > 0 || summary.flaky > 0 ? "failed" : "passed";

    return { summary, errorSummary, status };
  } catch (error: any) {
    console.error("Failed to parse Playwright JSON report:", error);
    return {
      status: "error",
      summary: { total: 0, passed: 0, failed: 0, skipped: 0, flaky: 0 },
      errorSummary: [
        {
          testTitle: "Report Parsing",
          message: `Could not parse JSON report at ${filePath}: ${error.message}`,
        },
      ],
    };
  }
}

export async function runStudioAcceptanceOnce({
  taskId,
  triggerSource,
}: RunOptions): Promise<{ runId: string }> {
  const db = await getDb();
  let runId = "unknown";
  const startedAt = new Date();

  const runData: Omit<QARun, "id"> = {
    taskId,
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
    runId,
    taskId,
  });

  const reportPath = path.join(process.cwd(), PLAYWRIGHT_ACCEPTANCE_JSON_REPORT_PATH);

  try {
    await fs.rm(reportPath, { force: true });
    
    // DGF-398 / 2: Use Playwright's programmatic API instead of exec
    const result = await runTests({
      projects: ['acceptance'],
      reporter: 'json,line' // Keep line for debugging, json is used by parser
    }, {});
    
    // Playwright's programmatic runner result has a 'status' of 'passed' or 'failed'
    if (result.status !== 'passed' && result.status !== 'failed') {
        throw new Error(`Playwright run exited with unexpected status: ${result.status}`);
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
      runId,
      taskId,
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
      runId,
      taskId,
      errorMessage: e.message,
    });
    throw e;
  }

  return { runId };
}
