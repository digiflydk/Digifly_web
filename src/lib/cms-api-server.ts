// src/lib/cms-api-server.ts
import { headers as nextHeaders } from "next/headers";

/**
 * Supports environments where nextHeaders() is either:
 *  - Headers-like (sync), or
 *  - Promise<Headers> (async-typed)
 */
export async function getRequestMeta() {
  const maybe = (nextHeaders as unknown as () => Headers | Promise<Headers>)();

  // If it already has .get, use it; otherwise await it.
  const h: Headers =
    typeof (maybe as Headers).get === "function" ? (maybe as Headers) : await (maybe as Promise<Headers>);

  const get = (name: string) => h.get(name) ?? null;

  const protocol =
    get("x-forwarded-proto") ??
    get("x-forwarded-protocol") ??
    "https";

  const host =
    get("x-forwarded-host") ??
    get("host") ??
    "";

  const origin = host ? `${protocol}://${host}` : undefined;
  const referer = get("referer") ?? undefined;

  return { protocol, host, origin, referer, headers: h };
}

/** Optional helper if you read an auth bearer later */
export async function getAuthBearer() {
  const { headers } = await getRequestMeta();
  const auth = headers.get("authorization") ?? headers.get("Authorization");
  if (!auth) return undefined;
  const [scheme, token] = auth.split(" ");
  if ((scheme ?? "").toLowerCase() !== "bearer" || !token) return undefined;
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
