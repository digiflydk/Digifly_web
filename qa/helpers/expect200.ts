import { expect, APIResponse } from '@playwright/test';

export async function expect200(res: APIResponse, hint?: string) {
  const ok = res.ok();
  if (!ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Expected 200 but got ${res.status()} ${hint ? `(${hint})` : ''}\n${text}`);
  }
  expect(ok).toBeTruthy();
}
