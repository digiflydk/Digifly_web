
"use server";

import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { getAdminApp } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth/serverAuth";

export type AdminAction = 
    | "homepage.save" | "homepage.read" 
    | "site-seo.save" | "site-seo.read" 
    | "cases.save" | "cases.read" 
    | "navigation.save" | "navigation.read"
    | "pages.save" | "pages.read"
    | "services.save" | "services.read"
    | "playwright.run"
    | "playwright.acceptance.debug.start"
    | "playwright.acceptance.debug.finish"
    | "playwright.acceptance.debug.error"
    | "playwright.acceptance.studio.start"
    | "playwright.acceptance.studio.finish"
    | "playwright.acceptance.studio.error";

export interface AuditLog {
  action: AdminAction;
  actorUid: string | null;
  actorEmail?: string | null;
  path?: string;
  payloadSummary?: string;
  status: "ok" | "error";
  errorMessage?: string;
  ts: any;
  version?: string;
  receivedPayload?: any;
  afterSaveSnapshot?: any;
  firestoreSnapshot?: any;
  responsePayload?: any;
}

export interface LoggingSettings {
  enabled: boolean;
  actions: Record<AdminAction, boolean>;
}

// Simple in-memory cache with TTL
let settingsCache: { settings: LoggingSettings; timestamp: number } | null = null;
const CACHE_TTL_MS = 1000 * 30; // 30 seconds

async function getLoggingSettings(): Promise<LoggingSettings | null> {
  const now = Date.now();
  if (settingsCache && (now - settingsCache.timestamp < CACHE_TTL_MS)) {
    return settingsCache.settings;
  }

  try {
    const db = getFirestore(getAdminApp());
    const snap = await db.doc('developerSettings/logging').get();
    if (snap.exists) {
      const settings = snap.data() as LoggingSettings;
      settingsCache = { settings, timestamp: now };
      return settings;
    }
    return null;
  } catch (error) {
    console.warn("[logAdminAction] Could not fetch logging settings. Logging will be disabled.", error);
    return null;
  }
}

export async function logAdminAction(
  input: Omit<AuditLog, "ts" | "actorUid" | "actorEmail">
) {
  const loggingSettings = await getLoggingSettings();

  // Check if logging is globally disabled or disabled for this specific action
  if (!loggingSettings?.enabled || !loggingSettings.actions[input.action]) {
    return; // Skip logging
  }

  try {
    const db = getFirestore(getAdminApp());
    const actor = await getCurrentUser();

    const doc: AuditLog = {
      ...input,
      actorUid: actor?.uid ?? "unknown",
      actorEmail: actor?.email ?? "unknown",
      ts: FieldValue.serverTimestamp(),
    };
    await db.collection("auditLogs").add(doc);
  } catch (error) {
    console.error("[logAdminAction] Failed to write audit log:", error);
  }
}

export async function getLogSettings(): Promise<LoggingSettings> {
    const defaultSettings: LoggingSettings = {
        enabled: false,
        actions: {
            'homepage.save': false,
            'homepage.read': false,
            'site-seo.save': false,
            'site-seo.read': false,
            'cases.save': false,
            'cases.read': false,
            'navigation.save': false,
            'navigation.read': false,
            'pages.save': false,
            'pages.read': false,
            'services.save': false,
            'services.read': false,
            'playwright.run': false,
            'playwright.acceptance.debug.start': true, // default to on
            'playwright.acceptance.debug.finish': true,
            'playwright.acceptance.debug.error': true,
            'playwright.acceptance.studio.start': true,
            'playwright.acceptance.studio.finish': true,
            'playwright.acceptance.studio.error': true,
        } as any,
    };
    const settings = await getLoggingSettings();
    return settings ? { ...defaultSettings, ...settings, actions: { ...defaultSettings.actions, ...settings.actions }} : defaultSettings;
}

export async function saveLogSettings(settings: Partial<LoggingSettings>): Promise<{ok: boolean}> {
    const db = getFirestore(getAdminApp());
    await db.doc('developerSettings/logging').set(settings, { merge: true });
    settingsCache = null; // Invalidate cache
    return { ok: true };
}
