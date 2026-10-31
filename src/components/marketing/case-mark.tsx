import type { CaseVisual } from "@/lib/marketing";

export function CaseMark({ kind }: { kind: CaseVisual }) {
  return (
    <svg
      className="case-mark"
      viewBox="0 0 100 84"
      aria-hidden="true"
      focusable="false"
      fill="none"
    >
      {kind === "warehouse" && (
        <g stroke="currentColor" strokeWidth="2">
          <path d="M12 18v55M88 18v55M12 42h76M12 70h76" />
          <rect x="20" y="19" width="24" height="23" rx="2" />
          <rect x="52" y="26" width="27" height="16" rx="2" />
          <rect x="23" y="50" width="49" height="20" rx="2" />
        </g>
      )}
      {kind === "channels" && (
        <g stroke="currentColor" strokeWidth="2">
          <path d="M18 16c24 0 16 26 43 26M18 42h43M18 68c24 0 16-26 43-26M61 42h22" />
          <circle cx="16" cy="16" r="5" fill="currentColor" />
          <circle cx="16" cy="42" r="5" fill="currentColor" />
          <circle cx="16" cy="68" r="5" fill="currentColor" />
          <circle cx="83" cy="42" r="9" fill="currentColor" />
        </g>
      )}
      {kind === "workflow" && (
        <g stroke="currentColor" strokeWidth="2">
          <rect x="10" y="17" width="23" height="55" rx="4" />
          <rect x="39" y="17" width="23" height="55" rx="4" />
          <rect x="68" y="17" width="23" height="55" rx="4" />
          <path d="M16 29h11M45 29h11M74 29h11M16 41h11M45 41h11M16 53h11" />
        </g>
      )}
      {kind === "documents" && (
        <g stroke="currentColor" strokeWidth="2">
          <rect
            x="18"
            y="11"
            width="50"
            height="58"
            rx="4"
            transform="rotate(-10 18 11)"
          />
          <rect
            x="32"
            y="19"
            width="50"
            height="58"
            rx="4"
            fill="var(--case-surface)"
          />
          <path d="M43 35h27M43 45h27M43 55h19M43 65h23" />
        </g>
      )}
      {kind === "label" && (
        <g stroke="currentColor" strokeWidth="2">
          <path d="M19 17h49l17 20v29a6 6 0 0 1-6 6H19a6 6 0 0 1-6-6V23a6 6 0 0 1 6-6Z" />
          <circle cx="68" cy="34" r="4" />
          <path d="M25 34h24M25 47h46M25 58h32" />
        </g>
      )}
    </svg>
  );
}
