
// Acceptance test for DGF-406: Homepage hero
import { test, expect } from '@playwright/test';

test.describe('DGF-411 — homepage hero content is visible', () => {
  test('renders primary hero slide with visible CTA', async ({ page }) => {
    await page.goto('/');

    const hero = page.getByTestId('homepage-hero');
    await expect(hero).toBeVisible();

    const slides = hero.getByTestId('homepage-hero-slide');
    await expect(slides.first()).toBeVisible();

    const heading = hero.locator('h1');
    await expect(heading).toBeVisible();
    expect((await heading.innerText()).trim()).not.toBe('');

    const cta = hero.getByTestId('homepage-hero-cta').first();
    if (await cta.count() > 0) {
      await expect(cta).toBeVisible();

      const label = await cta.innerText();
      expect(label.trim().length).toBeGreaterThan(0);

      const href = await cta.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });
});
