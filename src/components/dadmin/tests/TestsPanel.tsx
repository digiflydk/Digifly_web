
'use client';
import { useEffect, useState, useCallback } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, functions } from '@/lib/firebase-client';
import { httpsCallable } from 'firebase/functions';
import type { QARun } from '@/lib/qa/qa.types';

export default function TestsPanel() {
  const [runs, setRuns] = useState<{id:string; data:QARun}[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'qaRuns'), orderBy('startedAt', 'desc'));
    return onSnapshot(q, snap => {
      const items = snap.docs.map(d => ({ id: d.id, data: d.data() as QARun }));
      setRuns(items);
      setIsRunning(items.some(r => r.data.status === 'queued' || r.data.status === 'running'));
    });
  }, []);

  const trigger = useCallback(async () => {
    setIsRunning(true);
    try {
      await httpsCallable(functions, 'triggerPlaywrightRun')({ baseUrlOverride: null });
    } finally {
      // isRunning will be controlled by snapshot updates
    }
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Playwright Tests</h1>
        <button
          className="px-4 py-2 rounded-lg bg-black text-white disabled:opacity-60"
          onClick={trigger}
          disabled={isRunning}
        >
          {isRunning ? 'Running…' : 'Run tests'}
        </button>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Started</th>
            <th>Finished</th>
            <th>Status</th>
            <th>Totals</th>
            <th>Commit</th>
            <th>Report</th>
          </tr>
        </thead>
        <tbody>
          {runs.map(({id, data}) => (
            <tr key={id} className="border-b">
              <td className="py-2">{data.startedAt?.toDate().toLocaleString() ?? '—'}</td>
              <td>{data.finishedAt?.toDate().toLocaleString() ?? '—'}</td>
              <td className="capitalize">{data.status}</td>
              <td>
                {data.totals
                  ? `${data.totals.passed}/${data.totals.total} passed, ${data.totals.failed} failed`
                  : '—'}
              </td>
              <td className="font-mono">{data.commit?.slice(0,7) ?? '—'}</td>
              <td>
                {data.artifactUrl
                  ? <a className="underline" href={data.artifactUrl} target="_blank" rel="noreferrer">View report</a>
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
