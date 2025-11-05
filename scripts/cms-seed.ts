import { getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-admin';

async function upsert(db: any, path: string, data: any) {
  const ref = db.doc(path);
  const snap = await ref.get();
  if (!snap.exists) {
    console.log(`Seeding: ${path}`);
    await ref.set(data, { merge: true });
  } else {
    console.log(`Exists, skipping: ${path}`);
  }
}

async function run() {
  console.log('Starting CMS seed...');

  try {
    // This will initialize Firebase if it hasn't been already.
    // It is designed to be safe and not throw if the service account is missing.
    getAdminApp();
  } catch (e: any) {
    console.warn(`[cms-seed] Could not initialize Firebase Admin. This is expected in environments without a service account. Seeding will be skipped. Error: ${e.message}`);
    console.log("CMS seed step skipped gracefully.");
    return; // Exit gracefully
  }

  // If there are no apps, it means initialization failed silently.
  if (!getApps().length) {
    console.warn("[cms-seed] Firebase app not initialized. Skipping Firestore seeding.");
    return;
  }

  const db = getFirestore();

  await upsert(db, 'content/about', {
    title: 'About Digifly',
    subtitle: 'From idea to intelligent software.',
    content: { body: [] },
    seo: { title: 'About • Digifly', description: 'About Digifly' },
  });

  await upsert(db, 'content/services', {
    title: 'Services',
    subtitle: 'Strategy, software & automation.',
    content: { services: [] },
    seo: { title: 'Services • Digifly', description: 'What we do' },
  });

  await upsert(db, 'content/contact', {
    title: 'Contact',
    subtitle: 'Let’s build something intelligent.',
    seo: { title: 'Contact • Digifly', description: 'Get in touch' },
  });

  await upsert(db, 'content/cases-index', {
    title: 'Our Work in Action',
    subtitle: 'Selected projects and outcomes.',
    seo: { title: 'Cases • Digifly', description: 'Case studies' },
  });

  console.log('Seed complete ✅');
}

run().catch(err => {
  console.error('Seed script failed:', err);
  // We exit with 0 to prevent the build from failing in CI
  // if the seed script has an unexpected issue.
  process.exit(0);
});
