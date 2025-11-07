
import { NextRequest, NextResponse } from "next/server";
import { getNavigation, updateNavigation } from "@/lib/cms-server";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const json = (data: any, status = 200) => NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' }});

export async function GET() {
    try {
        const data = await getNavigation();
        return json({ ok: true, data: data.header });
    } catch (e: any) {
        return json({ ok: false, error: 'Server Error', details: e.message }, 500);
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const currentNav = await getNavigation();
        const updatedNav = { ...currentNav, header: body.items };
        await updateNavigation(updatedNav);
        return json({ ok: true, updatedCount: body.items.length });
    } catch (e: any) {
        return json({ ok: false, error: 'Server Error', details: e.message }, 500);
    }
}
