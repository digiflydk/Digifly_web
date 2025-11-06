
import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { revalidateTag, revalidatePath } from 'next/cache';
import { SiteSettingsSchema } from '@/lib/schemas';
import { getAdminApp } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  // TODO: Add authentication check
  
  try {
    const body = await req.json();
    const parsed = SiteSettingsSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
    }
    
    getAdminApp(); // Ensure app is initialized
    const db = getFirestore();
    
    await db.collection('site').doc('settings').set(parsed.data, { merge: true });

    // Invalidate cached data & key routes immediately
    revalidateTag('site-settings');
    revalidatePath('/');
    revalidatePath('/manifest.webmanifest');

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Error in /api/admin/site/save:', error);
    return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
