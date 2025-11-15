
// Acceptance tests for DGF-388
import { test, expect } from '@playwright/test';

test.describe('DGF-388 — Homepage Hero Colors Acceptance', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/dadmin/homepage');
    await expect(page.getByRole('heading', { name: 'Homepage' })).toBeVisible();
  });

  test('DGF-388 — hero text color can be updated from CMS', async ({ page }) => {
    const colorInput = page.locator('input[name="hero.slides.0.textColor"]');
    const saveButton = page.getByRole('button', { name: 'Save Homepage' });
    const testColor = '#FF0000';

    await colorInput.fill(testColor);
    await saveButton.click();
    await expect(page.getByText('Homepage updated.')).toBeVisible();

    const publicPage = await page.context().newPage();
    await publicPage.goto('/');

    const heroHeading = publicPage.locator('h1');
    await expect(heroHeading).toBeVisible();
    
    const headingColor = await heroHeading.evaluate(el => getComputedStyle(el).color);
    expect(headingColor).toBe('rgb(255, 0, 0)');

    await publicPage.close();

    // Reset
    await colorInput.fill('#FFFFFF');
    await saveButton.click();
    await expect(page.getByText('Homepage updated.')).toBeVisible();
  });
});
