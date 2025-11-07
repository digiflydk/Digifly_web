import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
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

  const serviceAccount = parseServiceAccount();
  const projectId = resolveProjectId(serviceAccount);

  if (getApps().length) {
    cachedApp = getApps()[0]!;
    return cachedApp;
  }
  
  if (!serviceAccount) {
    // This will cause an error, but it's better to fail early
    // if the service account isn't configured in a non-GCP env.
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not set or invalid. Cannot initialize Firebase Admin SDK.");
  }
  
  cachedApp = initializeApp({
    credential: cert(serviceAccount as any),
    projectId,
  });

  return cachedApp;
}

export function getDb(): Firestore {
  // Don’t run at import time; call only inside request handlers.
  return getFirestore(getAdminApp());
}
