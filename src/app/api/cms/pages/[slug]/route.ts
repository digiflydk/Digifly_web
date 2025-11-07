import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";
import { HomepageSchema, AboutPageSchema, ServicesPageSchema, CasesIndexSchema, ContactPageSchema } from "@/lib/schemas";
import { z } from "zod";

type Ctx = { params: { slug: string } };

const col = () => getDb().collection("pages");

const schemaMap: Record<string, z.ZodSchema<any>> = {
    'home': HomepageSchema,
    'about': AboutPageSchema,
    'services': ServicesPageSchema,
    'cases-index': CasesIndexSchema,
    'contact': ContactPageSchema,
};

export async function GET(_: Request, { params }: Ctx) {
  const ref = col().doc(params.slug);
  const snap = await ref.get();
  if (!snap.exists) return NextResponse.json({ ok: true, data: null });
  const data = snap.data();
  
  const schema = schemaMap[params.slug];
  if (schema) {
      const parsed = schema.safeParse(data);
      if (!parsed.success) {
          console.warn(`[GET /api/cms/pages/${params.slug}] Zod validation failed`, parsed.error);
          // Return the data anyway, but log the error
      }
  }
  
  return NextResponse.json({ ok: true, data });
}

export async function PUT(req: Request, { params }: Ctx) {
  const body = await req.json();
  const schema = schemaMap[params.slug];
  if (schema) {
      const parsed = schema.parse(body); // Throws on error
      await col().doc(params.slug).set(parsed, { merge: true });
  } else {
      await col().doc(params.slug).set(body, { merge: true });
  }
  return NextResponse.json({ ok: true });
}
