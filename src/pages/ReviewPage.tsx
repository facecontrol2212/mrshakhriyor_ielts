import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { getTest } from '@/content/tests'
import { ListeningRunner } from '@/exam/listening/ListeningRunner'
import { ReadingRunner } from '@/exam/reading/ReadingRunner'
import { useExamSettings } from '@/exam/settings'
import { useI18n } from '@/i18n'
import { scoreObjective } from '@/lib/scoring'
import { getAttempt } from '@/lib/storage'

const noop = () => undefined

/** Answer review in the exam interface: every question marked, evidence highlighted in the passage or transcript. */
export function ReviewPage() {
  const { attemptId = '', skill } = useParams()
  const navigate = useNavigate()
  const { t } = useI18n()
  const [settings, updateSettings] = useExamSettings()
  const attempt = getAttempt(attemptId)
  const test = attempt ? getTest(attempt.testId) : undefined
  const state = attempt && (skill === 'listening' || skill === 'reading') ? attempt.sections[skill] : undefined
  const section = test && (skill === 'listening' || skill === 'reading') ? test[skill] : undefined

  const results = useMemo(() => {
    if (!state || !section || !test || (skill !== 'listening' && skill !== 'reading')) return undefined
    return new Map(scoreObjective(skill, section, state.answers, test.module).results.map((r) => [r.n, r]))
  }, [state, section, test, skill])

  if (!attempt || !test || !state || !results) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="font-display text-3xl font-bold">{t.results.nothingToReview}</h1>
        <Link to="/dashboard" className="rounded-full bg-ink-950 px-5 py-2.5 font-semibold text-paper">
          {t.nav.dashboard}
        </Link>
      </div>
    )
  }

  const common = {
    testId: test.id,
    mode: 'practice' as const,
    candidate: attempt.candidate,
    state,
    update: noop,
    timer: { kind: 'none' as const },
    onSubmit: () => navigate(`/results/${attempt.id}`),
    settings,
    updateSettings,
    readOnly: true,
    results,
  }
  if (skill === 'reading' && test.reading) return <ReadingRunner section={test.reading} {...common} />
  if (skill === 'listening' && test.listening) return <ListeningRunner section={test.listening} {...common} />
  return null
}
