// Acceptance tests for DGF-416 (homepage regression) and DGF-406 (initial acceptance)
import { test, expect } from '@playwright/test';
import { saveHomepageAction, getHomepage } from '@/lib/cms-api';
import type { HomePage } from '@/lib/types';
import { defaultHomepage } from '@/data/defaults';
import deepmerge from 'deepmerge';

let originalHomepageData: HomePage | null = null;

test.beforeAll(async () => {
  const result = await getHomepage();
  if (result.ok) {
    originalHomepageData = result.data;
  } else {
    // If reading fails, use defaults as a baseline for restoration.
    originalHomepageData = defaultHomepage;
  }
});

test.afterAll(async () => {
  if (originalHomepageData) {
    await saveHomepageAction(originalHomepageData);
  }
});

test.describe('DGF-416 / DGF-406 — Homepage Regression (Node-only)', () => {
  
  test('DGF-406 — can write and read hero heading without error', async () => {
    const markerHeading = `DGF-416 regression test - ${Date.now()}`;
    // Fetch current data to avoid overwriting unrelated fields
    const result = await getHomepage();
    const currentData = result.ok ? result.data : defaultHomepage;
    
    const updatedPayload = deepmerge(currentData, {
      hero: {
        slides: [
          { heading: markerHeading },
        ]
      }
    }, {
      // DGF-372: Ensure arrays are overwritten, not merged
      arrayMerge: (_destination, source) => source,
    });
    
    await saveHomepageAction(updatedPayload);

    const readResult = await getHomepage();
    expect(readResult.ok).toBe(true);
    const readData = readResult.data;
    
    expect(readData?.hero?.slides?.[0]?.heading).toBe(markerHeading);
  });
  
  test('DGF-416 — homepage.read returns expected data shape', async () => {
    const result = await getHomepage();
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
  });
});
