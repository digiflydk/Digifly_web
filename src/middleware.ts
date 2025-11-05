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
  /^\/(api|graphql|gql)(?:\/|$)/i,           // unknown API endpoints
  /^\/(swagger|api-docs|v2|v3)(?:\/|$)/i,    // swagger, api-docs, etc.
  /^\/webjars\/swagger-ui\/index\.html$/i,
  /^\/swagger(?:-ui\.html|\/index\.html|\.json)?$/i,
  /^\/version$/i,
  /^\/login\.action$/i,
  /^\/_all_dbs$/i,
  /^\/ecp\/Current\/exporttool/i,            // ms exchange probe
  /^\/v2\/_catalog$/i,                       // docker registry probe
  /^\/js\/lkk_ch\.js$/i,
  /^\/css\/support_parent\.css$/i,
  /^\/s\/[0-9a-f/_;.-]+\/META-INF\/.+$/i,    // random maven/jira probes
];

export function middleware(req: NextRequest) {
  const { pathname } = new URL(req.url);

  for (const re of BLOCKED_PATTERNS) {
    if (re.test(pathname)) {
      return new NextResponse("Not found", { status: 404 });
    }
  }
  return NextResponse.next();
}

// Run middleware on all routes
export const config = {
  matcher: ["/:path*"],
};
