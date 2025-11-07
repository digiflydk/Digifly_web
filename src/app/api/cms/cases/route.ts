
import { NextResponse } from 'next/server';
import { getCasesServer } from '@/lib/cms-server';

export async function GET() {
  const data = await getCasesServer();
  return NextResponse.json({ ok: true, data });
}
