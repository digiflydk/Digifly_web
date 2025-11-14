
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

  test('4. All images load correctly', async ({ page }) => {
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

  test('5. Scanner-blocked routes return 404', async ({ page }) => {
    const blockedRoutes = ['/.git/config', '/swagger.json'];
    for (const route of blockedRoutes) {
      const response = await page.goto(route, { waitUntil: 'commit' });
      expect(response?.status()).toBe(404);
    }
  });
});
