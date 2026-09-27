import { AlertTriangle, CheckCircle2, ClipboardCopy, Download, XCircle } from 'lucide-react'
import { useState } from 'react'
import { WRITING_DESCRIPTORS } from '@/content/descriptors'
import { useI18n } from '@/i18n'
import { WRITING_CRITERIA, writingEstimate } from '@/lib/attempts'
import { criteriaBand, formatBand } from '@/lib/bands'
import { countWords, plainText } from '@/lib/text'
import { analyzeWriting, type WritingCheck } from '@/lib/writingAnalysis'
import type { Dictionary } from '@/i18n/en'
import { site } from '@/site.config'
import type { Attempt, SectionState } from '@/types/attempt'
import type { TestDef, WritingTask } from '@/types/content'
import { BandPicker } from './BandPicker'

function submissionText(attempt: Attempt, test: TestDef, state: SectionState): string {
  const lines = [
    `${site.name} — Writing submission`,
    `Candidate: ${attempt.candidate.name} (${attempt.candidate.number})`,
    `Test: ${test.title} · ${test.module === 'academic' ? 'Academic' : 'General Training'} · ${new Date(attempt.createdAt).toLocaleDateString()}`,
  ]
  if (state.startedAt && state.finishedAt) lines.push(`Time used: ${Math.round((state.finishedAt - state.startedAt) / 60000)} minutes`)
  for (const task of test.writing?.tasks ?? []) {
    const essay = state.essays?.[task.id] ?? ''
    lines.push('', `TASK ${task.number} (${countWords(essay)} words)`, `Question: ${task.prompt.map(plainText).join(' ')}`, '', essay || '(no answer)')
  }
  return lines.join('\n')
}

function checkCopy(c: WritingCheck, task: WritingTask, t: Dictionary): { label: string; detail?: string } {
  const copy = t.results.checks
  switch (c.id) {
    case 'minWords':
      return { label: copy.minWords.label(task.minWords), detail: c.ok ? undefined : copy.minWords.detail(c.value) }
    case 'paragraphs':
      return { label: task.number === 1 ? copy.paragraphs.label1 : copy.paragraphs.label2, detail: copy.paragraphs.detail(c.value) }
    case 'overview':
      return { label: copy.overview.label, detail: c.ok ? undefined : copy.overview.detail }
    case 'position':
      return { label: copy.position.label, detail: c.ok ? undefined : copy.position.detail }
    case 'linkers':
      return { label: copy.linkers.label, detail: copy.linkers.detail(c.value) }
  }
}

function TaskReport({ task, essay, assessment, onAssess }: { task: WritingTask; essay: string; assessment: Record<string, number>; onAssess: (key: string, band: number) => void }) {
  const { t } = useI18n()
  const analysis = analyzeWriting(essay, task.number, task.minWords)
  const criteria = WRITING_CRITERIA[task.number === 1 ? 'w1' : 'w2']
  const prefix = task.number === 1 ? 'w1' : 'w2'
  const scores = criteria.map((c) => assessment[`${prefix}.${c.key}`])
  const taskBand = scores.every((s) => typeof s === 'number') ? criteriaBand(scores as number[]) : null

  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-ink-900/5 sm:p-8">
      <header className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="font-display text-2xl font-semibold">{t.results.task(task.number)}</h3>
        <p className="text-sm text-ink-600">
          {t.results.wordCount(analysis.words)} · {t.results.minimum(task.minWords)}
          {taskBand !== null && (
            <span className="ml-3 rounded-full bg-ink-950 px-3 py-1 font-semibold text-paper">
              {t.common.band} {formatBand(taskBand)}
            </span>
          )}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <article className="max-h-[32rem] overflow-y-auto rounded-2xl bg-paper/70 p-5 text-[15px] leading-7 whitespace-pre-wrap text-ink-900 ring-1 ring-ink-900/5">
          {essay || <em className="text-ink-400">{t.results.blank}</em>}
        </article>
        <aside>
          <h4 className="mb-3 text-xs font-bold tracking-widest text-ink-500 uppercase">{t.results.analysis}</h4>
          <ul className="mb-5 space-y-2.5 text-sm">
            {analysis.checks.map((c) => {
              const copy = checkCopy(c, task, t)
              return (
                <li key={c.id} className="flex gap-2.5">
                  {c.ok ? <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#0f7b3f]" aria-label="✓" /> : <XCircle size={18} className="mt-0.5 shrink-0 text-[#c62828]" aria-label="✗" />}
                  <span>
                    <span className="font-medium text-ink-900">{copy.label}</span>
                    {copy.detail && <span className="block text-ink-500">{copy.detail}</span>}
                  </span>
                </li>
              )
            })}
          </ul>
          <dl className="mb-5 grid grid-cols-3 gap-2 text-center">
            {[
              [t.results.sentences, analysis.sentences],
              [t.results.wordsPerSentence, analysis.avgSentenceLength],
              [t.results.differentWords, `${Math.round(analysis.uniqueWordRatio * 100)}%`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-paper-2 px-2 py-2.5">
                <dd className="text-lg font-semibold text-ink-950">{value}</dd>
                <dt className="text-[11px] leading-tight text-ink-500">{label}</dt>
              </div>
            ))}
          </dl>
          {analysis.linkers.length > 0 && (
            <p className="mb-3 text-sm text-ink-600">
              <span className="font-medium text-ink-900">{t.results.linkingWords}: </span>
              {analysis.linkers.join(', ')}
            </p>
          )}
          {analysis.repeated.length > 0 && (
            <p className="mb-3 text-sm text-ink-600">
              <span className="font-medium text-ink-900">{t.results.repeatedOften}: </span>
              {analysis.repeated.map((r) => `${r.word} (${r.count}×)`).join(', ')} — {t.results.trySynonyms}.
            </p>
          )}
          {analysis.informal.length > 0 && (
            <p className="flex gap-2 rounded-xl bg-[#fff4e5] p-3 text-sm text-[#7a4a00]">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden />
              <span>
                <span className="font-medium">{t.results.tooInformal}: </span>
                {analysis.informal.map((id) => t.results.informal[id]).join('; ')}.
              </span>
            </p>
          )}
        </aside>
      </div>

      {task.modelAnswer && (
        <details className="group mt-6 rounded-2xl bg-ink-950 p-5 text-paper/90">
          <summary className="cursor-pointer list-none font-semibold text-paper marker:hidden">
            <span className="mr-2 inline-block transition-transform group-open:rotate-90">›</span>
            {t.results.modelAnswer} · {t.common.band} {task.modelAnswer.band}
          </summary>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <p className="text-[15px] leading-7 whitespace-pre-wrap">{task.modelAnswer.text}</p>
            <ul className="space-y-2 text-sm text-paper/75">
              {task.modelAnswer.notes.map((n) => (
                <li key={n} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mark" aria-hidden />
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </details>
      )}

      <div className="mt-6">
        <h4 className="mb-1 font-semibold text-ink-950">{t.results.selfAssess}</h4>
        <p className="mb-4 text-sm text-ink-600">{t.results.selfAssessLead}</p>
        <div className="grid gap-3 md:grid-cols-2">
          {criteria.map((c) => (
            <BandPicker
              key={c.key}
              label={c.label}
              descriptors={WRITING_DESCRIPTORS[c.key]}
              value={assessment[`${prefix}.${c.key}`]}
              onChange={(band) => onAssess(`${prefix}.${c.key}`, band)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export function WritingReport({ attempt, test, state, onAssess }: { attempt: Attempt; test: TestDef; state: SectionState; onAssess: (key: string, band: number) => void }) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)
  const estimate = writingEstimate(state)
  const text = submissionText(attempt, test, state)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }
  const download = () => {
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `writing-${attempt.candidate.name.replace(/\s+/g, '-').toLowerCase()}-${attempt.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-ink-600">
          {estimate !== null ? (
            <>
              {t.results.estimatedWriting}: <strong className="text-ink-950">{formatBand(estimate)}</strong> <span className="text-ink-500">({t.results.task2Double})</span>
            </>
          ) : (
            t.results.selfAssessLead
          )}
        </p>
        <div className="flex gap-2 print:hidden">
          <button type="button" onClick={copy} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold ring-1 ring-ink-900/15 hover:ring-ink-900/40">
            <ClipboardCopy size={16} /> {copied ? t.results.copied : t.results.copyForTeacher}
          </button>
          <button type="button" onClick={download} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold ring-1 ring-ink-900/15 hover:ring-ink-900/40">
            <Download size={16} /> {t.results.download}
          </button>
        </div>
      </div>
      {(test.writing?.tasks ?? []).map((task) => (
        <TaskReport key={task.id} task={task} essay={state.essays?.[task.id] ?? ''} assessment={state.selfAssessment ?? {}} onAssess={onAssess} />
      ))}
    </div>
  )
}
