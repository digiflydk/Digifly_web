import { NextResponse } from "next/server";
import { CaseSchema } from "@/lib/schemas.case";
import { createCase, getCases } from "@/lib/cms-server";

type Ok<T> = { ok: true; data: T };
type Err = { ok: false; error: string; issues?: any[] };

export async function GET() {
  try {
    const items = await getCases();
    return NextResponse.json<Ok<any[]>>({ ok: true, data: items });
  } catch (e: any) {
    return NextResponse.json<Err>(
      { ok: false, error: e?.message || "Failed to list cases" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CaseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<Err>(
        { ok: false, error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }
    const created = await createCase(parsed.data);
    return NextResponse.json<Ok<any>>({ ok: true, data: created }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json<Err>(
      { ok: false, error: e?.message || "Failed to create case" },
      { status: 500 }
    );
  }
}
