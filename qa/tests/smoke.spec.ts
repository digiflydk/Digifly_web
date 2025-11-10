
import { test, expect } from '@playwright/test';

test.describe('Smoke', () => {
  test('Homepage loads and has title @smoke', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Digifly/i);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('Cases index renders at least one card', async ({ page }) => {
    await page.goto('/cases');
    // Using a more generic locator since data-test may not exist yet.
    // This locator looks for a link within a section that has a heading "Our Work".
    const cards = page.locator('section:has-text("Our Work") a');
    await expect(cards.first()).toBeVisible();
  });

  test('Robots & sitemap resolve', async ({ page, request }) => {
    const robots = await request.get('/robots.txt');
    expect(robots.ok()).toBeTruthy();

    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.ok()).toBeTruthy();
  });
});
