
"use server";
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-admin';
import type { SiteSettings } from '@/lib/schemas';

const COLLECTION = 'site';
const DOC = 'settings';

export async function getSiteSettings(): Promise<SiteSettings | null> {
    try {
        const db = getFirestore(getAdminApp());
        const snap = await db.collection(COLLECTION).doc(DOC).get();
        if (!snap.exists) return null;
        return snap.data() as SiteSettings;
    } catch (e) {
        console.error("Failed to get site settings:", e);
        return null;
    }
}

export async function setSiteSettings(data: SiteSettings): Promise<void> {
    try {
        const db = getFirestore(getAdminApp());
        await db.collection(COLLECTION).doc(DOC).set(data, { merge: true });
    } catch (e) {
        console.error("Failed to set site settings:", e);
        throw new Error("Firestore write failed.");
    }
}
