

import { getHomePage, updateHomepage } from "@/lib/cms-server";
import { NextResponse, NextRequest } from "next/server";
import { ZodError, ZodIssue } from "zod";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const json = (data: any, status = 200) =>
  NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' } });

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const debug = searchParams.get('debug') === '1';
  
  try {
    const result = await getHomePage({ debug });
    // This now returns a result object with {ok, data, issues?}
    if (!result.ok) {
        return json({ ok: false, error: 'VALIDATION_ERROR', issues: result.issues }, 422);
    }
    
    return json({ ok: true, data: result.data });

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
  } catch(e: any) {
    if (e instanceof ZodError) {
      return json({ ok: false, error: 'VALIDATION_ERROR', issues: e.issues }, 422);
    }
    return json({ ok: false, error: 'SERVER_ERROR', detail: e.message }, 500);
  }
}
