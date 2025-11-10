
import { getFirestore, DocumentReference } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-admin';
import { ALL_DEFAULTS, defaultCases, SITE_DEFAULTS } from '@/lib/defaults/siteDefaults';
import { SiteSettingsSchema, NavigationSchema, HomepageSchema, CaseSchema } from '@/lib/schemas';
import { z } from 'zod';

const SCHEMAS: Record<string, z.ZodSchema<any>> = {
    'site/settings': SiteSettingsSchema,
    'navigation/main': NavigationSchema.pick({ header: true }),
    'navigation/footer': NavigationSchema.pick({ footer: true }),
    'pages/home': HomepageSchema,
};

async function upsert(db: FirebaseFirestore.Firestore, path: string, data: any, merge = true) {
  const ref = db.doc(path);
  console.log(`[SEED] Upserting: ${path}`);
  await ref.set(data, { merge });
}

async function run() {
  console.log('[SEED] Starting CMS data seed...');

  let db;
  try {
    getAdminApp();
    db = getFirestore();
  } catch (e: any) {
    console.warn(`[SEED] Could not initialize Firebase Admin. This is expected in environments without a service account. Seeding will be skipped. Error: ${e.message}`);
    console.log("[SEED] Gracefully skipped.");
    return;
  }

  // Upsert site/settings specifically
  const siteSettingsRef = db.doc('site/settings');
  const siteSettingsSnap = await siteSettingsRef.get();
  const currentSiteSettings = siteSettingsSnap.exists ? siteSettingsSnap.data() : {};
  const mergedSiteSettings = { ...SITE_DEFAULTS, ...currentSiteSettings };
  const siteParsed = SiteSettingsSchema.safeParse(mergedSiteSettings);
  if (siteParsed.success) {
    await upsert(db, 'site/settings', siteParsed.data);
  } else {
    console.warn(`[SEED] Validation failed for site/settings. Seeding with pure defaults.`, siteParsed.error.format());
    await upsert(db, 'site/settings', SITE_DEFAULTS);
  }
  console.log("[SEED] site/settings ready");
  
  // Upsert other singleton documents from ALL_DEFAULTS
  for (const [path, defaultData] of Object.entries(ALL_DEFAULTS)) {
    if (path === 'site/settings') continue; // Already handled

    const docRef = db.doc(path) as DocumentReference<any>;
    const snap = await docRef.get();
    const currentData = snap.exists ? snap.data() : {};
    
    // Merge defaults over current data to fill in missing fields
    const mergedData = { ...defaultData, ...currentData };

    const schema = SCHEMAS[path];
    if (schema) {
        const parsed = schema.safeParse(mergedData);
        if (parsed.success) {
            await upsert(db, path, parsed.data);
        } else {
            console.warn(`[SEED] Validation failed for ${path}. Using pure defaults.`, parsed.error.format());
            await upsert(db, path, defaultData);
        }
    } else {
        await upsert(db, path, mergedData);
    }
  }

  // Idempotently upsert default cases
  for (const caseData of defaultCases) {
    const q = db.collection('cases').where('slug', '==', caseData.slug).limit(1);
    const snap = await q.get();
    if (snap.empty) {
        console.log(`[SEED] Creating case: ${caseData.slug}`);
        await db.collection('cases').add(caseData);
    } else {
        const docRef = snap.docs[0].ref;
        const existingData = snap.docs[0].data();
        const mergedData = { ...caseData, ...existingData }; // Existing data takes precedence
        const parsed = CaseSchema.safeParse(mergedData);
        if (parsed.success) {
            await docRef.set(parsed.data, { merge: true });
        } else {
            console.warn(`[SEED] Skipping update for case ${caseData.slug} due to validation errors.`);
        }
    }
  }

  console.log('[SEED] CMS data seed complete ✅');
}

run().catch(err => {
  console.error('[SEED] Script failed:', err);
  process.exit(1);
});
