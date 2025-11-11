

'use client';
import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

async function safeJson(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`HTTP ${res.status} — ${text.slice(0, 150)}`);
  }
}

export default function TestsPanel() {
  const [isRunning, setIsRunning] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestReportUrl, setLatestReportUrl] = useState<string | null>(null);

  useEffect(() => setIsClient(true), []);

  const fetchLatestReport = useCallback(async () => {
    try {
      const res = await fetch('/predeploy/reports/index.json', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setLatestReportUrl(data.latestUrl);
      } else {
        setLatestReportUrl(null);
      }
    } catch {
      setLatestReportUrl(null);
    }
  }, []);

  useEffect(() => {
    fetchLatestReport();
  }, [fetchLatestReport]);

  const { toast } = useToast();

  const trigger = useCallback(async () => {
    setIsRunning(true);
    setError(null);
    toast({ title: 'Pre-deploy QA Started', description: 'This simulates running checks. To run it for real, use `npm run predeploy` in your terminal.' });
    
    // This is a UI simulation. A real implementation would trigger a server-side process.
    await new Promise(res => setTimeout(res, 2000));

    try {
      // After simulation, try to find a report that might have been generated locally.
      await fetchLatestReport(); 
      
      toast({ title: 'Simulation Complete', description: 'If a local report exists, its link will appear below.'});
    } catch (e: any) {
      setError(e.message);
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setIsRunning(false);
    }
  }, [toast, fetchLatestReport]);

  if (!isClient) {
      return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Pre-Deploy QA</h1>
           <p className="text-sm text-muted-foreground">
             Run smoke tests to catch issues before deploying.
           </p>
        </div>
        <div className="flex gap-2">
            <Button onClick={trigger} disabled={isRunning}>
              {isRunning ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Running Checks…</> : 'Run Pre-deploy QA'}
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

      {latestReportUrl ? (
        <Alert>
          <AlertTitle>Latest Report Ready</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            A report from the last pre-deploy run is available.
            <Button variant="outline" size="sm" asChild>
                <a href={latestReportUrl} target="_blank" rel="noopener noreferrer">
                    View Report <ExternalLink className="h-4 w-4 ml-2" />
                </a>
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
          <div className="border rounded-lg p-6 text-center text-muted-foreground">
              <p className="font-medium">No pre-deploy report found.</p>
              <p className="text-sm mt-2">Run the check locally to generate one:</p>
              <pre className="mt-2 inline-block bg-slate-100 dark:bg-slate-800 p-2 rounded-md text-xs">
                <code>npm run predeploy</code>
              </pre>
          </div>
      )}
    </div>
  );
}
