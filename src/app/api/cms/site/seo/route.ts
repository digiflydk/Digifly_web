
import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { revalidateTag } from 'next/cache';
import { SiteSettingsSchema } from '@/lib/schemas';
import { getAdminApp } from '@/lib/firebase-admin';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    getAdminApp(); // Ensure Firebase Admin is initialized
    const db = getFirestore();
    const body = await req.json();
    const parsed = SiteSettingsSchema.safeParse(body);

    if (!parsed.success) {
      const error = parsed.error.flatten();
      const firstError = Object.values(error.fieldErrors)[0]?.[0] || "Invalid data provided.";
      return NextResponse.json({ ok: false, error: firstError }, { status: 400 });
    }

    // Note: The document is cms_site/seo, not site/settings
    await db.collection('cms_site').doc('seo').set(parsed.data, { merge: true });

    revalidateTag('site-settings');
    revalidateTag('site');

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Error in /api/cms/site/seo:', error);
    return NextResponse.json({ ok: false, error: 'Internal Server Error: Could not connect to the database or save data.' }, { status: 500 });
  }
}
