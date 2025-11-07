
import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin"; // existing admin app
import { CaseSchema } from "@/lib/schemas";

export async function GET() {
  const snap = await getDb().collection("cases").orderBy("title").get();
  const data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  return NextResponse.json({ ok: true, data });
}

export async function POST() {
  const doc = {
    status: "draft",
    title: "Untitled case",
    slug: `case-${Date.now()}`,
    excerpt: "",
    cover: { src: "", alt: "" },
    content: "",
    tags: [],
  };
  // Validate defaults
  CaseSchema.parse(doc);
  const ref = await getDb().collection("cases").add(doc);
  return NextResponse.json({ ok: true, id: ref.id });
}
