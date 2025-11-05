import { test, expect } from '@playwright/test';
import { expect200 } from '../helpers/expect200';

for (const path of ['/api/cms/health','/api/cms/design','/api/cms/navigation','/api/cms/home','/api/cms/cases']) {
    test(`API exists: ${path}`, async ({ request, baseURL }) => {
      const r = await request.get(`${baseURL}${path}`);
      await expect200(r);
    });
}
