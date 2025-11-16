// UI-based acceptance tests for DGF-406 (homepage hero)
// These tests are browser-based and are NOT run in the Studio environment.
// They are intended for a CI environment like GitHub Actions that has browser support.
import { test, expect } from '@playwright/test';

test.describe('DGF-406 - Homepage UI (browser)', () => {
  test('renders primary hero slide with visible CTA', async ({ page }) => {
    await page.goto('/');

    const hero = page.getByTestId('homepage-hero');
    await expect(hero).toBeVisible();

    const slides = hero.getByTestId('homepage-hero-slide');
    await expect(slides.first()).toBeVisible();

    const cta = hero.getByTestId('homepage-hero-cta').first();
    await expect(cta).toBeVisible();
    await expect(cta).toBeEnabled();

    const label = await cta.innerText();
    expect(label.trim().length).toBeGreaterThan(0);

    const href = await cta.getAttribute('href');
    expect(href).toBeTruthy();
  });
});
