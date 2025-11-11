
import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function runScript(command: string): Promise<{ stdout: string, stderr: string, code: number | null }> {
  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      resolve({
        stdout,
        stderr,
        code: error ? error.code ?? 1 : 0,
      });
    });
  });
}

export async function POST() {
  try {
    // Run the main predeploy script
    const { code, stderr } = await runScript('npm run predeploy');

    // Regardless of outcome, try to read the report file
    const reportPath = path.join(process.cwd(), 'public', 'dev', 'reports', 'predeploy.json');
    let report = null;
    try {
      const reportContent = await fs.readFile(reportPath, 'utf-8');
      report = JSON.parse(reportContent);
    } catch (readError) {
      // If report doesn't exist, it's fine, the error from the script is the main thing
      console.warn(`[predeploy API] Could not read report file: ${readError}`);
    }

    if (code !== 0) {
      // The script failed, which is an expected outcome for the check
      // Return 200 OK but with the report indicating failure
      return NextResponse.json({ 
        ok: true, 
        message: 'Pre-deploy checks completed with errors.',
        report: report ?? { error: 'Script failed and report could not be read.', details: stderr }
      });
    }

    // Success case
    return NextResponse.json({ 
      ok: true, 
      message: 'All pre-deploy checks passed.',
      report 
    });

  } catch (err: any) {
    console.error('[API /dev/predeploy] uncaught error:', err);
    return NextResponse.json({
      ok: false,
      error: { code: 'PREDEPLOY_RUN_FAILED', message: err?.message ?? 'An unknown error occurred during pre-deploy checks.' },
    }, { status: 500 });
  }
}
