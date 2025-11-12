import 'server-only';
import { cert, getApps, initializeApp, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let app: App | null = null;

function loadServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    console.warn("FIREBASE_SERVICE_ACCOUNT_JSON is not set. Firestore connections will fail.");
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    // The replace logic is often needed if the key is stored as a single-line string.
    if (parsed.private_key) {
      parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
    }
    return parsed;
  } catch (e) {
    console.error("Could not parse FIREBASE_SERVICE_ACCOUNT_JSON", e);
    return null;
  }
}

export function getAdminApp() {
  if (app) return app;
  
  if (!getApps().length) {
    const creds = loadServiceAccount();
    if (!creds) {
        throw new Error("Firebase Admin SDK credentials are not configured.");
    }
    app = initializeApp({ credential: cert(creds) });
  } else {
    app = getApps()[0];
  }
  return app!;
}

export async function getDb() {
  return getFirestore(getAdminApp());
}
