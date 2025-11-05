import { test, expect } from '@playwright/test';

test('1) Homepage loads and shows CMS hero & CTA', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Digifly/i);

  // Hero title & CTA (from CMS)
  const heroTitle = page.getByRole('heading', { level: 1 });
  await expect(heroTitle).toContainText(/From Idea to Intelligent Solution/i);

  const cta = page.getByRole('link', { name: /Start Your Project/i });
  await expect(cta).toBeVisible();

  await page.screenshot({ path: `qa-artifacts/homepage.png`, fullPage: true });
});

test('2) CTA navigates to expected page', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /Start Your Project/i }).click();
  await page.waitForLoadState('domcontentloaded');
  await expect(page).toHaveURL(/\/contact/);
});

test('3) Design tokens are applied (no Tailwind fallback)', async ({ page }) => {
  await page.goto('/');
  const btn = page.getByRole('link', { name: /Start Your Project/i });
  const bg = await btn.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(bg).not.toBe('rgba(0, 0, 0, 0)'); // should be a token color, not transparent
  // spot-check CSS variables exist on :root
  const varBlue = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--btn-primary-bg').trim());
  expect(varBlue.length).toBeGreaterThan(0);
});

test('4) Images load (no broken sources)', async ({ page }) => {
  await page.goto('/');
  const imgs = page.locator('img');
  const count = await imgs.count();
  expect(count).toBeGreaterThan(0);
  // check hero first image naturalWidth > 0
  const ok = await imgs.nth(0).evaluate((img: any) => (img.naturalWidth ?? 0) > 0);
  expect(ok).toBeTruthy();
});

test('5) 404 hardening for scanner routes', async ({ request }) => {
  const urls = ['/.git/config', '/swagger.json'];
  for (const u of urls) {
    const res = await request.get(u);
    expect([404, 403]).toContain(res.status());
  }
});
