
"use server";
import 'server-only';

import { getDb } from "@/lib/firebase-admin";
import { logAdminAction } from "./audit";
import { QARun } from "../qa/qa.types";
import { FieldValue } from "firebase-admin/firestore";
import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";

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

async function parsePlaywrightJsonReport(filePath: string): Promise<Pick<QARun, 'summary' | 'errorSummary' | 'status'>> {
    try {
        const reportContent = await fs.readFile(filePath, 'utf-8');
        const report: PlaywrightJsonReport = JSON.parse(reportContent);

        const summary = {
            total: report.stats.total,
            passed: report.stats.expected,
            failed: report.stats.unexpected,
            flaky: report.stats.flaky,
            skipped: report.stats.skipped,
        };

        const errorSummary: QARun['errorSummary'] = [];
        report.suites.forEach(suite => {
            suite.specs.forEach(spec => {
                spec.tests.forEach(test => {
                    test.results.forEach(result => {
                        if (result.status === 'failed' || result.status === 'timedOut') {
                            errorSummary.push({
                                testTitle: `${suite.title} › ${spec.title}`,
                                message: result.error?.message.split('\n')[0] ?? "Unknown error",
                            });
                        }
                    });
                });
            });
        });

        const status: QARun['status'] = (summary.failed > 0 || summary.flaky > 0) ? 'failed' : 'passed';
        
        return { summary, errorSummary, status };

    } catch (error) {
        console.error("Failed to parse Playwright JSON report:", error);
        return {
            status: 'error',
            summary: { total: 0, passed: 0, failed: 0, skipped: 0, flaky: 0 },
            errorSummary: [{ testTitle: 'Report Parsing', message: 'Could not parse JSON report.' }],
        };
    }
}

export async function runStudioAcceptanceOnce({ taskId, triggerSource }: RunOptions): Promise<{ runId: string }> {
    const db = await getDb();
    let runId = 'unknown';

    const runData: Omit<QARun, 'id'> = {
        taskId,
        runType: 'acceptance',
        environment: 'test',
        triggeredBy: triggerSource,
        status: 'running',
        startedAt: FieldValue.serverTimestamp() as any,
    };

    const runRef = await db.collection('qaRuns').add(runData);
    runId = runRef.id;

    await logAdminAction({
        action: 'playwright.acceptance.studio.start',
        status: 'ok',
        runId,
        taskId,
    });

    try {
        const reportPath = `playwright-report/acceptance-results-${runId}.json`;
        
        const command = `npm run test:pw:acceptance -- --reporter=json > ${reportPath}`;
        
        await new Promise<void>((resolve, reject) => {
            exec(command, { 
                env: { 
                    ...process.env, 
                    PLAYWRIGHT_BASE_URL: process.env.E2E_BASE_URL
                } 
            }, (error, stdout, stderr) => {
                if (error && error.code !== 0) {
                    console.warn(`Playwright exited with code ${error.code}. This is expected for failed tests.`);
                }
                if (stderr) {
                    console.error('Playwright stderr:', stderr);
                }
                resolve();
            });
        });

        const result = await parsePlaywrightJsonReport(path.join(process.cwd(), reportPath));

        await runRef.update({
            status: result.status,
            summary: result.summary,
            errorSummary: result.errorSummary,
            finishedAt: FieldValue.serverTimestamp(),
        });

        await logAdminAction({
            action: 'playwright.acceptance.studio.finish',
            status: result.status,
            runId,
            taskId,
            payloadSummary: `Result: ${result.summary?.passed}/${result.summary?.total} passed.`,
        });

    } catch (e: any) {
        console.error(`[runStudioAcceptanceOnce] Error for runId ${runId}:`, e);
        await runRef.update({ status: 'error', finishedAt: FieldValue.serverTimestamp() });
        await logAdminAction({
            action: 'playwright.acceptance.studio.error',
            status: 'error',
            runId,
            taskId,
            errorMessage: e.message,
        });
        throw e; // Re-throw to be caught by the API route
    }

    return { runId };
}
