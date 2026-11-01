type InterfaceKind =
  "connections" | "development" | "roadmap" | "omnichannel" | "board";

export function InterfacePreview({
  kind,
  label,
}: {
  kind: InterfaceKind;
  label: string;
}) {
  return (
    <div
      className={`interface-preview interface-${kind}`}
      role="img"
      aria-label={label}
    >
      <div className="interface-window" aria-hidden="true">
        <div className="interface-chrome">
          <span className="interface-dots">
            <i />
            <i />
            <i />
          </span>
          <span>
            {kind === "board"
              ? "Arbejdsrum"
              : kind === "omnichannel"
                ? "Kanaloverblik"
                : "Arbejdsrum"}
          </span>
          <span className="interface-window-icon">↗</span>
        </div>
        {kind === "connections" && (
          <div className="connection-canvas">
            <div className="connection-source">
              <span className="interface-app-symbol">▤</span>
              <span>Systemer</span>
            </div>
            <div className="connection-line" />
            <div className="connection-center">
              <span>✳</span>
              <strong>AI + data</strong>
            </div>
            <div className="connection-line" />
            <div className="connection-source">
              <span className="interface-app-symbol">↗</span>
              <span>Arbejdsgange</span>
            </div>
          </div>
        )}
        {kind === "development" && (
          <div className="development-canvas">
            <div className="code-pane">
              <span className="code-muted">{"// fra idé til produkt"}</span>
              <span>
                <b>function</b> createFlow() {"{"}
              </span>
              <span className="code-indent">
                <b>return</b> connect(
              </span>
              <span className="code-indent code-string">
                &nbsp;&nbsp;people, systems
              </span>
              <span className="code-indent">);</span>
              <span>{"}"}</span>
            </div>
            <div className="product-pane">
              <div className="product-pane-nav">
                <i />
                <i />
                <i />
              </div>
              <div className="product-pane-hero" />
              <div className="product-pane-lines">
                <i />
                <i />
              </div>
              <div className="product-pane-cards">
                <i />
                <i />
                <i />
              </div>
            </div>
          </div>
        )}
        {kind === "roadmap" && (
          <div className="roadmap-canvas">
            <div className="interface-title-row">
              <strong>Næste skridt</strong>
              <span>Plan</span>
            </div>
            {["Prioritér", "Udvikl", "Byg videre"].map((item, index) => (
              <div className="roadmap-row" key={item}>
                <span className="roadmap-node" />
                <strong>{item}</strong>
                <span className={`roadmap-block roadmap-block-${index}`} />
              </div>
            ))}
            <div className="roadmap-caption">Fra behov til næste version</div>
          </div>
        )}
        {kind === "omnichannel" && (
          <div className="channel-layout">
            <aside>
              <span className="channel-brand-mark">◈</span>
              <span className="channel-nav-active">Overblik</span>
              <span>Produkter</span>
              <span>Kanaler</span>
              <span>Arbejdsgange</span>
            </aside>
            <div className="channel-main">
              <div className="interface-title-row">
                <strong>Én sammenhængende oplevelse</strong>
                <span>Arbejdsrum</span>
              </div>
              <div className="channel-tabs">
                <span>Web</span>
                <span>Butik</span>
                <span>Kundeservice</span>
              </div>
              <div className="channel-table">
                <div className="channel-table-head">
                  <span>Fælles information</span>
                  <span>Kanaler</span>
                </div>
                {["Produktinformation", "Bestilling", "Kundedialog"].map(
                  (item, index) => (
                    <div className="channel-table-row" key={item}>
                      <span
                        className={`channel-row-mark channel-mark-${index}`}
                      />
                      <span>{item}</span>
                      <span className="channel-connection-dots">
                        <i />
                        <i />
                        <i />
                      </span>
                    </div>
                  ),
                )}
              </div>
              <div className="channel-footer">
                <span className="channel-footer-node" />
                <span>Data og arbejdsgange i sammenhæng</span>
              </div>
            </div>
          </div>
        )}
        {kind === "board" && (
          <div className="board-layout">
            <div className="interface-title-row">
              <strong>Fra opgave til overblik</strong>
              <span>Opgavetavle</span>
            </div>
            <div className="board-columns">
              {[
                {
                  title: "Afklaring",
                  tasks: ["Kortlæg processen", "Afklar behov"],
                },
                {
                  title: "I gang",
                  tasks: ["Opsæt arbejdsgang", "Forbind systemer"],
                },
                { title: "Til gennemgang", tasks: ["Afprøv løsningen"] },
              ].map((column, index) => (
                <div className="board-column" key={column.title}>
                  <div className="board-column-title">
                    <i className={`board-dot-${index}`} />
                    {column.title}
                  </div>
                  {column.tasks.map((task) => (
                    <div className="board-task" key={task}>
                      <span>{task}</span>
                      <div className="board-task-footer">
                        <i />
                        <span>···</span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function ResearchVisual() {
  return (
    <div
      className="research-visual"
      role="img"
      aria-label="Illustrativt dokumentlayout om fondsresearch"
    >
      <div className="research-sheet research-sheet-back" aria-hidden="true" />
      <div className="research-sheet" aria-hidden="true">
        <span className="research-kicker">RESEARCH / MULIGHEDER</span>
        <strong>
          De rigtige
          <br />
          spørgsmål.
          <br />
          <em>
            Det næste
            <br />
            skridt.
          </em>
        </strong>
        <div className="research-rule" />
        <span className="research-note">Fonde · Formål · Relevans</span>
      </div>
      <span className="research-paperclip" aria-hidden="true" />
    </div>
  );
}
