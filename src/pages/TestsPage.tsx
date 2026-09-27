import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { SkillIcon } from '@/components/SkillIcon'
import { TESTS, testSkills } from '@/content/tests'
import { useI18n } from '@/i18n'
import { skillMinutes } from '@/lib/durations'
import { useAttempts } from '@/lib/storage'

type Filter = 'all' | 'full' | 'practice'

export function TestsPage() {
  const { t } = useI18n()
  const [filter, setFilter] = useState<Filter>('all')
  const attempts = useAttempts()
  const tests = TESTS.filter((test) => filter === 'all' || test.kind === filter)

  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6 sm:pt-16">
      <h1 className="font-display text-5xl font-semibold tracking-tight text-ink-950">{t.tests.title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-600">{t.tests.lead}</p>

      <div role="radiogroup" aria-label="Filter" className="mt-8 inline-flex rounded-full bg-white p-1 shadow-sm ring-1 ring-ink-900/10">
        {(
          [
            ['all', t.tests.filterAll],
            ['full', t.tests.filterFull],
            ['practice', t.tests.filterPractice],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={filter === value}
            onClick={() => setFilter(value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${filter === value ? 'bg-ink-950 text-paper' : 'text-ink-600 hover:text-ink-950'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {tests.map((test) => {
          const skills = testSkills(test)
          const count = attempts.filter((a) => a.testId === test.id).length
          return (
            <Link
              key={test.id}
              to={`/tests/${test.id}`}
              className="group flex flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink-900/5 transition-all hover:-translate-y-1 hover:shadow-lg sm:p-8"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wide uppercase">
                <span className={`rounded-full px-2.5 py-1 ${test.kind === 'full' ? 'bg-ink-950 text-paper' : 'bg-mark text-ink-950'}`}>
                  {test.kind === 'full' ? t.common.full : t.common.practice}
                </span>
                <span className="rounded-full bg-paper-2 px-2.5 py-1 text-ink-600">{test.module === 'academic' ? t.common.academic : t.common.general}</span>
                <span className="rounded-full bg-paper-2 px-2.5 py-1 text-ink-600">{t.common[test.difficulty]}</span>
                {count > 0 && <span className="ml-auto text-ink-400 normal-case">{t.tests.attempts(count)}</span>}
              </div>
              <h2 className="mt-5 font-display text-3xl font-semibold text-ink-950">{test.title}</h2>
              <p className="mt-2 flex-1 leading-relaxed text-ink-600">{test.summary}</p>
              <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {skills.map((s) => (
                  <li key={s} className="rounded-2xl bg-paper px-3 py-2.5">
                    <SkillIcon skill={s} size={16} />
                    <span className="mt-1.5 block text-sm font-semibold text-ink-900">{t.common[s]}</span>
                    <span className="text-xs text-ink-500">{t.common.minutes(skillMinutes(test, s))}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm text-ink-500">
                <span className="font-medium text-ink-700">{t.tests.topics}:</span> {test.topics.join(' · ')}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 font-semibold text-ink-950">
                {t.common.view} <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
