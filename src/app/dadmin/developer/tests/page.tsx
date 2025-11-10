
export const runtime = "nodejs"; // allow fs in server component

import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

export default async function PlaywrightPage() {
  const reportIndex = path.join(process.cwd(), "public", "playwright-report", "index.html");
  const hasReport = fs.existsSync(reportIndex);

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Playwright Tests</h1>

      <Card>
        <CardHeader>
          <CardTitle>Latest report</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          {hasReport ? (
            <Link href="/playwright-report/" className={buttonVariants()}>
              Open latest report
            </Link>
          ) : (
            <button
              className={buttonVariants({ variant: "secondary" })}
              disabled
              title="No report found in /public/playwright-report/"
            >
              No report found
            </button>
          )}
          <p className="text-sm text-muted-foreground">
            This page does not run tests; it links to generated reports if they exist.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
