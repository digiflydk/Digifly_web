
"use client";

import * as React from "react";
import { onSnapshot, query, collection, where, orderBy, limit, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import type { QARun, AcceptanceSuiteId } from "@/lib/qa/qa.types";

type UseAcceptanceRunsResult = {
  [suiteId in AcceptanceSuiteId]?: {
    lastRun?: QARun;
    loading: boolean;
  };
};

export function useAcceptanceRuns(suiteIds: AcceptanceSuiteId[]) {
  const [runs, setRuns] = React.useState<UseAcceptanceRunsResult>({});
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const validSuiteIds = suiteIds.filter((id): id is AcceptanceSuiteId => !!id);
    if (!validSuiteIds.length) return;

    const unsubscribers: (() => void)[] = [];
    setError(null);

    validSuiteIds.forEach(suiteId => {
      setRuns(prev => ({ ...prev, [suiteId]: { ...prev[suiteId], loading: true } }));

      try {
        const q = query(
          collection(db, "qaRuns"),
          where("runType", "==", "acceptance"),
          where("suiteId", "==", suiteId),
          orderBy("startedAt", "desc"),
          limit(1)
        );

        const unsub = onSnapshot(q,
          (snapshot) => {
            const lastRun = snapshot.empty ? undefined : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as QARun;
            setRuns(prev => ({ ...prev, [suiteId]: { lastRun, loading: false } }));
          },
          (err: any) => {
            console.error(`[useAcceptanceRuns] Firestore error for suiteId ${suiteId}:`, err);
            const friendlyError = err.message.includes('requires an index')
              ? "Firestore requires an index for this query. Create a composite index for qaRuns (runType asc, suiteId asc, startedAt desc)."
              : `Failed to subscribe to updates for suite ${suiteId}.`;
            setError(prev => prev ? `${prev}\n${friendlyError}` : friendlyError);
            setRuns(prev => ({ ...prev, [suiteId]: { ...prev[suiteId], loading: false } }));
          }
        );
        unsubscribers.push(unsub);
      } catch (e: any) {
        console.error(`[useAcceptanceRuns] Failed to create subscription for ${suiteId}:`, e);
        setError(`Client-side error setting up Firestore listener for suite ${suiteId}.`);
      }
    });

    return () => {
      unsubscribers.forEach(unsub => {
        if (typeof unsub === 'function') {
          try { unsub(); } catch (e) { console.error("Error unsubscribing:", e); }
        }
      });
    };
  }, [JSON.stringify(suiteIds)]); // Effect dependency on a stable representation of the suiteIds array

  return { runs, error };
}
