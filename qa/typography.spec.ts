import { test, expect } from '@playwright/test';

test.describe('Typography & Alignment', () => {
  test('Hero H1 uses headline font and is left-aligned', async ({ page }) => {
    await page.goto('/');
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();

    // Check alignment
    const textAlign = await h1.evaluate(el => getComputedStyle(el).textAlign);
    expect(textAlign).toMatch(/left/i);

    // Check font-family matches --font-headline
    const rootHeadline = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--font-headline'));
    const h1Font = await h1.evaluate(el => getComputedStyle(el).fontFamily);
    expect(h1Font.toLowerCase()).toContain(rootHeadline.split(',')[0].trim().toLowerCase());
  });

  test('Section H2 use headline font and are left-aligned', async ({ page }) => {
    await page.goto('/');
    const h2s = page.locator('h2'); // SectionHeading renders h2
    const count = await h2s.count();
    expect(count).toBeGreaterThan(0);

    const rootHeadline = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--font-headline'));
    for (let i = 0; i < count; i++) {
      const el = h2s.nth(i);
      const textAlign = await el.evaluate(e => getComputedStyle(e).textAlign);
      const fontFam = await el.evaluate(e => getComputedStyle(e).fontFamily);

      expect.soft(textAlign, `H2 #${i} should be left-aligned`).toMatch(/left/i);
      expect.soft(fontFam.toLowerCase(), `H2 #${i} should use headline font`).toContain(rootHeadline.split(',')[0].trim().toLowerCase());
    }
  });

  test('Header brand uses headline, nav links use body font', async ({ page }) => {
    await page.goto('/');
    const brand = page.locator('.header-brand').first();
    const navLink = page.locator('.header-nav a').first();

    await expect(brand).toBeVisible();
    await expect(navLink).toBeVisible();

    const rootHeadline = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--font-headline'));
    const rootBody = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--font-body'));

    const brandFont = await brand.evaluate(e => getComputedStyle(e).fontFamily);
    const navFont = await navLink.evaluate(e => getComputedStyle(e).fontFamily);

    expect(brandFont.toLowerCase()).toContain(rootHeadline.split(',')[0].trim().toLowerCase());
    expect(navFont.toLowerCase()).toContain(rootBody.split(',')[0].trim().toLowerCase());
  });
});
