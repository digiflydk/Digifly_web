
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-admin';

async function run() {
  console.log('Starting site config migration...');

  try {
    getAdminApp();
  } catch (e: any) {
    console.warn(`[migrate-site-config] Could not initialize Firebase Admin. Seeding will be skipped. Error: ${e.message}`);
    return;
  }

  const db = getFirestore();
  const legacyRef = db.collection('site').doc('config');
  const newRef = db.collection('site').doc('settings');

  const [legacySnap, newSnap] = await Promise.all([legacyRef.get(), newRef.get()]);

  if (newSnap.exists) {
    console.log('✅ New document `site/settings` already exists. No action needed.');
    return;
  }

  if (!legacySnap.exists) {
    console.log('Legacy document `site/config` not found. Seeding new `site/settings` with defaults.');
    await newRef.set({
      siteTitle: "Digifly",
      brand: {
        name: "Digifly",
        logo: { src: "https://example.com/logo.png", alt: "Digifly Logo" },
        favicon: { src: "/favicon.ico" }
      },
      social: {
        tagline: "Strategy, Software & Automation with AI."
      },
      defaultSeo: {
        description: "Digifly builds intelligent digital solutions."
      }
    });
    console.log('✅ Created `site/settings` with default values.');
    return;
  }

  const legacyData = legacySnap.data() as any;
  const newData = {
    siteTitle: legacyData.siteTitle || 'Digifly',
    social: {
      tagline: legacyData.tagline || 'Strategy, Software & Automation with AI.',
    },
    brand: {
      name: legacyData.brand?.name || 'Digifly',
      logo: {
        src: legacyData.logoUrl || legacyData.brand?.logo?.src || 'https://example.com/logo.png',
        alt: legacyData.brand?.logo?.alt || 'Digifly Logo',
      },
      favicon: {
        src: legacyData.faviconUrl || legacyData.brand?.favicon?.src || '/favicon.ico',
      },
    },
    defaultSeo: {
      description: legacyData.defaultDescription || 'Digifly builds intelligent digital solutions.',
    },
    migratedFrom: 'site/config',
    migratedAt: new Date().toISOString(),
  };

  await newRef.set(newData);
  console.log('✅ Successfully migrated data from `site/config` to `site/settings`.');
  console.log('You can now safely delete the `site/config` document in Firestore.');
}

run().catch(err => {
  console.error('Migration script failed:', err);
  process.exit(1);
});
