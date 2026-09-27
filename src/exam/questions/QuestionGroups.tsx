import { ArrowDown } from 'lucide-react'
import type { ReactNode } from 'react'
import { Markup } from '@/components/Markup'
import { Visual } from '@/content/visuals/Visual'
import { multiKey } from '@/lib/questions'
import { parseLine } from '@/lib/text'
import type {
  GapBankGroup,
  GapGroup,
  HeadingsGroup,
  JudgementGroup,
  MapGroup,
  MatchingGroup,
  McqGroup,
  McqMultiGroup,
  QuestionGroup,
  ShortAnswerGroup,
} from '@/types/content'
import { useExam } from '../ExamContext'
import { Highlightable } from '../highlight/Highlightable'
import { Explanation, GapInput, GroupHeader, OptionsBox, QNum, Verdict } from './common'
import { DragChip, DropSlot, OptionsDropZone } from './dnd'

export function QuestionGroupView({ group }: { group: QuestionGroup }) {
  return (
    <section id={`group-${group.id}`} className="mb-10">
      <GroupHeader from={group.from} to={group.to} instructions={group.instructions} />
      <GroupBody group={group} />
    </section>
  )
}

function GroupBody({ group }: { group: QuestionGroup }) {
  switch (group.type) {
    case 'tfng':
    case 'ynng':
      return <Judgement group={group} />
    case 'mcq':
      return <Mcq group={group} />
    case 'mcq-multi':
      return <McqMulti group={group} />
    case 'gap':
      return <Gaps group={group} />
    case 'gap-bank':
      return <GapBank group={group} />
    case 'headings':
      return <Headings group={group} />
    case 'matching':
      return <Matching group={group} />
    case 'map':
      return <MapLabelling group={group} />
    case 'short':
      return <ShortAnswers group={group} />
  }
}

// ─── Choice rows ────────────────────────────────────────────────────────────

function ChoiceRow({
  type,
  name,
  checked,
  disabled,
  onChange,
  children,
}: {
  type: 'radio' | 'checkbox'
  name: string
  checked: boolean
  disabled?: boolean
  onChange: () => void
  children: ReactNode
}) {
  const { readOnly } = useExam()
  return (
    <label
      className="flex cursor-pointer items-start gap-2.5 rounded-[3px] px-2 py-1.5"
      style={{ background: checked ? 'var(--ex-panel-2)' : 'transparent', cursor: readOnly ? 'default' : 'pointer' }}
    >
      <input
        type={type}
        name={name}
        checked={checked}
        disabled={readOnly || disabled}
        onChange={onChange}
        className="mt-[0.2em] h-[1.05em] w-[1.05em] shrink-0"
        style={{ accentColor: 'var(--ex-accent)' }}
      />
      <span className="leading-snug">{children}</span>
    </label>
  )
}

function Judgement({ group }: { group: JudgementGroup }) {
  const { answers, setAnswer, setActive } = useExam()
  const options = group.type === 'tfng' ? ['TRUE', 'FALSE', 'NOT GIVEN'] : ['YES', 'NO', 'NOT GIVEN']
  return (
    <div className="space-y-5">
      {group.questions.map((q) => (
        <div key={q.n} data-q={q.n} onFocus={() => setActive(q.n)}>
          <div className="flex items-start gap-2.5">
            <QNum n={q.n} />
            <p className="pt-[0.15em] leading-relaxed">
              <Highlightable blockId={`q${q.n}`} text={q.text} />
              <Verdict n={q.n} />
            </p>
          </div>
          <div role="radiogroup" aria-label={`Question ${q.n}`} className="mt-1.5 ml-9 flex flex-col">
            {options.map((option) => (
              <ChoiceRow key={option} type="radio" name={`q${q.n}`} checked={answers[String(q.n)] === option} onChange={() => setAnswer(String(q.n), option)}>
                {option}
              </ChoiceRow>
            ))}
          </div>
          <div className="ml-9">
            <Explanation n={q.n} />
          </div>
        </div>
      ))}
    </div>
  )
}

function Mcq({ group }: { group: McqGroup }) {
  const { answers, setAnswer, setActive } = useExam()
  return (
    <div className="space-y-6">
      {group.questions.map((q) => (
        <div key={q.n} data-q={q.n} onFocus={() => setActive(q.n)}>
          <div className="flex items-start gap-2.5">
            <QNum n={q.n} />
            <p className="pt-[0.15em] leading-relaxed">
              <Highlightable blockId={`q${q.n}`} text={q.text} />
              <Verdict n={q.n} />
            </p>
          </div>
          <div role="radiogroup" aria-label={`Question ${q.n}`} className="mt-1.5 ml-9 flex flex-col">
            {q.options.map((o) => (
              <ChoiceRow key={o.key} type="radio" name={`q${q.n}`} checked={answers[String(q.n)] === o.key} onChange={() => setAnswer(String(q.n), o.key)}>
                <strong className="mr-2">{o.key}</strong>
                <Markup text={o.text} />
              </ChoiceRow>
            ))}
          </div>
          <div className="ml-9">
            <Explanation n={q.n} />
          </div>
        </div>
      ))}
    </div>
  )
}

function McqMulti({ group }: { group: McqMultiGroup }) {
  const { answers, setAnswer, setActive } = useExam()
  const key = multiKey(group)
  const chosen = Array.isArray(answers[key]) ? (answers[key] as string[]) : []
  const max = group.to - group.from + 1
  const toggle = (k: string) => {
    const next = chosen.includes(k) ? chosen.filter((x) => x !== k) : chosen.length < max ? [...chosen, k].sort() : chosen
    setAnswer(key, next)
  }
  const numbers = Array.from({ length: max }, (_, i) => group.from + i)
  return (
    <div data-q={group.from} onFocus={() => setActive(group.from)}>
      <div className="flex items-start gap-2.5">
        <span className="flex gap-1">
          {numbers.map((n) => (
            <QNum key={n} n={n} />
          ))}
        </span>
        <p className="pt-[0.15em] leading-relaxed">
          <Markup text={group.stem} />
        </p>
      </div>
      {numbers.map((n) => (
        <span key={n} data-q={n} />
      ))}
      <div className="mt-2 ml-2 flex flex-col">
        {group.options.map((o) => (
          <ChoiceRow
            key={o.key}
            type="checkbox"
            name={key}
            checked={chosen.includes(o.key)}
            disabled={!chosen.includes(o.key) && chosen.length >= max}
            onChange={() => toggle(o.key)}
          >
            <strong className="mr-2">{o.key}</strong>
            <Markup text={o.text} />
          </ChoiceRow>
        ))}
      </div>
      <p className="mt-2 ml-2 text-[0.85em]" style={{ color: 'var(--ex-muted)' }}>
        {chosen.length} of {max} selected
      </p>
      <div className="ml-2">
        {numbers.map((n) => (
          <Verdict key={n} n={n} compact />
        ))}
        <Explanation n={group.from} />
      </div>
    </div>
  )
}

// ─── Gap fills ──────────────────────────────────────────────────────────────

function NoteLines({ lines, gap }: { lines: string[]; gap: (n: number) => ReactNode }) {
  return (
    <div className="space-y-1.5 leading-[2.1]">
      {lines.map((line, i) => {
        const { kind, content } = parseLine(line)
        if (kind === 'blank') return <div key={i} className="h-2" />
        if (kind === 'heading')
          return (
            <h4 key={i} className="pt-2 font-bold">
              <Markup text={content} gap={gap} />
            </h4>
          )
        if (kind === 'bullet' || kind === 'subbullet')
          return (
            <div key={i} className={`flex gap-2 ${kind === 'subbullet' ? 'ml-8' : 'ml-2'}`}>
              <span aria-hidden>{kind === 'bullet' ? '•' : '–'}</span>
              <div>
                <Markup text={content} gap={gap} />
              </div>
            </div>
          )
        return (
          <p key={i}>
            <Markup text={content} gap={gap} />
          </p>
        )
      })}
    </div>
  )
}

function Gaps({ group }: { group: GapGroup }) {
  const gap = (n: number) => <GapInput n={n} />
  const title = group.title && (
    <p className="mb-3 text-center font-bold">
      <Markup text={group.title} />
    </p>
  )

  if (group.layout === 'table' && group.table) {
    return (
      <div className="overflow-x-auto">
        {title}
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              {group.table.columns.map((c, i) => (
                <th key={i} className="border p-2 font-bold" style={{ borderColor: 'var(--ex-strong-border)', background: 'var(--ex-panel)' }}>
                  <Markup text={c} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {group.table.rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td key={c} className="border p-2 align-top leading-[2.1]" style={{ borderColor: 'var(--ex-strong-border)' }}>
                    <Markup text={cell} gap={gap} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (group.layout === 'flowchart') {
    const lines = group.lines ?? []
    return (
      <div>
        {title}
        <div className="flex flex-col items-stretch">
          {lines.map((line, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-full rounded-[3px] border px-4 py-2.5 text-center leading-[2.1]" style={{ borderColor: 'var(--ex-strong-border)' }}>
                <Markup text={line} gap={gap} />
              </div>
              {i < lines.length - 1 && <ArrowDown size={20} className="my-1" aria-hidden />}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (group.layout === 'notes' || group.layout === 'form') {
    return (
      <div className="rounded-[3px] border p-4" style={{ borderColor: 'var(--ex-strong-border)' }}>
        {title}
        <NoteLines lines={group.lines ?? []} gap={gap} />
      </div>
    )
  }

  // sentences / summary
  return (
    <div>
      {title}
      <div className={group.layout === 'summary' ? 'leading-[2.2]' : 'space-y-3 leading-[2.1]'}>
        {(group.lines ?? []).map((line, i) => (
          <p key={i}>
            <Markup text={line} gap={gap} />
          </p>
        ))}
      </div>
    </div>
  )
}

function GapBank({ group }: { group: GapBankGroup }) {
  const { answers } = useExam()
  const used = new Set(Object.entries(answers).filter(([k]) => Number(k) >= group.from && Number(k) <= group.to).map(([, v]) => v))
  const labelFor = (key: string) => group.options.find((o) => o.key === key)?.text ?? key
  return (
    <div>
      {group.title && (
        <p className="mb-3 text-center font-bold">
          <Markup text={group.title} />
        </p>
      )}
      <div className="mb-5 leading-[2.4]">
        {group.lines.map((line, i) => (
          <p key={i}>
            <Markup text={line} gap={(n) => <DropSlot groupId={group.id} n={n} label={labelFor} />} />
          </p>
        ))}
      </div>
      <OptionsDropZone groupId={group.id}>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
          {group.options.map((o) => (
            <DragChip key={o.key} groupId={group.id} optionKey={o.key} used={used.has(o.key)}>
              <span>
                <Markup text={o.text} />
              </span>
            </DragChip>
          ))}
        </div>
      </OptionsDropZone>
      {Array.from({ length: group.to - group.from + 1 }, (_, i) => (
        <Explanation key={i} n={group.from + i} />
      ))}
    </div>
  )
}

/** The list of headings. Their drop zones are inside the passage, like the real test. */
function Headings({ group }: { group: HeadingsGroup }) {
  const { answers } = useExam()
  const used = new Set(group.questions.map((q) => answers[String(q.n)]).filter(Boolean))
  if (group.example) used.add(group.example.key)
  const labelFor = (key: string) => (
    <>
      <strong className="mr-1.5">{key}</strong>
      {group.options.find((o) => o.key === key)?.text}
    </>
  )
  return (
    <div>
      <OptionsDropZone groupId={group.id}>
        <OptionsBox title="List of Headings">
          <div className="flex flex-col gap-1.5">
            {group.options.map((o) => (
              <DragChip key={o.key} groupId={group.id} optionKey={o.key} used={used.has(o.key)}>
                <strong className="w-8 shrink-0">{o.key}</strong>
                <span>
                  <Markup text={o.text} />
                </span>
              </DragChip>
            ))}
          </div>
        </OptionsBox>
      </OptionsDropZone>
      {/* On small screens the passage is on another tab, so repeat the drop zones here. */}
      <div className="space-y-2 lg:hidden">
        {group.questions.map((q) => (
          <div key={q.n} className="flex flex-wrap items-center gap-2">
            <span className="font-bold">Paragraph {q.paragraph}</span>
            <DropSlot groupId={group.id} n={q.n} label={labelFor} />
          </div>
        ))}
      </div>
      {group.questions.map((q) => (
        <Explanation key={q.n} n={q.n} />
      ))}
    </div>
  )
}

/** Drop zone rendered inside the passage above a paragraph. */
export function HeadingSlot({ group, paragraph }: { group: HeadingsGroup; paragraph: string }) {
  const option = (key: string) => group.options.find((o) => o.key === key)
  if (group.example?.paragraph === paragraph) {
    const o = option(group.example.key)
    return (
      <p className="mb-2 rounded-[3px] border px-2 py-1 text-[0.95em]" style={{ borderColor: 'var(--ex-border)', background: 'var(--ex-panel)' }}>
        <em>Example:</em> <strong>{o?.key}</strong> {o?.text}
      </p>
    )
  }
  const q = group.questions.find((x) => x.paragraph === paragraph)
  if (!q) return null
  return (
    <div className="mb-2">
      <DropSlot
        groupId={group.id}
        n={q.n}
        className="w-full"
        label={(key) => (
          <>
            <strong className="mr-1.5">{key}</strong>
            {option(key)?.text}
          </>
        )}
      />
    </div>
  )
}

function Matching({ group }: { group: MatchingGroup }) {
  const { answers, setAnswer, setActive, readOnly, results } = useExam()
  const used = group.reuse ? new Set<string>() : new Set(group.questions.map((q) => answers[String(q.n)]).filter(Boolean))
  const labelFor = (key: string) => (
    <>
      <strong className="mr-1.5">{key}</strong>
      <Markup text={group.options.find((o) => o.key === key)?.text ?? ''} />
    </>
  )

  if (group.display === 'select') {
    return (
      <div>
        <OptionsBox title={group.optionsTitle}>
          <ul className="space-y-1">
            {group.options.map((o) => (
              <li key={o.key} className="flex gap-3">
                <strong className="w-5 shrink-0">{o.key}</strong>
                <span>
                  <Markup text={o.text} />
                </span>
              </li>
            ))}
          </ul>
        </OptionsBox>
        <div className="space-y-3">
          {group.questions.map((q) => {
            const r = results?.get(q.n)
            return (
              <div key={q.n} className="flex flex-wrap items-center gap-2.5">
                <QNum n={q.n} />
                <span className="min-w-[10em] flex-1">
                  <Highlightable blockId={`q${q.n}`} text={q.text} />
                </span>
                <select
                  data-q={q.n}
                  aria-label={`Question ${q.n}`}
                  value={(answers[String(q.n)] as string) ?? ''}
                  disabled={readOnly}
                  onFocus={() => setActive(q.n)}
                  onChange={(e) => setAnswer(String(q.n), e.target.value)}
                  className="exam-input w-[5.5em] font-bold"
                  style={r ? { borderColor: r.correct ? 'var(--ex-correct)' : 'var(--ex-wrong)', borderWidth: 2 } : undefined}
                >
                  <option value="" />
                  {group.options.map((o) => (
                    <option key={o.key} value={o.key}>
                      {o.key}
                    </option>
                  ))}
                </select>
                <Verdict n={q.n} compact />
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-5 space-y-3">
        {group.questions.map((q) => (
          <div key={q.n} className="flex items-start gap-2.5">
            <QNum n={q.n} />
            <div className="flex flex-1 flex-col gap-1.5 pt-[0.15em]">
              <Highlightable blockId={`q${q.n}`} text={q.text} />
              <DropSlot groupId={group.id} n={q.n} label={labelFor} className="w-full" />
            </div>
          </div>
        ))}
      </div>
      <OptionsDropZone groupId={group.id}>
        <OptionsBox title={group.optionsTitle}>
          <div className="flex flex-col gap-1.5">
            {group.options.map((o) => (
              <DragChip key={o.key} groupId={group.id} optionKey={o.key} used={used.has(o.key)}>
                <strong className="w-5 shrink-0">{o.key}</strong>
                <span>
                  <Markup text={o.text} />
                </span>
              </DragChip>
            ))}
          </div>
        </OptionsBox>
      </OptionsDropZone>
    </div>
  )
}

function MapLabelling({ group }: { group: MapGroup }) {
  const { answers, setAnswer, setActive, readOnly } = useExam()
  return (
    <div>
      <div className="mb-4 rounded-[3px] border p-2" style={{ borderColor: 'var(--ex-strong-border)', background: '#fff' }}>
        <Visual name={group.visual} />
      </div>
      <div className="overflow-x-auto">
        <table className="border-collapse">
          <thead>
            <tr>
              <th />
              {group.letters.map((l) => (
                <th key={l} className="w-9 pb-1 text-center font-bold">
                  {l}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {group.questions.map((q) => (
              <tr key={q.n} data-q={q.n} onFocus={() => setActive(q.n)} className="border-t" style={{ borderColor: 'var(--ex-border)' }}>
                <td className="py-1.5 pr-4">
                  <span className="flex items-center gap-2 whitespace-nowrap">
                    <QNum n={q.n} />
                    <Markup text={q.text} />
                    <Verdict n={q.n} compact />
                  </span>
                </td>
                {group.letters.map((l) => (
                  <td key={l} className="text-center">
                    <input
                      type="radio"
                      name={`q${q.n}`}
                      aria-label={`Question ${q.n}: ${l}`}
                      checked={answers[String(q.n)] === l}
                      disabled={readOnly}
                      onChange={() => setAnswer(String(q.n), l)}
                      className="h-[1.1em] w-[1.1em]"
                      style={{ accentColor: 'var(--ex-accent)' }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ShortAnswers({ group }: { group: ShortAnswerGroup }) {
  return (
    <div className="space-y-4">
      {group.questions.map((q) => (
        <div key={q.n} className="flex items-start gap-2.5">
          <QNum n={q.n} />
          <div className="flex flex-1 flex-col gap-1.5 pt-[0.15em]">
            <Highlightable blockId={`q${q.n}`} text={q.text} />
            <GapInput n={q.n} wide />
          </div>
        </div>
      ))}
    </div>
  )
}
