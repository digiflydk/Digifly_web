
"use server";

import { getLogSettings as getLogSettingsServer, saveLogSettings as saveLogSettingsServer, type LoggingSettings } from '@/lib/dadmin/audit';

// This file acts as a server-side boundary for the client component.

export async function getLogSettings(): Promise<LoggingSettings> {
    return await getLogSettingsServer();
}

export async function saveLogSettings(settings: Partial<LoggingSettings>): Promise<{ok: boolean}> {
    return await saveLogSettingsServer(settings);
}
