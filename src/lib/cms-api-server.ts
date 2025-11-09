
// src/lib/cms-api-server.ts
import { headers as nextHeaders } from "next/headers";

/**
 * Returns request-related meta derived from headers.
 * Marked async to support environments where nextHeaders() is typed/treated as async.
 */
export async function getRequestMeta() {
  const h = await (nextHeaders as unknown as () => Promise<Readonly<Headers>>());

  const protocol =
    h.get("x-forwarded-proto") ??
    h.get("x-forwarded-protocol") ??
    "https";

  const host =
    h.get("x-forwarded-host") ??
    h.get("host") ??
    "";

  const origin = host ? `${protocol}://${host}` : undefined;

  const referer = h.get("referer") ?? undefined;

  return { protocol, host, origin, referer, headers: h };
}

/**
 * Example: read a bearer token from headers safely
 */
export async function getAuthBearer() {
  const { headers } = await getRequestMeta();
  const auth = headers.get("authorization") ?? headers.get("Authorization");
  if (!auth) return undefined;
  const [scheme, token] = auth.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return undefined;
  return token;
}

/**
 * Build the current base URL dynamically from request headers.
 */
export async function getBaseUrl() {
  const { host, protocol } = await getRequestMeta();
  if (!host) return "";
  return `${protocol}://${host}`;
}
