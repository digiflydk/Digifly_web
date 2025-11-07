
import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";
import { CaseSchema } from "@/lib/schemas";

type Ctx = { params: { id: string } };

export async function GET(_: Request, { params }: Ctx) {
  const ref = getDb().collection("cases").doc(params.id);
  const snap = await ref.get();
  if (!snap.exists) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, data: { id: snap.id, ...(snap.data() as any) } });
}

export async function PUT(req: Request, { params }: Ctx) {
  const body = await req.json();
  const parsed = CaseSchema.parse(body);
  await getDb().collection("cases").doc(params.id).set(parsed, { merge: true });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: Ctx) {
  await getDb().collection("cases").doc(params.id).delete();
  return NextResponse.json({ ok: true });
}
