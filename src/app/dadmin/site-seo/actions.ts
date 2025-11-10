
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
        await writeSiteSettings(input);
        // This is a server action, it cannot know the client-side user.
        // For a true audit trail, you'd need to pass user info from the client
        // or have a server-side session management system.
        // For now, we log the action without actor info.
        await logAdminAction({
            action: "site-seo.save",
            status: "ok",
            path: "site/settings",
            payloadSummary: `Title: ${input.seo?.defaultTitle ?? ""}`,
            version: process.env.NEXT_PUBLIC_APP_VERSION,
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
        });
        return { ok: false, error: err.message || "An unknown error occurred." };
    }
}
