
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "./lib/auth/serverAuth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminArea = pathname.startsWith("/dadmin");
  const isLoginPage = pathname === "/dadmin/login";
  
  // Let Next.js handle its own assets, API routes, and the login page
  if (!isAdminArea || isLoginPage || pathname.startsWith('/api/') || pathname.startsWith('/_next/') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const hasSession = req.cookies.has(SESSION_COOKIE_NAME);

  if (!hasSession) {
    const loginUrl = new URL("/dadmin/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  if (pathname === '/dadmin') {
      const url = req.nextUrl.clone();
      url.pathname = '/dadmin/site-seo';
      return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Match all routes except for static assets and public files.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
