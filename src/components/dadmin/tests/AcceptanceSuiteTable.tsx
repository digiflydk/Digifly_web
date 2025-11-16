
"use client";

import * as React from "react";
import { useAcceptanceRuns } from "@/lib/dadmin/tests/use-acceptance-runs";
import type { AcceptanceSuite } from "@/lib/dadmin/tests/acceptance-config";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileJson, Play, Loader2, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { JsonViewer } from "./JsonViewer"; // Assuming JsonViewer is extracted
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Status = 'passed' | 'failed' | 'running' | 'queued' | 'not_executed' | 'error' | 'timedout';

function getStatusInfo(status: Status) {
    switch (status) {
        case 'passed': return { text: 'Passed', color: 'text-green-600 bg-green-50 border-green-200', icon: <CheckCircle className="h-4 w-4" /> };
        case 'failed':
        case 'error':
        case 'timedout':
            return { text: 'Failed', color: 'text-red-600 bg-red-50 border-red-200', icon: <XCircle className="h-4 w-4" /> };
        case 'running': return { text: 'Running', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: <Loader2 className="h-4 w-4 animate-spin" /> };
        case 'queued': return { text: 'Queued', color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: <Clock className="h-4 w-4" /> };
        default: return { text: 'Not Executed', color: 'text-slate-500 bg-slate-100 border-slate-200', icon: null };
    }
}

function SuiteRow({ suite }: { suite: AcceptanceSuite }) {
  const { runs, error } = useAcceptanceRuns([suite.taskId]);
  const [isTriggering, setIsTriggering] = React.useState(false);
  const { toast } = useToast();

  const runState = runs[suite.taskId];
  const lastRun = runState?.lastRun;
  const status = runState?.loading ? 'running' : lastRun?.status ?? 'not_executed';
  const { color, icon, text } = getStatusInfo(status);

  const handleRun = async () => {
    setIsTriggering(true);
    try {
      const res = await fetch('/api/developer/tests/studio-acceptance-selftest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: suite.taskId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to trigger run.");
      toast({ title: 'Success', description: `${suite.title} run has been queued.` });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setIsTriggering(false);
    }
  };

  return (
    <TableRow>
      <TableCell>
        <div className="font-medium">{suite.title}</div>
        <div className="text-xs text-muted-foreground">{suite.description}</div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={color}>{icon && <span className="mr-1.5">{icon}</span>}{text}</Badge>
      </TableCell>
      <TableCell className="text-muted-foreground text-xs">
        {lastRun?.startedAt ? formatDistanceToNow(new Date(lastRun.startedAt.seconds * 1000), { addSuffix: true }) : '—'}
      </TableCell>
      <TableCell className="text-muted-foreground text-xs">
        {typeof lastRun?.durationMs === 'number' ? `${(lastRun.durationMs / 1000).toFixed(1)}s` : '—'}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          {lastRun && (
             <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="sm"><FileJson className="h-4 w-4 mr-2" /> View JSON</Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader><DialogTitle>Run Details</DialogTitle></DialogHeader>
                  <JsonViewer data={lastRun} />
                </DialogContent>
            </Dialog>
          )}
          <Button onClick={handleRun} disabled={isTriggering} size="sm">
            {isTriggering ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
            Run
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function AcceptanceSuiteTable({ suites }: { suites: AcceptanceSuite[] }) {
  const { error } = useAcceptanceRuns(suites.map(s => s.taskId));

  if (!suites.length) return null;

  return (
    <div>
        <h2 className="text-lg font-semibold mb-2">Acceptance Suites</h2>
        {error && (
            <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Firestore Error</AlertTitle>
                <AlertDescription>
                    Could not load acceptance test results. Check Firestore indexes and console for details. <br/>
                    <code className="text-xs mt-2 block bg-red-900/10 p-2 rounded">{error}</code>
                </AlertDescription>
            </Alert>
        )}
        <div className="border rounded-lg">
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead className="w-1/2">Suite</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Actions</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {suites.map(suite => <SuiteRow key={suite.id} suite={suite} />)}
            </TableBody>
        </Table>
        </div>
    </div>
  );
}
