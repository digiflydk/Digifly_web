import { getApps, initializeApp, cert, applicationDefault, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

function parseServiceAccount(): Record<string, any> | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    console.warn('[firebase-admin] FIREBASE_SERVICE_ACCOUNT_JSON is not set.');
    return null;
  }

  try {
    // Try parsing as plain JSON first
    if (raw.trim().startsWith('{')) {
      return JSON.parse(raw);
    }
    // If not plain JSON, assume it's base64 encoded
    const decoded = Buffer.from(raw, 'base64').toString('utf8');
    return JSON.parse(decoded);
  } catch (e: any) {
    console.warn(`[firebase-admin] Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON. Error: ${e.message}. It might not be a valid JSON or base64 string.`);
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
