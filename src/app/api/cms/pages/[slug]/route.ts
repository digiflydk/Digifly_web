

import { NextRequest, NextResponse } from "next/server";
import { getPageBySlug, updatePage, getHomePage, updateHomepage } from "@/lib/cms-server";
import { HomepageSchema } from "@/lib/schemas";
import { ZodError } from "zod";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const json = (data: any, status = 200) => NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' }});

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
    const { slug } = params;
    
    if (slug === 'home') {
        const result = await getHomePage();
        if (!result.ok) {
            return json({ ok: false, error: 'VALIDATION_ERROR', issues: result.issues }, 422);
        }
        return json({ ok: true, data: result.data });
    }

    try {
        const data = await getPageBySlug(slug);
        if (!data) return json({ ok: false, error: 'Not Found' }, 404);
        return json({ ok: true, data });
    } catch (e: any) {
        return json({ ok: false, error: 'Server Error', details: e.message }, 500);
    }
}


export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
    const { slug } = params;
    
    try {
        const body = await req.json();
        
        if (slug === 'home') {
            const updated = await updateHomepage(body);
            return json({ ok: true, data: updated });
        }

        const updated = await updatePage(slug, body);
        return json({ ok: true, data: updated });

    } catch (e: any) {
        if (e instanceof ZodError) {
            return json({ ok: false, error: 'Validation Error', details: e.issues }, 422);
        }
        return json({ ok: false, error: 'Server Error', details: e.message }, 500);
    }
}
