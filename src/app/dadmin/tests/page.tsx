
import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

export const runtime = "nodejs";

export default async function PlaywrightPage() {
  // purely file-system based; no Firestore calls here
  const reportDir = path.join(process.cwd(), "public", "playwright-report");
  const hasReport = fs.existsSync(path.join(reportDir, "index.html"));

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
            <button className={buttonVariants({ variant: "secondary" })} disabled>
              No report found
            </button>
          )}
          <p className="text-sm text-muted-foreground">
            This page does not depend on Firestore permissions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
