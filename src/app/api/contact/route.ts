import { NextResponse } from "next/server";
import { contactEnabled, contactSchema } from "@/lib/contact";
export const runtime = "nodejs";
const recentRequests = new Map<string, { count: number; resetAt: number }>();
export async function POST(request: Request) {
  if (!contactEnabled())
    return NextResponse.json(
      { error: "Kontaktformularen er ikke åbnet endnu." },
      { status: 503 },
    );
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin)
    return NextResponse.json(
      { error: "Ugyldig forespørgsel." },
      { status: 403 },
    );
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return NextResponse.json({ error: "Ugyldigt format." }, { status: 415 });
  const now = Date.now();
  for (const [key, value] of recentRequests)
    if (value.resetAt <= now) recentRequests.delete(key);
  // Best-effort per-instance protection. The delivery gateway must also enforce limits.
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limit = recentRequests.get(ip) || { count: 0, resetAt: now + 600_000 };
  if (limit.count >= 5)
    return NextResponse.json(
      {
        error: "Der er sendt flere henvendelser på kort tid. Prøv igen senere.",
      },
      { status: 429, headers: { "Retry-After": "600" } },
    );
  limit.count++;
  recentRequests.set(ip, limit);
  try {
    if (Number(request.headers.get("content-length") || 0) > 30_000)
      return NextResponse.json(
        { error: "Beskeden er for lang." },
        { status: 413 },
      );
    const raw = await request.text();
    if (raw.length > 30_000)
      return NextResponse.json(
        { error: "Beskeden er for lang." },
        { status: 413 },
      );
    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: "Ugyldigt format." }, { status: 400 });
    }
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        { error: "Kontrollér navn, mailadresse og besked." },
        { status: 400 },
      );
    const url = new URL(process.env.CONTACT_WEBHOOK_URL!);
    if (url.protocol !== "https:")
      return NextResponse.json(
        { error: "Kontaktformularen er midlertidigt utilgængelig." },
        { status: 503 },
      );
    const { website: _website, ...message } = parsed.data;
    const response = await fetch(url, {
      method: "POST",
      redirect: "error",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CONTACT_WEBHOOK_TOKEN}`,
      },
      body: JSON.stringify({ ...message, source: "digifly-website" }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok)
      return NextResponse.json(
        { error: "Vi kunne ikke sende din henvendelse. Prøv igen om lidt." },
        { status: 502 },
      );
    return NextResponse.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Vi kunne ikke sende din henvendelse. Prøv igen om lidt." },
      { status: 502 },
    );
  }
}
