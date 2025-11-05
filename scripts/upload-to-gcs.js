import { Storage } from '@google-cloud/storage';
import { readdirSync, statSync } from 'node:fs';
import { join, sep } from 'node:path';

export async function publishToGCS(localDir, buildStamp) {
  const bucketName = process.env.QA_REPORTS_BUCKET;
  if (!bucketName) {
    console.warn('[qa] QA_REPORTS_BUCKET env not set; skipping upload.');
    return null;
  }

  const storage = new Storage(); // uses ADC in App Hosting
  const bucket = storage.bucket(bucketName);

  const prefix = `playwright/${buildStamp}/`; // folder per build

  // recursive upload
  async function uploadDir(dir, rel = '') {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const full = join(dir, entry);
      const st = statSync(full);
      const relPath = rel ? `${rel}/${entry}` : entry;
      if (st.isDirectory()) await uploadDir(full, relPath);
      else {
        await bucket.upload(full, { destination: `${prefix}${relPath}`, gzip: true, metadata: { cacheControl: 'public, max-age=300' } });
      }
    }
  }

  await uploadDir(localDir);

  // If bucket is public, this is the public URL to index:
  const url = `https://storage.googleapis.com/${bucketName}/${prefix}index.html`;
  return url;
}
