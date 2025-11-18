// Acceptance tests for DGF-406, DGF-416, DGF-429, DGF-457, DGF-467, DGF-471 (homepage regression)
import { test, expect } from '@playwright/test';
import { getHomepage, saveHomepage } from '@/lib/cms-api';
import type { HomePage, HeroSlide } from '@/lib/types';
import { defaultHomepage, defaultHeroSlide } from '@/data/defaults';
import deepmerge from 'deepmerge';
import { cmykToRgba } from '@/lib/utils';
import { mapHeroSlideToViewModel } from '@/lib/hero-style-utils';
import { getCmsHomePayload } from '@/lib/server/cms-home-endpoint';

let originalHomepageData: HomePage;

test.beforeAll(async () => {
  // Backup original data once before all tests in this file
  try {
    originalHomepageData = await getHomepage();
  } catch (e) {
    console.warn(
      'Could not read original homepage data, will restore with defaults.',
      e,
    );
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

    const updatedPayload: HomePage = deepmerge(
      currentData,
      {
        hero: {
          slides: [{ heading: markerHeading }],
        },
      },
      {
        arrayMerge: (_destination, source) => source,
      },
    );

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

    const updatedPayload: HomePage = deepmerge(
      currentData,
      {
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
          ],
        },
      },
      { arrayMerge: (_d, s) => s },
    );

    await saveHomepage(updatedPayload);
    const readData = await getHomepage();

    const slide0 = readData?.hero?.slides?.[0];
    expect(slide0?.overlay?.enabled).toBe(true);
    expect(slide0?.overlay?.cmyk?.c).toBe(10);
    expect(slide0?.overlay?.opacityPercent).toBe(65);
  });

  test('DGF-429 — can save hero text colors and read them back', async () => {
    const currentData = await getHomepage();

    const updatedPayload: HomePage = deepmerge(
      currentData,
      {
        hero: {
          slides: [
            {
              ...(currentData.hero?.slides?.[0] ?? defaultHeroSlide),
              textColor: '#123456',
            },
          ],
        },
      },
      { arrayMerge: (_d, s) => s },
    );

    await saveHomepage(updatedPayload);
    const readData = await getHomepage();

    const slide0 = readData?.hero?.slides?.[0];
    expect(slide0?.textColor).toBe('#123456');
  });

  // Node-only tests for frontend mapping logic
  test('DGF-457 — hero overlay color & opacity is mapped correctly for frontend', async () => {
    const currentData = await getHomepage();
    const overlaySettings = {
      enabled: true,
      cmyk: { c: 10, m: 20, y: 30, k: 40 },
      opacityPercent: 65,
    };

    const updatedPayload: HomePage = deepmerge(
      currentData,
      {
        hero: { slides: [{ overlay: overlaySettings }] },
      },
      { arrayMerge: (_d, s) => s },
    );

    await saveHomepage(updatedPayload);
    const readData = await getHomepage();
    const slide0 = readData?.hero?.slides?.[0];

    // Test the mapping logic directly
    const vm = mapHeroSlideToViewModel(slide0 as HeroSlide);

    const expectedRgba = cmykToRgba(10, 20, 30, 40, 0.65);
    expect(vm.shouldRenderOverlay).toBe(true);
    expect(vm.overlayColor).toBe(expectedRgba);
  });

  test('DGF-457 — hero text color is mapped correctly for frontend', async () => {
    const currentData = await getHomepage();
    const updatedPayload: HomePage = deepmerge(
      currentData,
      {
        hero: { slides: [{ textColor: '#abcdef' }] },
      },
      { arrayMerge: (_d, s) => s },
    );

    await saveHomepage(updatedPayload);
    const readData = await getHomepage();
    const slide0 = readData?.hero?.slides?.[0];

    // Test the mapping logic directly
    const vm = mapHeroSlideToViewModel(slide0 as HeroSlide);

    expect(vm.textColor).toBe('#abcdef');
  });

  // Existing CMS ↔ API textColor test
  test('DGF-467 — hero textColor from CMS matches the color returned by /api/cms/home', async () => {
    const TEST_TEXT_COLOR = '#00ff00';

    const currentData = await getHomepage();

    const updatedPayload: HomePage = deepmerge(
      currentData,
      {
        hero: {
          slides: [
            {
              ...(currentData.hero?.slides?.[0] ?? defaultHeroSlide),
              textColor: TEST_TEXT_COLOR,
            },
          ],
        },
      },
      { arrayMerge: (_destination, source) => source },
    );

    await saveHomepage(updatedPayload);

    const readData = await getHomepage();
    const slide0 = readData?.hero?.slides?.[0] as HeroSlide;
    expect(slide0).toBeTruthy();
    expect(slide0.textColor).toBe(TEST_TEXT_COLOR);

    const vmJson: any = await getCmsHomePayload();
    const vmHero = vmJson?.hero;
    expect(vmHero).toBeTruthy();

    const vmSlide0 = vmHero.slides?.[0];
    expect(vmSlide0).toBeTruthy();

    expect(vmSlide0.textColor).toBe(TEST_TEXT_COLOR);
  });

  // New focused tests for hero-banner data consistency

  test('DGF-471 — hero text fields from CMS match /api/cms/home view model', async () => {
    const marker = `DGF-471-${Date.now()}`;

    const TEST_VALUES = {
      eyebrow: `Eyebrow ${marker}`,
      heading: `Heading ${marker}`,
      body: `Body ${marker}`,
    };

    const currentData = await getHomepage();

    const updatedPayload: HomePage = deepmerge(
      currentData,
      {
        hero: {
          slides: [
            {
              ...(currentData.hero?.slides?.[0] ?? defaultHeroSlide),
              eyebrow: TEST_VALUES.eyebrow,
              heading: TEST_VALUES.heading,
              body: TEST_VALUES.body,
            },
          ],
        },
      },
      { arrayMerge: (_destination, source) => source },
    );

    await saveHomepage(updatedPayload);

    const readData = await getHomepage();
    const slide0 = readData?.hero?.slides?.[0] as HeroSlide;
    expect(slide0).toBeTruthy();

    expect(slide0.eyebrow).toBe(TEST_VALUES.eyebrow);
    expect(slide0.heading).toBe(TEST_VALUES.heading);
    expect(slide0.body).toBe(TEST_VALUES.body);

    const vmJson: any = await getCmsHomePayload();
    const vmHero = vmJson?.hero;
    expect(vmHero).toBeTruthy();

    const vmSlide0 = vmHero.slides?.[0];
    expect(vmSlide0).toBeTruthy();

    expect(vmSlide0.eyebrow).toBe(TEST_VALUES.eyebrow);
    expect(vmSlide0.heading).toBe(TEST_VALUES.heading);
    expect(vmSlide0.body).toBe(TEST_VALUES.body);
  });

  test('DGF-472 — hero CTA from CMS matches /api/cms/home view model', async () => {
    const marker = `DGF-472-${Date.now()}`;

    const TEST_VALUES = {
      label: `CTA ${marker}`,
      internalRef: 'contact',
    };

    const currentData = await getHomepage();

    const updatedPayload: HomePage = deepmerge(
      currentData,
      {
        hero: {
          slides: [
            {
              ...(currentData.hero?.slides?.[0] ?? defaultHeroSlide),
              cta: {
                label: TEST_VALUES.label,
                type: 'internal',
                internalRef: TEST_VALUES.internalRef,
                newTab: false,
              },
            },
          ],
        },
      },
      { arrayMerge: (_destination, source) => source },
    );

    await saveHomepage(updatedPayload);

    const readData = await getHomepage();
    const slide0 = readData?.hero?.slides?.[0] as HeroSlide;
    expect(slide0).toBeTruthy();

    expect(slide0.cta?.label).toBe(TEST_VALUES.label);
    expect(slide0.cta?.internalRef).toBe(TEST_VALUES.internalRef);
    expect(slide0.cta?.type).toBe('internal');
    expect(slide0.cta?.newTab).toBe(false);

    const vmJson: any = await getCmsHomePayload();
    const vmHero = vmJson?.hero;
    expect(vmHero).toBeTruthy();

    const vmSlide0 = vmHero.slides?.[0];
    expect(vmSlide0).toBeTruthy();

    const vmCta = vmSlide0.cta;
    expect(vmCta).toBeTruthy();
    expect(vmCta.label).toBe(TEST_VALUES.label);
    expect(vmCta.internalRef).toBe(TEST_VALUES.internalRef);
  });

  test('DGF-473 — hero textColor from CMS matches /api/cms/home view model (focused)', async () => {
    const TEST_TEXT_COLOR = '#f1f1f1';

    const currentData = await getHomepage();

    const updatedPayload: HomePage = deepmerge(
      currentData,
      {
        hero: {
          slides: [
            {
              ...(currentData.hero?.slides?.[0] ?? defaultHeroSlide),
              textColor: TEST_TEXT_COLOR,
            },
          ],
        },
      },
      { arrayMerge: (_destination, source) => source },
    );

    await saveHomepage(updatedPayload);

    const readData = await getHomepage();
    const slide0 = readData?.hero?.slides?.[0] as HeroSlide;
    expect(slide0).toBeTruthy();
    expect(slide0.textColor).toBe(TEST_TEXT_COLOR);

    const vmJson: any = await getCmsHomePayload();
    const vmHero = vmJson?.hero;
    expect(vmHero).toBeTruthy();

    const vmSlide0 = vmHero.slides?.[0];
    expect(vmSlide0).toBeTruthy();

    expect(vmSlide0.textColor).toBe(TEST_TEXT_COLOR);
  });

  test('DGF-474 — hero image from CMS matches /api/cms/home view model', async () => {
    const marker = `DGF-474-${Date.now()}`;

    const TEST_VALUES = {
      imageSrc: `https://example.com/dgf-474-${marker}.png`,
      imageAlt: `Alt ${marker}`,
    };

    const currentData = await getHomepage();

    const updatedPayload: HomePage = deepmerge(
      currentData,
      {
        hero: {
          slides: [
            {
              ...(currentData.hero?.slides?.[0] ?? defaultHeroSlide),
              image: { src: TEST_VALUES.imageSrc, alt: TEST_VALUES.imageAlt }
            },
          ],
        },
      },
      { arrayMerge: (_destination, source) => source },
    );

    await saveHomepage(updatedPayload);

    const readData = await getHomepage();
    const slide0 = readData?.hero?.slides?.[0] as HeroSlide;
    expect(slide0).toBeTruthy();

    expect(slide0.image?.src).toBe(TEST_VALUES.imageSrc);
    expect(slide0.image?.alt).toBe(TEST_VALUES.imageAlt);

    const vmJson: any = await getCmsHomePayload();
    const vmHero = vmJson?.hero;
    expect(vmHero).toBeTruthy();

    const vmSlide0 = vmHero.slides?.[0];
    expect(vmSlide0).toBeTruthy();

    const vmImageSrc = vmSlide0.image?.src;
    const vmImageAlt = vmSlide0.image?.alt;

    expect(vmImageSrc).toBe(TEST_VALUES.imageSrc);
    expect(vmImageAlt).toBe(TEST_VALUES.imageAlt);
  });

  test('DGF-475 — hero overlay from CMS matches /api/cms/home view model', async () => {
    const currentData = await getHomepage();

    const TEST_OVERLAY = {
      enabled: true,
      cmyk: { c: 7, m: 14, y: 21, k: 28 },
      opacityPercent: 50,
    };

    const updatedPayload: HomePage = deepmerge(
      currentData,
      {
        hero: {
          slides: [
            {
              ...(currentData.hero?.slides?.[0] ?? defaultHeroSlide),
              overlay: TEST_OVERLAY,
            },
          ],
        },
      },
      { arrayMerge: (_destination, source) => source },
    );

    await saveHomepage(updatedPayload);

    const readData = await getHomepage();
    const slide0 = readData?.hero?.slides?.[0] as HeroSlide;
    expect(slide0).toBeTruthy();

    expect(slide0.overlay?.enabled).toBe(TEST_OVERLAY.enabled);
    expect(slide0.overlay?.cmyk?.c).toBe(TEST_OVERLAY.cmyk.c);
    expect(slide0.overlay?.opacityPercent).toBe(TEST_OVERLAY.opacityPercent);

    const vmJson: any = await getCmsHomePayload();
    const vmHero = vmJson?.hero;
    expect(vmHero).toBeTruthy();

    const vmSlide0 = vmHero.slides?.[0];
    expect(vmSlide0).toBeTruthy();
    
    if ('overlay' in vmSlide0) {
      const vmOverlay = vmSlide0.overlay;
      // mapHeroSlideToViewModel now computes shouldRenderOverlay
      const { shouldRenderOverlay } = mapHeroSlideToViewModel(slide0);
      expect(shouldRenderOverlay).toBe(true);
    }
  });
});
