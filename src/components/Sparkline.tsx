/**
 * Band history as a sparkline: a recessive line for the past, the latest
 * value marked in the accent colour. Values are bands on the 0–9 scale.
 */
export function Sparkline({ values, color, label }: { values: number[]; color: string; label: string }) {
  const W = 132
  const H = 40
  const pad = 5
  if (values.length === 0) return null
  const min = Math.max(0, Math.min(...values) - 0.5)
  const max = Math.min(9, Math.max(...values) + 0.5)
  const span = Math.max(max - min, 1)
  const x = (i: number) => (values.length === 1 ? W - pad : pad + (i / (values.length - 1)) * (W - pad * 2))
  const y = (v: number) => pad + (1 - (v - min) / span) * (H - pad * 2)
  const d = values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')
  const last = values.length - 1
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label={`${label}: ${values.join(', ')}`} className="overflow-visible">
      {values.length > 1 && <path d={d} fill="none" stroke="#9aa1bb" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />}
      <circle cx={x(last)} cy={y(values[last])} r={6} fill="#ffffff" />
      <circle cx={x(last)} cy={y(values[last])} r={4} fill={color} />
    </svg>
  )
}
