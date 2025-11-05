import { test, expect } from '@playwright/test';
import { expect200 } from '../helpers/expect200';

test('@api /api/cms/health returns ok', async ({ request, baseURL }) => {
  const r = await request.get(`${baseURL}/api/cms/health`);
  await expect200(r);
  const json = await r.json();
  expect(json.ok).toBeTruthy();
});
