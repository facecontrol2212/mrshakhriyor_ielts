import { useState } from 'react'
import { SkillIcon } from '@/components/SkillIcon'
import { useI18n } from '@/i18n'
import { ACADEMIC_READING_TABLE, GENERAL_READING_TABLE, LISTENING_TABLE, bandLabel, formatBand, overallBand, rawToBand } from '@/lib/bands'
import type { Module } from '@/types/content'

const BANDS = [9, 8.5, 8, 7.5, 7, 6.5, 6, 5.5, 5, 4.5, 4, 3.5, 3, 2.5]
const HALF_BANDS = Array.from({ length: 19 }, (_, i) => i / 2).reverse()

function RawInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-ink-700">{label}</span>
      <span className="flex items-center gap-3">
        <input type="range" min={0} max={40} value={value} onChange={(e) => onChange(Number(e.target.value))} className="flex-1 accent-ink-950" aria-label={label} />
        <input
          type="number"
          min={0}
          max={40}
          value={value}
          onChange={(e) => onChange(Math.max(0, Math.min(40, Number(e.target.value) || 0)))}
          className="w-16 rounded-xl border border-ink-900/15 px-2 py-1.5 text-center font-semibold tabular-nums"
          aria-label={`${label} (number)`}
        />
      </span>
    </label>
  )
}

function rangeFor(table: readonly (readonly [number, number])[], band: number): string {
  const i = table.findIndex(([, b]) => b === band)
  if (i === -1) return '–'
  const min = table[i][0]
  const max = i === 0 ? 40 : table[i - 1][0] - 1
  return min === max ? String(min) : `${min}–${max}`
}

export function BandCalculatorPage() {
  const { t } = useI18n()
  const [listening, setListening] = useState(30)
  const [reading, setReading] = useState(30)
  const [module, setModule] = useState<Module>('academic')
  const [writing, setWriting] = useState(6.5)
  const [speaking, setSpeaking] = useState(6.5)
  const lBand = rawToBand('listening', listening)
  const rBand = rawToBand('reading', reading, 40, module)
  const overall = overallBand([lBand, rBand, writing, speaking])
  const mean = (lBand + rBand + writing + speaking) / 4

  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 sm:pt-16">
      <h1 className="font-display text-5xl font-semibold tracking-tight text-ink-950">{t.calculator.title}</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-600">{t.calculator.lead}</p>

      <div className="mt-10 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink-900/5 sm:p-8">
          <div>
            <p className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2 font-semibold">
                <SkillIcon skill="listening" /> {t.common.listening}
              </span>
              <span className="text-2xl font-semibold">{formatBand(lBand)}</span>
            </p>
            <RawInput label={t.calculator.rawLabel(t.common.listening)} value={listening} onChange={setListening} />
          </div>
          <div>
            <p className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2 font-semibold">
                <SkillIcon skill="reading" /> {t.common.reading}
              </span>
              <span className="text-2xl font-semibold">{formatBand(rBand)}</span>
            </p>
            <div role="radiogroup" aria-label={t.calculator.module} className="mb-3 inline-flex rounded-full bg-paper p-1 ring-1 ring-ink-900/10">
              {(['academic', 'general'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={module === m}
                  onClick={() => setModule(m)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${module === m ? 'bg-ink-950 text-paper' : 'text-ink-600'}`}
                >
                  {m === 'academic' ? t.common.academic : t.common.general}
                </button>
              ))}
            </div>
            <RawInput label={t.calculator.rawLabel(t.common.reading)} value={reading} onChange={setReading} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {(
              [
                ['writing', writing, setWriting],
                ['speaking', speaking, setSpeaking],
              ] as const
            ).map(([skill, value, set]) => (
              <label key={skill} className="block">
                <span className="mb-2 flex items-center gap-2 font-semibold">
                  <SkillIcon skill={skill} /> {t.calculator.bandLabel(t.common[skill])}
                </span>
                <select value={value} onChange={(e) => set(Number(e.target.value))} className="w-full rounded-xl border border-ink-900/15 bg-white px-3 py-2.5 text-lg font-semibold">
                  {HALF_BANDS.map((b) => (
                    <option key={b} value={b}>
                      {b.toFixed(1)}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="rounded-3xl bg-ink-950 p-8 text-paper">
            <p className="text-sm text-paper/60">{t.calculator.overall}</p>
            <p className="mt-1 text-8xl leading-none font-semibold tracking-tight text-mark">{formatBand(overall)}</p>
            <p className="mt-3 text-paper/80">{bandLabel(overall)}</p>
            <p className="mt-4 text-sm text-paper/55 tabular-nums">
              ({formatBand(lBand)} + {formatBand(rBand)} + {formatBand(writing)} + {formatBand(speaking)}) ÷ 4 = {mean.toFixed(3).replace(/0+$/, '').replace(/\.$/, '')} → {formatBand(overall)}
            </p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink-900/5">
            <h2 className="font-semibold">{t.calculator.roundingTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">{t.calculator.rounding}</p>
          </div>
        </div>
      </div>

      <section className="mt-14">
        <h2 className="mb-4 font-display text-3xl font-semibold">{t.calculator.tableTitle}</h2>
        <div className="overflow-x-auto rounded-3xl bg-white shadow-sm ring-1 ring-ink-900/5">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-paper-2 text-xs tracking-wide text-ink-500 uppercase">
              <tr>
                <th className="px-5 py-3 font-semibold">{t.common.band}</th>
                <th className="px-5 py-3 font-semibold">{t.common.listening}</th>
                <th className="px-5 py-3 font-semibold">
                  {t.common.reading} · {t.common.academic}
                </th>
                <th className="px-5 py-3 font-semibold">
                  {t.common.reading} · {t.common.general}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-900/8 tabular-nums">
              {BANDS.map((b) => (
                <tr key={b} className={b === lBand || b === rBand ? 'bg-mark/30' : undefined}>
                  <td className="px-5 py-2.5 font-semibold">{b.toFixed(1)}</td>
                  <td className="px-5 py-2.5">{rangeFor(LISTENING_TABLE, b)}</td>
                  <td className="px-5 py-2.5">{rangeFor(ACADEMIC_READING_TABLE, b)}</td>
                  <td className="px-5 py-2.5">{rangeFor(GENERAL_READING_TABLE, b)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-ink-500">{t.results.estimatedNote}</p>
      </section>
    </div>
  )
}
