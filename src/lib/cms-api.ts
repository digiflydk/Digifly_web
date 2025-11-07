
import type { CaseDoc, HomePage, SiteSettings, Navigation } from "./schemas";

const BASE =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    : "";

function api(p: string) {
  return `${BASE}/api/cms${p}`;
}

async function ok<T>(r: Response): Promise<T> {
  if (!r.ok) {
    const text = await r.text().catch(() => '');
    const message = `[cms-api] ${r.status} ${r.statusText} for ${r.url}${text ? ` • ${text.slice(0, 100)}` : ''}`;
    throw new Error(message);
  }
  const json = await r.json();
  if (json.ok === false) {
    throw new Error(json.error || 'API returned ok:false');
  }
  return json as Promise<T>;
}


// CASES
export async function listCases() {
  return ok<{ ok: true; data: (CaseDoc & { id: string })[] }>(
    await fetch(api("/cases"), { cache: "no-store" }),
  );
}
export async function createCaseDraft() {
  return ok<{ ok: true; id: string }>(
    await fetch(api("/cases"), { method: "POST" }),
  );
}
export async function getCaseById(id: string) {
  return ok<{ ok: true; data: CaseDoc & { id: string } }>(
    await fetch(api(`/cases/${id}`), { cache: "no-store" }),
  );
}
export async function updateCaseById(id: string, payload: CaseDoc) {
  return ok<{ ok: true }>(
    await fetch(api(`/cases/${id}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}
export async function deleteCaseById(id: string) {
  return ok<{ ok: true }>(await fetch(api(`/cases/${id}`), { method: "DELETE" }));
}


/** Homepage */
export async function getHomepage() {
  return ok<{ ok: true; data: HomePage }>(await fetch(api("/pages/home"), { cache: "no-store" }));
}
export async function updateHomepage(payload: HomePage) {
  return ok<{ ok: true }>(
    await fetch(api("/pages/home"), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

/** Site Settings */
export async function getSiteSettings() {
    return ok<{ok: true; data: SiteSettings}>(await fetch(api('/site'), { cache: 'no-store' }));
}

export async function saveSiteSettings(payload: SiteSettings) {
    return ok<{ok: true, data: SiteSettings}>(await fetch(api('/site'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    }));
}

/** Navigation */
export async function getNavigation() {
    return ok<{ok: true, data: Navigation}>(await fetch(api('/navigation')));
}

export async function updateNavigation(payload: Navigation) {
    return ok<{ok: true}>(await fetch(api('/navigation'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }));
}
