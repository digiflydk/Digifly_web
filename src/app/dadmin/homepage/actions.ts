
"use server";

import { getDb } from "@/lib/firebase/admin";
import { HomepageSchema } from "@/lib/schemas";
import { revalidatePath } from 'next/cache';
import { CMS_PATHS } from "@/lib/constants";
import { sanitizeHomepage } from "@/lib/cms-sanitize";
import deepmerge from "deepmerge";
import { defaultHomepage } from "@/lib/defaults/siteDefaults";

export async function saveHomepageAction(payload: unknown) {
    const db = await getDb();
    const sanitized = sanitizeHomepage(payload);
    
    // The defaultHomepage is deep merged to ensure any missing fields
    // from the client (e.g. if a new field was added to the schema)
    // are populated before validation and saving.
    const merged = deepmerge(defaultHomepage, sanitized);
    
    const parsed = HomepageSchema.parse(merged);
    
    await db.doc(CMS_PATHS.page('home')).set(parsed, { merge: true });
    
    // Revalidate the homepage and the main layout to reflect changes
    revalidatePath("/", "layout");
    
    return { ok: true };
}
