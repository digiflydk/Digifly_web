import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";
import { HomepageSchema, AboutPageSchema, ServicesPageSchema, CasesIndexSchema, ContactPageSchema } from "@/lib/schemas";
import { z } from "zod";

type RouteCtx = { params: Promise<{ slug: string }> };

const col = async () => (await getDb()).collection("pages");

const schemaMap: Record<string, z.ZodSchema<any>> = {
    'home': HomepageSchema,
    'about': AboutPageSchema,
    'services': ServicesPageSchema,
    'cases-index': CasesIndexSchema,
    'contact': ContactPageSchema,
};

export async function GET(_: Request, ctx: RouteCtx) {
  const { slug } = await ctx.params;
  const ref = (await col()).doc(slug);
  const snap = await ref.get();
  if (!snap.exists) return NextResponse.json({ ok: true, data: null });
  const data = snap.data();
  
  const schema = schemaMap[slug];
  if (schema) {
      const parsed = schema.safeParse(data);
      if (!parsed.success) {
          console.warn(`[GET /api/cms/pages/${slug}] Zod validation failed`, parsed.error);
          // Return the data anyway, but log the error
      }
  }
  
  return NextResponse.json({ ok: true, data });
}

export async function PUT(req: Request, ctx: RouteCtx) {
  const { slug } = await ctx.params;
  const body = await req.json();
  const schema = schemaMap[slug];
  if (schema) {
      const parsed = schema.parse(body); // Throws on error
      await (await col()).doc(slug).set(parsed, { merge: true });
  } else {
      await (await col()).doc(slug).set(body, { merge: true });
  }
  return NextResponse.json({ ok: true });
}
