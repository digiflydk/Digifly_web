import { test, expect } from '@playwright/test';

test('Home renders without runtime errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  expect(errors, errors.join('\n')).toHaveLength(0);
});
