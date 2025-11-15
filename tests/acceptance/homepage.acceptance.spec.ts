// Acceptance test for DGF-416 & DGF-417: Homepage regression
import { test, expect } from '@playwright/test';
import { saveHomepageAction } from '@/app/dadmin/homepage/actions';
import { getHomepage } from '@/lib/cms-server';
import type { HomePage } from '@/lib/types';
import { defaultHomepage } from '@/data/defaults';
import deepmerge from 'deepmerge';

// This test suite runs in a Node.js environment, not a browser.
// It directly tests the server-side CMS actions for the homepage.

let originalHomepageData: HomePage | null = null;

test.beforeAll(async () => {
  // Fetch and backup the current homepage data before any tests run.
  const result = await getHomepage();
  if (result.ok) {
    originalHomepageData = result.data;
  } else {
    // If the page is missing, use defaults as the "original" state.
    originalHomepageData = defaultHomepage;
  }
});

test.afterAll(async () => {
  // Restore the original homepage data after all tests have run.
  if (originalHomepageData) {
    await saveHomepageAction(originalHomepageData);
    console.log('\n[DGF-417] Homepage data restored.');
  }
});

test.describe('DGF-417 — Homepage Acceptance Regression (Node-only)', () => {
  test('can write and read hero heading without error', async () => {
    const markerHeading = `DGF-417 regression hero - ${Date.now()}`;
    const originalData = await getHomepage().then(res => res.data || defaultHomepage);

    try {
      // 2. Act: write a modified hero heading with a marker.
      const updatedPayload = deepmerge(originalData, {
          hero: {
              slides: [{
                  heading: markerHeading,
              }]
          }
      });
      
      const saveResult = await saveHomepageAction(updatedPayload);
      expect(saveResult.ok, `saveHomepageAction should return { ok: true }`).toBe(true);

      // 3. Assert: read again and verify the hero heading matches.
      const readResult = await getHomepage();
      expect(readResult.ok, 'getHomepage should successfully read the document.').toBe(true);
      
      const heroData = readResult.data?.hero;
      expect(heroData).toBeDefined();
      expect(heroData.slides.length).toBeGreaterThan(0);
      expect(heroData.slides[0].heading).toBe(markerHeading);
    } finally {
      // 4. Cleanup: restore original homepage data.
      if (originalData) {
        await saveHomepageAction(originalData);
      }
    }
  });

  test('homepage.read returns data in the expected shape', async () => {
    // Arrange: Ensure there's valid data (the previous test already wrote some).
    // Let's re-save with merged defaults to be safe.
    const mergedPayload = deepmerge(originalHomepageData || defaultHomepage, {
        seo: { title: 'Shape Test' }
    });
    await saveHomepageAction(mergedPayload);
    
    // Act: Read the homepage data.
    const result = await getHomepage();
    
    // Assert: Check for the presence of all top-level keys.
    expect(result.ok).toBe(true);
    const data = result.data;
    
    expect(data).toHaveProperty('hero');
    expect(data).toHaveProperty('whatWeDo');
    expect(data).toHaveProperty('services');
    expect(data).toHaveProperty('featuredCases');
    expect(data).toHaveProperty('cta');
    expect(data).toHaveProperty('seo');

    // Assert some critical nested fields to ensure they are not accidentally wiped.
    expect(typeof data.hero?.rotationDelaySec).toBe('number');
    expect(Array.isArray(data.hero?.slides)).toBe(true);
    expect(typeof data.whatWeDo?.title).toBe('string');
    expect(typeof data.services?.title).toBe('string');
    expect(Array.isArray(data.services?.items)).toBe(true);
    expect(typeof data.cta?.text).toBe('string');
    expect(typeof data.seo?.title).toBe('string');
  });

});
