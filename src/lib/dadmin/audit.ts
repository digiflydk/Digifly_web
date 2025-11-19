
"use server";
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('server-only');
} catch {}

import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { getAdminApp } from "@/lib/firebase-admin";
import { getCurrentUser } from "@/lib/auth/serverAuth";
import deepmerge from 'deepmerge';
import type { HeroSlide } from '@/lib/types';

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
    | "playwright.acceptance.studio.error"
    | "playwright.acceptance.selftest.diagnostics"
    | "homepage.hero.data.loaded"; // DGF-473: New action

export interface AuditLog {
  action: AdminAction;
  actorUid: string | null;
  actorEmail?: string | null;
  path?: string;
  payloadSummary?: string;
  status: "ok" | "error" | "info";
  errorMessage?: string;
  ts: any;
  version?: string;
  receivedPayload?: any;
  afterSaveSnapshot?: any;
  firestoreSnapshot?: any;
  responsePayload?: any;
  hero?: HeroSnapshot; // DGF-473: Add hero snapshot to log
}

export interface LoggingSettings {
  enabled: boolean;
  actions: Record<AdminAction, boolean>;
}

// DGF-473: New type for hero snapshot
export type HeroSnapshot = {
  heading: string | null;
  body: string | null;
  textColor: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  overlayEnabled: boolean;
  overlayCmyk: { c: number | null; m: number | null; y: number | null; k: number | null; };
  overlayOpacityPercent: number | null;
};

// Simple in-memory cache with TTL
let settingsCache: { settings: LoggingSettings; timestamp: number } | null = null;
const CACHE_TTL_MS = 1000 * 30; // 30 seconds

async function getLoggingSettingsServer(): Promise<LoggingSettings | null> {
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
  const loggingSettings = await getLogSettings();

  // Check if logging is globally disabled or disabled for this specific action
  if (!loggingSettings?.enabled || !loggingSettings.actions[input.action]) {
    return; // Skip logging
  }

  try {
    const db = getFirestore(getAdminApp());
    const actor = await getCurrentUser();

    const doc: AuditLog = {
      ...input,
      actorUid: actor?.uid ?? "system",
      actorEmail: actor?.email ?? "system",
      ts: FieldValue.serverTimestamp(),
    };
    await db.collection("auditLogs").add(doc);
  } catch (error) {
    console.error("[logAdminAction] Failed to write audit log:", error);
  }
}

// DGF-473: New helper function for logging hero snapshots
export async function logHomepageHeroSnapshot(opts: {
  source: 'homepage-view-model' | 'api-cms-home' | 'unknown';
  environment: string;
  hero: HeroSnapshot;
}) {
  const { source, environment, hero } = opts;
  await logAdminAction({
    action: 'homepage.hero.data.loaded',
    status: 'info',
    payloadSummary: `Hero loaded on ${environment} from ${source}`,
    hero,
    responsePayload: hero, // Use a generic field for inspection
  });
}


export async function getLogSettings(): Promise<LoggingSettings> {
    const defaultSettings: LoggingSettings = {
        enabled: true, // Default to enabled for easier debugging
        actions: {
            'homepage.save': true,
            'homepage.read': false, // READ actions can be noisy
            'site-seo.save': true,
            'site-seo.read': false,
            'cases.save': true,
            'cases.read': false,
            'navigation.save': true,
            'navigation.read': false,
            'pages.save': true,
            'pages.read': false,
            'services.save': true,
            'services.read': false,
            'playwright.run': true,
            'playwright.acceptance.debug.start': true,
            'playwright.acceptance.debug.finish': true,
            'playwright.acceptance.debug.error': true,
            'playwright.acceptance.studio.start': true,
            'playwright.acceptance.studio.finish': true,
            'playwright.acceptance.studio.error': true,
            'playwright.acceptance.selftest.diagnostics': true,
            'homepage.hero.data.loaded': true, // DGF-473
        } as any,
    };
    const settings = await getLoggingSettingsServer();
    // DGF-450: Deep merge defaults with stored settings to ensure new keys are present
    return settings ? deepmerge(defaultSettings, settings) : defaultSettings;
}

export async function saveLogSettings(settings: Partial<LoggingSettings>): Promise<{ok: boolean}> {
    const db = getFirestore(getAdminApp());
    await db.doc('developerSettings/logging').set(settings, { merge: true });
    settingsCache = null; // Invalidate cache
    return { ok: true };
}
