
// src/app/api/cms/pages/home/route.ts
import { getHomepage, updateHomepage } from "@/lib/cms-api";
import { NextResponse, NextRequest } from "next/server";
import { ZodError } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Small helper: return JSON with numeric status (not an options object)
const json = (data: any, status = 200) => NextResponse.json(data, { status });

export async function GET() {
  try {
    const result = await getHomepage();
    return json({ ok: true, data: result.data }, 200);
  } catch (error: any) {
    console.error(`[GET /api/cms/pages/home]`, error);
    // FIX: pass numeric status instead of `{ status: 500 }`
    return json({ ok: false, error: "Failed to load homepage" }, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = await updateHomepage(body);
    return json({ ok: true, data: updated }, 200);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return json(
        { ok: false, error: "Validation failed", issues: error.issues },
        400
      );
    }
    console.error(`[POST /api/cms/pages/home]`, error);
    return json({ ok: false, error: "Failed to update homepage" }, 500);
  }
}
