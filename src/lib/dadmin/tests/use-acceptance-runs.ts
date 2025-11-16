
"use client";

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import type { QARun } from '@/lib/qa/qa.types';

type RunState = {
  lastRun?: QARun;
  loading: boolean;
  error?: string;
};

export function useAcceptanceRuns(taskIds: string[]): { runs: Record<string, RunState>, error?: string } {
  const [runs, setRuns] = useState<Record<string, RunState>>(() => {
    const initialState: Record<string, RunState> = {};
    taskIds.forEach(id => {
      initialState[id] = { loading: true };
    });
    return initialState;
  });
  const [globalError, setGlobalError] = useState<string | undefined>();

  useEffect(() => {
    const unsubscribers: Unsubscribe[] = [];

    taskIds.forEach(taskId => {
      const q = query(
        collection(db, "qaRuns"),
        where("runType", "==", "acceptance"),
        where("taskId", "==", taskId),
        orderBy("startedAt", "desc"),
        limit(1)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const lastRun = snapshot.empty ? undefined : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as QARun;
        
        setRuns(prev => ({
          ...prev,
          [taskId]: { lastRun, loading: false }
        }));
        if(globalError) setGlobalError(undefined); // Clear global error on success
      }, (error) => {
        console.error(`Error fetching run for taskId ${taskId}:`, error);
        const errorMessage = error.message.includes('requires an index') 
          ? 'Firestore query requires a composite index. Please create it in your Firebase console or configuration.' 
          : error.message;

        setRuns(prev => ({
          ...prev,
          [taskId]: { loading: false, lastRun: undefined, error: errorMessage }
        }));
        if(!globalError) setGlobalError(errorMessage);
      });

      unsubscribers.push(unsubscribe);
    });

    return () => {
      unsubscribers.forEach(unsub => {
        try {
          if (typeof unsub === 'function') unsub();
        } catch (err) {
          console.error('[QA Acceptance Runs] Error during unsubscribe', err);
        }
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(taskIds)]);

  return { runs, error: globalError };
}
