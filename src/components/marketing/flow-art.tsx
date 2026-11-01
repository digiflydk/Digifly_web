export function FlowArt() {
  const paths = [
    "M-70 118H88c74 0 74 96 148 96h86c76 0 76-126 152-126h130",
    "M-70 150H75c74 0 74 96 148 96h110c75 0 75-126 150-126h130",
    "M-70 182H62c74 0 74 96 148 96h136c74 0 74-126 148-126h130",
    "M-70 214H49c74 0 74 96 148 96h162c73 0 73-126 146-126h130",
    "M-70 246H36c74 0 74 96 148 96h188c72 0 72-126 144-126h130",
    "M-70 278H23c74 0 74 96 148 96h214c71 0 71-126 142-126h130",
  ];
  return (
    <div className="flow-art">
      <div className="art-caption">
        <span className="signal-dot" /> FORBIND DET, DER ER MULIGT
      </div>
      <svg
        viewBox="0 0 560 470"
        role="img"
        aria-label="Forretningsbehov forbindes med AI og digitale løsninger"
      >
        <defs>
          <pattern
            id="flow-dots"
            x="0"
            y="0"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill="#cecaf8" />
          </pattern>
        </defs>
        <rect width="560" height="470" fill="url(#flow-dots)" />
        {paths.map((d, i) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke={i === 2 ? "#b2aaf7" : "#4F46E5"}
            strokeWidth={i === 2 ? 13 : 9}
            strokeLinecap="round"
          />
        ))}
        <circle
          cx="278"
          cy="300"
          r="50"
          fill="#f7f7f2"
          stroke="#4F46E5"
          strokeWidth="2"
        />
        <path d="M264 300h28m-14-14v28" stroke="#4F46E5" strokeWidth="3" />
        <g className="flow-signal">
          <circle cx="90" cy="150" r="6" fill="#DCF98C" />
          <circle cx="456" cy="225" r="6" fill="#DCF98C" />
        </g>
        <text x="31" y="98">
          FORRETNING
        </text>
        <text x="250" y="420">
          AI + TEKNOLOGI
        </text>
        <text x="390" y="57">
          FREMDRIFT
        </text>
      </svg>
      <div className="art-bottom">
        <span>Fra kompleksitet</span>
        <span>til fremdrift ↗</span>
      </div>
    </div>
  );
}
