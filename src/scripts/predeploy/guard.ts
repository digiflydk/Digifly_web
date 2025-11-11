
import fg from "fast-glob";
import fs from "node:fs/promises";

const BANNED = /<Button[^>]*\shref=/g;
const STRIP_LINE_COMMENTS = /(^|\s)\/\/.*$/gm;
const STRIP_BLOCK_COMMENTS = /\/\*[\s\S]*?\*\//g;

(async () => {
  const files = await fg([
    "src/**/*.tsx",
    "!src/scripts/**",
    "!src/**/__tests__/**",
    "!src/**/tests/**"
  ]);

  const offenders: { file: string; lines: number[] }[] = [];

  for (const file of files) {
    const raw = await fs.readFile(file, "utf8");
    const cleaned = raw.replace(STRIP_BLOCK_COMMENTS, "").replace(STRIP_LINE_COMMENTS, "");
    
    // Reset regex state before each test
    BANNED.lastIndex = 0;
    if (!BANNED.test(cleaned)) continue;

    const lines: number[] = [];
    cleaned.split("\n").forEach((line, i) => {
      if (/<Button[^>]*\shref=/.test(line)) lines.push(i + 1);
    });
    if (lines.length) offenders.push({ file, lines });
  }

  if (offenders.length) {
    console.error("[PREDEPLOY GUARD] Do not use href directly on <Button>. Offenders:");
    offenders.forEach(o => console.error(`- ${o.file}:${o.lines.join(",")}`));
    process.exit(1);
  }

  console.log("[PREDEPLOY GUARD] OK");
})();
