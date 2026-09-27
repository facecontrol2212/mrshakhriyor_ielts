/** Plan of Thornbury Country Park — Listening Mock 1, Questions 15–20. */
export function ThornburyParkMap() {
  const letter = (x: number, y: number, l: string) => (
    <g key={l}>
      <circle cx={x} cy={y} r={13} fill="#fff" stroke="#111" strokeWidth={2} />
      <text x={x} y={y + 5} textAnchor="middle" fontSize={15} fontWeight={700} fill="#111">
        {l}
      </text>
    </g>
  )
  const tree = (x: number, y: number, i: number) => <circle key={i} cx={x} cy={y} r={9} fill="#7fae6a" stroke="#4f7d3f" strokeWidth={1.5} />
  const trees = [
    [30, 30], [58, 22], [92, 34], [128, 24], [160, 40], [196, 26], [232, 38], [262, 24], [382, 30], [414, 42], [446, 24],
    [480, 38], [512, 26], [546, 40], [604, 28], [36, 88], [150, 80], [214, 84], [250, 70], [396, 80], [432, 92], [520, 84], [612, 88],
  ]
  return (
    <svg viewBox="0 0 640 460" role="img" aria-label="Plan of Thornbury Country Park with locations labelled A to H" className="h-auto w-full" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <rect x={1} y={1} width={638} height={458} fill="#eef5e4" stroke="#111" strokeWidth={2} />
      {/* Woodland */}
      <rect x={1} y={1} width={638} height={105} fill="#dcebcf" />
      {trees.map(([x, y], i) => tree(x, y, i))}
      <text x={320} y={100} textAnchor="middle" fontSize={13} fontStyle="italic" fill="#3b5e2e">
        Woodland
      </text>
      {/* Stream and bridge */}
      <path d="M0 160 C 90 150, 170 170, 250 158 S 400 150, 470 162 S 580 170, 640 156" fill="none" stroke="#6fb3e0" strokeWidth={9} />
      <text x={560} y={184} fontSize={12} fontStyle="italic" fill="#2b6d99">
        stream
      </text>
      {/* Paths */}
      <g stroke="#cdb68a" strokeWidth={12} strokeLinecap="round" fill="none">
        <line x1={320} y1={452} x2={320} y2={112} />
        <path d="M320 178 L 250 182 L 110 186" />
        <path d="M320 126 L 620 122" />
        <path d="M320 405 L 470 405 L 600 400" />
      </g>
      <rect x={306} y={146} width={28} height={26} fill="#a47b4f" stroke="#5c4128" strokeWidth={1.5} />
      <text x={344} y={146} fontSize={12} fill="#111">
        Bridge
      </text>
      {/* Lake */}
      <ellipse cx={172} cy={250} rx={100} ry={56} fill="#a9d3ef" stroke="#4d93c4" strokeWidth={2} />
      <text x={172} y={255} textAnchor="middle" fontSize={15} fontStyle="italic" fill="#1f5a86">
        Lake
      </text>
      {/* Buildings and car park */}
      <rect x={350} y={350} width={96} height={46} fill="#fff" stroke="#111" strokeWidth={2} />
      <text x={398} y={370} textAnchor="middle" fontSize={12} fontWeight={700} fill="#111">
        Visitor
      </text>
      <text x={398} y={385} textAnchor="middle" fontSize={12} fontWeight={700} fill="#111">
        centre
      </text>
      <rect x={30} y={370} width={160} height={66} fill="#e3e3e3" stroke="#111" strokeWidth={2} strokeDasharray="6 4" />
      <text x={110} y={408} textAnchor="middle" fontSize={13} fontWeight={700} fill="#111">
        Car park
      </text>
      <rect x={250} y={362} width={40} height={30} fill="#f7f7f7" stroke="#111" strokeWidth={1.5} />
      {/* Entrance and compass */}
      <path d="M320 458 l-9 -14 h18 z" fill="#111" />
      <text x={336} y={447} fontSize={13} fontWeight={700} fill="#111">
        ENTRANCE
      </text>
      <g transform="translate(600 150)">
        <circle r={17} fill="#fff" stroke="#111" strokeWidth={1.5} />
        <path d="M0 -12 L5 4 L0 0 L-5 4 Z" fill="#111" />
        <text y={-19} textAnchor="middle" fontSize={12} fontWeight={700} fill="#111" dy={-2}>
          N
        </text>
      </g>
      {/* Letters */}
      {letter(172, 206, 'A')}
      {letter(42, 250, 'B')}
      {letter(270, 336, 'C')}
      {letter(420, 262, 'D')}
      {letter(458, 146, 'E')}
      {letter(580, 62, 'F')}
      {letter(560, 372, 'G')}
      {letter(62, 58, 'H')}
    </svg>
  )
}
