
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "./lib/auth/serverAuth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminArea = pathname.startsWith("/dadmin");
  const isLoginPage = pathname === "/dadmin/login";
  const isApiOrStatic = pathname.startsWith('/api/') || pathname.startsWith('/_next/') || pathname.includes('.');

  // Ignore API, static files, and the login page itself from the main guard
  if (!isAdminArea || isLoginPage || isApiOrStatic) {
    return NextResponse.next();
  }

  const hasSession = req.cookies.has(SESSION_COOKIE_NAME);

  if (!hasSession) {
    const loginUrl = new URL("/dadmin/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // DGF-340: Redirect from base /dadmin to a default page
  if (pathname === '/dadmin') {
      const url = req.nextUrl.clone();
      url.pathname = '/dadmin/site-seo';
      return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Match all dadmin routes except for the specific assets that Next.js needs.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
