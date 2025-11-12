
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_ROUTES = ["/dadmin"];
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

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  for (const re of BLOCKED_PATTERNS) {
    if (re.test(pathname)) {
      return new NextResponse(JSON.stringify({ error: "Not found" }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
  }
  
  const isAdminRoute = ADMIN_ROUTES.some(p => pathname.startsWith(p));
  const isLoginPage = pathname === '/dadmin/login';

  // If it's not an admin route, do nothing.
  if (!isAdminRoute) {
    return NextResponse.next();
  }

  // Check for session cookie
  const hasSession = req.cookies.has('__session');
  
  // If user is trying to access login page with a valid session, redirect to dashboard
  if (isLoginPage && hasSession) {
      // We assume the cookie is valid here; detailed validation happens in `getCurrentUser` on the page itself.
      return NextResponse.redirect(new URL('/dadmin', req.url));
  }
  
  // If user is trying to access a protected admin route without a session, redirect to login
  if (!isLoginPage && !hasSession) {
    const url = new URL("/dadmin/login", req.url);
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Run middleware on all routes except static assets
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
