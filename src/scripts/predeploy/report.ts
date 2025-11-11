
import { promises as fs } from 'fs';
import path from 'path';

const reportDir = path.join(process.cwd(), 'public', 'predeploy', 'reports');

async function main() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportName = `report-${timestamp}.html`;
  const latestJsonPath = path.join(reportDir, 'index.json');
  const sourceHtmlPath = path.join(process.cwd(), 'playwright-report', 'index.html');
  const targetHtmlPath = path.join(reportDir, reportName);

  try {
    await fs.mkdir(reportDir, { recursive: true });
    
    // Copy the generated report to its new timestamped location
    await fs.copyFile(sourceHtmlPath, targetHtmlPath);
    console.log(`[report] Copied Playwright report to ${targetHtmlPath}`);

    // Update the index file
    const indexData = {
      latestUrl: `/predeploy/reports/${reportName}`,
      generatedAt: new Date().toISOString(),
    };
    await fs.writeFile(latestJsonPath, JSON.stringify(indexData, null, 2));
    console.log(`[report] Updated latest report index: ${latestJsonPath}`);

  } catch (err: any) {
    console.error('[report] Failed to process report:', err);
    // Create an index file indicating failure
    const errorIndexData = {
        latestUrl: null,
        error: `Failed to generate report: ${err.message}`,
        generatedAt: new Date().toISOString(),
    };
    try {
        await fs.writeFile(latestJsonPath, JSON.stringify(errorIndexData, null, 2));
    } catch (writeErr) {
        console.error('[report] Could not even write error index:', writeErr);
    }
    process.exit(1); // Exit with error code so CI can fail if needed
  }
}

main();
