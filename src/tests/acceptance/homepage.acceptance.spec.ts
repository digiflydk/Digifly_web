// Acceptance tests for DGF-406 & DGF-416 (homepage regression)
// DGF-427: Updated to use the stable cms-api facade.
import { test, expect } from '@playwright/test';
import { getHomepage, saveHomepage } from '@/lib/cms-api';
import type { HomePage } from '@/lib/types';
import { defaultHomepage } from '@/data/defaults';
import deepmerge from 'deepmerge';

let originalHomepageData: HomePage | null = null;

test.beforeAll(async () => {
  // Backup original data once before all tests in this file
  try {
    originalHomepageData = await getHomepage();
  } catch (e) {
    console.warn("Could not read original homepage data, will restore with defaults.", e);
    originalHomepageData = defaultHomepage;
  }
});

test.afterAll(async () => {
  // Restore original data once after all tests in this file have run
  if (originalHomepageData) {
    await saveHomepage(originalHomepageData);
  }
});

test.describe('DGF-416 / DGF-406 — Homepage Regression (Node-only)', () => {
  
  test('DGF-406 — can write and read hero heading without error', async () => {
    const markerHeading = `DGF-416 regression test - ${Date.now()}`;
    const currentData = await getHomepage();
    
    const updatedPayload: HomePage = deepmerge(currentData, {
      hero: {
        slides: [
          { heading: markerHeading },
        ]
      }
    }, {
      arrayMerge: (_destination, source) => source,
    });
    
    await saveHomepage(updatedPayload);

    const readData = await getHomepage();
    
    expect(readData?.hero?.slides?.[0]?.heading).toBe(markerHeading);
  });
  
  test('DGF-416 — homepage.read returns expected data shape', async () => {
    const data = await getHomepage();
    
    expect(data).toHaveProperty('hero');
    expect(data).toHaveProperty('whatWeDo');
    expect(data).toHaveProperty('services');
    expect(data).toHaveProperty('featuredCases');
    expect(data).toHaveProperty('cta');
    expect(data).toHaveProperty('seo');

    // Assert some critical nested fields to ensure they are not accidentally wiped.
    expect(typeof data.hero?.rotationDelaySec).toBe('number');
    expect(Array.isArray(data.hero?.slides)).toBe(true);
  });
});

test.describe('DGF-429 — Hero text colors acceptance', () => {
    test('DGF-429 — can update hero text colors and read them back', async () => {
      const markerColor = '#FF00FF'; // A distinct magenta color for testing
      const currentData = await getHomepage();

      const updatedPayload: HomePage = deepmerge(currentData, {
        hero: {
          slides: [
            { textColor: markerColor },
          ]
        }
      }, {
        arrayMerge: (_destination, source) => source,
      });

      await saveHomepage(updatedPayload);
      const readBack = await getHomepage();

      expect(readBack?.hero?.slides?.[0]?.textColor).toBe(markerColor);
    });

    test('DGF-429 — updating hero text colors preserves hero structure', async () => {
      const original = await getHomepage();
      const originalSlidesLength = original.hero?.slides?.length ?? 0;
      const originalOverlay = original.hero?.slides?.[0]?.overlay;
      
      const updatedPayload: HomePage = deepmerge(original, {
        hero: {
          slides: [
            { textColor: '#00AAFF' }
          ]
        }
      }, {
        arrayMerge: (_destination, source) => source,
      });

      await saveHomepage(updatedPayload);
      const readBack = await getHomepage();

      expect(readBack.hero?.slides?.length).toBe(originalSlidesLength);

      // Verify that the overlay object wasn't accidentally wiped out
      if (originalOverlay) {
        expect(readBack.hero?.slides?.[0]?.overlay).toBeDefined();
        expect(readBack.hero?.slides?.[0]?.overlay).toMatchObject(originalOverlay);
      }
    });
});
