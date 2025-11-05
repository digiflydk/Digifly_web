import { test } from '@playwright/test';
import { expect200 } from '../helpers/expect200';

test('manifest.webmanifest exists', async ({ request, baseURL }) => {
    const r = await request.get(`${baseURL}/manifest.webmanifest`);
    await expect200(r);
});
  
for (const path of ['/media/hero-1.jpg','/media/intro-1.jpg','/media/case-001.jpg','/media/case-002.jpg']) {
  test(`asset exists: ${path}`, async ({ request, baseURL }) => {
    const r = await request.get(`${baseURL}${path}`);
    await expect200(r);
  });
}

test('git probe returns 404 (expected)', async ({ request, baseURL }) => {
    const r = await request.get(`${baseURL}/.git/HEAD`);
    expect(r.status()).toBe(404);
});
