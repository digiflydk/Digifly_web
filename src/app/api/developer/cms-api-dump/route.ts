
import { NextResponse } from "next/server";
import { buildCmsApiDump } from "@/lib/developer/cms-introspection";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload = buildCmsApiDump();
    return NextResponse.json(payload);
  } catch (error) {
    console.error("[Developer CMS API Dump] Failed to generate dump", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new NextResponse(`Failed to generate CMS API dump: ${errorMessage}`, { status: 500 });
  }
}
