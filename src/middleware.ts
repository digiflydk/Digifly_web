
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth/serverAuth";

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

  // If it's not an admin route, or it's the login page itself, do nothing special yet.
  if (!isAdminRoute || pathname === '/dadmin/login') {
    return NextResponse.next();
  }

  // Check for session for all other /dadmin routes
  const hasSession = req.cookies.has('__session');
  
  if (!hasSession) {
    const url = new URL("/dadmin/login", req.url);
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // If a session exists, you might perform further validation here (e.g., check token validity)
  // For now, we assume a session cookie means the user is authenticated.

  return NextResponse.next();
}

// Run middleware on all routes except static assets
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
