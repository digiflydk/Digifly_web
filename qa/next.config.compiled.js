// qa/next.config.compiled.js
// Robust shim for Playwright's webServer. Do NOT depend on adapter temp files.
function tryLoad(mod) {
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const c = require(mod);
    return c && c.default ? c.default : c;
  } catch {
    return null;
  }
}

const cfg =
  tryLoad("../next.config.ts") ||
  tryLoad("../next.config.mjs") ||
  tryLoad("../next.config.js") ||
  {};

module.exports = cfg;
