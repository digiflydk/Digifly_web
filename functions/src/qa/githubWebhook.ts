
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const githubWebhook = functions.https.onRequest(async (req, res) => {
  // TODO: verify signature (X-Hub-Signature-256)
  const { qaRunId, status, totals, artifactUrl, commit, workflowRunId } = req.body;
  if (!qaRunId) return res.status(400).send('missing qaRunId');

  await admin.firestore().collection('qaRuns').doc(qaRunId).update({
    status,
    totals,
    artifactUrl,
    commit,
    workflowRunId,
    finishedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  res.status(200).send('ok');
});
