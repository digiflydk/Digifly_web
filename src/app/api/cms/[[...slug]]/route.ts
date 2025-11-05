import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { zDesignTokens, zNavigation, zHome } from "@/lib/cms-schemas";

export const revalidate = 60;

function cache() {
  return { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" };
}

export async function GET(_req: Request, { params }: { params: { slug?: string[] } }) {
  const path = (params.slug || []).join("/");
  try {
    if (!path || path === "health") {
      return NextResponse.json({ ok: true, ts: Date.now() }, { headers: cache() });
    }

    if (path === "design") {
      const snap = await db.doc("content/settings/design").get();
      const data = zDesignTokens.parse(snap.data());
      return NextResponse.json(data, { headers: cache() });
    }

    if (path === "navigation") {
      const snap = await db.doc("content/navigation").get();
      const data = zNavigation.parse(snap.data());
      return NextResponse.json(data, { headers: cache() });
    }

    if (path === "home") {
      const snap = await db.doc("content/home").get();
      const data = zHome.parse(snap.data());
      return NextResponse.json(data, { headers: cache() });
    }

    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  } catch (err: any) {
    console.error(`Error in /api/cms/${path}:`, err);
    return NextResponse.json({ error: err.message || "Invalid data" }, { status: 400 });
  }
}
