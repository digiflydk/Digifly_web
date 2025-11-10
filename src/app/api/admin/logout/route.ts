
import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth/serverAuth';

export async function POST() {
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
