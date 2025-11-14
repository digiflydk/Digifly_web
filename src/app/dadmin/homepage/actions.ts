
"use server";

import { getDb } from "@/lib/firebase/admin";
import { HomepageSchema } from "@/lib/schemas";
import { revalidatePath } from 'next/cache';
import { CMS_PATHS } from "@/lib/constants";
import { sanitizeHomepage } from "@/lib/cms-sanitize";
import deepmerge from "deepmerge";
import { defaultHomepage } from "@/lib/defaults/siteDefaults";
import { ZodError } from "zod";
import { logAdminAction } from "@/lib/dadmin/audit";

export async function saveHomepageAction(payload: unknown): Promise<{ ok: boolean; error?: string; issues?: any[] }> {
    try {
        const db = await getDb();
        const sanitized = sanitizeHomepage(payload);
        
        const merged = deepmerge(defaultHomepage, sanitized);
        
        const parsed = HomepageSchema.parse(merged);
        
        await db.doc(CMS_PATHS.page('home')).set(parsed, { merge: true });
        
        revalidatePath("/", "layout");

        await logAdminAction({
            action: 'homepage.save',
            status: 'ok',
            path: CMS_PATHS.page('home'),
            payloadSummary: `Hero: ${parsed.hero.slides[0]?.heading ?? 'N/A'}`,
            receivedPayload: payload,
            afterSaveSnapshot: parsed,
        });
        
        return { ok: true };
    } catch (e: any) {
        if (e instanceof ZodError) {
            console.error("[saveHomepageAction] Zod Validation Error:", e.issues);
            await logAdminAction({
                action: 'homepage.save',
                status: 'error',
                path: CMS_PATHS.page('home'),
                errorMessage: 'Zod validation failed.',
                receivedPayload: payload,
            });
            return { ok: false, error: "Validation failed", issues: e.issues };
        }
        console.error("[saveHomepageAction] Unexpected Error:", e.message);
        await logAdminAction({
            action: 'homepage.save',
            status: 'error',
            path: CMS_PATHS.page('home'),
            errorMessage: e.message,
            receivedPayload: payload,
        });
        return { ok: false, error: "An unexpected server error occurred." };
    }
}
