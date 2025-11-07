import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";
import { HomepageSchema } from "@/lib/schemas";

type Ctx = { params: { slug: string } };

const col = () => getDb().collection("pages");

export async function GET(_: Request, { params }: Ctx) {
  const ref = col().doc(params.slug);
  const snap = await ref.get();
  if (!snap.exists) return NextResponse.json({ ok: true, data: null });
  const data = snap.data();
  // For home, validate to guard regressions
  if (params.slug === "home") HomepageSchema.parse(data);
  return NextResponse.json({ ok: true, data });
}

export async function PUT(req: Request, { params }: Ctx) {
  const body = await req.json();
  if (params.slug === "home") HomepageSchema.parse(body);
  await col().doc(params.slug).set(body, { merge: true });
  return NextResponse.json({ ok: true });
}
