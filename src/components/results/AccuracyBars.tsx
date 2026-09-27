import { Target } from 'lucide-react'
import { useState } from 'react'
import { useI18n } from '@/i18n'
import type { TypeBreakdown } from '@/lib/scoring'

/**
 * Accuracy per question type as a ranked list of meters: one hue for the fill,
 * a lighter step of the same hue for the track, weakest type first.
 */
export function AccuracyBars({ rows, focusLabel }: { rows: TypeBreakdown[]; focusLabel?: string }) {
  const { t } = useI18n()
  const [hover, setHover] = useState<string | null>(null)
  if (!rows.length) return null
  return (
    <ul className="space-y-3">
      {rows.map((row) => {
        const pct = row.total ? Math.round((row.correct / row.total) * 100) : 0
        const weak = pct < 60
        return (
          <li
            key={row.label}
            tabIndex={0}
            aria-label={`${row.label}: ${row.correct} of ${row.total} correct, ${pct} percent`}
            onPointerEnter={() => setHover(row.label)}
            onPointerLeave={() => setHover(null)}
            onFocus={() => setHover(row.label)}
            onBlur={() => setHover(null)}
            className="relative rounded-lg px-2 py-1.5 outline-none transition-colors hover:bg-paper-2 focus-visible:bg-paper-2"
          >
            <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 font-medium text-ink-900">
                {row.label}
                {weak && focusLabel && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-ink-950 px-2 py-0.5 text-[11px] font-semibold text-paper">
                    <Target size={11} aria-hidden /> {focusLabel}
                  </span>
                )}
              </span>
              <span className="text-ink-600 tabular-nums">
                {row.correct}/{row.total} · {pct}%
              </span>
            </div>
            <div className="h-3.5 w-full rounded-[4px] bg-[#e3e7ff]" aria-hidden>
              <div className="h-full rounded-r-[4px] bg-signal" style={{ width: `${Math.max(pct, 1.5)}%`, borderRadius: pct >= 99 ? 4 : undefined }} />
            </div>
            {hover === row.label && (
              <div role="tooltip" className="pointer-events-none absolute -top-9 right-2 z-10 rounded-lg bg-ink-950 px-3 py-1.5 text-xs text-paper shadow-lg">
                <strong className="text-sm">{pct}%</strong> <span className="text-paper/70">· {t.results.raw(row.correct, row.total)}</span>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
