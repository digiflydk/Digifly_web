
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "./lib/auth/serverAuth";

// IMPORTANT: This file runs on the Edge and CANNOT import any Node.js-only modules.

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminArea = pathname.startsWith("/dadmin");
  const isLoginPage = pathname === "/dadmin/login";
  
  // Allow public assets and API routes to pass through without checks.
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // If not in the admin area, no action is needed.
  if (!isAdminArea) {
    return NextResponse.next();
  }

  // If in the admin area, but on the login page, allow access.
  if (isLoginPage) {
    return NextResponse.next();
  }

  // Check for the session cookie for any other /dadmin route.
  const hasSession = req.cookies.has(SESSION_COOKIE_NAME);

  if (!hasSession) {
    const loginUrl = new URL("/dadmin/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // This matcher is broad. It excludes files with extensions and _next assets,
    // but includes all pages and API routes. The middleware logic above narrows it down.
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
