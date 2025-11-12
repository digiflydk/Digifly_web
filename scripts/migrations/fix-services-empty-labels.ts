
import { getDb } from "@/lib/firebase-admin";
import { defaultHomepage } from "@/lib/defaults/siteDefaults";
import { HomepageSchema } from "@/lib/schemas";
import deepmerge from "deepmerge";

async function run() {
  console.log('Starting one-time migration: fix-services-empty-labels...');
  
  const ref = getDb().doc("pages/home");
  const snap = await ref.get();
  
  if (!snap.exists) {
    console.log("Homepage document missing at `pages/home`. No action taken.");
    return;
  }

  const data: any = snap.data();
  let wasModified = false;

  if (data?.services?.items?.length) {
    data.services.items = data.services.items.map((it: any) => {
      // Ensure 'link' is an object
      const link = (it && typeof it.link === 'object' && it.link !== null) ? { ...it.link } : {};
      const originalLabel = link.label;

      // Fallback label to title if it's missing or empty
      if (!link.label || String(link.label).trim() === "") {
        link.label = String(it?.title ?? "").trim();
        if (originalLabel !== link.label) {
          wasModified = true;
        }
      }
      
      // Ensure mutual exclusivity of link targets
      if (link.type === "internal") {
        if (link.externalUrl) {
          link.externalUrl = "";
          wasModified = true;
        }
      } else if (link.type === "external") {
        if (link.internalRef) {
          link.internalRef = "";
          wasModified = true;
        }
      }
      
      return { ...it, link };
    });
  }

  if (wasModified) {
    // Merge with defaults before final parse and save to ensure full compliance
    const merged = deepmerge(defaultHomepage, data ?? {});
    const parsed = HomepageSchema.parse(merged);
    await ref.set(parsed, { merge: false });
    console.log("✅ Successfully fixed empty link.labels in homepage services.");
  } else {
    console.log("✅ No empty link labels found. No migration needed.");
  }
}

run().catch(err => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});

    