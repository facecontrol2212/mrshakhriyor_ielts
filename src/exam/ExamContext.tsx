import { createContext, useContext } from 'react'
import type { QuestionResult } from '@/lib/scoring'
import type { AnswerValue, ExamMode, Highlight } from '@/types/attempt'

/** A drag-and-drop item picked up by click/tap (the keyboard and touch fallback for dragging). */
export interface PickedItem {
  groupId: string
  key: string
  /** Question the item was picked from, when moving an already placed answer. */
  from?: number
}

export interface ExamApi {
  mode: ExamMode
  /** True in the answer review screen: inputs are locked and marking is shown. */
  readOnly: boolean
  answers: Record<string, AnswerValue>
  setAnswer: (key: string, value: AnswerValue) => void
  flagged: number[]
  toggleFlag: (n: number) => void
  active: number
  /** Make a question current without moving the page (e.g. when its input gets focus). */
  setActive: (n: number) => void
  /** Make a question current, show its part and scroll it into view. */
  goToQuestion: (n: number) => void
  highlights: Record<string, Highlight[]>
  setHighlights: (blockId: string, list: Highlight[]) => void
  picked: PickedItem | null
  setPicked: (item: PickedItem | null) => void
  /** Marking, keyed by question number — review screen only. */
  results?: Map<number, QuestionResult>
}

export const ExamContext = createContext<ExamApi | null>(null)

export function useExam(): ExamApi {
  const ctx = useContext(ExamContext)
  if (!ctx) throw new Error('useExam must be used inside an exam section')
  return ctx
}

/** Scroll a question into view and focus its first control. */
export function focusQuestionElement(n: number) {
  requestAnimationFrame(() => {
    const target = document.querySelector<HTMLElement>(`[data-q="${n}"]`)
    if (!target) return
    target.scrollIntoView({ block: 'center', behavior: 'smooth' })
    const control = target.matches('input, textarea, select, button') ? target : target.querySelector<HTMLElement>('input, textarea, select, button')
    control?.focus({ preventScroll: true })
  })
}
