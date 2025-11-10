
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { Loader2, ExternalLink, CheckCircle, XCircle, AlertCircle, SkipForward } from 'lucide-react';

type Summary = {
  status: 'passed' | 'failed' | 'timedout';
  stats: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    duration: number;
  };
};

function getStatus(summary?: Summary | null) {
  if (!summary) return 'unknown';
  if (summary.status === 'failed' || summary.status === 'timedout') return 'failed';
  if (summary.stats.passed === summary.stats.total) return 'passed';
  return 'passed';
}

function StatusBadge({ status }: { status: 'passed' | 'failed' | 'unknown' }) {
    if (status === 'passed') return <Badge variant="default" className="bg-green-600 hover:bg-green-700"><CheckCircle className="h-4 w-4 mr-2" /> Passed</Badge>;
    if (status === 'failed') return <Badge variant="destructive"><XCircle className="h-4 w-4 mr-2" /> Failed</Badge>;
    return <Badge variant="secondary">Unknown</Badge>
}

function EmptyState() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>No report found</CardTitle>
        <CardDescription>
          The UI expects a Playwright HTML report at <code>/public/__reports/playwright/latest/</code>. It’s created automatically during the build process.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">If you're running locally and want to see a report, use the script below:</p>
        <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-xs overflow-x-auto">
          <code>
            npm run test:e2e:report
          </code>
        </pre>
        <p className="text-sm text-muted-foreground">
          This page does not depend on Firestore permissions.
        </p>
      </CardContent>
    </Card>
  );
}


export function PlaywrightReportCard({ hasSummary }: { hasSummary: boolean }) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!hasSummary) {
        setIsLoading(false);
        return;
    }
    fetch('/__reports/playwright/latest/summary.json')
      .then(res => res.ok ? res.json() : null)
      .then(data => setSummary(data))
      .catch(() => setSummary(null))
      .finally(() => setIsLoading(false));
  }, [hasSummary]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return <EmptyState />;
  }
  
  const status = getStatus(summary);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>Latest Test Run</CardTitle>
                <CardDescription>
                    Duration: {(summary.stats.duration / 1000).toFixed(2)}s
                </CardDescription>
            </div>
            <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-2xl font-bold">{summary.stats.total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-700">{summary.stats.passed}</p>
            <p className="text-xs text-green-600">Passed</p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-700">{summary.stats.failed}</p>
            <p className="text-xs text-red-600">Failed</p>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-2xl font-bold">{summary.stats.skipped}</p>
            <p className="text-xs text-muted-foreground">Skipped</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild>
            <Link href="/__reports/playwright/latest/index.html" target="_blank" rel="noopener noreferrer">
                View full report
                <ExternalLink className="h-4 w-4 ml-2" />
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
