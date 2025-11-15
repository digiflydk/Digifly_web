
// Acceptance tests for DGF-417 (homepage regression) and DGF-416 (homepage hero)
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
    originalHomepageData = defaultHomepage;
  }
});

test.afterAll(async () => {
  if (originalHomepageData) {
    await saveHomepageAction(originalHomepageData);
  }
});

test.describe('DGF-417 / DGF-416 — Homepage Regression (Node-only)', () => {
  
  test('DGF-417 — can write and read hero heading without error', async () => {
    const markerHeading = `DGF-417 regression test - ${Date.now()}`;
    const currentData = (await getHomepage()).data || defaultHomepage;
    
    const updatedPayload = deepmerge(currentData, {
      hero: {
        slides: [
          { heading: markerHeading },
        ]
      }
    }, {
      // DGF-372: Ensure arrays are overwritten, not merged
      arrayMerge: (destination, source) => source,
    });
    
    await saveHomepageAction(updatedPayload);

    const readResult = await getHomepage();
    expect(readResult.ok).toBe(true);
    const readData = readResult.data;
    
    expect(readData?.hero?.slides?.[0]?.heading).toBe(markerHeading);
  });
  
  test('DGF-416 — homepage.read returns expected shape', async () => {
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
