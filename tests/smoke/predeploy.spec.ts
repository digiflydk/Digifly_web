
import { test, expect } from '@playwright/test';

test.describe('Pre-deploy Smoke Tests @predeploy @smoke', () => {

  test('Homepage loads with 200 OK', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });

  test('No console errors on homepage load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    await page.goto('/');
    expect(errors).toHaveLength(0);
  });
  
  test('Header and Footer are visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('Basic SEO tags are present', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title).not.toBe('');

    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', /.+/);
  });
});
