
"use server";

import { NextResponse, NextRequest } from "next/server";
import { getHomepage, updateHomepage } from "@/lib/cms-server";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const json = (data: any, status = 200) =>
  NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' } });

export async function GET(req: NextRequest) {
  try {
    const result = await getHomepage({ debug: req.nextUrl.searchParams.get('debug') === '1' });
    return json(result);
  } catch (error: any) {
    console.error(`[GET /api/cms/pages/home]`, error);
    return json({ ok: false, error: 'SERVER_ERROR', detail: error.message }, 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = await updateHomepage(body);
    return json({ ok: true, data: updated });
  } catch (e: any) {
    if (e instanceof Error && 'issues' in e) { // ZodError
      return json({ ok: false, error: 'VALIDATION_ERROR', issues: e.issues }, 422);
    }
    return json({ ok: false, error: 'SERVER_ERROR', detail: e.message }, 500);
  }
}
