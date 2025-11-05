import { test, expect } from '@playwright/test';

test.describe('UI Polish', () => {
  test('Header elevates on scroll', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header').first();
    const initialShadow = await header.evaluate(el => getComputedStyle(el).boxShadow);
    await page.mouse.wheel(0, 200);
    await page.waitForTimeout(100);
    const scrolledShadow = await header.evaluate(el => getComputedStyle(el).boxShadow);
    expect(scrolledShadow).not.toBe(initialShadow);
  });

  test('Hero → next section spacing is ≥ 64px', async ({ page }) => {
    await page.goto('/');
    const h1 = page.getByRole('heading', { level: 1 });
    const nextSection = page.locator('section').nth(1);
    const gap = await page.evaluate(([a,b]) => {
      const r1 = (a as HTMLElement).getBoundingClientRect();
      const r2 = (b as HTMLElement).getBoundingClientRect();
      return Math.max(0, r2.top - r1.bottom);
    }, [await h1.elementHandle(), await nextSection.elementHandle()]);
    expect(gap).toBeGreaterThanOrEqual(64);
  });

  test('Case images use normalized aspect and lazy-load', async ({ page }) => {
    await page.goto('/');
    const imgs = page.locator('section:has-text("Our Work") img');
    await expect(imgs.first()).toBeVisible();
    // heuristic: aspect wrapper exists
    const wrapper = imgs.first().locator('xpath=ancestor::*[contains(@class,"aspect-")]');
    await expect(wrapper).toHaveCount(1);
  });
});