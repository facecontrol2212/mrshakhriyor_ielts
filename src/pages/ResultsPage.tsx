import { ArrowRight, Eye, Printer, RotateCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import { AccuracyBars } from '@/components/results/AccuracyBars'
import { QuestionTable } from '@/components/results/QuestionTable'
import { SpeakingReport } from '@/components/results/SpeakingReport'
import { WritingReport } from '@/components/results/WritingReport'
import { SkillIcon } from '@/components/SkillIcon'
import { getTest } from '@/content/tests'
import { useI18n } from '@/i18n'
import { summarize, updateSection } from '@/lib/attempts'
import { bandLabel, formatBand } from '@/lib/bands'
import { breakdownByType, scoreObjective } from '@/lib/scoring'
import { getAttempt, saveAttempt, useAttempts } from '@/lib/storage'
import type { Skill } from '@/types/content'

export function ResultsPage() {
  const { attemptId = '' } = useParams()
  const { t } = useI18n()
  const attempts = useAttempts()
  const attempt = attempts.find((a) => a.id === attemptId) ?? getAttempt(attemptId)
  const test = attempt ? getTest(attempt.testId) : undefined
  const [tab, setTab] = useState<Skill | null>(null)

  const objective = useMemo(() => {
    if (!attempt || !test) return {}
    const out: Partial<Record<'listening' | 'reading', ReturnType<typeof scoreObjective>>> = {}
    for (const skill of ['listening', 'reading'] as const) {
      const state = attempt.sections[skill]
      const section = test[skill]
      if (state?.phase === 'done' && section) out[skill] = scoreObjective(skill, section, state.answers, test.module)
    }
    return out
  }, [attempt, test])

  if (!attempt || !test) {
    return (
      <div className="mx-auto max-w-xl px-6 py-28 text-center">
        <h1 className="font-display text-3xl font-semibold">{t.results.notFound}</h1>
        <Link to="/dashboard" className="mt-6 inline-block rounded-full bg-ink-950 px-5 py-2.5 font-semibold text-paper">
          {t.results.dashboard}
        </Link>
      </div>
    )
  }

  if (attempt.status !== 'completed') {
    return (
      <div className="mx-auto max-w-xl px-6 py-28 text-center">
        <h1 className="font-display text-3xl font-semibold">{t.results.incomplete}</h1>
        <Link to={`/exam/${attempt.id}`} className="mt-6 inline-block rounded-full bg-ink-950 px-5 py-2.5 font-semibold text-paper">
          {t.results.resume}
        </Link>
      </div>
    )
  }

  const summary = summarize(attempt, test)
  const skills = attempt.skills
  const active = tab ?? skills[0]
  const single = skills.length === 1
  const hero = single ? summary.bands[skills[0]] : summary.overall
  const assess = (skill: Skill) => (key: string, band: number) =>
    saveAttempt(updateSection(attempt, skill, (s) => ({ ...s, selfAssessment: { ...s.selfAssessment, [key]: band } })))

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
      <section className="relative overflow-hidden rounded-[2rem] bg-ink-950 p-6 text-paper sm:p-10">
        <div className="grain pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-mark uppercase">{t.results.title}</p>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{test.title}</h1>
            <p className="mt-3 text-sm text-paper/65">
              {t.results.candidate}: <span className="text-paper">{attempt.candidate.name}</span> · #{attempt.candidate.number} ·{' '}
              {new Date(attempt.completedAt ?? attempt.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })} ·{' '}
              {attempt.mode === 'exam' ? t.common.examMode : t.common.practiceMode}
            </p>
          </div>
          <div className="md:text-right">
            <p className="text-sm text-paper/60">{single ? t.common[skills[0]] : t.common.overall}</p>
            <p className="text-7xl leading-none font-semibold tracking-tight text-mark">{formatBand(hero)}</p>
            <p className="mt-2 text-sm text-paper/70">{typeof hero === 'number' ? bandLabel(hero) : single ? t.results.assess : t.results.overallNeedsAll}</p>
          </div>
        </div>

        <div className={`relative mt-8 grid gap-3 ${skills.length > 2 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2'}`}>
          {skills.map((skill) => {
            const band = summary.bands[skill]
            const raw = skill === 'listening' || skill === 'reading' ? summary.raw[skill] : undefined
            return (
              <button
                key={skill}
                type="button"
                onClick={() => {
                  setTab(skill)
                  document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="rounded-2xl bg-paper/[0.06] p-4 text-left ring-1 ring-paper/10 transition-colors hover:bg-paper/10"
              >
                <span className="flex items-center gap-2 text-sm font-medium text-paper/80">
                  <SkillIcon skill={skill} size={16} /> {t.common[skill]}
                </span>
                <span className="mt-2 block text-4xl font-semibold">{formatBand(band)}</span>
                <span className="mt-1 block text-xs text-paper/55">
                  {raw ? t.results.raw(raw.raw, raw.total) : typeof band === 'number' ? t.common.estimate : `${t.results.assess} →`}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-2 print:hidden">
        {(['listening', 'reading'] as const)
          .filter((s) => skills.includes(s))
          .map((s) => (
            <Link key={s} to={`/review/${attempt.id}/${s}`} className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-4 py-2.5 text-sm font-semibold text-paper hover:bg-ink-800">
              <Eye size={16} /> {t.results.reviewAnswers} · {t.common[s]}
            </Link>
          ))}
        <Link to={`/tests/${test.id}`} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold ring-1 ring-ink-900/15 hover:ring-ink-900/40">
          <RotateCcw size={16} /> {t.results.retake}
        </Link>
        <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold ring-1 ring-ink-900/15 hover:ring-ink-900/40">
          <Printer size={16} /> {t.results.printReport}
        </button>
        <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-signal hover:underline">
          {t.results.dashboard} <ArrowRight size={16} />
        </Link>
      </div>
      <p className="mt-3 text-xs text-ink-500">{t.results.estimatedNote}</p>

      <div id="details" className="mt-12 scroll-mt-24">
        {skills.length > 1 && (
          <div role="tablist" className="mb-6 flex gap-1 overflow-x-auto border-b border-ink-900/10 print:hidden">
            {skills.map((s) => (
              <button
                key={s}
                type="button"
                role="tab"
                aria-selected={active === s}
                onClick={() => setTab(s)}
                className={`-mb-px flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold whitespace-nowrap ${active === s ? 'border-ink-950 text-ink-950' : 'border-transparent text-ink-500 hover:text-ink-900'}`}
              >
                <SkillIcon skill={s} /> {t.common[s]}
              </button>
            ))}
          </div>
        )}

        {(active === 'listening' || active === 'reading') && objective[active] && (
          <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
            <section>
              <h2 className="mb-4 font-display text-2xl font-semibold">{t.results.byType}</h2>
              <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-ink-900/5 sm:p-6">
                <AccuracyBars rows={breakdownByType(objective[active].results)} focusLabel={t.results.focus} />
              </div>
            </section>
            <section>
              <h2 className="mb-4 font-display text-2xl font-semibold">{t.results.questions}</h2>
              <QuestionTable results={objective[active].results} />
            </section>
          </div>
        )}
        {active === 'writing' && attempt.sections.writing && (
          <WritingReport attempt={attempt} test={test} state={attempt.sections.writing} onAssess={assess('writing')} />
        )}
        {active === 'speaking' && attempt.sections.speaking && test.speaking && (
          <SpeakingReport section={test.speaking} state={attempt.sections.speaking} onAssess={assess('speaking')} />
        )}
      </div>
    </div>
  )
}
