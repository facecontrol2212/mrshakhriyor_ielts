import { Check, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { Markup } from '@/components/Markup'
import { useExam } from '../ExamContext'

/** The boxed question number used throughout the CD test. */
export function QNum({ n }: { n: number }) {
  const { active, setActive, flagged } = useExam()
  const isActive = active === n
  return (
    <button
      type="button"
      tabIndex={-1}
      onClick={() => setActive(n)}
      className="relative inline-flex h-[1.9em] min-w-[1.9em] shrink-0 items-center justify-center rounded-[3px] border px-1 text-[0.95em] font-bold"
      style={{
        borderColor: isActive ? 'var(--ex-accent)' : 'var(--ex-strong-border)',
        background: isActive ? 'var(--ex-accent)' : 'transparent',
        color: isActive ? 'var(--ex-accent-fg)' : 'var(--ex-fg)',
      }}
      aria-label={`Question ${n}`}
    >
      {n}
      {flagged.includes(n) && (
        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border-2" style={{ borderColor: 'var(--ex-bg)', background: '#f59e0b' }} />
      )}
    </button>
  )
}

/** Review screen: tick or cross plus the correct answer. Renders nothing during the test. */
export function Verdict({ n, compact }: { n: number; compact?: boolean }) {
  const { results } = useExam()
  const r = results?.get(n)
  if (!r) return null
  return (
    <span className={`inline-flex items-center gap-1 ${compact ? '' : 'ml-2'} text-[0.85em] font-bold`} style={{ color: r.correct ? 'var(--ex-correct)' : 'var(--ex-wrong)' }}>
      {r.correct ? <Check size={16} strokeWidth={3} aria-label="Correct" /> : <X size={16} strokeWidth={3} aria-label="Incorrect" />}
      {!r.correct && <span>Answer: {r.expected}</span>}
    </span>
  )
}

export function Explanation({ n }: { n: number }) {
  const { results } = useExam()
  const r = results?.get(n)
  if (!r?.spec.explanation) return null
  return (
    <p className="mt-1 text-[0.85em]" style={{ color: 'var(--ex-muted)' }}>
      {r.spec.explanation}
    </p>
  )
}

/** A typed answer gap inside notes, tables, sentences … */
export function GapInput({ n, wide }: { n: number; wide?: boolean }) {
  const { answers, setAnswer, setActive, readOnly, results } = useExam()
  const value = typeof answers[String(n)] === 'string' ? (answers[String(n)] as string) : ''
  const r = results?.get(n)
  return (
    <span className="inline-flex flex-wrap items-center gap-1 align-baseline">
      <input
        data-q={n}
        type="text"
        value={value}
        placeholder={String(n)}
        aria-label={`Question ${n}`}
        onFocus={() => setActive(n)}
        onChange={(e) => setAnswer(String(n), e.target.value)}
        readOnly={readOnly}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        className={`exam-input mx-0.5 ${wide ? 'w-[13em]' : 'w-[9.5em]'}`}
        style={r ? { borderColor: r.correct ? 'var(--ex-correct)' : 'var(--ex-wrong)', borderWidth: 2 } : undefined}
      />
      <Verdict n={n} compact />
    </span>
  )
}

export function GroupHeader({ from, to, instructions }: { from: number; to: number; instructions: string[] }) {
  return (
    <header className="mb-4">
      <h3 className="mb-1.5 text-[1.05em] font-bold">
        Questions {from}
        {to !== from ? `–${to}` : ''}
      </h3>
      {instructions.map((line, i) => (
        <p key={i} className="mb-1 leading-relaxed">
          <Markup text={line} />
        </p>
      ))}
    </header>
  )
}

export function OptionsBox({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="mb-4 rounded-[3px] border p-3" style={{ borderColor: 'var(--ex-strong-border)' }}>
      {title && (
        <p className="mb-2 font-bold">
          <Markup text={title} />
        </p>
      )}
      {children}
    </div>
  )
}
