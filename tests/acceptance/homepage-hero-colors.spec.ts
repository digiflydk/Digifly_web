
import { test, expect } from '@playwright/test';

test.describe('[DGF-388] Acceptance: Homepage Hero Colors', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage editor before each test
    await page.goto('/dadmin/homepage');
    await expect(page.getByRole('heading', { name: 'Homepage' })).toBeVisible();
  });

  test('@acceptance hero text color can be updated from CMS', async ({ page }) => {
    const colorInput = page.locator('input[name="hero.slides.0.textColor"]');
    const saveButton = page.getByRole('button', { name: 'Save Homepage' });
    const testColor = '#FF0000'; // Bright red

    // 1. Change color in CMS
    await colorInput.fill(testColor);
    await expect(colorInput).toHaveValue(testColor);
    await saveButton.click();
    
    // Wait for the toast confirmation
    await expect(page.getByText('Homepage updated.')).toBeVisible();

    // 2. Verify on public homepage
    const publicPage = await page.context().newPage();
    await publicPage.goto('/');

    const heroHeading = publicPage.locator('h1');
    await expect(heroHeading).toBeVisible();
    
    // Check computed style
    const headingColor = await heroHeading.evaluate(el => getComputedStyle(el).color);
    expect(headingColor).toBe('rgb(255, 0, 0)');

    await publicPage.close();

    // 3. Reset color in CMS to avoid affecting other tests
    await colorInput.fill('#FFFFFF');
    await saveButton.click();
    await expect(page.getByText('Homepage updated.')).toBeVisible();
  });
});
