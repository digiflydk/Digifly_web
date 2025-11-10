
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-admin';
import { ALL_DEFAULTS, defaultCases, SITE_DEFAULTS } from '@/lib/defaults/siteDefaults';
import { CaseSchema } from '@/lib/schemas';
import { z } from 'zod';
import { merge } from 'lodash';

// Simplified schema map for seed script
const SCHEMAS: Record<string, z.ZodSchema<any>> = {
  'site/settings': z.any(),
  'navigation/main': z.any(),
  'navigation/footer': z.any(),
  'pages/home': z.any(),
};

async function upsert(db: FirebaseFirestore.Firestore, path: string, data: any, doMerge = true) {
  const ref = db.doc(path);
  console.log(`[SEED] Upserting: ${path}`);
  await ref.set(data, { merge: doMerge });
}

async function run() {
  console.log('[SEED] Starting CMS data seed...');

  let db;
  try {
    getAdminApp();
    db = getFirestore();
  } catch (e: any) {
    console.warn(`[SEED] Could not initialize Firebase Admin. Seeding will be skipped. Error: ${e.message}`);
    return;
  }

  // Handle site/settings with deep merge
  const siteSettingsRef = db.doc('site/settings');
  const siteSettingsSnap = await siteSettingsRef.get();
  const currentSiteSettings = siteSettingsSnap.exists ? siteSettingsSnap.data() : {};
  const mergedSiteSettings = merge({}, SITE_DEFAULTS, currentSiteSettings); // lodash merge for deep merge
  await upsert(db, 'site/settings', mergedSiteSettings, false); // use set without merge as we've already merged
  console.log("[SEED] site/settings ready");

  // Upsert other singleton documents
  for (const [path, defaultData] of Object.entries(ALL_DEFAULTS)) {
    if (path === 'site/settings') continue; // Already handled

    const docRef = db.doc(path);
    const snap = await docRef.get();
    const currentData = snap.exists ? snap.data() : {};
    
    const mergedData = { ...defaultData, ...currentData };
    await upsert(db, path, mergedData);
  }

  // Idempotently upsert default cases
  for (const caseData of defaultCases) {
    const q = db.collection('cases').where('slug', '==', caseData.slug).limit(1);
    const snap = await q.get();
    if (snap.empty) {
        console.log(`[SEED] Creating case: ${caseData.slug}`);
        const parsed = CaseSchema.parse(caseData);
        await db.collection('cases').add(parsed);
    } else {
        const docRef = snap.docs[0].ref;
        const existingData = snap.docs[0].data();
        const mergedData = { ...caseData, ...existingData };
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
