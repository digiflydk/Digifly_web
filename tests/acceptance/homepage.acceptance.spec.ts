// Acceptance tests for DGF-416: Homepage Regression

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
    console.log('\n[DGF-416] Homepage data restored.');
  }
});

test.describe('DGF-416 — Homepage Regression Tests', () => {

  test('homepage.save writes hero content to Firestore', async () => {
    const testMarker = `DGF-416 regression test - ${Date.now()}`;
    const testPayload: Partial<HomePage> = {
      hero: {
        ...defaultHomepage.hero,
        slides: [{
          ...defaultHomepage.hero.slides[0],
          heading: testMarker,
          eyebrow: 'Test Eyebrow',
          cta: { ...defaultHomepage.hero.slides[0].cta, label: 'Test CTA' }
        }]
      }
    };
    
    // Act: Save the test data.
    const saveResult = await saveHomepageAction(testPayload);
    expect(saveResult.ok, `saveHomepageAction should return { ok: true }`).toBe(true);

    // Assert: Read the data back and verify the changes.
    const readResult = await getHomepage();
    expect(readResult.ok, 'getHomepage should successfully read the document.').toBe(true);
    
    const heroData = readResult.data?.hero;
    expect(heroData).toBeDefined();
    expect(heroData.slides).toHaveLength(1);
    expect(heroData.slides[0].heading).toBe(testMarker);
    expect(heroData.slides[0].eyebrow).toBe('Test Eyebrow');
    expect(heroData.slides[0].cta?.label).toBe('Test CTA');
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

  test('homepage.save with only hero data does not wipe other sections', async () => {
    // Arrange: Start with full data.
    const fullPayload = deepmerge(defaultHomepage, {
        whatWeDo: { title: "Original WhatWeDo Title" },
        services: { title: "Original Services Title" },
        seo: { title: "Original SEO Title" }
    });
    await saveHomepageAction(fullPayload);

    // Act: Simulate a partial update, just changing the hero.
    const heroOnlyUpdate: Partial<HomePage> = {
      hero: {
        ...defaultHomepage.hero,
        slides: [{
          ...defaultHomepage.hero.slides[0],
          heading: "Updated Hero Only",
        }]
      }
    };
    const saveResult = await saveHomepageAction(heroOnlyUpdate);
    expect(saveResult.ok).toBe(true);

    // Assert: Read back and ensure other sections still exist.
    const finalResult = await getHomepage();
    expect(finalResult.ok).toBe(true);
    const data = finalResult.data;

    expect(data.hero?.slides[0].heading).toBe("Updated Hero Only");
    expect(data.whatWeDo?.title).toBe("Original WhatWeDo Title");
    expect(data.services?.title).toBe("Original Services Title");
    expect(data.seo?.title).toBe("Original SEO Title");
  });

});
