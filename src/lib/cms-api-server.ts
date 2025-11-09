import { headers } from "next/headers";

/**
 * Safely reads headers in Next 15+.
 * The `headers()` function is synchronous and returns a ReadonlyHeaders instance.
 */
export function readRequestHeaders() {
  const h = headers(); // sync ReadonlyHeaders

  const origin =
    h.get("origin") ??
    `${(h.get("x-forwarded-proto") ?? "https")}://${h.get("x-forwarded-host") ?? h.get("host") ?? ""}`;

  const authorization = h.get("authorization") ?? h.get("Authorization") ?? "";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  const proto = h.get("x-forwarded-proto") ?? (origin.startsWith("https") ? "https" : "http");

  return { origin, authorization, host, proto };
}

/**
 * Build the current base URL dynamically from request headers.
 */
export function getBaseUrl() {
  const { host, proto } = readRequestHeaders();
  if (!host) return "";
  return `${proto}://${host}`;
}
