import { ArrowDownRight, ArrowUpRight, CalendarDays, Download, Minus, Trash2, Upload } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import { AccuracyBars } from '@/components/results/AccuracyBars'
import { SkillIcon } from '@/components/SkillIcon'
import { Sparkline } from '@/components/Sparkline'
import { getTest } from '@/content/tests'
import { useI18n } from '@/i18n'
import { summarize } from '@/lib/attempts'
import { formatBand, overallBand } from '@/lib/bands'
import { deleteRecordings } from '@/lib/recordings'
import { breakdownByType, scoreObjective, type QuestionResult } from '@/lib/scoring'
import { SKILL_COLOR } from '@/lib/skills'
import { deleteAttempt, exportBackup, importBackup, saveProfile, useAttempts, useProfile } from '@/lib/storage'
import type { Profile } from '@/types/attempt'
import type { Skill } from '@/types/content'

const SKILLS: Skill[] = ['listening', 'reading', 'writing', 'speaking']
const TARGETS = [5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9]

function daysUntil(date?: string): number | null {
  if (!date) return null
  const diff = new Date(`${date}T09:00:00`).getTime() - Date.now()
  return diff >= 0 ? Math.ceil(diff / 86_400_000) : null
}

function ProfileCard({ profile }: { profile: Profile | null }) {
  const { t } = useI18n()
  const [draft, setDraft] = useState<Profile>(() => profile ?? { name: '', targetBand: 7, module: 'academic' })
  const [saved, setSaved] = useState(false)
  const days = daysUntil(draft.examDate)
  return (
    <form
      className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink-900/5"
      onSubmit={(e) => {
        e.preventDefault()
        saveProfile(draft)
        setSaved(true)
        window.setTimeout(() => setSaved(false), 1800)
      }}
    >
      <h2 className="mb-4 font-display text-xl font-semibold">{t.dashboard.profile}</h2>
      <label className="mb-3 block text-sm">
        <span className="mb-1 block font-medium text-ink-700">{t.dashboard.name}</span>
        <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="w-full rounded-xl border border-ink-900/15 px-3 py-2 focus:border-ink-950 focus:outline-none" />
      </label>
      <div className="mb-3 grid grid-cols-2 gap-3">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-ink-700">{t.dashboard.target}</span>
          <select value={draft.targetBand} onChange={(e) => setDraft({ ...draft, targetBand: Number(e.target.value) })} className="w-full rounded-xl border border-ink-900/15 bg-white px-3 py-2">
            {TARGETS.map((b) => (
              <option key={b} value={b}>
                {b.toFixed(1)}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-ink-700">{t.dashboard.examDate}</span>
          <input type="date" value={draft.examDate ?? ''} onChange={(e) => setDraft({ ...draft, examDate: e.target.value || undefined })} className="w-full rounded-xl border border-ink-900/15 px-3 py-2" />
        </label>
      </div>
      {days !== null && (
        <p className="mb-3 flex items-center gap-2 rounded-xl bg-mark/60 px-3 py-2 text-sm font-semibold text-ink-950">
          <CalendarDays size={16} aria-hidden /> {t.dashboard.daysLeft(days)}
        </p>
      )}
      <button type="submit" className="w-full rounded-full bg-ink-950 px-4 py-2.5 text-sm font-semibold text-paper">
        {saved ? t.dashboard.saved : t.dashboard.save}
      </button>
    </form>
  )
}

export function DashboardPage() {
  const { t } = useI18n()
  const attempts = useAttempts()
  const profile = useProfile()
  const fileInput = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<string | null>(null)

  const completed = useMemo(() => attempts.filter((a) => a.status === 'completed' && getTest(a.testId)).sort((a, b) => (a.completedAt ?? 0) - (b.completedAt ?? 0)), [attempts])
  const unfinished = attempts.filter((a) => a.status !== 'completed' && getTest(a.testId))
  const summaries = useMemo(() => completed.map((a) => ({ attempt: a, summary: summarize(a, getTest(a.testId)!) })), [completed])

  const history: Record<Skill, number[]> = { listening: [], reading: [], writing: [], speaking: [] }
  for (const { summary } of summaries) for (const s of SKILLS) if (typeof summary.bands[s] === 'number') history[s].push(summary.bands[s]!)
  const latest = SKILLS.map((s) => history[s].at(-1))
  const estimate = latest.every((b) => typeof b === 'number') ? overallBand(latest as number[]) : null
  const allBands = SKILLS.flatMap((s) => history[s])
  const best = allBands.length ? Math.max(...allBands) : null
  const target = profile?.targetBand ?? 7

  const weak = useMemo(() => {
    const results: QuestionResult[] = []
    for (const a of completed) {
      const test = getTest(a.testId)!
      for (const skill of ['listening', 'reading'] as const) {
        const state = a.sections[skill]
        const section = test[skill]
        if (state?.phase === 'done' && section) results.push(...scoreObjective(skill, section, state.answers, test.module).results)
      }
    }
    return breakdownByType(results)
  }, [completed])

  const exportData = () => {
    const url = URL.createObjectURL(new Blob([exportBackup()], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `mrshakhriyor-ielts-progress-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = async (file: File) => {
    try {
      const count = importBackup(await file.text())
      setMessage(t.dashboard.imported(count))
    } catch {
      setMessage(t.dashboard.importError)
    }
  }

  const remove = (id: string) => {
    if (!window.confirm(t.dashboard.confirmDelete)) return
    deleteAttempt(id)
    void deleteRecordings(`${id}/`)
  }

  const kpis = [
    { label: t.dashboard.testsTaken, value: String(completed.length) },
    { label: `${t.common.overall} (${t.common.estimate})`, value: formatBand(estimate) },
    { label: t.dashboard.best, value: formatBand(best) },
    {
      label: t.dashboard.toTarget,
      value: estimate === null ? '–' : estimate >= target ? '✓' : `+${(target - estimate).toFixed(1)}`,
    },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 sm:pt-16">
      <h1 className="font-display text-5xl font-semibold tracking-tight text-ink-950">{t.dashboard.title}</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-600">{t.dashboard.lead}</p>

      <div className="mt-10 grid gap-5 lg:grid-cols-[320px_1fr]">
        <ProfileCard key={profile?.name ?? 'new'} profile={profile} />
        <div className="grid content-start gap-5">
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {kpis.map((k) => (
              <div key={k.label} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink-900/5">
                <dt className="text-sm text-ink-500">{k.label}</dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-ink-950">{k.value}</dd>
              </div>
            ))}
          </dl>
          <div className="grid gap-3 sm:grid-cols-2">
            {SKILLS.map((s) => {
              const values = history[s]
              const current = values.at(-1)
              const delta = values.length > 1 ? values[values.length - 1] - values[values.length - 2] : null
              const Trend = delta === null || delta === 0 ? Minus : delta > 0 ? ArrowUpRight : ArrowDownRight
              return (
                <div key={s} className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink-900/5">
                  <div>
                    <p className="flex items-center gap-2 text-sm text-ink-500">
                      <SkillIcon skill={s} /> {t.common[s]}
                    </p>
                    <p className="mt-1 text-3xl font-semibold text-ink-950">{formatBand(current)}</p>
                    {delta !== null && (
                      <p className={`mt-0.5 flex items-center gap-1 text-xs font-semibold ${delta > 0 ? 'text-[#0f7b3f]' : delta < 0 ? 'text-[#c62828]' : 'text-ink-500'}`}>
                        <Trend size={14} aria-hidden /> {delta === 0 ? t.dashboard.noChange : t.dashboard.vsPrevious(`${delta > 0 ? '+' : ''}${delta.toFixed(1)}`)}
                      </p>
                    )}
                  </div>
                  <Sparkline values={values} color={SKILL_COLOR[s]} label={`${t.common[s]} ${t.dashboard.trend}`} />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {unfinished.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 font-display text-2xl font-semibold">{t.dashboard.inProgress}</h2>
          <ul className="grid gap-3 md:grid-cols-2">
            {unfinished.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink-900/5">
                <span>
                  <span className="block font-semibold">{getTest(a.testId)?.title}</span>
                  <span className="text-sm text-ink-500">
                    {new Date(a.createdAt).toLocaleDateString()} · {a.skills.map((s) => t.common[s]).join(', ')}
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <Link to={`/exam/${a.id}`} className="rounded-full bg-ink-950 px-4 py-2 text-sm font-semibold text-paper">
                    {t.dashboard.continue}
                  </Link>
                  <button type="button" onClick={() => remove(a.id)} aria-label={t.dashboard.delete} className="rounded-full p-2 text-ink-500 hover:text-[#c62828]">
                    <Trash2 size={16} />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <section>
          <h2 className="font-display text-2xl font-semibold">{t.dashboard.weak}</h2>
          <p className="mt-1 mb-4 text-sm text-ink-500">{t.dashboard.weakLead}</p>
          <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-ink-900/5 sm:p-6">
            {weak.length ? <AccuracyBars rows={weak} focusLabel={t.results.focus} /> : <p className="text-ink-500">{t.dashboard.empty}</p>}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-display text-2xl font-semibold">{t.dashboard.history}</h2>
          {summaries.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-ink-900/5">
              <p className="text-ink-600">{t.dashboard.empty}</p>
              <Link to="/tests/mock-1" className="mt-4 inline-block rounded-full bg-ink-950 px-5 py-2.5 font-semibold text-paper">
                {t.nav.start}
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl bg-white shadow-sm ring-1 ring-ink-900/5">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="bg-paper-2 text-xs tracking-wide text-ink-500 uppercase">
                  <tr>
                    <th className="px-4 py-3 font-semibold">{t.common.date}</th>
                    <th className="px-4 py-3 font-semibold">{t.dashboard.test}</th>
                    {SKILLS.map((s) => (
                      <th key={s} className="px-2 py-3 text-center font-semibold" title={t.common[s]}>
                        {t.common[s][0]}
                      </th>
                    ))}
                    <th className="px-2 py-3 text-center font-semibold">{t.common.overall}</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-900/8">
                  {[...summaries].reverse().map(({ attempt, summary }) => (
                    <tr key={attempt.id} className="hover:bg-paper/60">
                      <td className="px-4 py-3 whitespace-nowrap text-ink-600 tabular-nums">{new Date(attempt.completedAt ?? attempt.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-ink-900">{getTest(attempt.testId)?.title}</span>
                        <span className="block text-xs text-ink-400">{attempt.mode === 'exam' ? t.common.examMode : t.common.practiceMode}</span>
                      </td>
                      {SKILLS.map((s) => (
                        <td key={s} className="px-2 py-3 text-center tabular-nums">
                          {attempt.skills.includes(s) ? formatBand(summary.bands[s]) : <span className="text-ink-400">·</span>}
                        </td>
                      ))}
                      <td className="px-2 py-3 text-center font-semibold tabular-nums">{formatBand(summary.overall)}</td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <Link to={`/results/${attempt.id}`} className="font-semibold text-signal hover:underline">
                          {t.dashboard.open}
                        </Link>
                        <button type="button" onClick={() => remove(attempt.id)} aria-label={t.dashboard.delete} className="ml-2 rounded-full p-1.5 align-middle text-ink-400 hover:text-[#c62828]">
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <section className="mt-12 flex flex-wrap items-center gap-3 rounded-3xl bg-paper-2 p-6">
        <h2 className="mr-auto font-display text-xl font-semibold">{t.dashboard.backup}</h2>
        {message && (
          <p role="status" className="w-full text-sm font-medium text-ink-700 sm:w-auto">
            {message}
          </p>
        )}
        <button type="button" onClick={exportData} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold ring-1 ring-ink-900/15 hover:ring-ink-900/40">
          <Download size={16} /> {t.dashboard.export}
        </button>
        <button type="button" onClick={() => fileInput.current?.click()} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold ring-1 ring-ink-900/15 hover:ring-ink-900/40">
          <Upload size={16} /> {t.dashboard.import}
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void importData(file)
            e.target.value = ''
          }}
        />
      </section>
    </div>
  )
}
