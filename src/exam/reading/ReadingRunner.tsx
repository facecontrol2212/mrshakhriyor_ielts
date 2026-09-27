import { useMemo, useRef, useState } from 'react'
import { Markup } from '@/components/Markup'
import { buildQuestionIndex, isAnswered, partRange } from '@/lib/questions'
import type { QuestionResult } from '@/lib/scoring'
import type { Candidate, ExamMode, SectionState } from '@/types/attempt'
import type { HeadingsGroup, ReadingPart, ReadingSection } from '@/types/content'
import { ExamContext } from '../ExamContext'
import { HighlightMenu } from '../highlight/HighlightMenu'
import { Highlightable } from '../highlight/Highlightable'
import { HeadingSlot, QuestionGroupView } from '../questions/QuestionGroups'
import type { ExamSettings } from '../settings'
import { BottomNav } from '../shell/BottomNav'
import { ExamFrame, type TimerSpec } from '../shell/ExamFrame'
import { SplitPane } from '../shell/SplitPane'
import { useExamApi, type SectionUpdater } from '../useExamApi'

export function PartHeader({ label, intro }: { label: string; intro: string }) {
  return (
    <div className="shrink-0 border-b px-4 py-2.5 sm:px-6" style={{ borderColor: 'var(--ex-border)', background: 'var(--ex-panel)' }}>
      <p className="font-bold">{label}</p>
      <p className="text-[0.95em]">
        <Markup text={intro} />
      </p>
    </div>
  )
}

function PassageView({ part, results }: { part: ReadingPart; results?: Map<number, QuestionResult> }) {
  const headings = part.groups.find((g): g is HeadingsGroup => g.type === 'headings')
  const evidence = useMemo(() => {
    if (!results) return undefined
    const { from, to } = partRange(part)
    const out: { quote: string; n: number }[] = []
    for (let n = from; n <= to; n++) {
      const quote = results.get(n)?.spec.evidence
      if (quote && !out.some((e) => e.quote === quote)) out.push({ quote, n })
    }
    return out
  }, [part, results])

  return (
    <article className="mx-auto max-w-[46em] px-4 py-5 sm:px-6">
      <Highlightable as="h2" blockId={`${part.id}-title`} text={part.passage.title} className="mb-1 block text-[1.45em] font-bold leading-tight" />
      {part.passage.subtitle && <Highlightable as="p" blockId={`${part.id}-sub`} text={part.passage.subtitle} className="mb-5 italic" />}
      {part.passage.paragraphs.map((p, i) => (
        <div key={i} className="mb-4">
          {headings && p.label && <HeadingSlot group={headings} paragraph={p.label} />}
          <div className="flex gap-3">
            {p.label && <span className="w-4 shrink-0 font-bold">{p.label}</span>}
            <Highlightable as="p" blockId={`${part.id}-p${i}`} text={p.text} evidence={evidence} className="leading-[1.75]" />
          </div>
        </div>
      ))}
    </article>
  )
}

export interface RunnerProps {
  testId: string
  mode: ExamMode
  candidate: Candidate
  state: SectionState
  update: SectionUpdater
  timer: TimerSpec
  onTimeUp?: () => void
  onSubmit?: () => void
  settings: ExamSettings
  updateSettings: (patch: Partial<ExamSettings>) => void
  readOnly?: boolean
  results?: Map<number, QuestionResult>
}

export function ReadingRunner({ section, ...props }: RunnerProps & { section: ReadingSection }) {
  const [partIndex, setPartIndex] = useState(0)
  const refs = useMemo(() => buildQuestionIndex(section.parts), [section])
  const api = useExamApi({ mode: props.mode, state: props.state, update: props.update, refs, onPartChange: setPartIndex, readOnly: props.readOnly, results: props.results })
  const containerRef = useRef<HTMLDivElement>(null)
  const part = section.parts[partIndex]
  const parts = section.parts.map((p, i) => {
    const { from, to } = partRange(p)
    return { label: `Part ${i + 1}`, numbers: Array.from({ length: to - from + 1 }, (_, k) => from + k) }
  })
  const answeredInPart = refs.filter((r) => r.partIndex === partIndex && isAnswered(props.state.answers, r)).length

  return (
    <ExamContext.Provider value={api}>
      <ExamFrame
        skill="reading"
        candidate={props.candidate}
        mode={props.mode}
        timer={props.timer}
        onTimeUp={props.onTimeUp}
        settings={props.settings}
        updateSettings={props.updateSettings}
        readOnly={props.readOnly}
        nav={
          <BottomNav
            parts={parts}
            currentPart={partIndex}
            onPart={(i) => api.goToQuestion(parts[i].numbers[0])}
            refs={refs}
            onSubmit={props.onSubmit}
            submitLabel={props.readOnly ? 'Close' : 'Submit'}
          />
        }
      >
        <div ref={containerRef} className="flex h-full flex-col">
          <PartHeader label={`Part ${partIndex + 1}`} intro={part.intro} />
          <div className="min-h-0 flex-1">
            <SplitPane
              key={part.id}
              leftLabel="Passage"
              rightLabel={`Questions (${answeredInPart}/${parts[partIndex].numbers.length})`}
              left={<PassageView part={part} results={props.results} />}
              right={
                <div className="mx-auto max-w-[46em] px-4 py-5 sm:px-6">
                  {part.groups.map((g) => (
                    <QuestionGroupView key={g.id} group={g} />
                  ))}
                </div>
              }
            />
          </div>
        </div>
        <HighlightMenu containerRef={containerRef} />
      </ExamFrame>
    </ExamContext.Provider>
  )
}
