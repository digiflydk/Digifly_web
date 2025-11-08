"use server";

import { getDb } from "@/lib/firebase-admin";
import { CaseSchema, type CaseDoc } from "@/lib/schemas.case";
import { z } from "zod";

const COLLECTION = "cases";

function docToCase(id: string, data: FirebaseFirestore.DocumentData): CaseDoc {
  const parsed = CaseSchema.safeParse({ id, ...data });
  if (!parsed.success) {
    // Fallback to minimal safe object, but keep raw values to not lose data
    return {
      id,
      slug: data.slug || id,
      title: data.title || "Untitled",
      excerpt: data.excerpt || "",
      body: data.body || "",
      coverImage: data.coverImage || { src: "", alt: "" },
      gallery: data.gallery || [],
      client: data.client,
      featured: !!data.featured,
      published: data.published ?? true,
      metrics: data.metrics,
      dates: data.dates,
      seo: data.seo || {},
    };
  }
  return parsed.data;
}

export async function getCases(opts?: { published?: boolean; limit?: number }) {
  const db = getDb();
  let q: FirebaseFirestore.Query = db.collection(COLLECTION).orderBy("title");
  if (opts?.published === true) q = q.where("published", "==", true);
  if (opts?.limit) q = q.limit(opts.limit);

  const snap = await q.get();
  return snap.docs.map((d) => docToCase(d.id, d.data()));
}

export async function getCaseById(id: string) {
  const db = getDb();
  const ref = db.collection(COLLECTION).doc(id);
  const snap = await ref.get();
  if (!snap.exists) return null;
  return docToCase(snap.id, snap.data()!);
}

export async function getCaseBySlug(slug: string) {
  const db = getDb();
  const q = await db.collection(COLLECTION).where("slug", "==", slug).limit(1).get();
  if (q.empty) return null;
  const d = q.docs[0];
  return docToCase(d.id, d.data());
}

export async function createCase(input: unknown) {
  const parsed = CaseSchema.safeParse(input);
  if (!parsed.success) {
    throw new z.ZodError(parsed.error.errors);
  }
  const { id, ...payload } = parsed.data;
  const db = getDb();
  const ref = await db.collection(COLLECTION).add({
    ...payload,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  });
  const snap = await ref.get();
  return docToCase(snap.id, snap.data()!);
}

export async function updateCase(id: string, input: unknown) {
  const parsed = CaseSchema.partial().safeParse(input);
  if (!parsed.success) {
    throw new z.ZodError(parsed.error.errors);
  }
  const db = getDb();
  const ref = db.collection(COLLECTION).doc(id);
  await ref.set(
    { ...parsed.data, updatedAt: new Date().toISOString() },
    { merge: true }
  );
  const snap = await ref.get();
  if (!snap.exists) return null;
  return docToCase(snap.id, snap.data()!);
}

export async function deleteCase(id: string) {
  const db = getDb();
  await db.collection(COLLECTION).doc(id).delete();
  return { ok: true as const };
}
