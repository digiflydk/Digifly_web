
'use client';
import { useEffect, useState, useCallback } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import type { QARun } from '@/lib/qa/qa.types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, ExternalLink, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function getBadgeVariant(status: string) {
    if (status === 'passed') return 'default';
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

export default function TestsPanel() {
  const [runs, setRuns] = useState<{id:string; data:QARun}[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRunResult, setLastRunResult] = useState<any>(null);

  useEffect(() => setIsClient(true), []);

  const { toast } = useToast();
  useEffect(() => {
    if (!isClient) return;
    
    const q = query(collection(db, 'qa_runs'), orderBy('startedAt', 'desc'), limit(50));
    const unsub = onSnapshot(q, snap => {
      const items = snap.docs.map(d => ({ id: d.id, data: d.data() as QARun }));
      setRuns(items);
      const isAnyRunning = items.some(r => r.data.status === 'queued' || r.data.status === 'running');
      setIsRunning(isAnyRunning);
    }, (error) => {
        console.error("Firestore snapshot error:", error);
        toast({ title: 'Error', description: 'Could not connect to test results.', variant: 'destructive' });
    });
    return () => unsub();
  }, [toast, isClient]);

  const trigger = useCallback(async () => {
    setIsRunning(true);
    setError(null);
    setLastRunResult(null);
    toast({ title: 'Test run requested', description: 'The Playwright test suite is starting...' });
    try {
      const res = await fetch('/api/developer/tests/run', { method: 'POST' });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status} — ${txt}`);
      }
      
      const data = await safeJson(res);
      
      if (!data.ok) {
        throw new Error(data.error || 'Failed to start test run.');
      }
      setLastRunResult(data);
      toast({ title: 'Success', description: 'Playwright run completed.'});
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
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Playwright Tests</h1>
           <p className="text-sm text-muted-foreground">
             Trigger and view automated UI test runs.
           </p>
        </div>
        <Button
          onClick={trigger}
          disabled={isRunning}
        >
          {isRunning ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Running…</> : 'Run tests now'}
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Could not start test run</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {lastRunResult && (
        <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Run Completed</AlertTitle>
            <AlertDescription>
                Passed: {lastRunResult.summary.passed}, Failed: {lastRunResult.summary.failed}
                <a href={lastRunResult.artifacts.htmlReportUrl} target="_blank" rel="noreferrer" className="underline ml-4">View Report</a>
            </AlertDescription>
        </Alert>
      )}

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Run</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Passed</TableHead>
              <TableHead>Failed</TableHead>
              <TableHead>Report</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {runs.length === 0 && !isRunning && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24 text-slate-500">No Playwright runs found yet.</TableCell>
                </TableRow>
            )}
            {runs.map(({id, data}) => (
              <TableRow key={id}>
                <TableCell className="py-2.5">
                    <div className="font-medium">{new Date(data.startedAt?.toDate() ?? 0).toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{data.commit?.slice(0,7) ?? '—'}</div>
                </TableCell>
                <TableCell className="capitalize">
                    <Badge variant={getBadgeVariant(data.status)}>{data.status}</Badge>
                </TableCell>
                <TableCell>
                    {data.durationMs ? `${(data.durationMs / 1000).toFixed(2)}s` : '—'}
                </TableCell>
                <TableCell className="text-green-600">{data.totals?.passed ?? '—'}</TableCell>
                <TableCell className={data.totals?.failed ?? 0 > 0 ? 'text-red-600' : ''}>{data.totals?.failed ?? '—'}</TableCell>
                <td>
                  {data.reportUrl
                    ? <Button asChild variant="outline" size="sm"><a href={data.reportUrl} target="_blank" rel="noreferrer">Open report <ExternalLink className="ml-2 h-3 w-3" /></a></Button>
                    : '—'}
                </td>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
