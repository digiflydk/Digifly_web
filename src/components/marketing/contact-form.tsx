"use client";
import { useState } from "react";
import Link from "next/link";
import { Arrow } from "./icons";
export function MarketingContactForm({
  enabled,
  subject = "",
}: {
  enabled: boolean;
  subject?: string;
}) {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!enabled || status === "sending") return;
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.error ||
            "Vi kunne ikke sende din henvendelse. Prøv igen om lidt.",
        );
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Vi kunne ikke sende din henvendelse. Prøv igen om lidt.",
      );
      setStatus("error");
    }
  }
  return (
    <form
      className="contact-form"
      method="post"
      action="/api/contact"
      onSubmit={submit}
    >
      {enabled && (
        <noscript>
          <p className="form-status">
            Slå JavaScript til for at sende en henvendelse.
          </p>
        </noscript>
      )}
      {!enabled && (
        <p className="form-status" role="status">
          Dette er en forhåndsvisning. Kontaktformularen åbner ved lancering og
          sender ikke beskeder endnu.
        </p>
      )}
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="contact-name">Navn</label>
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            placeholder="Dit navn"
            required
            minLength={2}
            maxLength={100}
          />
        </div>
        <div className="form-field">
          <label htmlFor="contact-email">Arbejdsmail</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="din@virksomhed.dk"
            required
            maxLength={254}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="contact-company">
            Virksomhed <span className="optional">(valgfrit)</span>
          </label>
          <input
            id="contact-company"
            name="company"
            autoComplete="organization"
            placeholder="Virksomhedens navn"
            maxLength={150}
          />
        </div>
        <div className="form-field">
          <label htmlFor="contact-subject">Hvad handler det om?</label>
          <select id="contact-subject" name="subject" defaultValue={subject}>
            {[
              "",
              "AI og automatisering",
              "Digitalt produkt",
              "Integrationer",
              "Udviklingskapacitet",
              "Orderfly",
              "Opsfly",
            ].map((value) => (
              <option value={value} key={value}>
                {value || "Ikke afklaret endnu"}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="contact-message">Hvad vil I gerne gøre muligt?</label>
        <textarea
          id="contact-message"
          name="message"
          placeholder="Fortæl kort om jeres idé eller udfordring…"
          required
          minLength={10}
          maxLength={5000}
          rows={5}
        />
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <p className="form-privacy">
        Læs, hvordan vi behandler dine oplysninger, i vores{" "}
        <Link href="/privacy">privatlivspolitik</Link>.
      </p>
      {status === "error" && (
        <p className="form-status error" role="alert">
          {error}
        </p>
      )}
      {status === "success" && (
        <p className="form-status success" role="status">
          Tak for din henvendelse. Den er modtaget, og vi vender tilbage på den
          mailadresse, du har angivet.
        </p>
      )}
      <button
        type="submit"
        className="button"
        disabled={!enabled || status === "sending"}
      >
        {!enabled
          ? "Åbner ved lancering"
          : status === "sending"
            ? "Sender…"
            : "Send henvendelse"}
        <Arrow diagonal />
      </button>
    </form>
  );
}
