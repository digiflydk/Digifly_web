
import { test, expect } from '@playwright/test';
import { maybeSeedCMS } from '../fixtures/cms';

const pages = [
  { path: '/', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/services', name: 'Services' },
  { path: '/contact', name: 'Contact' },
];

test.beforeAll(async () => {
  await maybeSeedCMS();
});

test.describe('Meta basics', () => {
  for (const p of pages) {
    test(`Title & description — ${p.name}`, async ({ page, baseURL }) => {
      await page.goto(p.path);
      const title = await page.title();
      expect(title).toBeTruthy();

      const desc = await page.locator('head meta[name="description"]').first();
      await expect(desc).toHaveAttribute('content', /.+/);
    });

    test(`Canonical — ${p.name}`, async ({ page, baseURL }) => {
      await page.goto(p.path);
      const canonical = page.locator('head link[rel="canonical"]').first();
      await expect(canonical).toHaveAttribute('href', new RegExp(`^${baseURL?.replace(/\/$/, '')}${p.path}$`));
    });

    test(`Single H1 — ${p.name}`, async ({ page }) => {
      await page.goto(p.path);
      await expect(page.locator('h1')).toHaveCount(1);
    });
  }
});

test('robots.txt reflects current setting', async ({ request, baseURL }) => {
  const res = await request.get('/robots.txt');
  expect(res.ok()).toBeTruthy();
  const body = await res.text();
  expect(/Disallow: \/$|Allow: \/$/m.test(body)).toBeTruthy();
});

test('sitemap.xml has absolute URLs and 200', async ({ request, baseURL }) => {
  const sm = await request.get('/sitemap.xml');
  expect(sm.ok()).toBeTruthy();
  const xml = await sm.text();

  // Absolute URLs
  for (const p of pages) {
    const url = `${baseURL?.replace(/\/$/, '')}${p.path}`;
    expect(xml).toContain(`<loc>${url}</loc>`);
  }
});

test('OG fallback exists when page has no explicit OG', async ({ page }) => {
  // Pick a page that should rely on fallback (adjust if needed)
  await page.goto('/about');
  const og = page.locator('head meta[property="og:image"]').first();
  await expect(og).toHaveAttribute('content', /.+/);
});
