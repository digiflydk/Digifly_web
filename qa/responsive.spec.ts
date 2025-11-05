import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-414', width: 414, height: 896 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'laptop-1024', width: 1024, height: 768 },
  { name: 'desktop-1280', width: 1280, height: 800 },
];

async function hasOverflow(page) {
  return await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const offenders: string[] = [];
    const nodes = Array.from(document.querySelectorAll('body, main, header, footer, section, div, img, a, h1, h2, p'));
    for (const el of nodes) {
      const r = el.getBoundingClientRect();
      if (r.right - 1 > vw) offenders.push(el.tagName + (el.id ? `#${el.id}` : ''));
    }
    return { scrollOverflow: document.documentElement.scrollWidth > vw + 1, offenders };
  });
}

for (const vp of viewports) {
  test.describe(`Responsive ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test('No horizontal overflow; hero & CTA visible', async ({ page }) => {
      await page.goto('/');
      const h1 = page.getByRole('heading', { level: 1 });
      await expect(h1).toBeVisible();
      const cta = page.getByRole('link', { name: /Start Your Project/i });
      await expect(cta).toBeVisible();

      const { scrollOverflow, offenders } = await hasOverflow(page);
      expect.soft(scrollOverflow, `Overflow @ ${vp.name}. Offenders: ${offenders.slice(0,5).join(', ')}`).toBeFalsy();
      await page.screenshot({ path: `qa-artifacts/home-${vp.name}.png`, fullPage: true });
    });

    test('Grids collapse correctly', async ({ page }) => {
      await page.goto('/');
      const services = page.locator('section:has-text("Services") >> .grid');
      await expect(services).toBeVisible();
      const { scrollOverflow } = await hasOverflow(page);
      expect.soft(scrollOverflow, `Grid overflow @ ${vp.name}`).toBeFalsy();
    });

    test('Mobile nav works (under 768px)', async ({ page }) => {
      await page.goto('/');
      if (vp.width < 768) {
        const desktopNav = page.locator('nav.md\\:flex');
        await expect(desktopNav).toHaveCount(1); // It's hidden, but still in the DOM
        const trigger = page.getByRole('button', { name: /menu|open|navigation|☰/i });
        if (await trigger.count()) {
          await trigger.first().click();
          const anyLink = page.locator('.is-mobile-nav-link');
          await expect(anyLink.first()).toBeVisible();
        }
      }
    });
  });
}
