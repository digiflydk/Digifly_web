
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase-admin';
import { 
  navigation,
  homePage,
  aboutPage,
  servicesPage,
  contactPage,
  casesIndexPage, 
  cases 
} from '@/lib/cms-data';
import { SiteSettingsSchema } from '@/lib/schemas';

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

  const db = getFirestore(getAdminApp());
  
  // Site Settings (Canonical Path)
  const siteSettingsData = {
    siteTitle: "Digifly",
    social: {
      tagline: "Strategy, Software & Automation with AI."
    },
    brand: {
      name: "Digifly",
      logo: { src: "https://i.postimg.cc/yxjNkX5M/digifly-logo.png", alt: "Digifly Logo" },
      favicon: { src: "https://i.postimg.cc/VvP3vfcP/favicon.png" }
    },
    defaultSeo: {
      description: "We build intelligent digital solutions."
    }
  };
  const parsedSiteSettings = SiteSettingsSchema.parse(siteSettingsData);
  await upsert(db, 'site/settings', parsedSiteSettings);

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
