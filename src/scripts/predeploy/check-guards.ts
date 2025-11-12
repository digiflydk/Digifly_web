import { globby } from "globby";
import fs from "fs/promises";
import path from "path";

export const runtime = 'nodejs';

type GuardResult = {
  ok: boolean;
  name: string;
  details?: string;
  file?: string;
};

async function checkButtonHref(): Promise<GuardResult> {
  const files = await globby(["src/components/**/*.{ts,tsx}", "src/app/**/*.{ts,tsx}"]);
  for (const file of files) {
    const content = await fs.readFile(file, "utf8");
    if (content.match(/<Button\s+[^>]*href=/)) {
      return { ok: false, name: "No <Button href>", file, details: "Found <Button> with href prop. Use <Button asChild><a href.../></Button> or ButtonLink." };
    }
  }
  return { ok: true, name: "No <Button href>" };
}

async function checkUseServerExports(): Promise<GuardResult> {
    const files = await globby(["src/app/**/*.{ts,tsx}", "src/lib/**/*.{ts,tsx}"]);
    for (const file of files) {
      const content = await fs.readFile(file, "utf8");
      if (content.match(/^['"]use server['"]/m)) {
        if (content.match(/export\s+(const|let|var|type|interface|enum|class|function\s(?!async))/)) {
          return { ok: false, name: "Valid 'use server' exports", file, details: "Files with 'use server' should only export async functions." };
        }
      }
    }
    return { ok: true, name: "Valid 'use server' exports" };
}

async function checkServerOnlyImports(): Promise<GuardResult> {
    const files = await globby(["src/scripts/**/*.ts"]);
    for (const file of files) {
      const content = await fs.readFile(file, "utf8");
      if (content.includes("server-only")) {
        return { ok: false, name: "No 'server-only' in scripts", file, details: "Build scripts cannot import 'server-only' modules." };
      }
    }
    return { ok: true, name: "No 'server-only' in scripts" };
}

async function checkDeprecatedKeys(): Promise<GuardResult> {
    const files = await globby(["src/**/*.{ts,tsx}"]);
    const deprecated = ["siteTitle", "brand.logo.src", "brand.favicon.src", "social.tagline", "defaultSeo.description"];
    for (const file of files) {
        if (file.includes("schemas.ts") || file.includes("defaults.ts")) continue;

        const content = await fs.readFile(file, "utf8");
        for (const key of deprecated) {
            if (content.includes(key)) {
                 return { ok: false, name: "No deprecated keys", file, details: `Found deprecated key: ${key}. Use keys from SiteSettingsSchema.` };
            }
        }
    }
    return { ok: true, name: "No deprecated keys" };
}

async function runGuards() {
  const checks = [
    checkButtonHref(),
    checkUseServerExports(),
    checkServerOnlyImports(),
    checkDeprecatedKeys(),
  ];

  const results = await Promise.all(checks);
  
  const reportPath = path.join(process.cwd(), 'public', 'dev', 'reports', 'guards.json');
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, JSON.stringify(results, null, 2));

  if (results.some(r => !r.ok)) {
    console.error("\n❌ Pre-deploy guards failed:");
    results.filter(r => !r.ok).forEach(r => {
      console.error(`  - [${r.name}] ${r.details} (${r.file})`);
    });
    console.error("\n");
    process.exit(1);
  } else {
    console.log("✅ All pre-deploy guards passed.");
  }
}

runGuards();
