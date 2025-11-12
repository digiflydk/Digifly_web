import 'server-only';
import admin from "firebase-admin";

let app: admin.app.App | null = null;

function loadServiceAccount(): admin.ServiceAccount | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    console.warn("FIREBASE_SERVICE_ACCOUNT_JSON is not set. Firestore connections will fail.");
    return null;
  }

  const jsonStr = (() => {
    try {
      return Buffer.from(raw, "base64").toString("utf8");
    } catch {
      return raw;
    }
  })();

  let parsed: any;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    console.error("FIREBASE_SERVICE_ACCOUNT_JSON is invalid JSON.");
    return null;
  }

  if (parsed.private_key && typeof parsed.private_key === "string") {
    parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
  }

  for (const key of ["project_id", "client_email", "private_key"]) {
    if (!parsed[key]) {
      console.error(`Service account in FIREBASE_SERVICE_ACCOUNT_JSON is missing field: ${key}.`);
      return null;
    }
  }

  return {
    projectId: parsed.project_id,
    clientEmail: parsed.client_email,
    privateKey: parsed.private_key,
  };
}

export function getAdminApp() {
  if (app) return app;
  
  if (!admin.apps.length) {
    const creds = loadServiceAccount();
    if (!creds) {
        throw new Error("Firebase Admin SDK credentials are not configured.");
    }
    app = admin.initializeApp({ credential: admin.credential.cert(creds) });
  } else {
    app = admin.app();
  }
  return app!;
}

export async function getDb() {
  return getAdminApp().firestore();
}
