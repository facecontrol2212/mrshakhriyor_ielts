import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useBlocker, useNavigate, useParams } from 'react-router'
import { audioUrl, listeningAudio, soundCheckAudio } from '@/content/audio'
import { getTest } from '@/content/tests'
import { useI18n } from '@/i18n'
import { ListeningRunner } from '@/exam/listening/ListeningRunner'
import { getAudio, playPart } from '@/exam/listening/player'
import { ReadingRunner } from '@/exam/reading/ReadingRunner'
import { CandidateCheck, SectionIntro } from '@/exam/screens'
import { useExamSettings } from '@/exam/settings'
import { ExamButton, ExamDialog } from '@/exam/shell/primitives'
import type { TimerSpec } from '@/exam/shell/ExamFrame'
import { SpeakingRunner } from '@/exam/speaking/SpeakingRunner'
import type { SectionUpdater } from '@/exam/useExamApi'
import { WritingRunner } from '@/exam/writing/WritingRunner'
import { finishSection, newSectionState, sectionSeconds, startSection, updateSection } from '@/lib/attempts'
import { buildQuestionIndex, isAnswered } from '@/lib/questions'
import { getAttempt, saveAttempt } from '@/lib/storage'
import { countWords } from '@/lib/text'
import type { Attempt } from '@/types/attempt'
import type { Skill, TestDef } from '@/types/content'

const TITLES: Record<Skill, string> = { listening: 'Listening', reading: 'Reading', writing: 'Writing', speaking: 'Speaking' }

/** Unlocks audio on browsers (iOS Safari) that only allow playback inside a click handler. */
function primeAudio(skill: Skill, test: TestDef) {
  if (skill === 'listening' && test.listening) {
    const first = listeningAudio(test.id, test.listening.parts[0].id)
    if (first) void playPart(audioUrl(first.src), 0).catch(() => undefined)
  } else if (skill === 'speaking') {
    const check = soundCheckAudio()
    if (!check) return
    const audio = getAudio()
    audio.muted = true
    void playPart(audioUrl(check.src), 0)
      .then(() => audio.pause())
      .catch(() => undefined)
      .finally(() => (audio.muted = false))
  }
}

function unansweredCount(attempt: Attempt, test: TestDef, skill: Skill): string | null {
  const state = attempt.sections[skill]
  if (!state) return null
  if (skill === 'listening' || skill === 'reading') {
    const section = test[skill]
    if (!section) return null
    const refs = buildQuestionIndex(section.parts)
    const missing = refs.filter((r) => !isAnswered(state.answers, r)).length
    return missing ? `You have ${missing} unanswered question${missing === 1 ? '' : 's'}.` : null
  }
  if (skill === 'writing' && test.writing) {
    const short = test.writing.tasks.filter((t) => countWords(state.essays?.[t.id] ?? '') < t.minWords)
    return short.length ? `${short.map((t) => `Part ${t.number}`).join(' and ')} ${short.length === 1 ? 'is' : 'are'} below the minimum word count.` : null
  }
  return null
}

export function ExamPage() {
  const { attemptId = '' } = useParams()
  const navigate = useNavigate()
  const { t } = useI18n()
  const [attempt, setAttempt] = useState<Attempt | undefined>(() => getAttempt(attemptId))
  const [settings, updateSettings] = useExamSettings()
  const [confirmSubmit, setConfirmSubmit] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const test = attempt ? getTest(attempt.testId) : undefined

  // Persist every change, like the real test saves every answer.
  const latest = useRef(attempt)
  useLayoutEffect(() => {
    latest.current = attempt
  }, [attempt])
  useEffect(() => {
    if (!attempt) return
    const id = window.setTimeout(() => saveAttempt(attempt), 150)
    return () => window.clearTimeout(id)
  }, [attempt])
  useEffect(() => {
    const flush = () => latest.current && saveAttempt(latest.current)
    window.addEventListener('pagehide', flush)
    return () => {
      window.removeEventListener('pagehide', flush)
      flush()
    }
  }, [])

  const skill = attempt?.skills[attempt.current]
  const state = attempt && skill ? (attempt.sections[skill] ?? newSectionState()) : undefined
  const running = attempt?.status === 'in-progress' && (state?.phase === 'running' || state?.phase === 'checking')

  // Warn before leaving a running section (tab close or in-app navigation).
  useEffect(() => {
    if (!running) return
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [running])
  const blocker = useBlocker(({ nextLocation }) => Boolean(running) && !nextLocation.pathname.startsWith('/results'))

  const update: SectionUpdater = useCallback(
    (fn) => {
      if (!skill) return
      setAttempt((a) => (a ? updateSection(a, skill, fn) : a))
    },
    [skill],
  )

  const submit = useCallback(
    (reason: 'manual' | 'time') => {
      const current = latest.current
      if (!skill || !current || current.sections[skill]?.phase === 'done') return
      setConfirmSubmit(false)
      const next = finishSection(current, skill)
      latest.current = next
      setAttempt(next)
      saveAttempt(next)
      setNotice(reason === 'time' ? `Time is up. Your ${TITLES[skill]} answers have been submitted.` : `Your ${TITLES[skill]} answers have been submitted.`)
      if (next.status === 'completed') navigate(`/results/${next.id}`, { replace: true })
    },
    [skill, navigate],
  )

  const timer: TimerSpec = !attempt || !state?.startedAt
    ? { kind: 'none' }
    : attempt.mode === 'exam' && state.endsAt
      ? { kind: 'countdown', endsAt: state.endsAt }
      : { kind: 'elapsed', startedAt: state.startedAt }

  if (!attempt || !test || !skill || !state) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="font-display text-3xl font-bold">{t.exam.notFound}</h1>
        <p className="text-ink-600">{t.exam.notFoundText}</p>
        <Link to="/tests" className="rounded-full bg-ink-950 px-5 py-2.5 font-semibold text-paper">
          {t.exam.browse}
        </Link>
      </div>
    )
  }

  if (attempt.status === 'completed') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="font-display text-3xl font-bold">{t.exam.finished}</h1>
        <Link to={`/results/${attempt.id}`} className="rounded-full bg-ink-950 px-5 py-2.5 font-semibold text-paper">
          {t.exam.seeResults}
        </Link>
      </div>
    )
  }

  if (!attempt.confirmedAt) {
    return (
      <CandidateCheck
        attempt={attempt}
        test={test}
        settings={settings}
        onConfirm={(name) => setAttempt({ ...attempt, confirmedAt: Date.now(), candidate: { ...attempt.candidate, name } })}
      />
    )
  }

  const common = {
    testId: test.id,
    mode: attempt.mode,
    candidate: attempt.candidate,
    state,
    update,
    timer,
    onTimeUp: () => submit('time'),
    onSubmit: () => setConfirmSubmit(true),
    settings,
    updateSettings,
  }

  let body
  if (state.phase === 'intro') {
    const seconds = sectionSeconds(test, skill)
    body = (
      <SectionIntro
        key={skill}
        skill={skill}
        test={test}
        mode={attempt.mode}
        minutes={seconds ? Math.round(seconds / 60) : null}
        notice={notice}
        settings={settings}
        updateSettings={updateSettings}
        onStart={() => {
          primeAudio(skill, test)
          setNotice(null)
          setAttempt((a) => (a ? startSection(a, test, skill) : a))
        }}
      />
    )
  } else if (skill === 'reading' && test.reading) body = <ReadingRunner section={test.reading} {...common} />
  else if (skill === 'listening' && test.listening)
    body = (
      <ListeningRunner
        section={test.listening}
        {...common}
        onAudioComplete={() => {
          // If the recording ran late (slow connection), keep the full review time.
          const review = test.listening?.reviewSeconds ?? 120
          if (attempt.mode === 'exam') update((s) => ({ ...s, endsAt: Math.max(s.endsAt ?? 0, Date.now() + review * 1000) }))
        }}
      />
    )
  else if (skill === 'writing' && test.writing) body = <WritingRunner section={test.writing} {...common} />
  else if (skill === 'speaking' && test.speaking)
    body = <SpeakingRunner section={test.speaking} attemptId={attempt.id} {...common} timer={state.startedAt ? { kind: 'elapsed', startedAt: state.startedAt } : { kind: 'none' }} onSubmit={() => submit('manual')} />

  const warning = unansweredCount(attempt, test, skill)

  return (
    <>
      {body}
      {confirmSubmit && (
        <div className="exam" data-contrast={settings.contrast} data-text={settings.textSize}>
          <ExamDialog
            title={`Submit ${TITLES[skill]}?`}
            onClose={() => setConfirmSubmit(false)}
            footer={
              <>
                <ExamButton variant="secondary" onClick={() => setConfirmSubmit(false)}>
                  Return to test
                </ExamButton>
                <ExamButton onClick={() => submit('manual')}>Submit answers</ExamButton>
              </>
            }
          >
            {warning && <p className="mb-3 font-bold">{warning}</p>}
            <p>
              Once you submit, you cannot return to this section.
              {attempt.current < attempt.skills.length - 1 ? ` The ${TITLES[attempt.skills[attempt.current + 1]]} test comes next.` : ' Your results will be shown next.'}
            </p>
          </ExamDialog>
        </div>
      )}
      {blocker.state === 'blocked' && (
        <div className="exam" data-contrast={settings.contrast} data-text={settings.textSize}>
          <ExamDialog
            title="Leave the test?"
            onClose={() => blocker.reset()}
            footer={
              <>
                <ExamButton variant="secondary" onClick={() => blocker.reset()}>
                  Stay in the test
                </ExamButton>
                <ExamButton onClick={() => blocker.proceed()}>Leave</ExamButton>
              </>
            }
          >
            <p>Your answers are saved on this device. {attempt.mode === 'exam' ? 'The clock keeps running while you are away, just as in the real exam.' : 'You can come back and continue later.'}</p>
          </ExamDialog>
        </div>
      )}
    </>
  )
}
