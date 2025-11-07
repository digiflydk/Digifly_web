

import { NextRequest, NextResponse } from "next/server";
import { getCaseBySlug, updateCase, deleteCaseServer } from "@/lib/cms-server";
import { CaseSchema } from "@/lib/schemas";
import { ZodError } from "zod";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const json = (data: any, status = 200) => NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' }});

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
    const { slug } = params;
    try {
        const data = await getCaseBySlug(slug);
        if (!data) return json({ ok: false, error: 'Not Found' }, 404);
        
        const parsed = CaseSchema.safeParse(data);
        if (!parsed.success) {
            console.error(`[GET /api/cms/cases/${slug}] Zod validation failed:`, parsed.error);
            return json({ ok: false, error: 'Invalid data structure', details: parsed.error.format() }, 500);
        }
        return json({ ok: true, data: parsed.data });

    } catch (e: any) {
        return json({ ok: false, error: 'Server Error', details: e.message }, 500);
    }
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
    const { slug } = params;
     try {
        const body = await req.json();
        const parsed = CaseSchema.parse(body); // Throws if invalid
        const updated = await updateCase(slug, parsed);
        return json({ ok: true, data: updated });
    } catch (e: any) {
        if (e instanceof ZodError) {
            return json({ ok: false, error: 'Validation Error', details: e.issues }, 422);
        }
        return json({ ok: false, error: 'Server Error', details: e.message }, 500);
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  const { slug: id } = params; // The slug is the ID in this case for client
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
