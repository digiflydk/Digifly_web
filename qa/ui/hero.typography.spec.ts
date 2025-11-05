import { test, expect } from '@playwright/test';

test('@ui hero H1 is left aligned (mobile & desktop)', async ({ page }) => {
  for (const width of [360, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const h1 = page.locator('h1:near(:text("Digifly"), 500), h1');
    await expect(h1).toBeVisible();
    // Simple CSS check: no 'text-center' class; allow 'text-left' or default left
    const classAttr = await h1.getAttribute('class');
    expect(classAttr ?? '').not.toContain('text-center');
  }
});
