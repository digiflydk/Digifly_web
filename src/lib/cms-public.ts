import "server-only";
import { db } from "./firebase/client";
import { doc, getDoc } from "firebase/firestore";
import { HomepageSchema, NavigationSchema, SiteSettingsSchema } from "./schemas";
import { sanitizeHomepage } from "./cms-sanitize";
import { defaultHomepage, defaultNavigation } from "./defaults/siteDefaults";
import { coerceToDefaults } from "@/components/dadmin/site-seo/utils/formDefaults";

export async function getHomepagePublic(project = "default") {
    const path = `site/${project}/content/homepage`;
    try {
        const snap = await getDoc(doc(db, path));
        const data = snap.exists() ? snap.data() : {};
        const sanitized = sanitizeHomepage(data);
        return HomepageSchema.parse(sanitized);
    } catch (err) {
        console.error(`[cms-public] Failed to read ${path}`, err);
        return defaultHomepage;
    }
}

export async function getNavigationPublic(project = "default") {
    const path = `site/${project}/content/navigation`;
    try {
        const snap = await getDoc(doc(db, path));
        const data = snap.exists() ? snap.data() : {};
        return NavigationSchema.parse(data);
    } catch (err) {
        console.error(`[cms-public] Failed to read ${path}`, err);
        return defaultNavigation;
    }
}

export async function getSiteSettingsPublic(project = "default") {
    const path = `site/${project}/public/settings`; // Assuming settings are public
    try {
        const snap = await getDoc(doc(db, path));
        const data = snap.exists() ? snap.data() : {};
        return SiteSettingsSchema.parse(coerceToDefaults(data));
    } catch (err) {
        console.error(`[cms-public] Failed to read ${path}`, err);
        return coerceToDefaults({});
    }
}
