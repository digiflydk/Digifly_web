
import { getFirestore, DocumentReference } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-admin';
import { ALL_DEFAULTS, defaultCases, defaultNavigation } from '@/lib/defaults/siteDefaults';
import { SiteSettingsSchema, NavigationSchema, HomepageSchema, CaseSchema } from '@/lib/schemas';
import { z } from 'zod';
import { normalizeLink } from '@/lib/links';
import { normalizeHome } from '@/lib/defaults/siteDefaults';
import { CMS_PATHS } from '@/lib/constants';

const hasAdminCreds = !!process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (!hasAdminCreds) {
  console.log('[cms:seed] No admin credentials detected — skipping seeding (CI-safe).');
  process.exit(0);
}

const SCHEMAS: Record<string, z.ZodSchema<any>> = {
    [CMS_PATHS.site]: SiteSettingsSchema,
    [CMS_PATHS.navigation]: NavigationSchema,
    [CMS_PATHS.page('home')]: HomepageSchema,
};

async function upsert(db: FirebaseFirestore.Firestore, path: string, data: any, merge = true) {
  const ref = db.doc(path);
  console.log(`[SEED] Upserting: ${path}`);
  await ref.set(data, { merge });
}

// Function to consolidate old navigation documents into the new single document
async function migrateLegacyNavigation(db: FirebaseFirestore.Firestore) {
    const mainRef = db.doc('navigation/main');
    const footerRef = db.doc('navigation/footer');
    const newNavRef = db.doc(CMS_PATHS.navigation);

    const [mainSnap, footerSnap, newNavSnap] = await Promise.all([mainRef.get(), footerRef.get(), newNavRef.get()]);

    if (newNavSnap.exists) {
        console.log('[SEED] New navigation document already exists. Skipping migration.');
        return; // New doc already exists, no migration needed
    }

    if (!mainSnap.exists && !footerSnap.exists) {
        console.log('[SEED] No legacy navigation docs found. Seeding new default navigation.');
        await upsert(db, CMS_PATHS.navigation, defaultNavigation);
        return;
    }

    console.log('[SEED] Migrating legacy navigation documents to cms/navigation...');
    
    const header = mainSnap.exists ? (mainSnap.data()?.header || []) : [];
    const footer = footerSnap.exists ? (footerSnap.data()?.footer || { columns: [] }) : { columns: [] };

    const migratedData = { header, footer };
    const parsed = NavigationSchema.parse(migratedData); // Validate against the schema
    
    await upsert(db, CMS_PATHS.navigation, parsed);

    // Optional: Delete old documents after successful migration
    // await mainRef.delete();
    // await footerRef.delete();
    console.log('[SEED] Legacy navigation migration complete.');
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
  
  await migrateLegacyNavigation(db);

  // Singleton documents other than navigation
  const singletonPaths = [CMS_PATHS.site, CMS_PATHS.page('home')];

  for (const path of singletonPaths) {
      const defaultData = (ALL_DEFAULTS as any)[path];
      if (!defaultData) continue;

      const docRef = db.doc(path);
      const snap = await docRef.get();
      let currentData = snap.exists ? snap.data() : {};

      if (path === 'pages/home') {
          currentData = normalizeHome(currentData);
      }
      
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
