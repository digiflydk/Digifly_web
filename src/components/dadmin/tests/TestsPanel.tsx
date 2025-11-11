
'use client';
import { useEffect, useState, useCallback } from 'react';
import type { QARun } from '@/lib/qa/qa.types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, ExternalLink, AlertTriangle, CheckCircle, XCircle, ChevronRight, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ButtonLink from '@/components/common/ButtonLink';

function getBadgeVariant(status: string) {
    if (status === 'passed' || status === 'ok') return 'default';
    if (status === 'failed' || status === 'error') return 'destructive';
    return 'secondary';
}

async function safeJson(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`HTTP ${res.status} — ${text.slice(0, 150)}`);
  }
}

function PredeployReport({ report }: { report: any }) {
    if (!report || !report.checks) return null;

    const getStatusIcon = (status: 'ok' | 'warn' | 'fail') => {
        if (status === 'ok') return <CheckCircle className="h-4 w-4 text-green-500" />;
        if (status === 'fail') return <XCircle className="h-4 w-4 text-red-500" />;
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    };
    
    return (
        <div className="border rounded-lg mt-6">
            <div className="p-4 border-b">
                <h3 className="font-semibold">Pre-deploy Check Report</h3>
                <p className="text-xs text-muted-foreground">
                    Status as of: {report.generatedAt ? new Date(report.generatedAt).toLocaleString() : 'N/A'}
                </p>
            </div>
            <ul className="divide-y">
                {report.checks.map((check: any) => (
                    <li key={check.name} className="p-4 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                {getStatusIcon(check.status)}
                                <span className="font-medium">{check.name}</span>
                            </div>
                            {check.status !== 'ok' && (
                                <p className="text-xs text-red-600 mt-1 pl-6">{check.details}</p>
                            )}
                        </div>
                        {check.docsUrl && (
                            <Button variant="ghost" size="sm" asChild>
                                <a href={check.docsUrl} target="_blank" rel="noopener noreferrer">
                                    <HelpCircle className="h-4 w-4" />
                                </a>
                            </Button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function TestsPanel() {
  const [runs, setRuns] = useState<{id:string; data:QARun}[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRunResult, setLastRunResult] = useState<any>(null);
  const [predeployReport, setPredeployReport] = useState<any>(null);

  useEffect(() => setIsClient(true), []);

  const fetchPredeployReport = useCallback(async () => {
    try {
      const res = await fetch('/dev/reports/predeploy.json', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setPredeployReport(data);
      } else {
        setPredeployReport(null);
      }
    } catch {
      setPredeployReport(null);
    }
  }, []);

  useEffect(() => {
    fetchPredeployReport();
  }, [fetchPredeployReport]);

  const { toast } = useToast();

  const trigger = useCallback(async (isPredeploy = false) => {
    setIsRunning(true);
    setError(null);
    setLastRunResult(null);

    const url = isPredeploy ? '/api/dev/predeploy' : '/api/developer/tests/run';
    const toastTitle = isPredeploy ? 'Pre-deploy checks started' : 'Test run requested';
    const toastDesc = isPredeploy ? 'Validating project health...' : 'The Playwright test suite is starting...';

    toast({ title: toastTitle, description: toastDesc });
    
    try {
      const res = await fetch(url, { method: 'POST' });
      const data = await safeJson(res);

      if (!res.ok) {
        throw new Error(data.error?.message || `Request failed with status ${res.status}`);
      }
      
      if (isPredeploy) {
        setPredeployReport(data.report);
        toast({ title: 'Success', description: 'Pre-deploy checks completed.'});
      } else {
        setLastRunResult(data);
        toast({ title: 'Success', description: 'Playwright run completed.'});
      }

    } catch (e: any) {
      console.error(e);
      setError(e.message);
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setIsRunning(false);
    }
  }, [toast]);

  if (!isClient) {
      return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Build & Test Tools</h1>
           <p className="text-sm text-muted-foreground">
             Run pre-deploy checks and UI tests.
           </p>
        </div>
        <div className="flex gap-2">
            <Button
              onClick={() => trigger(true)}
              disabled={isRunning}
              variant="outline"
            >
              {isRunning ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Running…</> : 'Run Pre-deploy Checks'}
            </Button>
            <Button
              onClick={() => trigger(false)}
              disabled={isRunning}
            >
              {isRunning ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Running…</> : 'Run Playwright Tests'}
            </Button>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Run Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {lastRunResult && (
        <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Playwright Run Completed</AlertTitle>
            <AlertDescription>
                Passed: {lastRunResult.summary.passed}, Failed: {lastRunResult.summary.failed}
                {lastRunResult?.artifacts?.htmlReportUrl ? (
                    <ButtonLink href={lastRunResult.artifacts.htmlReportUrl} target="_blank" rel="noreferrer" variant="link" className="p-0 h-auto ml-4">
                        View Report
                    </ButtonLink>
                ) : null}
            </AlertDescription>
        </Alert>
      )}

      {predeployReport ? <PredeployReport report={predeployReport} /> : (
          <div className="border rounded-lg p-6 text-center text-muted-foreground">
              No pre-deploy report found. Run checks to generate one.
          </div>
      )}
    </div>
  );
}
