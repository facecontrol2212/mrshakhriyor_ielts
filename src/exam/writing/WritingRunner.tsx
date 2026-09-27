import { Check } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Markup } from '@/components/Markup'
import { TaskChart } from '@/components/TaskChart'
import { Visual } from '@/content/visuals/Visual'
import { countWords } from '@/lib/text'
import type { WritingSection, WritingTask } from '@/types/content'
import { ExamContext } from '../ExamContext'
import { PartHeader, type RunnerProps } from '../reading/ReadingRunner'
import { ExamFrame } from '../shell/ExamFrame'
import { SplitPane } from '../shell/SplitPane'
import { useExamApi } from '../useExamApi'

function TaskPrompt({ task }: { task: WritingTask }) {
  return (
    <div className="mx-auto max-w-[46em] px-4 py-5 sm:px-6">
      {task.prompt.map((line, i) => (
        <p key={i} className="mb-3 leading-relaxed">
          <Markup text={line} />
        </p>
      ))}
      {task.visual && task.visual.kind !== 'custom' && (
        <div className="mt-4 rounded-[3px] border p-2" style={{ borderColor: 'var(--ex-strong-border)', background: '#fff' }}>
          <TaskChart chart={task.visual} />
        </div>
      )}
      {task.visual?.kind === 'custom' && (
        <div className="mt-4 rounded-[3px] border p-2" style={{ borderColor: 'var(--ex-strong-border)', background: '#fff' }}>
          <Visual name={task.visual.key} />
        </div>
      )}
    </div>
  )
}

function Editor({ task, value, onChange, readOnly }: { task: WritingTask; value: string; onChange: (v: string) => void; readOnly?: boolean }) {
  const words = countWords(value)
  return (
    <div className="flex h-full min-h-[60vh] flex-col px-4 py-4 sm:px-6 lg:min-h-0">
      <textarea
        data-q={task.number}
        aria-label={`Answer for Part ${task.number}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        autoComplete="off"
        data-gramm="false"
        data-enable-grammarly="false"
        className="exam-input min-h-0 w-full flex-1 resize-none p-3 leading-[1.7]"
        placeholder={readOnly ? '' : 'Type your answer here'}
      />
      <div className="mt-2 flex items-center justify-between text-[0.9em]">
        <span>
          Word count: <strong className="tabular-nums">{words}</strong>
        </span>
        {words > 0 && words < task.minWords && (
          <span style={{ color: 'var(--ex-muted)' }}>
            {task.minWords - words} more to reach {task.minWords}
          </span>
        )}
      </div>
    </div>
  )
}

export function WritingRunner({ section, ...props }: RunnerProps & { section: WritingSection }) {
  const [taskIndex, setTaskIndex] = useState(0)
  const refs = useMemo(() => [], [])
  const api = useExamApi({ mode: props.mode, state: props.state, update: props.update, refs, readOnly: props.readOnly })
  const task = section.tasks[taskIndex]
  const essays = props.state.essays ?? {}
  const setEssay = (id: string, text: string) => props.update((s) => ({ ...s, essays: { ...s.essays, [id]: text } }))

  const nav = (
    <nav aria-label="Tasks" className="flex h-[60px] shrink-0 items-center justify-between border-t px-2" style={{ borderColor: 'var(--ex-strong-border)', background: 'var(--ex-panel)' }}>
      <div className="flex gap-1">
        {section.tasks.map((t, i) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTaskIndex(i)}
            aria-current={i === taskIndex ? 'true' : undefined}
            className="flex items-center gap-2 rounded-[3px] border px-3 py-2 text-[13px]"
            style={{
              borderColor: i === taskIndex ? 'var(--ex-accent)' : 'var(--ex-border)',
              borderWidth: i === taskIndex ? 2 : 1,
              background: 'var(--ex-bg)',
            }}
          >
            <strong>Part {t.number}</strong>
            <span style={{ color: 'var(--ex-muted)' }}>{countWords(essays[t.id] ?? '')} words</span>
          </button>
        ))}
      </div>
      {props.onSubmit && (
        <button type="button" onClick={props.onSubmit} className="flex items-center gap-1.5 rounded-[3px] px-3 py-2 text-[13px] font-bold" style={{ background: 'var(--ex-accent)', color: 'var(--ex-accent-fg)' }}>
          <Check size={16} aria-hidden />
          {props.readOnly ? 'Close' : 'Submit'}
        </button>
      )}
    </nav>
  )

  return (
    <ExamContext.Provider value={api}>
      <ExamFrame
        skill="writing"
        candidate={props.candidate}
        mode={props.mode}
        timer={props.timer}
        onTimeUp={props.onTimeUp}
        settings={props.settings}
        updateSettings={props.updateSettings}
        nav={nav}
      >
        <div className="flex h-full flex-col">
          <PartHeader label={`Part ${task.number}`} intro={`You should spend about ${task.suggestedMinutes} minutes on this task. Write at least ${task.minWords} words.`} />
          <div className="min-h-0 flex-1">
            <SplitPane
              key={task.id}
              leftLabel="Task"
              rightLabel={`Your answer (${countWords(essays[task.id] ?? '')})`}
              left={<TaskPrompt task={task} />}
              right={<Editor task={task} value={essays[task.id] ?? ''} onChange={(v) => setEssay(task.id, v)} readOnly={props.readOnly} />}
            />
          </div>
        </div>
      </ExamFrame>
    </ExamContext.Provider>
  )
}
