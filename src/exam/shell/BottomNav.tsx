import { Check, ChevronLeft, ChevronRight, Flag } from 'lucide-react'
import type { ReactNode } from 'react'
import { isAnswered, type QuestionRef } from '@/lib/questions'
import { useExam } from '../ExamContext'

export interface PartNav {
  label: string
  numbers: number[]
}

/** The question navigator along the bottom of the CD test screen. */
export function BottomNav({
  parts,
  currentPart,
  onPart,
  refs,
  onSubmit,
  submitLabel = 'Submit',
  extra,
}: {
  parts: PartNav[]
  currentPart: number
  onPart: (index: number) => void
  refs: QuestionRef[]
  onSubmit?: () => void
  submitLabel?: string
  extra?: ReactNode
}) {
  const { answers, active, flagged, toggleFlag, goToQuestion, readOnly, results } = useExam()
  const refByN = new Map(refs.map((r) => [r.n, r]))
  const answered = (n: number) => {
    const ref = refByN.get(n)
    return ref ? isAnswered(answers, ref) : false
  }
  const all = refs.map((r) => r.n)
  const index = all.indexOf(active)

  return (
    <nav aria-label="Questions" className="flex h-[60px] shrink-0 items-stretch border-t" style={{ borderColor: 'var(--ex-strong-border)', background: 'var(--ex-panel)' }}>
      <div className="exam-scroll flex min-w-0 flex-1 items-center gap-1 overflow-x-auto overflow-y-hidden px-2">
        {parts.map((part, pi) => {
          const done = part.numbers.filter(answered).length
          if (pi !== currentPart)
            return (
              <button
                key={part.label}
                type="button"
                onClick={() => onPart(pi)}
                className="flex shrink-0 items-center gap-2 rounded-[3px] px-3 py-2 text-[13px] hover:bg-[var(--ex-panel-2)]"
              >
                <span className="font-bold">{part.label}</span>
                {part.numbers.length > 0 && (
                  <span style={{ color: 'var(--ex-muted)' }}>
                    {done} of {part.numbers.length}
                  </span>
                )}
              </button>
            )
          return (
            <div key={part.label} className="flex shrink-0 items-center gap-1 rounded-[3px] px-2 py-1" style={{ background: 'var(--ex-bg)', boxShadow: 'inset 0 0 0 1px var(--ex-border)' }}>
              <span className="mr-1 text-[13px] font-bold">{part.label}</span>
              {part.numbers.map((n) => {
                const isAns = answered(n)
                const isActive = n === active
                const r = results?.get(n)
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => goToQuestion(n)}
                    aria-label={`Question ${n}${isAns ? ', answered' : ''}${flagged.includes(n) ? ', flagged for review' : ''}`}
                    aria-current={isActive ? 'true' : undefined}
                    className="relative flex h-8 min-w-8 items-center justify-center rounded-[3px] border px-1 text-[13px] font-bold"
                    style={{
                      borderColor: isActive ? 'var(--ex-accent)' : 'var(--ex-strong-border)',
                      borderWidth: isActive ? 2 : 1,
                      background: r ? (r.correct ? 'var(--ex-correct)' : 'var(--ex-wrong)') : isAns ? 'var(--ex-answered)' : 'var(--ex-bg)',
                      color: r || isAns ? 'var(--ex-bg)' : 'var(--ex-fg)',
                      borderRadius: flagged.includes(n) ? '999px' : undefined,
                    }}
                  >
                    {n}
                  </button>
                )
              })}
            </div>
          )
        })}
        {extra}
      </div>
      <div className="flex shrink-0 items-center gap-1 border-l px-2" style={{ borderColor: 'var(--ex-border)' }}>
        {!readOnly && active > 0 && (
          <button
            type="button"
            onClick={() => toggleFlag(active)}
            aria-pressed={flagged.includes(active)}
            className="flex items-center gap-1.5 rounded-[3px] border px-2 py-1.5 text-[13px] font-semibold"
            style={{
              borderColor: flagged.includes(active) ? '#d97706' : 'var(--ex-strong-border)',
              background: flagged.includes(active) ? '#fef3c7' : 'var(--ex-bg)',
              color: flagged.includes(active) ? '#92400e' : 'var(--ex-fg)',
            }}
          >
            <Flag size={15} aria-hidden />
            <span className="hidden sm:inline">Review</span>
          </button>
        )}
        <button type="button" aria-label="Previous question" disabled={index <= 0} onClick={() => goToQuestion(all[index - 1])} className="rounded-[3px] border p-1.5 disabled:opacity-40" style={{ borderColor: 'var(--ex-strong-border)', background: 'var(--ex-bg)' }}>
          <ChevronLeft size={18} />
        </button>
        <button type="button" aria-label="Next question" disabled={index === -1 || index >= all.length - 1} onClick={() => goToQuestion(all[index + 1])} className="rounded-[3px] border p-1.5 disabled:opacity-40" style={{ borderColor: 'var(--ex-strong-border)', background: 'var(--ex-bg)' }}>
          <ChevronRight size={18} />
        </button>
        {onSubmit && (
          <button
            type="button"
            onClick={onSubmit}
            className="ml-1 flex items-center gap-1.5 rounded-[3px] px-3 py-1.5 text-[13px] font-bold"
            style={{ background: 'var(--ex-accent)', color: 'var(--ex-accent-fg)' }}
          >
            <Check size={16} aria-hidden />
            <span className="hidden sm:inline">{submitLabel}</span>
          </button>
        )}
      </div>
    </nav>
  )
}
