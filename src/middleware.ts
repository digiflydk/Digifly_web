// This file is temporarily disabled to prevent Edge runtime conflicts.
// The "os" module error indicates a Node.js dependency was being
// incorrectly bundled for the Edge. Forcing a Node.js runtime
// across the app via layouts is a more robust solution for now.

// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";

// export function middleware(req: NextRequest) {
//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
//   ],
// };
