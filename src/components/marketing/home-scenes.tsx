import type { ReactNode } from "react";

type SceneKind =
  | "hero"
  | "flow"
  | "systems"
  | "software"
  | "warehouse"
  | "channels"
  | "research"
  | "packaging";
const indigo = "#4f46e5";
const lavender = "#dcd8f8";
const paper = "#fffefb";

function Panel({
  x,
  y,
  width = 220,
  height = 180,
  children,
  rotate = 0,
}: {
  x: number;
  y: number;
  width?: number;
  height?: number;
  children?: ReactNode;
  rotate?: number;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rotate} ${width / 2} ${height / 2})`}
    >
      <rect
        x="8"
        y="14"
        width={width}
        height={height}
        rx="14"
        fill="#3f365a"
        opacity=".08"
      />
      <rect
        width={width}
        height={height}
        rx="14"
        fill={paper}
        stroke="#dedadf"
      />
      <path d={`M0 36H${width}`} stroke="#e8e4e7" />
      <circle cx="18" cy="18" r="3" fill="#c5bfd1" />
      <circle cx="30" cy="18" r="3" fill="#d8d2df" />
      <circle cx="42" cy="18" r="3" fill="#e7e1e9" />
      {children}
    </g>
  );
}
function Board({
  x,
  y,
  scale = 1,
  rotate = 0,
}: {
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <Panel x={0} y={0} width={280} height={222} rotate={rotate}>
        {[0, 1, 2].map((column) => (
          <g key={column} transform={`translate(${18 + column * 84} 54)`}>
            <rect
              width="74"
              height="14"
              rx="5"
              fill={[lavender, "#dce7d4", "#eee3d3"][column]}
            />
            {[0, 1, 2].slice(0, column === 2 ? 1 : 3).map((row) => (
              <g key={row} transform={`translate(0 ${27 + row * 43})`}>
                <rect width="74" height="34" rx="6" fill="#f4f2f5" />
                <rect
                  x="9"
                  y="10"
                  width="43"
                  height="4"
                  rx="2"
                  fill="#c1b9d3"
                />
                <rect
                  x="9"
                  y="20"
                  width="28"
                  height="3"
                  rx="1.5"
                  fill="#ddd7e5"
                />
              </g>
            ))}
          </g>
        ))}
      </Panel>
    </g>
  );
}
function Block({
  x,
  y,
  size = 70,
  color = indigo,
}: {
  x: number;
  y: number;
  size?: number;
  color?: string;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d={`M0 ${size * 0.25} ${size * 0.5} 0 ${size} ${size * 0.25} ${size * 0.5} ${size * 0.5}Z`}
        fill={color}
      />
      <path
        d={`M0 ${size * 0.25} ${size * 0.5} ${size * 0.5}V${size * 1.06}L0 ${size * 0.8}Z`}
        fill={color}
        opacity=".65"
      />
      <path
        d={`M${size * 0.5} ${size * 0.5} ${size} ${size * 0.25}V${size * 0.8}L${size * 0.5} ${size * 1.06}Z`}
        fill={color}
        opacity=".85"
      />
    </g>
  );
}
function Star({
  x,
  y,
  radius = 38,
  color = indigo,
}: {
  x: number;
  y: number;
  radius?: number;
  color?: string;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d={`M0 ${-radius}C4 -10 10 -4 ${radius} 0C10 4 4 10 0 ${radius}C-4 10 -10 4 ${-radius} 0C-10 -4 -4 -10 0 ${-radius}Z`}
        fill={color}
      />
    </g>
  );
}
function CodePanel({
  x,
  y,
  scale = 1,
  rotate = 0,
}: {
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <Panel x={0} y={0} width={230} height={190} rotate={rotate}>
        <path
          d="m55 67-22 20 22 20m119-40 22 20-22 20m-75 14 23-51"
          stroke={indigo}
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="31" y="132" width="108" height="7" rx="3.5" fill="#cfc8e3" />
        <rect x="31" y="149" width="165" height="6" rx="3" fill="#e6e1ef" />
        <rect x="31" y="165" width="136" height="6" rx="3" fill="#e6e1ef" />
      </Panel>
    </g>
  );
}
function Document({
  x,
  y,
  rotate = 0,
  color = paper,
}: {
  x: number;
  y: number;
  rotate?: number;
  color?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate} 75 100)`}>
      <rect
        x="7"
        y="10"
        width="150"
        height="202"
        rx="8"
        fill="#473c60"
        opacity=".08"
      />
      <rect width="150" height="202" rx="8" fill={color} stroke="#d9d2df" />
      <rect x="22" y="25" width="42" height="42" rx="8" fill={lavender} />
      <path
        d="M22 90h105M22 108h86M22 126h105M22 144h93M22 163h56"
        stroke="#c9c2d5"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </g>
  );
}
function AiScene() {
  return (
    <>
      <ellipse cx="325" cy="332" rx="242" ry="44" fill="#dcd7ef" opacity=".6" />
      <path
        d="M103 241h84c44 0 39-72 89-72h92c42 0 35 80 79 80h75"
        stroke="#b1a6e7"
        strokeWidth="13"
        fill="none"
        strokeLinecap="round"
      />
      <Document x={67} y={136} rotate={-10} />
      <g transform="translate(247 92)">
        <rect
          x="8"
          y="13"
          width="146"
          height="165"
          rx="32"
          fill="#4834b7"
          opacity=".13"
        />
        <rect width="146" height="165" rx="32" fill={indigo} />
        <Star x={73} y={70} radius={39} color="#e4ddff" />
        <rect x="44" y="125" width="58" height="6" rx="3" fill="#a99cf4" />
      </g>
      <Panel x={426} y={195} width={141} height={115} rotate={7}>
        <rect x="17" y="54" width="106" height="13" rx="5" fill="#e0e8d8" />
        <rect x="17" y="80" width="72" height="7" rx="3" fill="#cbc2dd" />
      </Panel>
      <circle cx="462" cy="108" r="31" fill="#d9e5cb" />
      <path
        d="M448 108h28m-14-14v28"
        stroke="#768167"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </>
  );
}
export function HomeScene({ kind, label }: { kind: SceneKind; label: string }) {
  return (
    <svg
      className={`home-scene scene-${kind}`}
      viewBox="0 0 640 440"
      role="img"
      aria-label={label}
    >
      {kind === "hero" && (
        <>
          <ellipse
            cx="338"
            cy="377"
            rx="256"
            ry="46"
            fill="#ded7e7"
            opacity=".52"
          />
          <circle cx="337" cy="216" r="173" fill="#e7e1f3" />
          <path
            d="M109 279c-6 69 113 80 181 54 67-27 57-128 132-128h116"
            fill="none"
            stroke="#c5b9ec"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <Board x={259} y={46} scale={0.97} rotate={8} />
          <CodePanel x={56} y={189} scale={0.94} rotate={-9} />
          <Block x={410} y={276} size={100} color={indigo} />
          <Block x={496} y={310} size={57} color="#b2a0e3" />
          <g transform="translate(221 237)">
            <circle cx="41" cy="41" r="52" fill="#f7f7f2" />
            <circle cx="41" cy="41" r="42" fill={indigo} />
            <Star x={41} y={41} radius={25} color="#e5f2bb" />
          </g>
          <Star x={130} y={105} radius={22} color="#a8b88f" />
          <circle cx="561" cy="251" r="12" fill="#d1ddbd" />
        </>
      )}
      {kind === "flow" && <AiScene />}
      {kind === "systems" && (
        <>
          <ellipse
            cx="325"
            cy="350"
            rx="219"
            ry="43"
            fill="#d8d0e4"
            opacity=".5"
          />
          <rect
            x="118"
            y="99"
            width="360"
            height="235"
            rx="20"
            fill="#d6cdef"
            transform="rotate(-7 298 217)"
          />
          <Board x={155} y={83} scale={1.2} rotate={3} />
          <circle cx="500" cy="278" r="44" fill={indigo} />
          <path
            d="M482 267h35m-35 11h25m-25 11h30"
            stroke="#f0edff"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Star x={100} y={150} radius={22} color="#c3ae8d" />
        </>
      )}
      {kind === "software" && (
        <>
          <ellipse
            cx="321"
            cy="361"
            rx="224"
            ry="39"
            fill="#dbd5e1"
            opacity=".6"
          />
          <CodePanel x={129} y={58} scale={1.35} rotate={-5} />
          <Block x={105} y={283} size={72} color="#a8b9a0" />
          <Block x={359} y={250} size={111} color={indigo} />
          <Block x={462} y={314} size={66} color="#c5b5e5" />
          <path
            d="M191 343h99c34 0 30-42 64-42"
            fill="none"
            stroke="#b8a9d5"
            strokeWidth="9"
            strokeLinecap="round"
          />
        </>
      )}
      {kind === "warehouse" && (
        <>
          <path d="m74 344 285-68 214 72-283 72Z" fill="#ded7d0" />
          <g transform="translate(103 83)">
            <path
              d="M0 0v263M164 0v263M328 0v263"
              stroke="#635c6e"
              strokeWidth="10"
            />
            <path
              d="M0 88h328M0 174h328M0 252h328"
              stroke="#81778f"
              strokeWidth="11"
            />
            <g fill="#d2bd9f" stroke="#b29b7d" strokeWidth="1.5">
              <rect x="14" y="28" width="63" height="54" rx="3" />
              <rect x="88" y="16" width="61" height="66" rx="3" />
              <rect x="180" y="37" width="62" height="45" rx="3" />
              <rect x="251" y="25" width="62" height="57" rx="3" />
              <rect x="17" y="119" width="123" height="48" rx="3" />
              <rect x="184" y="107" width="55" height="60" rx="3" />
              <rect x="249" y="112" width="65" height="55" rx="3" />
              <rect x="15" y="203" width="59" height="42" rx="3" />
              <rect x="86" y="198" width="65" height="47" rx="3" />
            </g>
            <g fill="#f6f0e4">
              <rect x="29" y="46" width="30" height="16" rx="2" />
              <rect x="99" y="38" width="31" height="16" rx="2" />
              <rect x="201" y="49" width="25" height="13" rx="2" />
              <rect x="35" y="135" width="38" height="16" rx="2" />
            </g>
          </g>
          <Panel x={403} y={211} width={151} height={143} rotate={6}>
            <rect
              x="18"
              y="52"
              width="113"
              height="12"
              rx="4"
              fill={lavender}
            />
            <rect x="18" y="78" width="70" height="6" rx="3" fill="#ccc3dc" />
            <rect x="18" y="95" width="106" height="6" rx="3" fill="#e0d9e9" />
            <rect x="18" y="112" width="88" height="6" rx="3" fill="#e0d9e9" />
          </Panel>
        </>
      )}
      {kind === "channels" && (
        <>
          <ellipse cx="327" cy="338" rx="228" ry="43" fill="#d8d1ed" />
          <path
            d="M158 193c0 106 169 73 169 73s170 17 170-77M327 266V123"
            fill="none"
            stroke="#a89bd3"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <Panel x={69} y={111} width={179} height={133} rotate={-8}>
            <rect
              x="16"
              y="52"
              width="147"
              height="32"
              rx="5"
              fill={lavender}
            />
            <path
              d="M16 102h81M16 116h126"
              stroke="#cec5dc"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </Panel>
          <g transform="translate(421 92) rotate(9 55 90)">
            <rect
              x="6"
              y="10"
              width="108"
              height="187"
              rx="20"
              fill="#49376d"
              opacity=".1"
            />
            <rect
              width="108"
              height="187"
              rx="20"
              fill={paper}
              stroke="#d6cddd"
              strokeWidth="2"
            />
            <rect x="15" y="27" width="78" height="76" rx="7" fill="#dad3f3" />
            <path
              d="M22 124h63M22 140h43"
              stroke="#c8bfd7"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle cx="54" cy="166" r="5" fill="#cbc1da" />
          </g>
          <Block x={280} y={248} size={95} color={indigo} />
          <circle cx="327" cy="94" r="39" fill="#d9e5ca" />
          <Star x={327} y={94} radius={20} color="#859875" />
        </>
      )}
      {kind === "research" && (
        <>
          <ellipse cx="322" cy="357" rx="210" ry="38" fill="#dbd5cc" />
          <Document x={139} y={109} rotate={-16} color="#e4ddf3" />
          <Document x={246} y={69} rotate={8} />
          <Document x={343} y={118} rotate={19} color="#f6efdf" />
          <g transform="translate(335 247) rotate(-17)">
            <path
              d="m34 34 66 66"
              stroke={indigo}
              strokeWidth="18"
              strokeLinecap="round"
            />
            <circle
              r="52"
              fill="#f7f7f2"
              fillOpacity=".74"
              stroke={indigo}
              strokeWidth="11"
            />
            <path
              d="M-26-9c8-17 25-24 41-15"
              stroke="#beb0e8"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </>
      )}
      {kind === "packaging" && (
        <>
          <ellipse cx="324" cy="359" rx="222" ry="38" fill="#d9d6d0" />
          <g transform="translate(116 96) rotate(-6 80 120)">
            <path d="m0 28 96-28 54 29v221l-54 27-96-29Z" fill="#cbb89d" />
            <path d="m0 28 96 29 54-28-54-29Z" fill="#e5d6bf" />
            <path d="M96 57v220l54-27V29Z" fill="#bda587" />
            <rect x="17" y="93" width="62" height="98" rx="5" fill="#faf7ed" />
            <rect x="28" y="110" width="39" height="25" rx="4" fill="#d7d0ef" />
            <path
              d="M29 148h36M29 158h29M29 169h35"
              stroke="#b9b0c5"
              strokeWidth="3"
            />
          </g>
          <g transform="translate(302 75) rotate(9 67 142)">
            <rect x="45" width="45" height="21" rx="5" fill="#80768a" />
            <path
              d="M39 21h57v41c0 17 24 18 24 48v157a16 16 0 0 1-16 16H31a16 16 0 0 1-16-16V110c0-30 24-31 24-48Z"
              fill="#d9e3d0"
              stroke="#becbb3"
            />
            <rect x="22" y="116" width="91" height="109" rx="4" fill={paper} />
            <rect
              x="36"
              y="131"
              width="63"
              height="36"
              rx="5"
              fill={lavender}
            />
            <path
              d="M38 183h56M38 195h43M38 207h50"
              stroke="#c3bacf"
              strokeWidth="4"
            />
          </g>
          <g transform="translate(453 251) rotate(15)">
            <path d="M0 0h65l20 20v73H0Z" fill={paper} stroke="#cfc6d9" />
            <circle cx="64" cy="20" r="5" fill="#d5cce3" />
            <path
              d="M14 42h48M14 55h36M14 68h42"
              stroke="#c0b3db"
              strokeWidth="4"
            />
          </g>
        </>
      )}
    </svg>
  );
}
