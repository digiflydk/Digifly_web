
import { getHomePage } from "@/lib/cms-server";
import { NextResponse, NextRequest } from "next/server";

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
        // Even if validation fails, return sanitized data but with a 422 status
        // so the frontend knows there's an issue.
        return json({ ok: false, data: result.data, errors: result.issues }, 422);
    }
    
    return json({ ok: true, data: result.data });

  } catch (error: any) {
    console.error(`[GET /api/cms/pages/home]`, error);
    return json({ ok: false, error: 'SERVER_ERROR', detail: error.message }, 500);
  }
}
