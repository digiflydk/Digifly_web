"use client";

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import { db } from '@/lib/firebase-client';
import type { QARun } from '@/lib/qa/qa.types';

type RunState = {
  lastRun?: QARun;
  loading: boolean;
};

export function useAcceptanceRuns(taskIds: string[]): { runs: Record<string, RunState> } {
  const [runs, setRuns] = useState<Record<string, RunState>>(() => {
    const initialState: Record<string, RunState> = {};
    taskIds.forEach(id => {
      initialState[id] = { loading: true };
    });
    return initialState;
  });

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
      }, (error) => {
        console.error(`Error fetching run for taskId ${taskId}:`, error);
        setRuns(prev => ({
          ...prev,
          [taskId]: { loading: false, lastRun: undefined }
        }));
      });

      unsubscribers.push(unsubscribe);
    });

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [taskIds]);

  return { runs };
}
