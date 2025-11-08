import { NextRequest, NextResponse } from "next/server";
import { updateCase, deleteCaseServer } from "@/lib/cms-server";
import { getCaseById, getCaseBySlug } from "@/lib/cms-server";
import { CaseSchema } from "@/lib/schemas";
import { ZodError } from "zod";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const json = (data: any, status = 200) => NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' }});

// A simple regex to distinguish a likely Firestore ID from a slug
const isFirestoreId = (id: string) => /^[a-zA-Z0-9]{20,}$/.test(id);

export async function GET(req: NextRequest, { params }: { params: { param: string } }) {
    const { param } = params;
    try {
        const data = isFirestoreId(param) ? await getCaseById(param) : await getCaseBySlug(param);
        if (!data) return json({ ok: false, error: 'Not Found' }, 404);
        
        const parsed = CaseSchema.safeParse(data);
        if (!parsed.success) {
            console.error(`[GET /api/cms/cases/${param}] Zod validation failed:`, parsed.error);
            return json({ ok: false, error: 'Invalid data structure', details: parsed.error.format() }, 500);
        }
        return json({ ok: true, data: parsed.data });

    } catch (e: any) {
        return json({ ok: false, error: 'Server Error', details: e.message }, 500);
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { param: string } }) {
    const { param: slug } = params;
     try {
        const body = await req.json();
        const parsed = CaseSchema.parse(body);
        const updated = await updateCase(slug, parsed);
        return json({ ok: true, data: updated });
    } catch (e: any) {
        if (e instanceof ZodError) {
            return json({ ok: false, error: 'Validation Error', details: e.issues }, 422);
        }
        return json({ ok: false, error: 'Server Error', details: e.message }, 500);
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { param: string } }) {
  const { param: id } = params; 
  try {
    const result = await deleteCaseServer(id);
    if (!result.ok) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return json({ ok: false, error: 'Server Error', details: e.message }, 500);
  }
}
