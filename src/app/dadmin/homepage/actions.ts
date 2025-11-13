
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
        
        // Deep merge with defaults to ensure all nested properties are present
        const merged = deepmerge(defaultHomepage, sanitized);
        
        // Validate the complete, merged object
        const parsed = HomepageSchema.parse(merged);
        
        // The critical database write operation that was missing
        await db.doc(CMS_PATHS.page('home')).set(parsed, { merge: true });
        
        // Revalidate the homepage and the entire layout
        revalidatePath("/", "layout");
        
        return { ok: true };
    } catch (e: any) {
        if (e instanceof ZodError) {
            console.error("[saveHomepageAction] Zod Validation Error:", e.issues);
            return { ok: false, error: "Validation failed", issues: e.issues };
        }
        console.error("[saveHomepageAction] Unexpected Error:", e.message);
        return { ok: false, error: "An unexpected server error occurred." };
    }
}
