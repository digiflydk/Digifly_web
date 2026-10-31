import assert from "node:assert/strict";
import { test } from "node:test";
const base = process.env.BASE_URL || "http://127.0.0.1:4173";
test("marketing pages render and IDs are unique", async () => {
  for (const path of [
    "/",
    "/services",
    "/cases",
    "/cases/warehouse-management",
    "/cases/omnichannel",
    "/cases/monday-implementering",
    "/cases/fondsresearch",
    "/cases/retail-labels-og-pant",
    "/about",
    "/contact",
    "/privacy",
    "/cookies",
  ]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, /<html[^>]*lang="da"/);
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(new Set(ids).size, ids.length, `${path} has duplicate IDs`);
    assert.ok(!html.includes("reducing manual effort by 90%"));
    assert.ok(!html.includes("50k active users"));
    assert.doesNotMatch(
      html,
      /orderfly|opsfly|egne produkter|eget produkt/i,
    );
    assert.ok(!html.includes("googletagmanager.com"));
    assert.ok(!html.includes("http://localhost:3000"));
  }
});
test("unknown and former placeholder case URLs return actual 404", async () => {
  for (const path of [
    "/this-page-does-not-exist",
    "/cases/autostream-ai",
    "/cases/connect-app",
    "/cases/orderfly",
    "/cases/opsfly",
  ])
    assert.equal((await fetch(base + path)).status, 404, path);
});
test("preview SEO and version are explicit", async () => {
  const health = await fetch(base + "/api/health");
  assert.equal(health.status, 200);
  const json = await health.json();
  assert.equal(json.service, "digifly");
  assert.match(json.release, /^[a-f0-9]{40}$/);
  const robots = await (await fetch(base + "/robots.txt")).text();
  assert.match(robots, /Disallow: \//);
  assert.ok(!robots.includes("localhost"));
  const html = await (await fetch(base + "/")).text();
  assert.match(html, /noindex/);
});
test("local preview cannot mutate legacy CMS or claim contact delivery", async () => {
  for (const path of [
    "/api/cms/site",
    "/api/admin/site",
    "/api/cms/cases",
    "/api/health/firebase",
    "/%64admin",
  ]) {
    assert.equal(
      (
        await fetch(base + path, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{}",
        })
      ).status,
      404,
      path,
    );
  }
  assert.equal((await fetch(base + "/", { method: "POST" })).status, 405);
  assert.equal(
    (
      await fetch(base + "/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      })
    ).status,
    503,
  );
});
