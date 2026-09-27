import { Check, X } from 'lucide-react'
import { useI18n } from '@/i18n'
import type { QuestionResult } from '@/lib/scoring'

/** Every question with the candidate's answer, the key and a short explanation. */
export function QuestionTable({ results }: { results: QuestionResult[] }) {
  const { t } = useI18n()
  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-ink-900/10">
      <div className="hidden grid-cols-[3rem_1fr_1fr_12rem] gap-3 bg-paper-2 px-4 py-2.5 text-xs font-semibold tracking-wide text-ink-500 uppercase md:grid">
        <span>#</span>
        <span>{t.results.yourAnswer}</span>
        <span>{t.results.correctAnswer}</span>
        <span>{t.results.type}</span>
      </div>
      <ol className="divide-y divide-ink-900/8 bg-white">
        {results.map((r) => (
          <li key={r.n} className="grid grid-cols-[3rem_1fr] gap-x-3 gap-y-1 px-4 py-3 text-sm md:grid-cols-[3rem_1fr_1fr_12rem]">
            <span className="row-span-3 flex items-start gap-1.5 font-semibold tabular-nums md:row-span-1">
              {r.correct ? (
                <Check size={16} className="mt-0.5 text-[#0f7b3f]" aria-label="Correct" />
              ) : (
                <X size={16} className="mt-0.5 text-[#c62828]" aria-label="Incorrect" />
              )}
              {r.n}
            </span>
            <span className={r.correct ? 'text-ink-900' : 'text-ink-600'}>
              <span className="text-ink-400 md:hidden">{t.results.yourAnswer}: </span>
              {r.given ? <span className={r.correct ? 'font-medium' : 'line-through decoration-[#c62828]/60'}>{r.given}</span> : <em className="text-ink-400">{t.results.blank}</em>}
              {r.overLimit && <span className="ml-2 rounded bg-[#fdecea] px-1.5 py-0.5 text-[11px] font-semibold text-[#9f1d1d]">{t.results.overLimit}</span>}
            </span>
            <span className="font-medium text-ink-900">
              <span className="font-normal text-ink-400 md:hidden">{t.results.correctAnswer}: </span>
              {r.expected}
              {r.spec.explanation && <span className="mt-0.5 block text-xs font-normal leading-relaxed text-ink-500">{r.spec.explanation}</span>}
            </span>
            <span className="text-xs text-ink-500 md:text-sm">{r.typeLabel}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
