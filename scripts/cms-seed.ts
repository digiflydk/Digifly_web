import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!serviceAccountJson) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set.');
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountJson);
} catch (e) {
  throw new Error('Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON. Ensure it is valid JSON.');
}

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}

const db = getFirestore();

async function upsert(path: string, data: any) {
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

  await upsert('content/about', {
    title: 'About Digifly',
    subtitle: 'From idea to intelligent software.',
    content: { body: [] },
    seo: { title: 'About • Digifly', description: 'About Digifly' },
  });

  await upsert('content/services', {
    title: 'Services',
    subtitle: 'Strategy, software & automation.',
    content: { services: [] },
    seo: { title: 'Services • Digifly', description: 'What we do' },
  });

  await upsert('content/contact', {
    title: 'Contact',
    subtitle: 'Let’s build something intelligent.',
    seo: { title: 'Contact • Digifly', description: 'Get in touch' },
  });

  await upsert('content/cases-index', {
    title: 'Our Work in Action',
    subtitle: 'Selected projects and outcomes.',
    seo: { title: 'Cases • Digifly', description: 'Case studies' },
  });

  console.log('Seed complete ✅');
}

run().catch(err => {
  console.error('Seed script failed:', err);
  process.exit(1);
});
