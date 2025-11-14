
import { test, expect } from '@playwright/test';

test.describe('Acceptance: Public Homepage', () => {
  test('@acceptance hero heading and CTA from CMS are visible', async ({ page }) => {
    await page.goto('/');

    // This test assumes default seeded content.
    // In a real scenario, you might pre-seed specific test data.
    const heroHeading = page.getByRole('heading', { name: /From Idea to Intelligent Solution/i });
    await expect(heroHeading).toBeVisible();

    const ctaButton = page.getByRole('link', { name: 'Start Your Project' });
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toHaveAttribute('href', /contact/);
  });
});
