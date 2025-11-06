import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-admin';
import { homePage, navigation, designSettings, aboutPage, servicesPage, casesIndexPage, contactPage, cases } from '@/lib/cms-data';

async function upsert(db: any, path: string, data: any) {
  const ref = db.doc(path);
  const snap = await ref.get();
  if (!snap.exists) {
    console.log(`Seeding: ${path}`);
    await ref.set(data, { merge: true });
  } else {
    // For this project, we'll overwrite to ensure defaults are applied
    console.log(`Overwriting: ${path}`);
    await ref.set(data, { merge: true });
  }
}

async function run() {
  console.log('Starting CMS seed...');

  try {
    getAdminApp();
  } catch (e: any) {
    console.warn(`[cms-seed] Could not initialize Firebase Admin. This is expected in environments without a service account. Seeding will be skipped. Error: ${e.message}`);
    console.log("CMS seed step skipped gracefully.");
    return;
  }

  if (!getApps().length) {
    console.warn("[cms-seed] Firebase app not initialized. Skipping Firestore seeding.");
    return;
  }

  const db = getFirestore();

  // Upsert single-instance docs
  await upsert(db, 'content/design', designSettings);
  await upsert(db, 'content/navigation', navigation);
  await upsert(db, 'content/home', homePage);
  await upsert(db, 'content/about', aboutPage);
  await upsert(db, 'content/services', servicesPage);
  await upsert(db, 'content/contact', contactPage);
  await upsert(db, 'content/cases-index', casesIndexPage);

  // Upsert collection docs (cases)
  for (const caseDoc of cases) {
    const caseRef = db.collection('cases').doc(caseDoc.slug);
    const snap = await caseRef.get();
    if (!snap.exists) {
        console.log(`Seeding case: ${caseDoc.slug}`);
        await caseRef.set(caseDoc);
    } else {
        console.log(`Overwriting case: ${caseDoc.slug}`);
        await caseRef.set(caseDoc, { merge: true });
    }
  }


  console.log('Seed complete ✅');
}

run().catch(err => {
  console.error('Seed script failed:', err);
  process.exit(0);
});
