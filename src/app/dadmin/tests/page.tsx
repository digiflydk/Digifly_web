// src/app/dadmin/tests/page.tsx
import fs from "node:fs";
import path from "node:path";
import { PlaywrightReportCard } from "@/components/dadmin/tests/PlaywrightReportCard";

export const runtime = "nodejs";

export default async function PlaywrightPage() {
  // Check for summary on the server to pass its existence to the client.
  // This avoids a 404 flash for the summary.json fetch on the client.
  const summaryPath = path.join(process.cwd(), "public", "__reports", "playwright", "latest", "summary.json");
  const hasSummary = fs.existsSync(summaryPath);

  return (
    <div className="max-w-4xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Playwright Tests</h1>
        <p className="text-sm text-muted-foreground">
          A summary of the latest end-to-end test run, generated during the last build.
        </p>
      </div>
      <PlaywrightReportCard hasSummary={hasSummary} />
    </div>
  );
}
