
import { NextResponse } from "next/server";
import { getNavigation, updateNavigation } from "@/lib/server/cms-actions";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const json = (data: any, status = 200) => NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' }});

export async function GET() {
  try {
    const data = await getNavigation();
    return json({ ok: true, data });
  } catch (e: any) {
    return json({ ok: false, error: 'Failed to load navigation', details: e.message }, 500);
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    await updateNavigation(body);
    return json({ ok: true });
  } catch (err: any) {
    const issues = err?.issues ?? [{ message: err?.message ?? "Invalid payload" }];
    return NextResponse.json({ ok: false, issues }, { status: 400 });
  }
}
