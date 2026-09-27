import { useCallback, useMemo, useState } from 'react'
import type { QuestionRef } from '@/lib/questions'
import type { QuestionResult } from '@/lib/scoring'
import type { AnswerValue, ExamMode, Highlight, SectionState } from '@/types/attempt'
import { focusQuestionElement, type ExamApi, type PickedItem } from './ExamContext'

export type SectionUpdater = (fn: (state: SectionState) => SectionState) => void

/** Builds the ExamContext value for a section from its persisted state. */
export function useExamApi({
  mode,
  state,
  update,
  refs,
  onPartChange,
  readOnly = false,
  results,
}: {
  mode: ExamMode
  state: SectionState
  update: SectionUpdater
  refs: QuestionRef[]
  onPartChange?: (partIndex: number) => void
  readOnly?: boolean
  results?: Map<number, QuestionResult>
}): ExamApi {
  const [active, setActive] = useState(() => refs[0]?.n ?? 0)
  const [picked, setPicked] = useState<PickedItem | null>(null)

  const setAnswer = useCallback(
    (key: string, value: AnswerValue) => {
      if (readOnly) return
      update((s) => ({ ...s, answers: { ...s.answers, [key]: value } }))
    },
    [update, readOnly],
  )

  const toggleFlag = useCallback(
    (n: number) =>
      update((s) => ({ ...s, flagged: s.flagged.includes(n) ? s.flagged.filter((x) => x !== n) : [...s.flagged, n] })),
    [update],
  )

  const setHighlights = useCallback(
    (blockId: string, list: Highlight[]) => update((s) => ({ ...s, highlights: { ...s.highlights, [blockId]: list } })),
    [update],
  )

  const goToQuestion = useCallback(
    (n: number) => {
      const ref = refs.find((r) => r.n === n)
      if (!ref) return
      onPartChange?.(ref.partIndex)
      setActive(n)
      focusQuestionElement(n)
    },
    [refs, onPartChange],
  )

  return useMemo(
    () => ({
      mode,
      readOnly,
      answers: state.answers,
      setAnswer,
      flagged: state.flagged,
      toggleFlag,
      active,
      setActive,
      goToQuestion,
      highlights: state.highlights,
      setHighlights,
      picked,
      setPicked,
      results,
    }),
    [mode, readOnly, state.answers, setAnswer, state.flagged, toggleFlag, active, goToQuestion, state.highlights, setHighlights, picked, results],
  )
}
