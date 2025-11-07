

import { getHomePage } from "@/lib/cms-server";
import { NextResponse, NextRequest } from "next/server";
import { ZodIssue } from "zod";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const json = (data: any, status = 200) =>
  NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' } });

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const debug = searchParams.get('debug') === '1';
  
  try {
    const result = await getHomePage({ debug });
    
    if (!result.ok) {
        return json({ ok: false, error: 'VALIDATION_ERROR', issues: result.issues }, 422);
    }
    
    return json({ ok: true, data: result.data });

  } catch (error: any) {
     if (error?.code === "HOMEPAGE_VALIDATION_ERROR") {
      return json({ ok: false, error: error.code, issues: error.details as ZodIssue[] }, 422);
    }
    console.error(`[GET /api/cms/pages/home]`, error);
    return json({ ok: false, error: 'SERVER_ERROR', detail: error.message }, 500);
  }
}
