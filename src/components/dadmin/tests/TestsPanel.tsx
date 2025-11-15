
'use client';
import { useEffect, useState, useCallback, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ExternalLink, AlertTriangle, Play, CheckCircle, XCircle, Clock, Bug } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { QARun, QARunTrigger } from '@/lib/qa/qa.types';
import { db } from '@/lib/firebase-client';
import { collection, query, orderBy, onSnapshot, limit, Timestamp } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Copy, FileJson } from 'lucide-react';

function JsonViewer({ data }: { data: any }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const prettyJson = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(prettyJson).then(() => {
      setCopied(true);
      toast({ title: "Copied!", description: "Log JSON copied to clipboard." });
      setTimeout(() => setCopied(false), 2000);
    }, () => {
      toast({ title: "Error", description: "Failed to copy.", variant: "destructive" });
    });
  };

  return (
    <div className="relative">
      <Button variant="outline" size="sm" onClick={handleCopy} className="absolute top-2 right-2 z-10">
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        <span className="ml-2">{copied ? 'Copied' : 'Copy JSON'}</span>
      </Button>
      <pre className="bg-slate-900 text-white text-xs p-4 rounded-lg overflow-auto max-h-[70vh]">
        <code>{prettyJson}</code>
      </pre>
    </div>
  );
}

function getTriggerLabel(trigger?: QARunTrigger, taskId?: string | null) {
    switch (trigger) {
        case 'studio': return `Auto for task ${taskId || 'Unknown'}`;
        case 'studioSelftest': return 'Manual Selftest';
        case 'studioDebug': return 'Manual Debug';
        case 'predeploySmoke': return 'Manual Smoke Test';
        case 'autoAcceptance': return `Auto for task ${taskId || 'Unknown'}`;
        default: return 'Unknown';
    }
}

function RunCard({ run }: { run: QARun }) {
    const getStatusInfo = (status: QARun['status']) => {
        switch (status) {
            case 'passed': return { color: 'text-green-600 bg-green-50 border-green-200', icon: <CheckCircle className="h-4 w-4" /> };
            case 'failed':
            case 'error':
            case 'timedout':
                return { color: 'text-red-600 bg-red-50 border-red-200', icon: <XCircle className="h-4 w-4" /> };
            case 'running': return { color: 'text-blue-600 bg-blue-50 border-blue-200', icon: <Loader2 className="h-4 w-4 animate-spin" /> };
            case 'queued': return { color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: <Clock className="h-4 w-4" /> };
            default: return { color: 'text-muted-foreground bg-slate-50 border-slate-200', icon: <AlertTriangle className="h-4 w-4" /> };
        }
    };
    
    const { color, icon } = getStatusInfo(run.status);
    const startedAt = run.startedAt ? (run.startedAt as unknown as Timestamp).toDate() : null;
    const finishedAt = run.finishedAt ? (run.finishedAt as unknown as Timestamp).toDate() : null;

    return (
      <Dialog>
        <DialogTrigger asChild>
            <div className="border rounded-lg p-4 space-y-3 hover:bg-slate-50 cursor-pointer transition-colors">
                <div className="flex justify-between items-start">
                    <span className={`font-semibold capitalize flex items-center gap-2 text-sm ${color}`}>{icon}{run.status}</span>
                    {startedAt && <span className="text-xs text-muted-foreground" title={startedAt.toLocaleString()}>{formatDistanceToNow(startedAt, { addSuffix: true })}</span>}
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                    <Badge variant="outline">{run.runType}</Badge>
                    <Badge variant="secondary" title="Task ID">
                      Task: {run.taskId ?? '—'}
                    </Badge>
                    <Badge variant="secondary" title={`Triggered by: ${run.triggeredBy}`}>
                        {getTriggerLabel(run.triggeredBy, run.taskId)}
                    </Badge>
                </div>
                {run.totals && (
                    <div className="text-xs text-muted-foreground flex gap-4 flex-wrap border-t pt-3 mt-3">
                        <span>Total: {run.totals.total}</span>
                        <span className="text-green-600">Passed: {run.totals.passed}</span>
                        <span className="text-red-600">Failed: {run.totals.failed}</span>
                        <span>Skipped: {run.totals.skipped}</span>
                    </div>
                )}
                 {run.errorMessage && (
                    <p className="text-xs text-red-500 font-mono bg-red-50 p-2 rounded-md line-clamp-2">{run.errorMessage}</p>
                )}
                 <div className="flex items-center gap-2 pt-2">
                    {run.artifactUrl && (
                        <Button variant="outline" size="sm" asChild onClick={(e) => e.stopPropagation()}>
                            <a href={run.artifactUrl} target="_blank" rel="noopener noreferrer">
                                View Report <ExternalLink className="h-4 w-4 ml-2" />
                            </a>
                        </Button>
                    )}
                    {run.commit && <Badge variant="secondary" className="font-mono text-xs">{run.commit.slice(0,7)}</Badge>}
                </div>
            </div>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Run Details: {run.id}</DialogTitle>
          </DialogHeader>
          <JsonViewer data={run} />
        </DialogContent>
      </Dialog>
    )
}

export default function TestsPanel() {
  const [runs, setRuns] = useState<QARun[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTaskId, setCurrentTaskId] = useState<string>('');
  
  const [isSmokePending, startSmokeTransition] = useTransition();
  const [isDebugPending, startDebugTransition] = useTransition();
  const [isStudioSelftestPending, startStudioSelftestTransition] = useTransition();


  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    if (!isClient) return;
    const q = query(collection(db, "qaRuns"), orderBy("startedAt", "desc"), limit(50));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const runsData: QARun[] = [];
        querySnapshot.forEach((doc) => {
            runsData.push({ id: doc.id, ...doc.data() } as QARun);
        });
        setRuns(runsData);
        setError(null);
    }, (err) => {
        console.error("Error fetching test runs:", err);
        setError("Failed to subscribe to test run updates. Check Firestore rules and network connection.");
    });
    return () => unsubscribe();
  }, [isClient]);

  const { toast } = useToast();

  const triggerSmokeTests = useCallback(async () => {
    startSmokeTransition(async () => {
      setError(null);
      console.info("[TestsPanel] Triggering pre-deploy smoke test...");
      
      try {
        const res = await fetch('/api/developer/tests/run', { method: 'POST' });
        const data = await res.json();
        
        if (!res.ok || !data.ok) {
          throw new Error(data.error || 'Failed to trigger run.');
        }

        toast({ title: 'Success', description: `Smoke test run queued (ID: ${data.runId}).` });
      } catch (e: any) {
        console.error("[TestsPanel] API call failed:", e);
        setError(e.message);
        toast({ title: 'Error Triggering Run', description: e.message, variant: 'destructive' });
      }
    });
  }, [toast]);
  
  const triggerDebugRun = useCallback(async () => {
    startDebugTransition(async () => {
      setError(null);
      console.info("[TestsPanel] Triggering debug acceptance run...");
      
      try {
        const res = await fetch('/api/developer/tests/debug-acceptance', { method: 'POST' });
        const data = await res.json();
        
        if (!res.ok || !data.ok) {
          throw new Error(data.error || 'Failed to trigger debug run.');
        }

        toast({ title: 'Success', description: `Debug run created (ID: ${data.runId}).` });
      } catch (e: any) {
        console.error("[TestsPanel] Debug API call failed:", e);
        setError(e.message);
        toast({ title: 'Error Triggering Debug Run', description: e.message, variant: 'destructive' });
      }
    });
  }, [toast]);

  const triggerStudioSelftest = useCallback(async () => {
    startStudioSelftestTransition(async () => {
      setError(null);
      console.info("[TestsPanel] Triggering Studio acceptance selftest...");

      try {
        const res = await fetch('/api/developer/tests/studio-acceptance-selftest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskId: currentTaskId.trim() || null }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.error || 'Failed to trigger selftest.');
        }
        toast({ title: 'Success', description: `Studio acceptance selftest queued.` });
      } catch (e: any) {
        console.error("[TestsPanel] Selftest API call failed:", e);
        setError(e.message);
        toast({ title: 'Error Triggering Selftest', description: e.message, variant: 'destructive' });
      }
    });
  }, [toast, currentTaskId]);

  if (!isClient) {
      return <div className="p-8 text-center text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>;
  }
  
  const isPending = isSmokePending || isDebugPending || isStudioSelftestPending;
  const isProd = process.env.NODE_ENV === 'production';

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg border bg-card">
        <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-1">
                <h3 className="text-lg font-semibold">Playwright Test Runs</h3>
                <p className="text-sm text-muted-foreground">
                    Manually trigger smoke tests or view results from automated acceptance runs.
                </p>
            </div>
            <div className="flex gap-2 flex-wrap items-end">
                <div className="grid gap-1.5">
                    <Label htmlFor="task-id-input" className="text-xs">Current Task ID (optional)</Label>
                    <Input
                        id="task-id-input"
                        placeholder="e.g. DGF-408"
                        value={currentTaskId}
                        onChange={(e) => setCurrentTaskId(e.target.value)}
                        className="h-9"
                    />
                </div>
                <Button onClick={triggerStudioSelftest} disabled={isPending}>
                    {isStudioSelftestPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Running...</> : <><Play className="mr-2 h-4 w-4" />Run Studio Acceptance Selftest</>}
                </Button>
            </div>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Action Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Recent Runs</h2>
        {runs.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {runs.map(run => <RunCard key={run.id} run={run} />)}
            </div>
        ) : (
            <div className="border-2 border-dashed rounded-lg p-12 text-center text-muted-foreground">
                <p className="font-medium">No test runs found.</p>
                <p className="text-sm mt-2">Trigger a run or push a commit to see results here.</p>
            </div>
        )}
      </div>
    </div>
  );
}
