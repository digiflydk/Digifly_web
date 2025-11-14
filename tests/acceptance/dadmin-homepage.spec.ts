import { test, expect } from '@playwright/test';

test.describe('Acceptance: D-Admin Homepage Editor', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage editor before each test
    // Bypassing auth via env var or a custom state setup might be needed in real CI
    await page.goto('/dadmin/homepage');
    await expect(page.getByRole('heading', { name: 'Homepage' })).toBeVisible();
  });

  test('@acceptance form loads and hero fields are rendered', async ({ page }) => {
    // Check that the main tabs are there
    await expect(page.getByRole('tab', { name: 'Hero' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'What We Do' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Services' })).toBeVisible();

    // Check for a few key fields in the Hero tab
    await expect(page.getByLabel('Eyebrow')).toBeVisible();
    await expect(page.getByLabel('Heading')).toBeVisible();
    await expect(page.getByLabel('Image URL')).toBeVisible();
  });

  test('@acceptance can type in a field and it reflects the change', async ({ page }) => {
    const headingInput = page.getByLabel('Heading');
    await headingInput.fill('New Test Heading');
    await expect(headingInput).toHaveValue('New Test Heading');
    
    // Note: This test doesn't save, it just verifies UI interaction.
    // A more complex test could save and then check the public page.
  });
});
