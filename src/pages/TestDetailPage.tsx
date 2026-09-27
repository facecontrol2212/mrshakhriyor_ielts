import { ArrowRight, Check, Clock, Headphones, Laptop, Mic, Volume2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { SkillIcon } from '@/components/SkillIcon'
import { getTest, testSkills } from '@/content/tests'
import { useI18n } from '@/i18n'
import { createAttempt, summarize } from '@/lib/attempts'
import { skillMinutes } from '@/lib/durations'
import { formatBand } from '@/lib/bands'
import { getProfile, saveAttempt, saveProfile, useAttempts } from '@/lib/storage'
import type { ExamMode } from '@/types/attempt'
import type { Skill } from '@/types/content'
import { NotFoundPage } from './NotFoundPage'

type Plan = 'full' | 'fullSpeaking' | Skill

export function TestDetailPage() {
  const { testId = '' } = useParams()
  const { t } = useI18n()
  const navigate = useNavigate()
  const test = getTest(testId)
  const attempts = useAttempts().filter((a) => a.testId === testId)
  const skills = test ? testSkills(test) : []
  const [plan, setPlan] = useState<Plan>(() => (test?.kind === 'full' ? 'full' : skills[0] ?? 'reading'))
  const [mode, setMode] = useState<ExamMode>('exam')
  const [name, setName] = useState(() => getProfile()?.name ?? '')

  if (!test) return <NotFoundPage />

  const chosen: Skill[] =
    plan === 'full' ? skills.filter((s) => s !== 'speaking') : plan === 'fullSpeaking' ? skills : [plan]
  const total = chosen.reduce((sum, s) => sum + skillMinutes(test, s), 0)

  const start = () => {
    const trimmed = name.trim()
    const profile = getProfile()
    if (trimmed && (!profile || profile.name !== trimmed))
      saveProfile({ name: trimmed, targetBand: profile?.targetBand ?? 7, examDate: profile?.examDate, module: profile?.module ?? 'academic' })
    const attempt = createAttempt(test, chosen, mode, trimmed || 'Candidate')
    saveAttempt(attempt)
    navigate(`/exam/${attempt.id}`)
  }

  const planOption = (value: Plan, title: string, text: string, icons: Skill[]) => (
    <label
      key={value}
      className={`flex cursor-pointer items-start gap-4 rounded-2xl border-2 bg-white p-4 transition-colors sm:p-5 ${plan === value ? 'border-ink-950' : 'border-transparent shadow-sm hover:border-ink-900/20'}`}
    >
      <input type="radio" name="plan" className="mt-1 accent-ink-950" checked={plan === value} onChange={() => setPlan(value)} />
      <span className="flex-1">
        <span className="block font-semibold text-ink-950">{title}</span>
        <span className="mt-0.5 block text-sm text-ink-600">{text}</span>
        <span className="mt-3 flex flex-wrap gap-1.5">
          {icons.map((s) => (
            <span key={s} className="inline-flex items-center gap-1 rounded-full bg-paper-2 px-2 py-0.5 text-xs font-medium text-ink-700">
              <SkillIcon skill={s} size={12} /> {t.common[s]} · {skillMinutes(test, s)}′
            </span>
          ))}
        </span>
      </span>
    </label>
  )

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-4 sm:px-6 sm:pt-14">
      <nav className="mb-6 text-sm text-ink-500">
        <Link to="/tests" className="hover:text-ink-950">
          {t.nav.tests}
        </Link>{' '}
        / <span className="text-ink-800">{test.title}</span>
      </nav>
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <p className="mb-3 flex flex-wrap gap-2 text-xs font-semibold tracking-wide uppercase">
            <span className="rounded-full bg-ink-950 px-2.5 py-1 text-paper">{test.kind === 'full' ? t.common.full : t.common.practice}</span>
            <span className="rounded-full bg-paper-3 px-2.5 py-1 text-ink-700">{test.module === 'academic' ? t.common.academic : t.common.general}</span>
            <span className="rounded-full bg-paper-3 px-2.5 py-1 text-ink-700">{t.common[test.difficulty]}</span>
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-950 sm:text-5xl">{test.title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-600">{test.summary}</p>
          <p className="mt-4 flex flex-wrap gap-2">
            {test.topics.map((topic) => (
              <span key={topic} className="rounded-full border border-ink-900/15 px-3 py-1 text-sm text-ink-700">
                {topic}
              </span>
            ))}
          </p>

          <h2 className="mt-12 mb-4 font-display text-2xl font-semibold">{t.detail.howTitle}</h2>
          <div className="grid gap-3">
            {test.kind === 'full' && (
              <>
                {planOption('full', t.detail.plans.full.title, t.detail.plans.full.text, skills.filter((s) => s !== 'speaking'))}
                {skills.includes('speaking') && planOption('fullSpeaking', t.detail.plans.fullSpeaking.title, t.detail.plans.fullSpeaking.text, skills)}
              </>
            )}
            <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-5">
              <p className="mb-3 font-semibold">{test.kind === 'full' ? t.detail.chooseSection : t.detail.plans.single.title}</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {skills.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setPlan(s)}
                    aria-pressed={plan === s}
                    className={`flex flex-col items-start gap-1 rounded-xl border-2 px-3 py-2.5 text-left transition-colors ${plan === s ? 'border-ink-950 bg-paper' : 'border-ink-900/10 hover:border-ink-900/30'}`}
                  >
                    <SkillIcon skill={s} size={18} />
                    <span className="text-sm font-semibold">{t.common[s]}</span>
                    <span className="text-xs text-ink-500">{t.common.minutes(skillMinutes(test, s))}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <h2 className="mt-10 mb-4 font-display text-2xl font-semibold">{t.detail.modeTitle}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {(['exam', 'practice'] as const).map((m) => (
              <label key={m} className={`flex cursor-pointer gap-3 rounded-2xl border-2 bg-white p-4 ${mode === m ? 'border-ink-950' : 'border-transparent shadow-sm'}`}>
                <input type="radio" name="mode" className="mt-1 accent-ink-950" checked={mode === m} onChange={() => setMode(m)} />
                <span>
                  <span className="block font-semibold">{m === 'exam' ? t.detail.exam : t.detail.practice}</span>
                  <span className="text-sm text-ink-600">{m === 'exam' ? t.detail.examHint : t.detail.practiceHint}</span>
                </span>
              </label>
            ))}
          </div>

          {attempts.length > 0 && (
            <>
              <h2 className="mt-10 mb-4 font-display text-2xl font-semibold">{t.detail.previous}</h2>
              <ul className="divide-y divide-ink-900/10 overflow-hidden rounded-2xl bg-white shadow-sm">
                {attempts.map((a) => {
                  const s = summarize(a, test)
                  return (
                    <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
                      <span>
                        <span className="font-medium">{new Date(a.createdAt).toLocaleDateString()}</span>
                        <span className="ml-2 text-ink-500">{a.skills.map((sk) => t.common[sk]).join(' · ')}</span>
                      </span>
                      <span className="flex items-center gap-3">
                        {a.status === 'completed' ? (
                          <>
                            {a.skills.map((sk) => (
                              <span key={sk} className="tabular-nums text-ink-600">
                                {t.common[sk][0]} {formatBand(s.bands[sk])}
                              </span>
                            ))}
                            <Link to={`/results/${a.id}`} className="font-semibold text-signal hover:underline">
                              {t.dashboard.open}
                            </Link>
                          </>
                        ) : (
                          <Link to={`/exam/${a.id}`} className="font-semibold text-signal hover:underline">
                            {t.detail.resume}
                          </Link>
                        )}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl bg-ink-950 p-6 text-paper shadow-xl">
            <p className="text-sm text-paper/60">{t.detail.totalTime}</p>
            <p className="mt-1 flex items-baseline gap-2 font-display text-5xl font-semibold">
              <Clock size={28} className="self-center text-mark" aria-hidden />
              {t.common.duration(total)}
            </p>
            <p className="mt-2 text-sm text-paper/70">{chosen.map((s) => t.common[s]).join(' → ')}</p>
            <label className="mt-6 block text-sm">
              <span className="mb-1.5 block text-paper/70">{t.detail.nameLabel}</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.detail.namePlaceholder}
                className="w-full rounded-xl border border-paper/15 bg-paper/10 px-3.5 py-2.5 text-paper placeholder:text-paper/50 focus:border-mark focus:outline-none"
              />
            </label>
            <button
              type="button"
              onClick={start}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-mark px-5 py-3.5 font-semibold text-ink-950 transition-transform hover:-translate-y-0.5"
            >
              {t.detail.start} <ArrowRight size={18} />
            </button>
            <div className="mt-6 border-t border-paper/10 pt-5">
              <p className="mb-3 text-xs font-bold tracking-widest text-paper/60 uppercase">{t.detail.checklistTitle}</p>
              <ul className="space-y-2.5 text-sm text-paper/80">
                {t.detail.checklist.map((item, i) => {
                  const Icon = [Laptop, Headphones, Mic, Volume2][i] ?? Check
                  return (
                    <li key={item} className="flex gap-2.5">
                      <Icon size={16} className="mt-0.5 shrink-0 text-mark" aria-hidden />
                      {item}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
