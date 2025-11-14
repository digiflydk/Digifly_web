
"use server";

import { getDb } from "@/lib/firebase/admin";
import { HomepageSchema, type HomePage } from "@/lib/schemas";
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
        const docRef = db.doc(CMS_PATHS.page('home'));

        // 1. Get existing data to merge against, ensuring we don't lose fields from other tabs.
        const existingSnap = await docRef.get();
        const existingData = existingSnap.exists ? existingSnap.data() : {};

        // 2. Sanitize the incoming payload from the form.
        const sanitizedPayload = sanitizeHomepage(payload);

        // 3. Merge sanitized payload into the existing data.
        // This preserves fields that aren't on the current form tab.
        const mergedData = deepmerge(existingData, sanitizedPayload);
        
        // 4. Validate the final, complete object.
        const parsed = HomepageSchema.parse(mergedData);
        
        // 5. Save the complete object, overwriting the document.
        await docRef.set(parsed, { merge: false });
        
        revalidatePath("/", "layout");

        // 6. Log the action with the final saved data as the snapshot.
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
