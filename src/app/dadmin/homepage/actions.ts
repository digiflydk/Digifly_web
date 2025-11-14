
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

const overwriteMerge = (destinationArray: any[], sourceArray: any[], options: deepmerge.Options): any[] => sourceArray;

export async function saveHomepageAction(payload: unknown): Promise<{ ok: boolean; error?: string; issues?: any[] }> {
    try {
        const db = await getDb();
        const docRef = db.doc(CMS_PATHS.page('home'));

        const existingSnap = await docRef.get();
        const existingData = existingSnap.exists ? existingSnap.data() : {};
        const sanitizedPayload = sanitizeHomepage(payload);
        
        // DGF-368: Use a custom merge strategy to overwrite arrays instead of concatenating them.
        const mergedData = deepmerge(existingData, sanitizedPayload, {
            arrayMerge: overwriteMerge
        });
        
        const parsed = HomepageSchema.parse(mergedData);
        
        await docRef.set(parsed, { merge: false });
        
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
