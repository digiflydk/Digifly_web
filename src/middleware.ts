
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser, isSuperadmin, isAdmin } from "./lib/auth/roles";

const BLOCKED_PATTERNS = [
  /^\/\.git(?:\/|$)/i,
  /^\/\.env$/i,
  /^\/\.DS_Store$/i,
  /^\/wordpress(?:\/|$)/i,
  /^\/info\.php$/i,
  /^\/server(?:-status)?$/i,
  /^\/telescope(?:\/|$)/i,
  /^\/config\.json$/i,
  /^\/@vite\/env$/i,
  /^\/api\/(?!cms|debug|contact|docs|_health|admin).*/i,
  /^\/(graphql|gql)(?:\/|$)/i,
  /^\/(swagger|api-docs|v2|v3)(?:\/|$)/i,
  /^\/webjars\/swagger-ui\/index\.html$/i,
  /^\/swagger(?:-ui\.html|\/index\.html|\.json)?$/i,
  /^\/version$/i,
  /^\/login\.action$/i,
  /^\/_all_dbs$/i,
  /^\/ecp\/Current\/exporttool/i,
  /^\/v2\/_catalog$/i,
  /^\/js\/lkk_ch\.js$/i,
  /^\/css\/support_parent\.css$/i,
  /^\/s\/[0-9a-f/_;.-]+\/META-INF\/.+$/i,
];

// This is a server-function that can't be run in middleware directly
// so we use a simplified check here. The layout will do the full check.
async function checkAuth(req: NextRequest): Promise<{ authed: boolean, role: string | null }> {
    const hasAuthCookie = req.cookies.has('__session');
    if (!hasAuthCookie) return { authed: false, role: null };
    
    // We cannot use the full Admin SDK verification here as it's not supported in Edge runtime.
    // Instead, we will do a basic check and rely on the page/layout level for full verification.
    // For middleware, we'll assume the presence of the cookie means "logged in as some user".
    // The role will be checked on the server-side layout. For now, this is a limitation.
    return { authed: true, role: null }; // We can't know the role here.
}


export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  for (const re of BLOCKED_PATTERNS) {
    if (re.test(pathname)) {
      return new NextResponse(JSON.stringify({ error: "Not found" }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
  }

  // Admin area authentication
  if (pathname.startsWith('/dadmin') && !pathname.startsWith('/dadmin/login')) {
    const hasAuth = req.cookies.has('dadmin_auth') && req.cookies.get('dadmin_auth')?.value === 'true';
    if (!hasAuth) {
      const loginUrl = new URL('/dadmin/login', req.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Developer section guard
  if (pathname.startsWith('/dadmin/developer') || pathname.startsWith('/dadmin/dev')) {
      // NOTE: Middleware runs in Edge runtime where Admin SDK isn't available.
      // We will perform the real role check in a server-side layout that wraps these pages.
      // This middleware step is now more of a placeholder, the real guard is in the layout.
  }

  return NextResponse.next();
}

// Run middleware on all routes
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
