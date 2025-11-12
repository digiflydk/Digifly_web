
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminArea = pathname.startsWith("/dadmin");
  const isLoginPage = pathname === '/dadmin/login';

  // If it's an admin route but NOT the login page, check for a session.
  if (isAdminArea && !isLoginPage) {
    const hasSession = req.cookies.get("session")?.value;
    if (!hasSession) {
      const url = new URL("/dadmin/login", req.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  // If on the login page with a session, redirect to dashboard.
  if (isLoginPage && req.cookies.has("session")?.value) {
      return NextResponse.redirect(new URL('/dadmin', req.url));
  }

  return NextResponse.next();
}

// Ensure the matcher covers all necessary paths.
export const config = { matcher: ["/dadmin/:path*"] };
