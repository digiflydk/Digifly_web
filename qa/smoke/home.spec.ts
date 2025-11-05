import { test, expect } from '@playwright/test';

test('@smoke home renders without console errors', async ({ page }) => {
  const errors: any[] = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('/');
  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('h1')).toBeVisible();
  expect(errors).toHaveLength(0);
});
