
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch';
import { logAdminAction } from '../../../src/lib/dadmin/audit';

const GH_TOKEN = process.env.GH_FINE_TOKEN!;
const GH_OWNER = process.env.GH_OWNER!;
const GH_REPO  = process.env.GH_REPO!;
const GH_WORKFLOW = 'e2e.yml';

type TriggerPayload = {
  runType: 'acceptance' | 'predeploy';
  taskId?: string;
  testGrep?: string;
};

export const triggerPlaywrightRun = functions.https.onCall(async (data: TriggerPayload, context) => {
  const uid = context.auth?.uid ?? 'system';
  const email = context.auth?.token.email ?? 'unknown';

  await logAdminAction({
      action: 'playwright.run',
      status: 'ok',
      actorUid: uid,
      actorEmail: email,
      payloadSummary: `Triggered ${data.runType} run. Grep: ${data.testGrep || 'none'}`
  });
  
  const runRef = await admin.firestore().collection('qaRuns').add({
    status: 'queued',
    requestedBy: uid,
    startedAt: admin.firestore.FieldValue.serverTimestamp(),
    runType: data.runType || 'acceptance',
    taskId: data.taskId || null,
    environment: 'test'
  });

  const body = { 
    ref: 'main', 
    inputs: { 
      qaRunId: runRef.id,
      testGrep: data.testGrep || ''
    } 
  };

  const res = await fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/actions/workflows/${GH_WORKFLOW}/dispatches`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${GH_TOKEN}`, 
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error(`Failed to dispatch workflow: ${res.status}`, errorBody);
    await runRef.update({ status: 'error', errorMessage: `Failed to dispatch workflow: ${res.status}. ${errorBody}` });
    throw new functions.https.HttpsError('internal', `Failed to dispatch workflow: ${res.status}`);
  }

  await runRef.update({ status: 'running' });
  return { id: runRef.id };
});
