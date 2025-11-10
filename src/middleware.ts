import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Block common scanner patterns
  for (const re of BLOCKED_PATTERNS) {
    if (re.test(pathname)) {
      return new NextResponse("Not found", { status: 404 });
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

  return NextResponse.next();
}

// Run middleware on all routes
export const config = {
  matcher: ["/:path*"],
};
