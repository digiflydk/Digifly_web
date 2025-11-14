
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const githubWebhook = functions.https.onRequest(async (req, res) => {
  // TODO: verify signature (X-Hub-Signature-256)
  const { qaRunId, status, totals, artifactUrl, commit, workflowRunId } = req.body;
  if (!qaRunId) {
    console.error("Webhook received with missing qaRunId");
    return res.status(400).send('missing qaRunId');
  }

  try {
    await admin.firestore().collection('qaRuns').doc(qaRunId).update({
      status,
      totals,
      artifactUrl,
      commit,
      workflowRunId,
      finishedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`Successfully updated qaRunId: ${qaRunId} with status: ${status}`);
    res.status(200).send('ok');
  } catch (error) {
    console.error(`Failed to update qaRunId: ${qaRunId}`, error);
    res.status(500).send('Error updating Firestore document');
  }
});
