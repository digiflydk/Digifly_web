
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch';

const GH_TOKEN = process.env.GH_FINE_TOKEN!;
const GH_OWNER = process.env.GH_OWNER!;
const GH_REPO  = process.env.GH_REPO!;
const GH_WORKFLOW = 'e2e.yml';

export const triggerPlaywrightRun = functions.https.onCall(async (data, context) => {
  const uid = context.auth?.uid ?? 'system';
  const runRef = await admin.firestore().collection('qaRuns').add({
    status: 'queued',
    requestedBy: uid,
    startedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  const body = { ref: 'main', inputs: { qaRunId: runRef.id } };

  const res = await fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/actions/workflows/${GH_WORKFLOW}/dispatches`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${GH_TOKEN}`, 'Accept': 'application/vnd.github+json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    await runRef.update({ status: 'failed' });
    throw new functions.https.HttpsError('internal', `Failed to dispatch workflow: ${res.status}`);
  }

  await runRef.update({ status: 'running' });
  return { id: runRef.id };
});
