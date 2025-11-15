// DGF-413 & DGF-414: Node-only regression tests for CMS homepage logic.
import { test, expect } from '@playwright/test';
import { saveHomepageAction } from '@/app/dadmin/homepage/actions';
import { getHomepage as getHomepageServer } from '@/lib/cms-server';
import { defaultHomepage } from '@/data/defaults';
import type { HomePage } from '@/lib/types';

test.describe('DGF-414 — Homepage CMS Regression Tests', () => {
  let originalHomepageData: HomePage | null = null;

  // Before all tests, fetch the current homepage data to restore it later.
  test.beforeAll(async () => {
    const result = await getHomepageServer();
    if (result.ok) {
      originalHomepageData = result.data;
    } else {
      // If fetching fails, use the default as a fallback.
      originalHomepageData = defaultHomepage;
    }
  });

  // After all tests, restore the original homepage data.
  test.afterAll(async () => {
    if (originalHomepageData) {
      await saveHomepageAction(originalHomepageData);
    }
  });

  test('homepage.save action writes hero content to Firestore', async () => {
    const testMarker = `DGF-414 regression test ${Date.now()}`;
    const testPayload = {
      ...originalHomepageData,
      hero: {
        ...originalHomepageData!.hero,
        slides: [{
          ...(originalHomepageData!.hero.slides[0] ?? defaultHomepage.hero.slides[0]),
          eyebrow: testMarker,
        }],
      },
    };

    // 1. Write the test payload to Firestore using the server action.
    const saveResult = await saveHomepageAction(testPayload);
    expect(saveResult.ok, 'The save action should complete successfully.').toBe(true);
    
    // 2. Read the data back directly using the server-side getter.
    const readResult = await getHomepageServer();
    expect(readResult.ok, 'Reading the homepage data should be successful.').toBe(true);

    // 3. Assert that the read-back data contains our test marker.
    const readEyebrow = readResult.data?.hero?.slides?.[0]?.eyebrow;
    expect(readEyebrow, `Expected to find test marker "${testMarker}" in hero eyebrow.`).toBe(testMarker);
  });

  test('homepage.read action returns data with the expected shape', async () => {
    // This test relies on the data being present from the `beforeAll` or previous tests.
    const result = await getHomepageServer();

    // 1. Assert that the operation was successful.
    expect(result.ok, 'The getHomepageServer call should succeed.').toBe(true);

    // 2. Assert that the returned data has the core top-level sections.
    const data = result.data;
    expect(data, 'The homepage data object should not be null.').not.toBeNull();
    expect(data).toHaveProperty('hero');
    expect(data).toHaveProperty('whatWeDo');
    expect(data).toHaveProperty('services');
    expect(data).toHaveProperty('featuredCases');
    expect(data).toHaveProperty('cta');
    expect(data).toHaveProperty('seo');

    // 3. Assert that nested structures are arrays as expected.
    expect(Array.isArray(data.hero?.slides), 'Hero slides should be an array.').toBe(true);
    expect(Array.isArray(data.services?.items), 'Service items should be an array.').toBe(true);
    expect(Array.isArray(data.featuredCases), 'Featured cases should be an array.').toBe(true);
  });
});
