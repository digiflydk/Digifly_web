import { NextResponse } from "next/server";
import { CaseSchema } from "@/lib/schemas.case";
import { deleteCase, getCaseById, updateCase } from "@/lib/cms";

type Ok<T> = { ok: true; data: T };
type Err = { ok: false; error: string; issues?: any[] };

export async function GET(_: Request, ctx: { params: { id: string } }) {
  try {
    const item = await getCaseById(ctx.params.id);
    if (!item) return NextResponse.json<Err>({ ok: false, error: "Not found" }, { status: 404 });
    return NextResponse.json<Ok<any>>({ ok: true, data: item });
  } catch (e: any) {
    return NextResponse.json<Err>({ ok: false, error: e?.message || "Failed to fetch" }, { status: 500 });
  }
}

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  try {
    const body = await req.json();
    const parsed = CaseSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<Err>(
        { ok: false, error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }
    const updated = await updateCase(ctx.params.id, parsed.data);
    if (!updated) return NextResponse.json<Err>({ ok: false, error: "Not found" }, { status: 404 });
    return NextResponse.json<Ok<any>>({ ok: true, data: updated });
  } catch (e: any) {
    return NextResponse.json<Err>({ ok: false, error: e?.message || "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_: Request, ctx: { params: { id: string } }) {
  try {
    await deleteCase(ctx.params.id);
    return NextResponse.json<Ok<{ id: string }>>({ ok: true, data: { id: ctx.params.id } });
  } catch (e: any) {
    return NextResponse.json<Err>({ ok: false, error: e?.message || "Failed to delete" }, { status: 500 });
  }
}
