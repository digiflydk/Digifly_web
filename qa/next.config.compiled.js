// qa/next.config.compiled.js
// Minimal, robust shim for Playwright's webServer.
// Do NOT depend on adapter temp files (e.g., next.config.original).

function tryLoad(mod) {
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const c = require(mod);
    return c && c.default ? c.default : c;
  } catch {
    return null;
  }
}

// Try common Next config entry points in project root:
const cfg =
  tryLoad("../next.config.ts") ||
  tryLoad("../next.config.mjs") ||
  tryLoad("../next.config.js") ||
  {};

module.exports = cfg;
