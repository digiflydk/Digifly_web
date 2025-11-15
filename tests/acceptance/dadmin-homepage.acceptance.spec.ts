
import { test, expect } from '@playwright/test';

test.describe('DGF-411 — D-Admin Homepage Editor Acceptance', () => {

  test.beforeEach(async ({ page }) => {
    // This assumes auth is handled globally (e.g. by a state file or env var)
    await page.goto('/dadmin/homepage');
    await expect(page.getByRole('heading', { name: 'Homepage' })).toBeVisible();
  });

  test('DGF-411 — form loads and hero fields are rendered', async ({ page }) => {
    await expect(page.getByRole('tab', { name: 'Hero' })).toBeVisible();
    await expect(page.getByLabel('Heading')).toBeVisible();
    await expect(page.getByLabel('Image URL')).toBeVisible();
  });
});
