export function ProductArt({ product }: { product: "orderfly" | "opsfly" }) {
  if (product === "orderfly")
    return (
      <div
        className="product-art orderfly-art"
        aria-label="Illustration af Orderflys bestillingsflow"
      >
        <div className="order-visual">
          <div className="mini-top">
            <span>
              orderfly<span className="mini-spark">↗</span>
            </span>
            <span>Bestilling</span>
          </div>
          <div className="order-menu">
            <div className="pizza-visual" aria-hidden="true">
              <span />
              <i />
              <b />
            </div>
            <div>
              <small>FRA MENUEN</small>
              <strong>
                Et godt måltid. <br />
                Et enkelt flow.
              </strong>
            </div>
          </div>
          <div className="order-flow">
            <span>
              01 <b>Vælg</b>
            </span>
            <span>
              02 <b>Bestil</b>
            </span>
            <span>
              03 <b>Hent / få leveret</b>
            </span>
          </div>
          <div className="order-complete">
            <span className="check-circle">✓</span> Fra kunde til køkken{" "}
            <span>↗</span>
          </div>
        </div>
        <span className="illustration-label">
          Illustration af produktets flow
        </span>
      </div>
    );
  return (
    <div
      className="product-art opsfly-art"
      aria-label="Illustration af Opsflys driftsområder"
    >
      <div className="ops-visual">
        <div className="mini-top">
          <span>
            opsfly<span className="mini-spark">↗</span>
          </span>
          <span>Drift i sammenhæng</span>
        </div>
        <div className="ops-network">
          <div className="ops-center">
            Én hverdag. <br />
            <b>Flere forbindelser.</b>
          </div>
          <div className="ops-module">
            <span>◎</span>Medarbejdere
          </div>
          <div className="ops-module">
            <span>▦</span>Vagtplanlægning
          </div>
          <div className="ops-module">
            <span>↗</span>Administration
          </div>
        </div>
      </div>
      <span className="illustration-label">
        Illustration af produktets områder
      </span>
    </div>
  );
}
