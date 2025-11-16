

'use client';
import { useEffect, useState } from 'react';
import { Loader2, ExternalLink, AlertTriangle, Play, CheckCircle, XCircle, Clock, FileJson } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { QARun } from '@/lib/qa/qa.types';
import { db } from '@/lib/firebase-client';
import { collection, query, orderBy, onSnapshot, limit, Timestamp } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { JsonViewer } from './JsonViewer';

function getTriggerLabel(trigger?: QARun['triggeredBy'], taskId?: string | null) {
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
            case 'passed': return { icon: <CheckCircle className="h-4 w-4" />, color: 'text-green-700 bg-green-50 border-green-200' };
            case 'failed':
            case 'error':
            case 'timedout':
                return { icon: <XCircle className="h-4 w-4" />, color: 'text-red-700 bg-red-50 border-red-200' };
            case 'running': return { icon: <Loader2 className="h-4 w-4 animate-spin" />, color: 'text-blue-700 bg-blue-50 border-blue-200' };
            case 'queued': return { icon: <Clock className="h-4 w-4" />, color: 'text-yellow-700 bg-yellow-50 border-yellow-200' };
            default: return { icon: <AlertTriangle className="h-4 w-4" />, color: 'text-muted-foreground bg-slate-50 border-slate-200' };
        }
    };
    
    const { color, icon } = getStatusInfo(run.status);
    const startedAt = run.startedAt ? (run.startedAt as unknown as Timestamp).toDate() : null;

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
                    <div className="text-xs text-muted-foreground grid grid-cols-2 sm:grid-cols-3 md:flex gap-x-4 gap-y-1 flex-wrap border-t pt-3 mt-3">
                        <span>Total: <strong>{run.totals.total}</strong></span>
                        <span className="text-green-600">Passed: <strong>{run.totals.passed}</strong></span>
                        <span className="text-red-600">Failed: <strong>{run.totals.failed}</strong></span>
                        <span>Skipped: <strong>{run.totals.skipped}</strong></span>
                        {typeof run.durationMs === 'number' && <span>Duration: <strong>{(run.durationMs/1000).toFixed(2)}s</strong></span>}
                    </div>
                )}
                 {run.errorMessage && (
                    <p className="text-xs text-red-600 font-mono bg-red-50 p-2 rounded-md line-clamp-2">{run.errorMessage}</p>
                )}
                 <div className="flex items-center gap-2 pt-2">
                    {run.artifactUrl && (
                        <Button variant="outline" size="sm" asChild onClick={(e) => e.stopPropagation()}>
                            <a href={run.artifactUrl} target="_blank" rel="noopener noreferrer">
                                View Report <ExternalLink className="h-4 w-4 ml-2" />
                            </a>
                        </Button>
                    )}
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                            <FileJson className="h-4 w-4 mr-2" /> View JSON
                        </Button>
                    </DialogTrigger>
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
  
  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    if (!isClient) return;
    
    let unsubscribe: any;
    try {
        const q = query(collection(db, "qaRuns"), orderBy("startedAt", "desc"), limit(50));
        unsubscribe = onSnapshot(q, (querySnapshot) => {
            const runsData: QARun[] = [];
            querySnapshot.forEach((doc) => {
                runsData.push({ id: doc.id, ...doc.data() } as QARun);
            });
            setRuns(runsData);
            setError(null);
        }, (err: any) => {
            console.error("Error fetching test runs:", err);
            const friendlyError = err.message.includes('requires an index') 
                ? "Firestore requires an index for the QA runs query. Create a composite index for qaRuns (runType asc, taskId asc, startedAt desc) and redeploy." 
                : "Failed to subscribe to test run updates. Check Firestore rules and network connection.";
            setError(friendlyError);
        });
    } catch(err: any) {
        console.error('[TestsPanel] Failed to init Firestore subscription', err);
        setError('Failed to subscribe to test run updates. Check Firestore indexes and rules.');
    }

    return () => {
        if (unsubscribe && typeof unsubscribe === 'function') {
            try { unsubscribe(); } catch (err) { console.error('[TestsPanel] Error during unsubscribe', err); }
        }
    };
  }, [isClient]);

  if (!isClient) {
      return <div className="p-8 text-center text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>;
  }
  
  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Subscription Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {runs.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {runs.map(run => <RunCard key={run.id} run={run} />)}
            </div>
        ) : !error && (
            <div className="border-2 border-dashed rounded-lg p-12 text-center text-muted-foreground">
                <p className="font-medium">No test runs found.</p>
                <p className="text-sm mt-2">Trigger a run or push a commit to see results here.</p>
            </div>
        )}
      </div>
    </div>
  );
}
