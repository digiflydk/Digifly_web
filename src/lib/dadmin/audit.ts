
"use server";

import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { getAdminApp } from "@/lib/firebase-admin";
import type { AuditLog } from "@/lib/schemas";

/**
 * Logs an administrative action to Firestore.
 * This is a server-only function that uses the Admin SDK.
 * It does not have access to client-side auth context, so actor info must be inferred
 * from a session or passed in if available.
 */
export async function logAdminAction(
  input: Omit<AuditLog, "ts" | "actorUid" | "actorEmail">,
  actor?: { uid: string; email?: string } | null
) {
  try {
    const db = getFirestore(getAdminApp());
    const doc: AuditLog = {
      ...input,
      actorUid: actor?.uid ?? null,
      actorEmail: actor?.email ?? null,
      ts: FieldValue.serverTimestamp(), // Use server timestamp for accuracy
    };
    await db.collection("auditLogs").add(doc);
  } catch (error) {
    console.error("[logAdminAction] Failed to write audit log:", error);
    // We don't re-throw here to avoid failing the primary action
    // if only the audit logging fails.
  }
}
