
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-admin';
import { 
  homePage, 
  navigation, 
  designSettings, 
  aboutPage, 
  servicesPage, 
  contactPage, 
  casesIndexPage, 
  cases 
} from '@/lib/cms-data';

// This function is idempotent. It will create or overwrite documents.
async function upsert(db: any, path: string, data: any, merge = true) {
  const ref = db.doc(path);
  console.log(`Upserting: ${path}`);
  await ref.set(data, { merge });
}

async function run() {
  console.log('Starting CMS data migration...');

  try {
    getAdminApp();
  } catch (e: any) {
    console.warn(`[cms-seed] Could not initialize Firebase Admin. This is expected in environments without a service account. Seeding will be skipped. Error: ${e.message}`);
    console.log("CMS seed step skipped gracefully.");
    return;
  }

  const db = getFirestore();

  // Site Settings
  await upsert(db, 'site/settings', designSettings);
  
  // Navigation
  await upsert(db, 'navigation/main', { items: navigation.header });
  await upsert(db, 'navigation/footer', { items: navigation.footer.columns.flatMap(c => c.links) });
  
  // Singleton Pages
  await upsert(db, 'pages/home', homePage);
  await upsert(db, 'pages/about', aboutPage);
  await upsert(db, 'pages/services', servicesPage);
  await upsert(db, 'pages/contact', contactPage);
  await upsert(db, 'pages/cases-index', casesIndexPage);

  // Collection: Cases
  for (const caseDoc of cases) {
    await upsert(db, `cases/${caseDoc.slug}`, caseDoc);
  }

  console.log('CMS data migration complete ✅');
}

run().catch(err => {
  console.error('Migration script failed:', err);
  process.exit(1);
});
