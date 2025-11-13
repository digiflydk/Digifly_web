
"use server";

import { getDb } from "@/lib/firebase/admin";
import { HomepageSchema } from "@/lib/schemas";
import { revalidatePath } from 'next/cache';
import { CMS_PATHS } from "@/lib/constants";
import { sanitizeHomepage } from "@/lib/cms-sanitize";
import deepmerge from "deepmerge";
import { defaultHomepage } from "@/lib/defaults/siteDefaults";
import { ZodError } from "zod";

export async function saveHomepageAction(payload: unknown): Promise<{ ok: boolean; error?: string; issues?: any[] }> {
    try {
        const db = await getDb();
        const sanitized = sanitizeHomepage(payload);
        
        const merged = deepmerge(defaultHomepage, sanitized);
        
        const parsed = HomepageSchema.parse(merged);
        
        // This was the missing database write operation.
        await db.doc(CMS_PATHS.page('home')).set(parsed, { merge: true });
        
        revalidatePath("/", "layout");
        
        return { ok: true };
    } catch (e: any) {
        if (e instanceof ZodError) {
            return { ok: false, error: "Validation failed", issues: e.issues };
        }
        console.error("[saveHomepageAction] Error:", e.message);
        return { ok: false, error: "An unexpected error occurred." };
    }
}
