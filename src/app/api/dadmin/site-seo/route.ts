
import { NextResponse } from "next/server";
import { readSiteSettings } from "@/lib/dadmin/siteSeoRepo";
import { SiteSettingsSchema } from "@/lib/schemas";

// This route is for admin panel client-side fetching if needed,
// but the primary mechanism for page loads should be server-side fetching.
// It must be protected by admin-only authentication.

export async function GET() {
  // TODO: Add robust authentication check here.
  try {
    const data = await readSiteSettings();
    return NextResponse.json({ ok: true, data }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "GET failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  // TODO: Add robust authentication check here.
  try {
    const body = await req.json();
    // Use the zod schema to parse and validate the incoming data
    const parsed = SiteSettingsSchema.parse(body);
    // The repo function handles the write
    // await writeSiteSettings(parsed);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    const msg = e?.message || "POST failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}
