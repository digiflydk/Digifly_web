import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Legacy CMS uses Admin SDK without verified user authentication.
// Keep it unreachable until server-side authentication is implemented and reviewed.
const legacy = /^\/(?:dadmin|docs|api\/(?:admin|cms|debug|docs))(?:\/|$)/i;
const probes =
  /^\/(?:\.git|\.env|\.DS_Store|wordpress|info\.php|server-status|graphql|swagger|api-docs)(?:\/|$)/i;

export function middleware(request: NextRequest) {
  let pathname = request.nextUrl.pathname;
  try {
    for (let i = 0; i < 3; i++) {
      const decoded = decodeURIComponent(pathname);
      if (decoded === pathname) break;
      pathname = decoded;
    }
  } catch {
    return new NextResponse("Bad request", { status: 400 });
  }
  if (
    legacy.test(pathname) ||
    probes.test(pathname) ||
    pathname.startsWith("/api/health/firebase")
  ) {
    return new NextResponse("Not found", { status: 404 });
  }
  // Marketing has no Server Actions. Block legacy actions even if their IDs are known.
  if (
    !["GET", "HEAD", "OPTIONS"].includes(request.method) &&
    pathname !== "/api/contact"
  ) {
    return new NextResponse("Method not allowed", {
      status: 405,
      headers: { Allow: "GET, HEAD, OPTIONS" },
    });
  }
  return NextResponse.next();
}
export const config = { matcher: ["/:path*"] };
