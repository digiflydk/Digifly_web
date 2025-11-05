import { test, expect } from '@playwright/test';
import { expect200 } from '../helpers/expect200';

for (const path of ['/robots.txt', '/sitemap.xml', '/manifest.webmanifest']) {
  test(`@seo ${path} exists`, async ({ request, baseURL }) => {
    const r = await request.get(`${baseURL}${path}`);
    await expect200(r);
  });
}
