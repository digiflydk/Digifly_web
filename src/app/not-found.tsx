import Link from "next/link";
export default function NotFound() {
  return (
    <section className="not-found">
      <p className="eyebrow">404 / SIDEN FINDES IKKE</p>
      <h1>Et lille sidespor.</h1>
      <p>
        Vi kunne ikke finde den side, du leder efter. Lad os få dig tilbage på
        sporet.
      </p>
      <Link href="/" className="button">
        Tilbage til forsiden ↗
      </Link>
    </section>
  );
}
