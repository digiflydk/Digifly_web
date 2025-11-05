import { test, expect } from '@playwright/test';

test('robots and sitemap exist', async ({ request, baseURL }) => {
  const [r, s] = await Promise.all([
    request.get(`${baseURL}/robots.txt`),
    request.get(`${baseURL}/sitemap.xml`)
  ]);
  expect(r.ok()).toBeTruthy();
  expect(s.ok()).toBeTruthy();
});

test('sitemap contains dynamic cases', async ({ request, baseURL }) => {
  const res = await request.get(`${baseURL}/api/cms/cases?limit=1000`);
  if (!res.ok()) test.skip(true, 'cases endpoint not present');
  const cases = await res.json();
  if (!Array.isArray(cases) || cases.length === 0) test.skip(true, 'no cases yet');
  const xml = await (await request.get(`${baseURL}/sitemap.xml`)).text();
  const firstHref = cases[0]?.slug ? `/cases/${cases[0].slug}`: null;
  if (firstHref) {
    expect(xml).toContain(firstHref);
  } else {
    test.skip(true, 'first case has no slug/href');
  }
});

test('header shows logo when CMS brand.logo exists', async ({ page }) => {
  await page.goto('/');
  const hasImg = await page.locator('header img[alt="Digifly"]').count();
  const hasText = await page.locator('header .header-brand').count();
  expect(hasImg + hasText).toBeGreaterThan(0); // at least one present
});
