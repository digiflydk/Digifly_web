
import { test, expect } from '@playwright/test';

test.describe('DGF-411 — D-Admin Homepage Editor E2E', () => {

  const TEST_EYEBROW_TEXT = 'Playwright DGF-411 Test';
  let originalEyebrowText: string;

  test.beforeEach(async ({ page }) => {
    await page.goto('/dadmin/homepage');
    await expect(page.getByRole('heading', { name: 'Homepage' })).toBeVisible();

    // Store original value
    const eyebrowInput = page.getByLabel('Eyebrow');
    originalEyebrowText = await eyebrowInput.inputValue();
  });

  test.afterEach(async ({ page }) => {
    // Revert changes
    await page.goto('/dadmin/homepage');
    const eyebrowInput = page.getByLabel('Eyebrow');
    await eyebrowInput.fill(originalEyebrowText);
    await page.getByRole('button', { name: /Save Homepage/i }).click();
    await expect(page.getByText('Homepage updated.')).toBeVisible();
  });

  test('can update hero eyebrow, save, and see change on public site', async ({ page, context }) => {
    const eyebrowInput = page.getByLabel('Eyebrow');
    const saveButton = page.getByRole('button', { name: /Save Homepage/i });

    // 1. Make a change in dadmin
    await eyebrowInput.fill(TEST_EYEBROW_TEXT);
    await expect(eyebrowInput).toHaveValue(TEST_EYEBROW_TEXT);

    // 2. Save the change
    await saveButton.click();
    await expect(page.getByText('Homepage updated.')).toBeVisible();

    // 3. Verify on public homepage in a new tab
    const publicPage = await context.newPage();
    await publicPage.goto('/');

    const hero = publicPage.getByTestId('homepage-hero');
    await expect(hero.getByText(TEST_EYEBROW_TEXT)).toBeVisible();

    await publicPage.close();
  });

  test('has no console errors during the editing flow', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    
    const eyebrowInput = page.getByLabel('Eyebrow');
    await eyebrowInput.click(); // Interact with the page
    
    expect(errors).toHaveLength(0);
  });
});
