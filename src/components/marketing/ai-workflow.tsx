"use client";
import { useState } from "react";
const workflow = [
  {
    label: "Henvendelse",
    title: "En opgave kommer ind.",
    text: "En kunde sender en henvendelse. De relevante oplysninger samles, så næste skridt har et klart udgangspunkt.",
  },
  {
    label: "AI-forslag",
    title: "AI gør forarbejdet.",
    text: "AI kan sortere oplysningerne og foreslå et svar eller næste handling. Forslaget skal kunne vurderes, før det bliver brugt.",
  },
  {
    label: "Godkendelse",
    title: "Et menneske tager stilling.",
    text: "En medarbejder kontrollerer forslaget, retter det om nødvendigt og beslutter, om opgaven skal gå videre.",
  },
  {
    label: "Handling",
    title: "Systemet tager næste skridt.",
    text: "Efter godkendelse kan løsningen oprette en opgave eller overføre oplysninger til det rette system.",
  },
];
export function AiWorkflow() {
  const [active, setActive] = useState(0);
  return (
    <section className="ai-section" id="ai">
      <div className="wrap ai-layout">
        <div>
          <p className="eyebrow light">AI MED ET FORMÅL</p>
          <h2>
            Start med opgaven. <br />
            <span>Byg med omtanke.</span>
          </h2>
          <p>
            Hvad er input? Hvad skal resultatet bruges til? Og hvornår skal et
            menneske tage over? Vi gør AI konkret, før vi gør det stort.
          </p>
          <span className="ai-note">Et eksempel på en arbejdsgang med AI.</span>
        </div>
        <div className="workflow">
          <div className="workflow-top">
            <span>FRA HENVENDELSE TIL HANDLING</span>
            <span>0{active + 1} / 04</span>
          </div>
          <div
            className="workflow-buttons"
            role="group"
            aria-label="Vælg trin i workflow"
          >
            {workflow.map((item, i) => (
              <button
                type="button"
                aria-pressed={active === i}
                key={item.label}
                onClick={() => setActive(i)}
              >
                <span>0{i + 1}</span>
                {item.label}
              </button>
            ))}
          </div>
          <div
            className="workflow-detail"
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="workflow-symbol" aria-hidden="true">
              {["↗", "✳", "✓", "→"][active]}
            </span>
            <h3>{workflow[active].title}</h3>
            <p>{workflow[active].text}</p>
          </div>
          <p className="workflow-footnote">
            Illustrativt eksempel på en løsning, vi kan udvikle sammen.
          </p>
        </div>
      </div>
    </section>
  );
}
