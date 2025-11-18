
// Acceptance tests for DGF-406, DGF-416, DGF-429 (homepage regression)
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

test.describe(
  '@suite:homepage-cms-core DGF-416 / DGF-417 — Homepage CMS core',
  () => {
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
  },
);

test.describe(
  '@suite:hero-banner-colors DGF-429 / DGF-431 — Hero banner colors',
  () => {
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

    // Node-only test for frontend logic: overlay mapping
    test(
      'DGF-457 — hero overlay color & opacity is mapped correctly for frontend',
      async () => {
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
      },
    );

    // Node-only test for frontend logic: text color mapping
    // This is the key business test: CMS text color must be the same in frontend mapping.
    test(
      'DGF-457 — hero text color is mapped correctly for frontend',
      async () => {
        const TEST_TEXT_COLOR = '#000000'; // black, as used in the business scenario
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
          { arrayMerge: (_d, s) => s },
        );

        await saveHomepage(updatedPayload);
        const readData = await getHomepage();
        const slide0 = readData?.hero?.slides?.[0];

        // Test the mapping logic directly
        const vm = mapHeroSlideToViewModel(slide0 as HeroSlide);

        // The value used by frontend logic must be exactly the same as in CMS.
        expect(vm.textColor).toBe(TEST_TEXT_COLOR);
      },
    );

    test('DGF-467 — hero textColor from CMS matches the color returned by /api/cms/home', async () => {
      const TEST_TEXT_COLOR = '#a1b2c3';

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

      // 3) Call the shared helper that the API endpoint uses internally.
      const apiPayload = await getCmsHomePayload();

      // 4) Verify that the API payload reflects the same textColor
      const apiSlide0 = (apiPayload as HomePage)?.hero?.slides?.[0] as HeroSlide | undefined;

      expect(apiSlide0).toBeTruthy();
      expect(apiSlide0?.textColor).toBe(TEST_TEXT_COLOR);
    });

    test('DGF-470 — hero slide core fields from CMS match /api/cms/home view model', async () => {
        // Use a marker so we know we are reading our own data
        const marker = `DGF-470-${Date.now()}`;

        const TEST_VALUES = {
          eyebrow: `Eyebrow ${marker}`,
          heading: `Heading ${marker}`,
          body: `Body ${marker}`,
          ctaLabel: `CTA ${marker}`,
          ctaInternalRef: 'contact',
          textColor: '#112233',
          imageSrc: 'https://example.com/dgf-470-test.png',
          imageAlt: `Alt ${marker}`,
          overlay: {
            enabled: true,
            cmyk: { c: 5, m: 10, y: 15, k: 20 },
            opacityPercent: 55,
          },
        };

        // 1) Read current homepage as base
        const currentData = await getHomepage();

        // 2) Write a single slide with our known marker values
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
                  cta: {
                    label: TEST_VALUES.ctaLabel,
                    type: 'internal',
                    internalRef: TEST_VALUES.ctaInternalRef,
                    newTab: false,
                  },
                  textColor: TEST_VALUES.textColor,
                  image: {
                      src: TEST_VALUES.imageSrc,
                      alt: TEST_VALUES.imageAlt
                  },
                  overlay: {
                    enabled: TEST_VALUES.overlay.enabled,
                    cmyk: TEST_VALUES.overlay.cmyk,
                    opacityPercent: TEST_VALUES.overlay.opacityPercent,
                  },
                },
              ],
            },
          },
          {
            arrayMerge: (_destination, source) => source,
          },
        );

        await saveHomepage(updatedPayload);

        // 3) Read back from CMS to confirm Firestore write
        const readData = await getHomepage();
        const slide0 = readData?.hero?.slides?.[0] as HeroSlide;
        expect(slide0).toBeTruthy();
        
        expect(slide0.eyebrow).toBe(TEST_VALUES.eyebrow);
        expect(slide0.heading).toBe(TEST_VALUES.heading);
        expect(slide0.body).toBe(TEST_VALUES.body);
        expect(slide0.cta?.label).toBe(TEST_VALUES.ctaLabel);
        expect(slide0.cta?.internalRef).toBe(TEST_VALUES.ctaInternalRef);
        expect(slide0.cta?.type).toBe('internal');
        expect(slide0.cta?.newTab).toBe(false);
        expect(slide0.textColor).toBe(TEST_VALUES.textColor);
        expect(slide0.image?.src).toBe(TEST_VALUES.imageSrc);
        expect(slide0.image?.alt).toBe(TEST_VALUES.imageAlt);
        expect(slide0.overlay?.enabled).toBe(TEST_VALUES.overlay.enabled);
        expect(slide0.overlay?.cmyk?.c).toBe(TEST_VALUES.overlay.cmyk.c);
        expect(slide0.overlay?.opacityPercent).toBe(TEST_VALUES.overlay.opacityPercent);

        // 4) Fetch the public homepage view model and assert the same values there
        const vmJson = await getCmsHomePayload();

        // The shape can vary slightly, but we expect hero.slides[0] to exist
        const vmHero = vmJson?.hero;
        expect(vmHero).toBeTruthy();

        const vmSlide0 = vmHero.slides?.[0];
        expect(vmSlide0).toBeTruthy();

        // Text content
        expect(vmSlide0.eyebrow).toBe(TEST_VALUES.eyebrow);
        expect(vmSlide0.heading).toBe(TEST_VALUES.heading);
        expect(vmSlide0.body).toBe(TEST_VALUES.body);

        // CTA
        expect(vmSlide0.cta?.label).toBe(TEST_VALUES.ctaLabel);
        expect(vmSlide0.cta?.internalRef).toBe(TEST_VALUES.ctaInternalRef);
        
        // Text color
        expect(vmSlide0.textColor).toBe(TEST_VALUES.textColor);

        // Image and alt text
        expect(vmSlide0.image?.src).toBe(TEST_VALUES.imageSrc);
        expect(vmSlide0.image?.alt).toBe(TEST_VALUES.imageAlt);

        if ('overlay' in vmSlide0) {
            expect(vmSlide0.overlay?.enabled).toBe(true);
        }
    });
  },
);
