import type { ChartVisual } from '@/types/content'

// Exam charts are printed in black and white, so series are told apart by
// line style and marker shape, never by colour alone.
const DASHES = ['', '8 5', '2 4', '12 4 2 4']
const FILLS = ['#222', '#fff', '#9a9a9a', 'url(#hatch)']

function Marker({ kind, x, y }: { kind: number; x: number; y: number }) {
  const common = { stroke: '#111', strokeWidth: 1.5 }
  if (kind % 3 === 1) return <rect x={x - 4.5} y={y - 4.5} width={9} height={9} fill="#fff" {...common} />
  if (kind % 3 === 2) return <path d={`M${x} ${y - 5.5} L${x + 5.5} ${y + 4.5} L${x - 5.5} ${y + 4.5} Z`} fill="#111" {...common} />
  return <circle cx={x} cy={y} r={4.5} fill="#111" {...common} />
}

/** Writing Task 1 line and bar charts, drawn in the style of the printed test. */
export function TaskChart({ chart }: { chart: ChartVisual }) {
  const W = 640
  const H = 380
  const m = { top: 46, right: 20, bottom: 78, left: 58 }
  const plotW = W - m.left - m.right
  const plotH = H - m.top - m.bottom
  const n = chart.xLabels.length
  const y = (v: number) => m.top + plotH - (v / chart.yMax) * plotH
  const ticks: number[] = []
  for (let v = 0; v <= chart.yMax; v += chart.yStep) ticks.push(v)

  const xLine = (i: number) => m.left + (n === 1 ? plotW / 2 : (i / (n - 1)) * plotW)
  const band = plotW / n
  const barW = Math.min(26, (band * 0.75) / chart.series.length)

  return (
    <figure className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={chart.title} className="h-auto w-full" style={{ fontFamily: 'Arial, Helvetica, sans-serif', background: '#fff' }}>
        <defs>
          <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#111" strokeWidth="1.5" />
          </pattern>
        </defs>
        <text x={W / 2} y={24} textAnchor="middle" fontSize={15} fontWeight={700} fill="#111">
          {chart.title}
        </text>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={m.left} x2={W - m.right} y1={y(t)} y2={y(t)} stroke="#d9d9d9" />
            <text x={m.left - 8} y={y(t) + 4} textAnchor="end" fontSize={12} fill="#333">
              {t}
            </text>
          </g>
        ))}
        <line x1={m.left} x2={m.left} y1={m.top} y2={m.top + plotH} stroke="#111" />
        <line x1={m.left} x2={W - m.right} y1={m.top + plotH} y2={m.top + plotH} stroke="#111" />
        <text transform={`translate(16 ${m.top + plotH / 2}) rotate(-90)`} textAnchor="middle" fontSize={12} fill="#333">
          {chart.yLabel}
        </text>
        {chart.xLabels.map((label, i) => (
          <text key={label} x={chart.kind === 'bar' ? m.left + band * i + band / 2 : xLine(i)} y={m.top + plotH + 20} textAnchor="middle" fontSize={12} fill="#333">
            {label}
          </text>
        ))}

        {chart.kind === 'line'
          ? chart.series.map((s, si) => {
              const points = s.values.map((v, i) => (v === null ? null : ([xLine(i), y(v)] as const)))
              const path = points
                .map((p, i) => (p ? `${i === 0 || !points[i - 1] ? 'M' : 'L'}${p[0]} ${p[1]}` : ''))
                .join(' ')
              return (
                <g key={s.name}>
                  <path d={path} fill="none" stroke="#111" strokeWidth={2} strokeDasharray={DASHES[si % DASHES.length]} />
                  {points.map((p, i) => (p ? <Marker key={i} kind={si} x={p[0]} y={p[1]} /> : null))}
                </g>
              )
            })
          : chart.series.map((s, si) =>
              s.values.map((v, i) =>
                v === null ? null : (
                  <rect
                    key={`${s.name}-${i}`}
                    x={m.left + band * i + band / 2 - (barW * chart.series.length) / 2 + barW * si}
                    y={y(v)}
                    width={barW}
                    height={m.top + plotH - y(v)}
                    fill={FILLS[si % FILLS.length]}
                    stroke="#111"
                    strokeWidth={1.2}
                  />
                ),
              ),
            )}

        {/* Legend */}
        <g transform={`translate(${m.left} ${H - 26})`}>
          {chart.series.map((s, si) => {
            const x = si * (plotW / chart.series.length)
            return (
              <g key={s.name} transform={`translate(${x} 0)`}>
                {chart.kind === 'line' ? (
                  <>
                    <line x1={0} x2={34} y1={0} y2={0} stroke="#111" strokeWidth={2} strokeDasharray={DASHES[si % DASHES.length]} />
                    <Marker kind={si} x={17} y={0} />
                  </>
                ) : (
                  <rect x={10} y={-7} width={16} height={14} fill={FILLS[si % FILLS.length]} stroke="#111" />
                )}
                <text x={42} y={4} fontSize={12.5} fill="#111">
                  {s.name}
                </text>
              </g>
            )
          })}
        </g>
      </svg>
    </figure>
  )
}
