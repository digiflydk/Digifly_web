
import type { CaseDoc } from "./schemas";

const BASE =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    : "";

function api(p: string) {
  return `${BASE}/api/cms${p}`;
}

async function ok<T>(r: Response): Promise<T> {
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return r.json() as Promise<T>;
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
  await ok<{ ok: true }>(
    await fetch(api(`/cases/${id}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}
export async function deleteCaseById(id: string) {
  await ok<{ ok: true }>(await fetch(api(`/cases/${id}`), { method: "DELETE" }));
}
