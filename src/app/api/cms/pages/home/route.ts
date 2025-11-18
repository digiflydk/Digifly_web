
import { NextResponse } from 'next/server';
import { getCmsHomePayload } from '@/lib/server/cms-home-endpoint';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  // Reuse the shared helper so the API and tests share the same logic
  const payload = await getCmsHomePayload();

  // Keep status code, headers and response shape exactly as before
  return NextResponse.json(payload, { 
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=0, stale-while-revalidate=0'
    }
  });
}
