
import { test, expect } from '@playwright/test';

test.describe('[DGF-378] Hero Overlay Configuration', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage editor before each test
    await page.goto('/dadmin/homepage');
    await expect(page.getByRole('heading', { name: 'Homepage' })).toBeVisible();
  });

  test('Overlay can be disabled and enabled', async ({ page }) => {
    const overlaySwitch = page.locator('label:has-text("Enable Overlay") + button[role="switch"]');
    const saveButton = page.getByRole('button', { name: 'Save Homepage' });

    // --- Disable Overlay ---
    await overlaySwitch.click();
    await expect(overlaySwitch).toHaveAttribute('data-state', 'unchecked');
    await saveButton.click();
    await expect(page.getByText('Homepage updated.')).toBeVisible();

    // Verify on public page
    const publicPage = await page.context().newPage();
    await publicPage.goto('/');
    // Check for the overlay div. Using a data-testid or a more specific selector would be better.
    // For now, we'll assume the overlay has a specific background color or is one of the direct children of the section.
    const overlayElement = publicPage.locator('section:first-of-type > div[style*="background-color"]');
    await expect(overlayElement).toHaveCount(0, 'Overlay should not be present when disabled.');
    await publicPage.close();


    // --- Re-enable Overlay ---
    await overlaySwitch.click();
    await expect(overlaySwitch).toHaveAttribute('data-state', 'checked');
    await saveButton.click();
    await expect(page.getByText('Homepage updated.')).toBeVisible();
    
    // Verify again
    const publicPage2 = await page.context().newPage();
    await publicPage2.goto('/');
    const enabledOverlay = publicPage2.locator('section:first-of-type > div[style*="background-color"]');
    await expect(enabledOverlay).toHaveCount(1, 'Overlay should be present when re-enabled.');
    await publicPage2.close();
  });

  test('Overlay color and transparency can be changed', async ({ page }) => {
    const cyanInput = page.locator('input[name="hero.slides.0.overlay.cmyk.c"]');
    const blackInput = page.locator('input[name="hero.slides.0.overlay.cmyk.k"]');
    const opacityInput = page.locator('input[name="hero.slides.0.overlay.opacityPercent"]');
    const saveButton = page.getByRole('button', { name: 'Save Homepage' });
    
    // Set a distinct color (bright cyan at 80% opacity)
    await cyanInput.fill('100');
    await blackInput.fill('0');
    await opacityInput.fill('80');

    await saveButton.click();
    await expect(page.getByText('Homepage updated.')).toBeVisible();
    
    // Verify on public page
    const publicPage = await page.context().newPage();
    await publicPage.goto('/');
    const overlayElement = publicPage.locator('section:first-of-type > div[style*="background-color"]');
    await expect(overlayElement).toBeVisible();

    const style = await overlayElement.getAttribute('style');
    // CMYK(100, 0, 0, 0) with 80% opacity becomes rgba(0, 255, 255, 0.8)
    expect(style).toContain('rgba(0, 255, 255, 0.8)');
    await publicPage.close();
  });
});
