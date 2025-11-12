import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME } from './lib/constants';

export function middleware(request: NextRequest) {
  // If auth is disabled for development, do nothing.
  if (process.env.ADMIN_AUTH_DISABLED === 'true') {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  const { pathname } = request.nextUrl;

  // If trying to access a protected admin route without a session, redirect to login.
  if (pathname.startsWith('/dadmin') && !pathname.startsWith('/dadmin/login') && !sessionCookie) {
    const loginUrl = new URL('/dadmin/login', request.url);
    loginUrl.searchParams.set('next', pathname); // Pass the intended destination
    return NextResponse.redirect(loginUrl);
  }

  // If logged in and trying to access the login page, redirect to the dashboard.
  if (pathname.startsWith('/dadmin/login') && sessionCookie) {
    return NextResponse.redirect(new URL('/dadmin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except for static files, image optimization, and API routes.
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
