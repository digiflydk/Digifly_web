import assert from "node:assert/strict";
import { test } from "node:test";
import { POST } from "../src/app/api/contact/route";
import { middleware } from "../src/middleware";
import { NextRequest } from "next/server";
import { contactEnabled } from "../src/lib/contact";

const valid = {
  name: "Test Person",
  email: "person@example.com",
  company: "Example",
  message: "A local test message only.",
  subject: "Orderfly",
  website: "",
};
function request(body: unknown = valid, origin = "https://digifly.test") {
  return new Request("https://digifly.test/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: origin,
      "x-forwarded-for": String(Math.random()),
    },
    body: JSON.stringify(body),
  });
}
test("contact is closed by default and never reports fake delivery", async () => {
  delete process.env.CONTACT_FORM_ENABLED;
  const response = await POST(request());
  assert.equal(response.status, 503);
  assert.equal(contactEnabled(), false);
});
test("configured contact validates origin/input and reports provider acceptance only", async () => {
  const original = globalThis.fetch;
  const previous = Object.fromEntries(
    [
      "CONTACT_FORM_ENABLED",
      "CONTACT_WEBHOOK_URL",
      "CONTACT_WEBHOOK_TOKEN",
      "CONTACT_PRIVACY_NOTICE",
    ].map((key) => [key, process.env[key]]),
  );
  process.env.CONTACT_FORM_ENABLED = "true";
  process.env.CONTACT_WEBHOOK_URL = "https://delivery.example.com/lead";
  process.env.CONTACT_WEBHOOK_TOKEN = "local-test-only";
  process.env.CONTACT_PRIVACY_NOTICE = "Reviewed local fixture.";
  let calls = 0;
  let providerStatus = 502;
  globalThis.fetch = async (_url, init) => {
    calls++;
    assert.equal(JSON.parse(String(init?.body)).source, "digifly-website");
    assert.equal(JSON.parse(String(init?.body)).website, undefined);
    return new Response("{}", { status: providerStatus });
  };
  try {
    assert.equal(
      (await POST(request(valid, "https://other.test"))).status,
      403,
    );
    assert.equal((await POST(request({ ...valid, email: "bad" }))).status, 400);
    assert.equal(
      (await POST(request({ ...valid, website: "bot" }))).status,
      400,
    );
    assert.equal(calls, 0);
    assert.equal((await POST(request())).status, 502);
    providerStatus = 202;
    const success = await POST(request());
    assert.equal(success.status, 200);
    assert.deepEqual(await success.json(), { ok: true });
    assert.equal(calls, 2);
    process.env.CONTACT_WEBHOOK_URL = "http://delivery.example.com";
    assert.equal((await POST(request())).status, 503);
    assert.equal(calls, 2);
  } finally {
    globalThis.fetch = original;
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});
test("legacy CMS, admin and encoded paths are blocked before route execution", () => {
  for (const path of [
    "/dadmin",
    "/dadmin/cases",
    "/api/cms/site",
    "/api/admin/site",
    "/api/debug/cms-map",
    "/docs",
    "/api/health/firebase",
    "/%64admin",
    "/api/%63ms/site",
    "/api/cms/site/",
  ]) {
    for (const method of ["GET", "POST", "PUT", "DELETE"])
      assert.equal(
        middleware(new NextRequest(`https://digifly.test${path}`, { method }))
          .status,
        404,
        `${method} ${path}`,
      );
  }
  assert.equal(
    middleware(new NextRequest("https://digifly.test/", { method: "POST" }))
      .status,
    405,
  );
  assert.equal(
    middleware(
      new NextRequest("https://digifly.test/api/contact", { method: "POST" }),
    ).status,
    200,
  );
  assert.equal(
    middleware(new NextRequest("https://digifly.test/api/health")).status,
    200,
  );
});
