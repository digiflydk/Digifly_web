
"use server";

import { revalidatePath } from "next/cache";
import type { SiteSettings } from "@/lib/schemas";
import { writeSiteSettings } from "@/lib/dadmin/siteSeoRepo";
import { logAdminAction } from "@/lib/dadmin/audit";

/**
 * Server Action: save settings
 */
export async function saveSiteSettingsAction(
  input: SiteSettings
): Promise<{ ok: true } | { ok: false, error: string }> {
    try {
        const savedData = await writeSiteSettings(input);
        
        await logAdminAction({
            action: "site-seo.save",
            status: "ok",
            path: "site/settings",
            payloadSummary: `Title: ${input.seo?.defaultTitle ?? ""}`,
            version: process.env.NEXT_PUBLIC_APP_VERSION,
            // Full payload and snapshot for detailed debugging
            receivedPayload: input,
            afterSaveSnapshot: savedData,
        });

        revalidatePath("/", "layout");
        revalidatePath("/dadmin/site-seo");
        return { ok: true };
    } catch (err: any) {
        console.error("[saveSiteSettingsAction] Error:", err);
        await logAdminAction({
          action: "site-seo.save",
          status: "error",
          path: "site/settings",
          errorMessage: String(err?.message ?? err),
          version: process.env.NEXT_PUBLIC_APP_VERSION,
          receivedPayload: input, // Log the payload that failed
        });
        return { ok: false, error: err.message || "An unknown error occurred." };
    }
}
