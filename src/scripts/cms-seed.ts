
import { getFirestore, DocumentReference } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-admin';
import { ALL_DEFAULTS, defaultCases } from '@/lib/defaults/siteDefaults';
import { SiteSettingsSchema, NavigationSchema, HomepageSchema, CaseSchema } from '@/lib/schemas';
import { z } from 'zod';

const hasAdminCreds = !!process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (!hasAdminCreds) {
  console.log('[cms:seed] No admin credentials detected — skipping seeding (CI-safe).');
  process.exit(0);
}

const SCHEMAS: Record<string, z.ZodSchema<any>> = {
    'site/settings': SiteSettingsSchema,
    'navigation/main': z.object({ header: z.array(z.object({ label: z.string(), href: z.string() })) }),
    'navigation/footer': z.object({ footer: z.any() }), // simple footer schema
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
  
  // Upsert singleton documents from ALL_DEFAULTS
  for (const [path, defaultData] of Object.entries(ALL_DEFAULTS)) {
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
  const casesSeed: Array<z.infer<typeof CaseSchema>> = defaultCases;
  for (const caseData of casesSeed) {
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
