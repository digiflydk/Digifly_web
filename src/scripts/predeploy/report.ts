
import { promises as fs } from 'fs';
import path from 'path';

const reportDir = path.join(process.cwd(), 'public', 'dev', 'reports');

async function readJson(file: string) {
  try {
    const content = await fs.readFile(path.join(reportDir, file), 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

async function main() {
  const guards = await readJson('guards.json') ?? [];
  const typecheck = await readJson('typecheck.json') ?? { ok: false, error: "Typecheck did not run." };
  const schema = await readJson('schema.json') ?? { ok: false, error: "Schema validation did not run." };

  const guardChecks = guards.map((g: any) => ({
    name: g.name,
    status: g.ok ? 'ok' : 'fail',
    details: g.details ? `${g.details} (${g.file})` : 'Passed',
    docsUrl: g.docsUrl,
  }));

  const overallStatus = 
      guardChecks.some((c:any) => c.status === 'fail') || !typecheck.ok || !schema.ok 
          ? 'fail' 
          : 'ok';

  const report = {
    status: overallStatus,
    generatedAt: new Date().toISOString(),
    checks: [
      ...guardChecks,
      { name: "Type Safety (tsc)", status: typecheck.ok ? 'ok' : 'fail', details: typecheck.ok ? "Passed" : "TypeScript errors found. See build logs." },
      { name: "Schema & Defaults", status: schema.ok ? 'ok' : 'fail', details: schema.ok ? "Passed" : schema.error || "Schema validation failed." },
    ],
  };

  const finalReportPath = path.join(reportDir, 'predeploy.json');
  await fs.writeFile(finalReportPath, JSON.stringify(report, null, 2));

  console.log(`[report] Pre-deploy report generated at ${finalReportPath}`);
  
  if (overallStatus === 'fail') {
    console.error('[report] One or more pre-deploy checks failed.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[report] Failed to generate report:', err);
  process.exit(1);
});
