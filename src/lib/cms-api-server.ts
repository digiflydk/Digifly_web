
import { headers } from "next/headers";

export function getRequestMeta() {
  const h = headers(); // ReadonlyHeaders (sync)
  const origin = h.get("origin") ?? "";
  const authorization = h.get("authorization") ?? h.get("Authorization") ?? "";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  const proto = h.get("x-forwarded-proto") ?? (origin.startsWith("https") ? "https" : "http");

  return { origin, authorization, host, proto };
}


function getServerBaseUrl(): string {
  const h = headers();
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host = h.get("x-forwarded-host") ?? h.get("host");
  return host ? `${proto}://${host}` : (process.env.NEXT_PUBLIC_SITE_URL ?? "");
}

export async function fetchCmsApiServer<T>(path: string, init?: RequestInit): Promise<T> {
  const base = getServerBaseUrl();
  const isAbs = /^https?:\/\//i.test(path);
  const isApi = path.startsWith("/api/");
  const url = isAbs ? path : isApi ? `${base}${path}` : `${base}/api/cms/${path.replace(/^\/+/, "")}`;

  const res = await fetch(url, {
    cache: "no-store",
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const snippet = await res.text().catch(() => "");
    throw new Error(`[cms-api:server] fetch failed for "${url}": ${snippet || res.statusText}`);
  }
  const json = await res.json().catch(() => ({}));
  return (json?.data ?? json) as T;
}
