import { useState } from 'react'
import type { Descriptor } from '@/content/descriptors'
import { useI18n } from '@/i18n'

/**
 * One criterion of a writing/speaking self-assessment: pick the band whose
 * description fits best. The description of the hovered or chosen band is shown.
 */
export function BandPicker({
  label,
  descriptors,
  value,
  onChange,
}: {
  label: string
  descriptors: Descriptor[]
  value?: number
  onChange: (band: number) => void
}) {
  const { t } = useI18n()
  const [preview, setPreview] = useState<number | null>(null)
  const shown = preview ?? value
  const text = descriptors.find(([b]) => b === shown)?.[1]
  const bands = [...descriptors].reverse().map(([b]) => b)
  return (
    <fieldset className="rounded-2xl border border-ink-900/10 bg-paper/60 p-4">
      <legend className="sr-only">{label}</legend>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <span className="font-semibold text-ink-950">{label}</span>
        <div className="flex gap-1" role="radiogroup" aria-label={label} onPointerLeave={() => setPreview(null)}>
          {bands.map((b) => (
            <button
              key={b}
              type="button"
              role="radio"
              aria-checked={value === b}
              onPointerEnter={() => setPreview(b)}
              onFocus={() => setPreview(b)}
              onBlur={() => setPreview(null)}
              onClick={() => onChange(b)}
              className={`h-9 w-9 rounded-lg text-sm font-semibold transition-colors ${
                value === b ? 'bg-ink-950 text-paper' : 'bg-white text-ink-700 ring-1 ring-ink-900/10 hover:ring-ink-900/40'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>
      <p className="min-h-[2.75rem] text-sm leading-relaxed text-ink-600">
        {text ? (
          <>
            <strong className="text-ink-900">
              {t.common.band} {shown}:
            </strong>{' '}
            {text}
          </>
        ) : (
          t.results.pickHint
        )}
      </p>
    </fieldset>
  )
}
