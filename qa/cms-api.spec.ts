import { test, expect } from '@playwright/test';

const base = process.env.SITE_URL || 'http://localhost:9002';

test.describe('CMS API', () => {
  test('health', async ({ request }) => {
    const res = await request.get(`${base}/api/cms/health`);
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json.ok).toBeTruthy();
  });

  for (const path of ['design', 'navigation', 'home']) {
    test(`${path} returns valid JSON`, async ({ request }) => {
      const res = await request.get(`${base}/api/cms/${path}`);
      expect(res.ok()).toBeTruthy();
      const json = await res.json();
      // lightweight shape checks (keys exist)
      if (path === 'design') expect(json.colors?.electricBlue).toBeTruthy();
      if (path === 'navigation') expect(Array.isArray(json.header)).toBeTruthy();
      if (path === 'home') expect(json.hero?.title).toBeTruthy();
    });
  }
});
