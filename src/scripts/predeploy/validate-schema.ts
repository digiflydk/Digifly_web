
import { promises as fs } from 'fs';
import path from 'path';
import { SiteSettingsSchema } from '@/lib/schemas';
import { SITE_DEFAULTS } from '@/lib/defaults/siteDefaults';
import { emptySiteSettings } from '@/components/dadmin/site-seo/utils/formDefaults';

async function main() {
    const results = { ok: true, errors: [] as string[] };

    // 1. Validate SITE_DEFAULTS against the master schema
    const siteDefaultsParsed = SiteSettingsSchema.safeParse(SITE_DEFAULTS);
    if (!siteDefaultsParsed.success) {
        results.ok = false;
        results.errors.push('`SITE_DEFAULTS` in `siteDefaults.ts` does not match `SiteSettingsSchema`.');
    }

    // 2. Validate emptySiteSettings against the master schema
    const emptySettingsParsed = SiteSettingsSchema.safeParse(emptySiteSettings);
    if (!emptySettingsParsed.success) {
        results.ok = false;
        results.errors.push('`emptySiteSettings` in `formDefaults.ts` does not match `SiteSettingsSchema`.');
    }
    
    // 3. Check manifest.ts for correct key usage
    try {
        const manifestPath = path.join(process.cwd(), 'src', 'app', 'manifest.ts');
        const manifestContent = await fs.readFile(manifestPath, 'utf8');
        if (!manifestContent.includes('s.general.brandName')) {
            results.ok = false;
            results.errors.push('`manifest.ts` must use `settings.general.brandName` instead of `settings.title`.');
        }
    } catch {
        results.ok = false;
        results.errors.push('Could not read or find `src/app/manifest.ts`.');
    }

    const reportPath = path.join(process.cwd(), 'public', 'dev', 'reports', 'schema.json');
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify({ ok: results.ok, error: results.errors.join('; ') }, null, 2));

    if (!results.ok) {
        console.error('❌ Schema & Defaults validation failed:', results.errors.join('\n'));
        process.exit(1);
    }
    console.log('✅ Schema & Defaults validation passed.');
}

main();
