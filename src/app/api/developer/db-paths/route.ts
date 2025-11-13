
import { NextResponse } from "next/server";
import { buildDbPathsDump } from "@/lib/developer/cms-introspection";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload = buildDbPathsDump();
    return NextResponse.json(payload);
  } catch (error) {
    console.error("[Developer DB Paths Dump] Failed to generate dump", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new NextResponse(`Failed to generate DB paths dump: ${errorMessage}`, { status: 500 });
  }
}
