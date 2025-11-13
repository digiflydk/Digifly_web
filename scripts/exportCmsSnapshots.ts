// scripts/exportCmsSnapshots.ts
import fs from "node:fs";
import path from "node:path";
import { getDb } from "@/lib/firebase/admin"; // or "@/lib/firebase-admin" depending on repo
import { CMS_PATHS } from "@/lib/constants";

async function main() {
  const db = await getDb();
  console.log("[SNAPSHOT] Firestore DB initialized.");

  const snapshotsDir = path.join(process.cwd(), "DOCS", "snapshots");
  fs.mkdirSync(snapshotsDir, { recursive: true });

  const writeSnapshot = (collection: string, id: string, data: any) => {
    const filename = `${collection.replace(/\//g, '-')}-${id}.json`;
    const fullPath = path.join(snapshotsDir, filename);
    const content = {
      collection,
      id,
      data: data ? JSON.parse(JSON.stringify(data)) : null, // Ensure serializable
    };
    fs.writeFileSync(fullPath, JSON.stringify(content, null, 2));
    console.log(`[SNAPSHOT] Wrote: ${filename}`);
  };

  // --- SINGLE DOCS ---
  const singleDocPaths = [
    { key: 'site-settings', path: CMS_PATHS.site },
    { key: 'site-navigation', path: CMS_PATHS.navigation },
    { key: 'pages-home', path: CMS_PATHS.page('home') },
    { key: 'pages-about', path: CMS_PATHS.page('about') },
    { key: 'pages-services', path: CMS_PATHS.page('services') },
    { key: 'pages-contact', path: CMS_PATHS.page('contact') },
    { key: 'pages-cases-index', path: CMS_PATHS.page('cases-index') },
  ];

  for (const { key, path: docPath } of singleDocPaths) {
    const docSnap = await db.doc(docPath).get();
    const [collection, id] = docPath.split('/');
    writeSnapshot(collection, id, docSnap.data());
  }

  // --- COLLECTIONS ---
  const collectionsToExport = [
    { key: 'cases', path: CMS_PATHS.cases },
  ];
  
  for (const { key, path: collectionPath } of collectionsToExport) {
    const colSnap = await db.collection(collectionPath).get();
    if (colSnap.empty) {
      console.log(`[SNAPSHOT] Collection '${collectionPath}' is empty. Skipping.`);
      continue;
    }
    colSnap.forEach(doc => {
       writeSnapshot(collectionPath, doc.id, doc.data());
    });
  }

  console.log("✅ CMS snapshots written to DOCS/snapshots");
}

main().catch((err) => {
  console.error("❌ exportCmsSnapshots failed:", err);
  process.exit(1);
});