
import { getHomepage } from "@/lib/cms-api";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const homepage = await getHomepage();

  return NextResponse.json(homepage, {
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=0, stale-while-revalidate=0'
    }
  });
}
