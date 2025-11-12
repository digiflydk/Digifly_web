
import { NextResponse } from "next/server";
import { getNavigation, saveNavigation } from "@/lib/cms-api";
import { ZodError } from "zod";

const json = (data: any, status = 200) => NextResponse.json(data, { status });

export async function GET() {
  try {
    const nav = await getNavigation();
    return json({ ok: true, data: nav });
  } catch (e: any) {
    return json({ ok: false, error: "Failed to get navigation" }, 500);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await saveNavigation(body);
    return json({ ok: true });
  } catch (e: any) {
    if (e instanceof ZodError) {
       return json({ ok: false, error: "Validation failed", issues: e.issues }, 400);
    }
    return json({ ok: false, error: "Save failed" }, 500);
  }
}
