
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
    
    // ACT: Use the new stable facade function
    await saveHomepage(updatedPayload);

    const readData = await getHomepage();
    
    // ASSERT
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
