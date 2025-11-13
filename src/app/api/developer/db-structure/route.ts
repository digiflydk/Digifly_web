
import { NextResponse } from "next/server";
import { buildDbStructureDump } from "@/lib/developer/cms-introspection";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload = buildDbStructureDump();
    return NextResponse.json(payload);
  } catch (error) {
    console.error("[Developer DB Structure Dump] Failed to generate dump", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new NextResponse(`Failed to generate DB structure dump: ${errorMessage}`, { status: 500 });
  }
}
