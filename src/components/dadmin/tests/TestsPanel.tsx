
'use client';
import { useEffect, useState, useCallback } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import type { QARun } from '@/lib/qa/qa.types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function getBadgeVariant(status: string) {
    if (status === 'passed') return 'default';
    if (status === 'failed' || status === 'error') return 'destructive';
    return 'secondary';
}

export default function TestsPanel() {
  const [runs, setRuns] = useState<{id:string; data:QARun}[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  const { toast } = useToast();
  useEffect(() => {
    if (!isClient) return;
    
    const q = query(collection(db, 'qa_runs'), orderBy('startedAt', 'desc'), limit(10));
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
    toast({ title: 'Test run requested', description: 'The Playwright test suite is starting...' });
    try {
      const res = await fetch('/api/tests/run', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to start test run.');
      }
    } catch (e: any) {
      console.error(e);
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
      // isRunning will be reset by the Firestore listener if the run fails to start
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
          <p className="text-sm text-slate-500">
            Runs are executed in the Studio environment.
          </p>
        </div>
        <Button
          onClick={trigger}
          disabled={isRunning}
        >
          {isRunning ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Running…</> : 'Run tests now'}
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Started</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Totals</TableHead>
              <TableHead>Report</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {runs.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-slate-500">No test runs found.</TableCell>
                </TableRow>
            )}
            {runs.map(({id, data}) => (
              <TableRow key={id}>
                <TableCell className="py-2.5">
                    {data.startedAt?.toDate().toLocaleString() ?? '—'}
                </TableCell>
                <TableCell>
                    {data.durationMs ? `${(data.durationMs / 1000).toFixed(2)}s` : '—'}
                </TableCell>
                <TableCell className="capitalize">
                    <Badge variant={getBadgeVariant(data.status)}>{data.status}</Badge>
                </TableCell>
                <TableCell>
                  {data.totals
                    ? <span className="text-sm">
                        <span className="text-green-600">{data.totals.passed} passed</span>,{' '}
                        <span className={data.totals.failed > 0 ? 'text-red-600' : ''}>{data.totals.failed} failed</span>
                      </span>
                    : data.status === 'running' || data.status === 'queued' ? <span className="text-xs text-slate-500">In progress...</span> : '—'}
                </TableCell>
                <td>
                  {data.reportUrl
                    ? <a className="underline text-primary text-sm inline-flex items-center" href={data.reportUrl} target="_blank" rel="noreferrer">View report <ExternalLink className="ml-1 h-3 w-3" /></a>
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
