
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/serverAuth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminArea = pathname.startsWith("/dadmin");
  const isLoginPage = pathname === "/dadmin/login";
  const isApiOrStatic = pathname.startsWith('/api/') || pathname.startsWith('/_next/') || pathname.includes('.');

  if (!isAdminArea || isApiOrStatic) {
    return NextResponse.next();
  }

  // We cannot use the cached getCurrentUser here as middleware runs in edge.
  // A simple cookie check is sufficient for the middleware guard.
  const hasSession = req.cookies.has("session");

  if (isLoginPage) {
    if (hasSession) {
      // If user is logged in and tries to access login page, redirect to dashboard
      return NextResponse.redirect(new URL("/dadmin", req.url));
    }
    // Allow access to login page if not logged in
    return NextResponse.next();
  }

  // For all other admin pages, require a session
  if (!hasSession) {
    const loginUrl = new URL("/dadmin/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Ensure the matcher covers all necessary paths.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
