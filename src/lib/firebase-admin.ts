import { getApps, initializeApp, cert, applicationDefault, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

function parseServiceAccount(): Record<string, any> | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;

  try {
    // Supports plain JSON or base64-encoded JSON
    const str = raw.trim().startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8');
    const sa = JSON.parse(str);
    if (typeof sa.project_id !== 'string' || !sa.project_id) {
      throw new Error('Service account must include a string "project_id".');
    }
    return sa;
  } catch (e) {
    console.warn('[firebase-admin] Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:', (e as Error).message);
    return null;
  }
}

function resolveProjectId(sa?: Record<string, any> | null): string | undefined {
  return (
    sa?.project_id ||
    process.env.FIREBASE_PROJECT_ID ||
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.GCLOUD_PROJECT
  );
}

let cachedApp: App | null = null;

export function getAdminApp(): App {
  if (cachedApp) return cachedApp;

  const sa = parseServiceAccount();
  const projectId = resolveProjectId(sa);

  if (getApps().length) {
    cachedApp = getApps()[0]!;
    return cachedApp;
  }

  if (sa) {
    cachedApp = initializeApp({
      credential: cert(sa as any),
      projectId,
    });
  } else {
    // No SA in env → use application default credentials (GCP environment)
    cachedApp = initializeApp({
      credential: applicationDefault(),
      projectId,
    });
  }
  return cachedApp;
}

export function getDb(): Firestore {
  // Don’t run at import time; call only inside request handlers.
  return getFirestore(getAdminApp());
}
