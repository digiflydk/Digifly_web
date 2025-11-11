
import { readFileSync, existsSync } from "fs";
import { execSync } from "child_process";

function fail(msg: string): never {
  console.error(`[PREDEPLOY GUARD] ${msg}`);
  process.exit(1);
}

// 1) No <Button ... href=...> misuse (already checked earlier, keep as programmatic fallback)
try {
  const grep = execSync(`grep -R "<Button\\s\\+.*href=" -n src || true`).toString().trim();
  if (grep) fail(`Do not use href directly on <Button>. Offenders:\n${grep}`);
} catch {}

// 2) Required predeploy scripts must exist (protect against regressions)
const pkg = JSON.parse(readFileSync("package.json", "utf8"));
["predeploy:guard", "predeploy:typecheck", "predeploy:qa"].forEach((s) => {
  if (!pkg.scripts?.[s]) fail(`Missing npm script: ${s}`);
});

// 3) Docs/Playwright routes present
[
  "src/app/dadmin/developer/docs/page.tsx",
  "src/app/dadmin/developer/tests/page.tsx"
].forEach((p) => {
  if (!existsSync(p)) fail(`Missing route file: ${p}`);
});

// 4) Types dependency we rely on (lodash types) present
try {
  execSync(`node -e "require.resolve('@types/lodash');"`, { stdio: "ignore" });
} catch {
  fail(`Missing dev dependency: @types/lodash`);
}

console.log("[PREDEPLOY GUARD] OK");
