
export const runtime = 'nodejs';
import { NextResponse } from "next/server";
import { createSessionCookie } from "@/lib/auth/serverAuth";

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    if (!idToken) {
      return NextResponse.json({ ok: false, error: "idToken is required." }, { status: 400 });
    }

    await createSessionCookie(idToken);
    
    return NextResponse.json({ ok: true }, { status: 200 });

  } catch (error: any) {
    console.error("[api/admin/login] Error:", error.message);
    return NextResponse.json({ ok: false, error: "An unexpected error occurred." }, { status: 500 });
  }
}
