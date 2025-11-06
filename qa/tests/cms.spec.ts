import { test, expect } from '@playwright/test';

test.describe('CMS screens', () => {
  test('Admin UI reachable (temporary open mode)', async ({ page }) => {
    await page.goto('/dadmin');
    await expect(page.getByRole('heading', { name: /digifly cms/i })).toBeVisible();
    // basic fields present
    await expect(page.getByLabel(/Logo URL/i)).toBeVisible();
    await expect(page.getByLabel(/Favicon URL/i)).toBeVisible();
  });

  test('Contact page content visible', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByRole('heading', { name: /contact/i })).toBeVisible();
    await expect(page.getByRole('form')).toBeVisible();
  });
});
