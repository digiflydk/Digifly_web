import admin from "firebase-admin";

let app: admin.app.App | null = null;

function loadServiceAccount(): admin.ServiceAccount {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not set");

  // Accept base64 or plain JSON
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
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is invalid JSON");
  }

  if (parsed.private_key && typeof parsed.private_key === "string") {
    parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
  }

  for (const key of ["project_id", "client_email", "private_key"]) {
    if (!parsed[key]) throw new Error(`Service account missing field: ${key}`);
  }

  return {
    projectId: parsed.project_id,
    clientEmail: parsed.client_email,
    privateKey: parsed.private_key,
  };
}

export function getAdminApp() {
  if (app) return app;
  const creds = loadServiceAccount();
  if (!admin.apps.length) {
    app = admin.initializeApp({ credential: admin.credential.cert(creds) });
  } else {
    app = admin.app();
  }
  return app!;
}

export async function getDb() {
  return getAdminApp().firestore();
}
