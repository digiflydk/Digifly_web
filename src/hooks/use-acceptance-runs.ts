
"use client";

import * as React from "react";
import { onSnapshot, query, collection, where, orderBy, limit, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import type { QARun } from "@/lib/qa/qa.types";

type UseAcceptanceRunsResult = {
  [taskId: string]: {
    lastRun?: QARun;
    loading: boolean;
  };
};

export function useAcceptanceRuns(taskIds: (string | null | undefined)[]) {
  const [runs, setRuns] = React.useState<UseAcceptanceRunsResult>({});
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const validTaskIds = taskIds.filter((id): id is string => !!id);
    if (!validTaskIds.length) return;

    const unsubscribers: (() => void)[] = [];
    setError(null);

    validTaskIds.forEach(taskId => {
      setRuns(prev => ({ ...prev, [taskId]: { ...prev[taskId], loading: true } }));

      try {
        const q = query(
          collection(db, "qaRuns"),
          where("runType", "==", "acceptance"),
          where("taskId", "==", taskId),
          orderBy("startedAt", "desc"),
          limit(1)
        );

        const unsub = onSnapshot(q,
          (snapshot) => {
            const lastRun = snapshot.empty ? undefined : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as QARun;
            setRuns(prev => ({ ...prev, [taskId]: { lastRun, loading: false } }));
          },
          (err: any) => {
            console.error(`[useAcceptanceRuns] Firestore error for taskId ${taskId}:`, err);
            const friendlyError = err.message.includes('requires an index') 
              ? "Firestore requires an index for the QA runs query. Create a composite index for qaRuns (runType asc, taskId asc, startedAt desc) and redeploy." 
              : `Failed to subscribe to updates for task ${taskId}.`;
            setError(prev => prev ? `${prev}\n${friendlyError}` : friendlyError);
            setRuns(prev => ({ ...prev, [taskId]: { ...prev[taskId], loading: false } }));
          }
        );
        unsubscribers.push(unsub);
      } catch (e: any) {
        console.error(`[useAcceptanceRuns] Failed to create subscription for ${taskId}:`, e);
        setError(`Client-side error setting up Firestore listener for task ${taskId}.`);
      }
    });

    return () => {
      unsubscribers.forEach(unsub => {
        if (typeof unsub === 'function') {
          try { unsub(); } catch (e) { console.error("Error unsubscribing:", e); }
        }
      });
    };
  }, [JSON.stringify(taskIds)]); // Effect dependency on a stable representation of the taskIds array

  return { runs, error };
}
