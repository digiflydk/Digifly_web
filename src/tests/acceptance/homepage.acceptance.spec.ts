
// Acceptance tests for DGF-406, DGF-416, DGF-429 (homepage regression)
import { test, expect } from '@playwright/test';
import { getHomepage, saveHomepage } from '@/lib/cms-api';
import type { HomePage, HeroSlide } from '@/lib/types';
import { defaultHomepage, defaultHeroSlide } from '@/data/defaults';
import deepmerge from "deepmerge";
import { cmykToRgba } from '@/lib/utils';
import { mapHeroSlideToViewModel } from '@/lib/hero-style-utils';
import React from 'react';
import { renderToString } from 'react-dom/server';
import Hero from '@/components/sections/hero';

let originalHomepageData: HomePage;

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

test.describe('@suite:homepage-cms-core DGF-416 / DGF-417 — Homepage CMS core', () => {
  
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

test.describe('@suite:hero-banner-colors DGF-429 / DGF-431 — Hero banner colors', () => {

    test('DGF-429 — can save hero overlay color & opacity and read it back', async () => {
        const currentData = await getHomepage();

        const updatedPayload: HomePage = deepmerge(currentData, {
            hero: {
                slides: [
                    {
                        ...(currentData.hero?.slides?.[0] ?? defaultHeroSlide),
                        overlay: {
                            enabled: true,
                            cmyk: { c: 10, m: 20, y: 30, k: 40 },
                            opacityPercent: 65,
                        },
                    },
                ]
            }
        }, { arrayMerge: (_d, s) => s });

        await saveHomepage(updatedPayload);
        const readData = await getHomepage();

        const slide0 = readData?.hero?.slides?.[0];
        expect(slide0?.overlay?.enabled).toBe(true);
        expect(slide0?.overlay?.cmyk?.c).toBe(10);
        expect(slide0?.overlay?.opacityPercent).toBe(65);
    });

    test('DGF-429 — can save hero text colors and read them back', async () => {
        const currentData = await getHomepage();
        const updatedPayload: HomePage = deepmerge(currentData, {
            hero: {
                slides: [
                    {
                        ...(currentData.hero?.slides?.[0] ?? defaultHeroSlide),
                        textColor: '#123456',
                    },
                ]
            }
        }, { arrayMerge: (_d, s) => s });

        await saveHomepage(updatedPayload);
        const readData = await getHomepage();

        const slide0 = readData?.hero?.slides?.[0];
        expect(slide0?.textColor).toBe('#123456');
    });

    // Node-only test for frontend logic
    test('DGF-457 — hero overlay color & opacity is mapped correctly for frontend', async () => {
        const currentData = await getHomepage();
        const overlaySettings = {
            enabled: true,
            cmyk: { c: 10, m: 20, y: 30, k: 40 },
            opacityPercent: 65,
        };

        const updatedPayload: HomePage = deepmerge(currentData, {
            hero: { slides: [{ overlay: overlaySettings }] }
        }, { arrayMerge: (_d, s) => s });

        await saveHomepage(updatedPayload);
        const readData = await getHomepage();
        const slide0 = readData?.hero?.slides?.[0];

        // Test the mapping logic directly
        const vm = mapHeroSlideToViewModel(slide0 as HeroSlide);

        const expectedRgba = cmykToRgba(10, 20, 30, 40, 0.65);
        expect(vm.shouldRenderOverlay).toBe(true);
        expect(vm.overlayColor).toBe(expectedRgba);
    });
    
    // Node-only test for frontend logic
    test('DGF-457 — hero text color is mapped correctly for frontend', async () => {
        const currentData = await getHomepage();
        const updatedPayload: HomePage = deepmerge(currentData, {
            hero: { slides: [{ textColor: '#abcdef' }] }
        }, { arrayMerge: (_d, s) => s });

        await saveHomepage(updatedPayload);
        const readData = await getHomepage();
        const slide0 = readData?.hero?.slides?.[0];

        // Test the mapping logic directly
        const vm = mapHeroSlideToViewModel(slide0 as HeroSlide);

        expect(vm.textColor).toBe('#abcdef');
    });

    test('DGF-460 — hero text color from CMS is applied in rendered hero markup', async () => {
        const TEST_TEXT_COLOR = '#f1f1f1';

        // 1) Read current homepage data as base
        const currentData = await getHomepage();

        // 2) Create new payload with specific textColor on the first hero slide
        const updatedPayload: HomePage = deepmerge(currentData, {
            hero: {
                slides: [
                    {
                        ...(currentData.hero?.slides?.[0] ?? defaultHeroSlide),
                        textColor: TEST_TEXT_COLOR,
                    },
                ],
            },
        }, {
            arrayMerge: (_destination, source) => source,
        });

        await saveHomepage(updatedPayload);

        // 3) Read homepage again so we use the same code path as the frontend
        const readData = await getHomepage();
        const slide0 = readData?.hero?.slides?.[0] as HeroSlide;
        expect(slide0).toBeTruthy();

        // 4) Map the slide to the same view model the Hero component uses
        const vm = mapHeroSlideToViewModel(slide0);

        // 5) Render the real Hero component (SSR, no browser)
        const html = renderToString(
            React.createElement(Hero, { data: { slides: [vm as HeroSlide] }})
        );

        // 6) Assert that the rendered markup contains the CMS text color
        expect(html).toContain(TEST_TEXT_COLOR);
    });
});
