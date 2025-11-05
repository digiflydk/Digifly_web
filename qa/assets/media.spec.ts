import { test } from '@playwright/test';
import { expect200 } from '../helpers/expect200';

for (const path of ['/media/hero-1.jpg','/media/intro-1.jpg','/media/case-001.jpg','/media/case-002.jpg']) {
  test(`@assets ${path} resolves`, async ({ request, baseURL }) => {
    const r = await request.get(`${baseURL}${path}`);
    await expect200(r);
  });
}
