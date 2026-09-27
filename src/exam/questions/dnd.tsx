import type { DragEvent, ReactNode } from 'react'
import { useExam, type PickedItem } from '../ExamContext'
import { Verdict } from './common'

const MIME = 'application/x-ielts-option'

function readPayload(event: DragEvent): PickedItem | null {
  try {
    return JSON.parse(event.dataTransfer.getData(MIME)) as PickedItem
  } catch {
    return null
  }
}

/**
 * A draggable option (heading, ending, word). Mouse users drag it; touch and
 * keyboard users tap it and then tap a gap.
 */
export function DragChip({ groupId, optionKey, children, used }: { groupId: string; optionKey: string; children: ReactNode; used?: boolean }) {
  const { picked, setPicked, readOnly } = useExam()
  const isPicked = picked?.groupId === groupId && picked.key === optionKey && picked.from === undefined
  return (
    <button
      type="button"
      draggable={!readOnly && !used}
      disabled={readOnly}
      aria-pressed={isPicked}
      onDragStart={(e) => {
        e.dataTransfer.setData(MIME, JSON.stringify({ groupId, key: optionKey }))
        e.dataTransfer.effectAllowed = 'move'
      }}
      onClick={() => !used && setPicked(isPicked ? null : { groupId, key: optionKey })}
      className="flex w-full items-start gap-2 rounded-[3px] border px-2.5 py-1.5 text-left transition-opacity"
      style={{
        borderColor: isPicked ? 'var(--ex-accent)' : 'var(--ex-strong-border)',
        background: isPicked ? 'var(--ex-panel-2)' : 'var(--ex-bg)',
        opacity: used ? 0.4 : 1,
        cursor: readOnly || used ? 'default' : 'grab',
        outline: isPicked ? '2px solid var(--ex-accent)' : undefined,
      }}
    >
      {children}
    </button>
  )
}

/** Drop target for one question. Filled slots can be dragged elsewhere or tapped to clear. */
export function DropSlot({
  groupId,
  n,
  label,
  className = '',
}: {
  groupId: string
  n: number
  /** Text of the option currently placed, if any. */
  label: (key: string) => ReactNode
  className?: string
}) {
  const { answers, setAnswer, setActive, picked, setPicked, readOnly, results, active } = useExam()
  const value = typeof answers[String(n)] === 'string' ? (answers[String(n)] as string) : ''
  const r = results?.get(n)

  const place = (item: PickedItem) => {
    if (item.groupId !== groupId) return
    if (item.from !== undefined && item.from !== n) {
      // Moving a placed answer: swap with whatever is here.
      setAnswer(String(item.from), value)
    }
    setAnswer(String(n), item.key)
    setActive(n)
    setPicked(null)
  }

  return (
    <span className={`inline-flex max-w-full items-center gap-1 align-middle ${className}`}>
      <span
        role="button"
        tabIndex={readOnly ? -1 : 0}
        data-q={n}
        aria-label={`Question ${n}${value ? `: ${value}` : ': empty'}`}
        draggable={!readOnly && Boolean(value)}
        onDragStart={(e) => {
          e.dataTransfer.setData(MIME, JSON.stringify({ groupId, key: value, from: n }))
        }}
        onDragOver={(e) => {
          if (!readOnly && e.dataTransfer.types.includes(MIME)) e.preventDefault()
        }}
        onDrop={(e) => {
          e.preventDefault()
          const item = readPayload(e)
          if (item) place(item)
        }}
        onFocus={() => setActive(n)}
        onClick={() => {
          if (readOnly) return
          if (picked?.groupId === groupId) place(picked)
          else if (value) setPicked({ groupId, key: value, from: n })
          else setActive(n)
        }}
        onKeyDown={(e) => {
          if (readOnly) return
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            if (picked?.groupId === groupId) place(picked)
          }
          if ((e.key === 'Backspace' || e.key === 'Delete') && value) setAnswer(String(n), '')
        }}
        className={`inline-flex min-h-[2em] max-w-full items-center gap-2 rounded-[3px] border-2 border-dashed px-2 py-0.5 ${className.includes('w-full') ? 'flex-1' : 'min-w-[9em]'}`}
        style={{
          borderColor: r ? (r.correct ? 'var(--ex-correct)' : 'var(--ex-wrong)') : active === n ? 'var(--ex-accent)' : 'var(--ex-strong-border)',
          borderStyle: value ? 'solid' : 'dashed',
          background: picked?.groupId === groupId ? 'var(--ex-panel)' : 'var(--ex-bg)',
          cursor: readOnly ? 'default' : 'pointer',
        }}
      >
        {value ? (
          <span className="font-semibold">{label(value)}</span>
        ) : (
          <span className="font-bold" style={{ color: 'var(--ex-muted)' }}>
            {n}
          </span>
        )}
      </span>
      <Verdict n={n} compact />
    </span>
  )
}

/** Dropping a placed answer back on the options list removes it. */
export function OptionsDropZone({ groupId, children }: { groupId: string; children: ReactNode }) {
  const { setAnswer, readOnly, picked, setPicked } = useExam()
  return (
    <div
      onDragOver={(e) => {
        if (!readOnly && e.dataTransfer.types.includes(MIME)) e.preventDefault()
      }}
      onDrop={(e) => {
        e.preventDefault()
        const item = readPayload(e)
        if (item?.groupId === groupId && item.from !== undefined) setAnswer(String(item.from), '')
      }}
      onClick={(e) => {
        // Tapping the list while holding a placed answer returns it.
        if (picked?.groupId === groupId && picked.from !== undefined && e.target === e.currentTarget) {
          setAnswer(String(picked.from), '')
          setPicked(null)
        }
      }}
    >
      {children}
    </div>
  )
}
