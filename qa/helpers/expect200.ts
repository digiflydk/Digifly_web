import { expect, APIResponse } from '@playwright/test';
export async function expect200(r: APIResponse) {
  expect(r.status(), await r.text()).toBeLessThan(400);
}
