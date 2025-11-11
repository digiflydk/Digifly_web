// src/scripts/predeploy/guard.ts
// Purpose: fail build if any TSX uses <Button ... href=...>. Allowed pattern is <Button asChild><a href=...>

import { globby } from "globby";
import fs from "node:fs/promises";

const BANNED = /<Button[^>]*\shref=/g; // matches href prop directly on Button
const STRIP_LINE_COMMENTS = /(^|\s)\/\/.*$/gm;
const STRIP_BLOCK_COMMENTS = /\/\*[\s\S]*?\*\//g;

(async () => {
  // Only scan app/components/etc. Exclude scripts and tests to avoid self-matches.
  const files = await globby([
    "src/**/*.tsx",
    "!src/scripts/**",
    "!src/**/__tests__/**",
    "!src/**/tests/**"
  ]);

  const offenders: { file: string; lines: number[] }[] = [];

  for (const file of files) {
    const raw = await fs.readFile(file, "utf8");
    // Remove comments so examples/comments don’t trigger the rule
    const cleaned = raw.replace(STRIP_BLOCK_COMMENTS, "").replace(STRIP_LINE_COMMENTS, "");
    
    // Reset regex state for each file
    BANNED.lastIndex = 0;
    if (!BANNED.test(cleaned)) continue;

    // Collect line numbers for developer ergonomics
    const lines: number[] = [];
    cleaned.split("\n").forEach((line, idx) => {
      if (/<Button[^>]*\shref=/.test(line)) lines.push(idx + 1);
    });
    
    if (lines.length > 0) {
        offenders.push({ file, lines });
    }
  }

  if (offenders.length) {
    console.error("\n[PREDEPLOY GUARD] Error: Found direct `href` prop on <Button> component. Use `<Button asChild><Link href...>` or a `ButtonLink` component instead.");
    console.error("Offending files:");
    for (const o of offenders) {
      console.error(`- ${o.file} (line${o.lines.length > 1 ? 's' : ''}: ${o.lines.join(", ")})`);
    }
    console.error("\nBuild failed due to pre-deploy guard.\n");
    process.exit(1);
  }

  console.log("[PREDEPLOY GUARD] OK");
})();
