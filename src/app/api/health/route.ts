import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export function GET() {
  return NextResponse.json(
    {
      ok: true,
      service: "digifly",
      release: process.env.NEXT_PUBLIC_RELEASE_SHA || "unknown",
      time: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
