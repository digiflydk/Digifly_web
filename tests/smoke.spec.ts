import { test, expect } from '@playwright/test';

test.describe('Digifly Smoke Test', () => {

  test('1. Homepage loads without errors and checks CMS content', async ({ page }) => {
    // 1. The homepage loads without errors
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);

    // 2. The hero title and main CTA button are fetched from the CMS
    // We check for visibility, assuming content is from CMS if visible.
    const heroTitle = page.locator('h1');
    await expect(heroTitle).toContainText('From Idea to Intelligent Solution');
    
    const ctaButton = page.locator('a:has-text("Start Your Project")');
    await expect(ctaButton).toBeVisible();
  });

  test('3. Clicking the CTA button leads to the correct page', async ({ page }) => {
    await page.goto('/');
    const ctaButton = page.locator('a:has-text("Start Your Project")');
    await ctaButton.click();
    
    // Wait for navigation to complete
    await page.waitForURL('**/contact');
    expect(page.url()).toContain('/contact');
  });

  test('4. Styles are applied via CSS variables', async ({ page }) => {
    await page.goto('/');
    const ctaButton = page.locator('a:has-text("Start Your Project")');
    
    const backgroundColor = await ctaButton.evaluate(el => {
      return window.getComputedStyle(el).getPropertyValue('background-color');
    });

    // This is an indirect check. We're verifying that the color isn't a default
    // and matches the HSL value from globals.css which is set by our tokens.
    // rgb(33, 150, 243) corresponds to hsl(211 100% 56%)
    expect(backgroundColor).toBe('rgb(33, 150, 243)');
  });

  test('5. All images load correctly', async ({ page }) => {
    await page.goto('/');
    const images = page.locator('img');
    const allImages = await images.all();

    for (const img of allImages) {
      const src = await img.getAttribute('src');
      expect(src).not.toBeNull();
      
      const response = await page.request.get(src!);
      expect(response.status()).toBe(200);
    }
  });

  test('6. Scanner-blocked routes return 404', async ({ page }) => {
    const blockedRoutes = ['/.git/config', '/swagger.json'];
    for (const route of blockedRoutes) {
      const response = await page.goto(route, { waitUntil: 'commit' });
      expect(response?.status()).toBe(404);
    }
  });
});
