
"use server";

import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { getAdminApp } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth/serverAuth";

export type AdminAction = "site-seo.save" | "homepage.save" | "homepage.read" | "cases.save" | "playwright.run";
export interface AuditLog {
  action: AdminAction;
  actorUid: string | null;
  actorEmail?: string | null;
  path?: string;
  payloadSummary?: string;
  status: "ok" | "error";
  errorMessage?: string;
  ts: any; // Using `any` for Firebase's serverTimestamp()
  version?: string;
  receivedPayload?: any;
  afterSaveSnapshot?: any;
  firestoreSnapshot?: any;
  responsePayload?: any;
}


/**
 * Logs an administrative action to Firestore.
 * This is a server-only function that uses the Admin SDK.
 * It automatically fetches the current authenticated user.
 */
export async function logAdminAction(
  input: Omit<AuditLog, "ts" | "actorUid" | "actorEmail">
) {
  try {
    const db = getFirestore(getAdminApp());
    const actor = await getCurrentUser(); // Fetch current user from session

    const doc: AuditLog = {
      ...input,
      actorUid: actor?.uid ?? "unknown",
      actorEmail: actor?.email ?? "unknown",
      ts: FieldValue.serverTimestamp(), // Use server timestamp for accuracy
    };
    await db.collection("auditLogs").add(doc);
  } catch (error) {
    console.error("[logAdminAction] Failed to write audit log:", error);
    // We don't re-throw here to avoid failing the primary action
    // if only the audit logging fails.
  }
}
