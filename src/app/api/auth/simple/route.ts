import { NextResponse } from 'next/server';
import { createSessionCookie } from '@/lib/auth/serverAuth';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // Securely compare against environment variables on the server
    const adminUser = process.env.ADMIN_USERNAME;
    const adminPass = process.env.ADMIN_PASSWORD;

    if (!adminUser || !adminPass) {
      console.error("ADMIN_USERNAME or ADMIN_PASSWORD is not set in .env file.");
      return NextResponse.json({ ok: false, error: 'Server is not configured for login.' }, { status: 500 });
    }

    if (username === adminUser && password === adminPass) {
      // In a real application with Firebase Auth, you'd get an idToken
      // and call createSessionCookie(idToken). For this demo, we'll
      // simulate a successful login without a real session.
      // The middleware currently just checks for the existence of *any* session cookie,
      // so this will need to be improved later for real security.
      const response = NextResponse.json({ ok: true }, { status: 200 });
      // Set a dummy session cookie to satisfy the middleware
      response.cookies.set('__session', 'true', { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' });
      return response;
    }

    return NextResponse.json({ ok: false, error: 'Invalid username or password.' }, { status: 401 });

  } catch (error) {
    console.error('[api/auth/simple] Error:', error);
    return NextResponse.json({ ok: false, error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
