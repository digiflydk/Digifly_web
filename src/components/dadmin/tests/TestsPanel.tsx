'use client';
import { useEffect, useState, useCallback, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink, AlertTriangle, Play, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app as firebaseApp } from '@/lib/firebase-client'; // Use the initialized client app
import { QARun } from '@/lib/qa/qa.types';
import { db } from '@/lib/firebase-client';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

function RunCard({ run }: { run: QARun }) {
    const getStatusInfo = (status: QARun['status']) => {
        switch (status) {
            case 'passed': return { color: 'text-green-600', icon: <CheckCircle className="h-4 w-4" /> };
            case 'failed':
            case 'error':
            case 'timedout':
                return { color: 'text-red-600', icon: <XCircle className="h-4 w-4" /> };
            case 'running': return { color: 'text-blue-600', icon: <Loader2 className="h-4 w-4 animate-spin" /> };
            case 'queued': return { color: 'text-yellow-600', icon: <Clock className="h-4 w-4" /> };
            default: return { color: 'text-muted-foreground', icon: <AlertTriangle className="h-4 w-4" /> };
        }
    };
    
    const { color, icon } = getStatusInfo(run.status);
    const finishedAt = run.finishedAt ? new Date(run.finishedAt.seconds * 1000) : null;

    return (
        <div className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
                <span className={`font-semibold capitalize flex items-center gap-2 ${color}`}>{icon}{run.status}</span>
                {finishedAt && <span className="text-xs text-muted-foreground" title={finishedAt.toLocaleString()}>{formatDistanceToNow(finishedAt, { addSuffix: true })}</span>}
            </div>
            <p className="font-mono text-sm font-medium">{run.runType === 'predeploy' ? 'Pre-deploy Smoke' : `Task: ${run.taskId || 'N/A'}`}</p>
            {run.totals && (
                 <div className="text-xs text-muted-foreground flex gap-4 flex-wrap">
                    <span>Total: {run.totals.total}</span>
                    <span className="text-green-600">Passed: {run.totals.passed}</span>
                    <span className="text-red-600">Failed: {run.totals.failed}</span>
                    <span>Skipped: {run.totals.skipped}</span>
                 </div>
            )}
            <div className="flex items-center gap-2">
                {run.artifactUrl && (
                    <Button variant="outline" size="sm" asChild>
                        <a href={run.artifactUrl} target="_blank" rel="noopener noreferrer">
                            View Report <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                    </Button>
                )}
                 {run.commit && <Badge variant="secondary" className="font-mono">{run.commit.slice(0,7)}</Badge>}
            </div>
        </div>
    )
}

export default function TestsPanel() {
  const [runs, setRuns] = useState<QARun[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
        setError(null); // Clear previous errors on successful fetch
    }, (err) => {
        console.error("Error fetching test runs:", err);
        setError("Failed to subscribe to test run updates. Check Firestore rules and network connection.");
    });
    return () => unsubscribe();
  }, [isClient]);

  const { toast } = useToast();

  const triggerSmokeTests = useCallback(async () => {
    startTransition(async () => {
      setError(null);
      toast({ title: 'Triggering Pre-deploy Smoke Test', description: 'The GitHub Action workflow has been dispatched.' });
      
      try {
        const functions = getFunctions(firebaseApp);
        const triggerPlaywrightRun = httpsCallable(functions, 'triggerPlaywrightRun');
        await triggerPlaywrightRun({ runType: 'predeploy', testGrep: '@smoke' });
        toast({ title: 'Success', description: 'Smoke test run is now queued.' });
      } catch (e: any) {
        setError(e.message);
        toast({ title: 'Error', description: e.message, variant: 'destructive' });
      }
    });
  }, [toast]);

  if (!isClient) {
      return <div className="p-8 text-center text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></div>;
  }

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
            <div className="flex gap-2">
                <Button onClick={triggerSmokeTests} disabled={isPending}>
                {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Triggering...</> : <><Play className="mr-2 h-4 w-4" />Run Pre-deploy Smoke</>}
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
            runs.map(run => <RunCard key={run.id} run={run} />)
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
