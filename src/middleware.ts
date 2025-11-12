
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE_NAME } from './lib/constants';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/dadmin')) {
      const hasSession = request.cookies.get(SESSION_COOKIE_NAME)?.value;
      if (!hasSession) {
          const loginUrl = new URL('/dadmin/login', request.url);
          loginUrl.searchParams.set('next', request.nextUrl.pathname);
          return NextResponse.redirect(loginUrl);
      }
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/dadmin/:path*'],
}
