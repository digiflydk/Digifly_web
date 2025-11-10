
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import { getRedirects } from "@/lib/cms-server"; // Placeholder

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

// let redirectCache: any[] | null = null; // Placeholder for redirect caching

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Block common scanner patterns
  for (const re of BLOCKED_PATTERNS) {
    if (re.test(pathname)) {
      return new NextResponse("Not found", { status: 404 });
    }
  }

  // Placeholder for redirect logic
  // try {
  //   redirectCache = redirectCache ?? await getRedirects();
  //   const hit = redirectCache?.find(r => r.active !== false && r.from === pathname);
  //   if (hit) {
  //     return NextResponse.redirect(new URL(hit.to, req.url), hit.status ?? 301);
  //   }
  // } catch (e) {
  //   console.warn('[middleware] Could not fetch redirects:', e);
  // }

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
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
