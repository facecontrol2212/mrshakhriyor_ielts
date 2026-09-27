import { Check, Eye, EyeOff, Mic, RotateCcw, SkipForward } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { audioUrl, speakingAudio } from '@/content/audio'
import { putRecording } from '@/lib/recordings'
import type { RecordingMeta } from '@/types/attempt'
import type { SpeakingPrompt, SpeakingSection } from '@/types/content'
import { getAudio, playPart } from '../listening/player'
import type { RunnerProps } from '../reading/ReadingRunner'
import { ExamFrame } from '../shell/ExamFrame'
import { ExamButton } from '../shell/primitives'
import { formatClock, useNow } from '../shell/time'
import { createLevelMeter, currentMicStream, getMicStream, recorderMimeType, releaseMic } from './mic'
import { buildSpeakingSteps, stepPart } from './steps'

type Phase = 'examiner' | 'answer' | 'prep' | 'talk' | 'waiting' | 'blocked' | 'done'

/** Plays an examiner prompt; falls back to the browser's own voice if no recording exists. */
function speakPrompt(testId: string, prompt: SpeakingPrompt): Promise<void> {
  const entry = speakingAudio(testId, prompt.id)
  if (entry) {
    return new Promise((resolve, reject) => {
      const audio = getAudio()
      const done = () => {
        audio.removeEventListener('ended', done)
        resolve()
      }
      audio.addEventListener('ended', done)
      playPart(audioUrl(entry.src), 0).catch((e) => {
        audio.removeEventListener('ended', done)
        reject(e)
      })
    })
  }
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) return resolve()
    const u = new SpeechSynthesisUtterance(prompt.say ?? prompt.text)
    u.lang = 'en-GB'
    u.rate = 0.95
    u.onend = () => resolve()
    u.onerror = () => resolve()
    window.speechSynthesis.speak(u)
  })
}

function LevelMeter() {
  const bar = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const stream = currentMicStream()
    if (!stream) return
    const meter = createLevelMeter(stream)
    let frame = 0
    const loop = () => {
      if (bar.current) bar.current.style.transform = `scaleX(${Math.max(0.03, meter.read())})`
      frame = requestAnimationFrame(loop)
    }
    loop()
    return () => {
      cancelAnimationFrame(frame)
      meter.close()
    }
  }, [])
  return (
    <div className="h-2 w-40 overflow-hidden rounded-full" style={{ background: 'var(--ex-panel-2)' }} aria-hidden>
      <div ref={bar} className="h-full origin-left rounded-full transition-transform duration-75" style={{ background: '#16a34a', transform: 'scaleX(0.03)' }} />
    </div>
  )
}

interface ActiveRecording {
  rec: MediaRecorder
  started: number
}

export function SpeakingRunner({ section, testId, attemptId, ...props }: RunnerProps & { section: SpeakingSection; attemptId: string }) {
  const steps = useMemo(() => buildSpeakingSteps(section), [section])
  const totalQuestions = steps.filter((s) => (s.kind === 'prompt' && s.prompt.answerSeconds > 0) || s.kind === 'talk').length
  const [index, setIndex] = useState(() => Math.min(props.state.speakingStep ?? 0, steps.length - 1))
  // After a reload the microphone must be re-opened with a click.
  const [phase, setPhase] = useState<Phase>(() => (currentMicStream() ? 'waiting' : 'blocked'))
  const [deadline, setDeadline] = useState<number | null>(null)
  const [showText, setShowText] = useState(props.mode === 'practice')
  const [repeats, setRepeats] = useState(0)
  const [micError, setMicError] = useState<string | null>(null)
  const recorder = useRef<ActiveRecording | null>(null)
  const cancelSpeech = useRef<() => void>(() => undefined)
  const now = useNow(250)
  const { update, onSubmit } = props
  const practice = props.mode === 'practice'
  const step = steps[index]

  const startRecording = useCallback(
    (promptId: string, part: 1 | 2 | 3, question: string) => {
      const stream = currentMicStream()
      if (!stream || typeof MediaRecorder === 'undefined') return
      const mimeType = recorderMimeType()
      const rec = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      const chunks: Blob[] = []
      const started = Date.now()
      rec.ondataavailable = (e) => {
        if (e.data.size) chunks.push(e.data)
      }
      rec.onstop = () => {
        const blob = new Blob(chunks, { type: rec.mimeType || 'audio/webm' })
        const key = `${attemptId}/${promptId}`
        const meta: RecordingMeta = { key, promptId, part, question, durationMs: Date.now() - started, mimeType: blob.type }
        void putRecording(key, blob).then(() =>
          update((s) => ({ ...s, recordings: [...(s.recordings ?? []).filter((r) => r.promptId !== promptId), meta] })),
        )
      }
      rec.start(1000)
      recorder.current = { rec, started }
    },
    [attemptId, update],
  )

  const stopRecording = useCallback(() => {
    const current = recorder.current
    if (current && current.rec.state !== 'inactive') current.rec.stop()
    recorder.current = null
  }, [])

  /** Start step `i`: the examiner speaks, then the candidate's answer is recorded. */
  const runStep = useRef<(i: number) => void>(() => undefined)
  const advance = useCallback(
    (next: number) => {
      cancelSpeech.current()
      stopRecording()
      setDeadline(null)
      setRepeats(0)
      setIndex(next)
      update((s) => ({ ...s, speakingStep: next }))
      runStep.current(next)
    },
    [stopRecording, update],
  )

  useEffect(() => {
    runStep.current = (i: number) => {
      const s = steps[i]
      if (s.kind === 'end') {
        setPhase('done')
        releaseMic()
        onSubmit?.()
        return
      }
      if (s.kind === 'prep') {
        setPhase('prep')
        setDeadline(Date.now() + section.part2.prepSeconds * 1000)
        return
      }
      if (s.kind === 'talk') {
        setPhase('talk')
        setDeadline(Date.now() + section.part2.talkSeconds * 1000)
        startRecording('p2-talk', 2, section.part2.cueCard.topic)
        return
      }
      let cancelled = false
      cancelSpeech.current = () => {
        cancelled = true
      }
      setPhase('examiner')
      speakPrompt(testId, s.prompt)
        .then(() => {
          if (cancelled) return
          if (s.prompt.answerSeconds > 0) {
            setPhase('answer')
            setDeadline(Date.now() + s.prompt.answerSeconds * (practice ? 2 : 1) * 1000)
            startRecording(s.prompt.id, s.part, s.prompt.text)
          } else {
            window.setTimeout(() => !cancelled && advance(i + 1), 700)
          }
        })
        .catch(() => {
          if (!cancelled) setPhase('blocked')
        })
    }
  })

  // Begin (or continue after a reload) once the component is on screen.
  useEffect(() => {
    if (!currentMicStream()) return
    const id = window.setTimeout(() => runStep.current(index), 0)
    return () => {
      window.clearTimeout(id)
      cancelSpeech.current()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Time limits: the examiner moves on when the answer or preparation time is up.
  const latest = useRef({ index, phase })
  useEffect(() => {
    latest.current = { index, phase }
  })
  useEffect(() => {
    if (deadline === null) return
    const id = window.setTimeout(() => {
      const { index: i, phase: p } = latest.current
      if (p === 'answer' || p === 'talk' || p === 'prep') advance(i + 1)
    }, Math.max(0, deadline - Date.now()))
    return () => window.clearTimeout(id)
  }, [deadline, advance])

  // Leaving mid-answer keeps what was said so far.
  useEffect(() => () => stopRecording(), [stopRecording])

  const repeat = () => {
    if (step.kind !== 'prompt') return
    const current = recorder.current
    current?.rec.pause()
    setRepeats((r) => r + 1)
    const remaining = deadline ? deadline - Date.now() : 0
    setDeadline(null)
    setPhase('examiner')
    speakPrompt(testId, step.prompt).finally(() => {
      current?.rec.resume()
      setPhase('answer')
      setDeadline(Date.now() + Math.max(remaining, 5000))
    })
  }

  const resumeAfterBlock = async () => {
    try {
      await getMicStream()
      setMicError(null)
      runStep.current(index)
    } catch {
      setMicError('Microphone access is needed for the speaking test. Please allow it in your browser settings.')
    }
  }

  const part = stepPart(step)
  const answering = phase === 'answer' || phase === 'talk'
  const remaining = deadline ? Math.max(0, deadline - now) : 0
  const questionNumber = steps.slice(0, index + 1).filter((s) => (s.kind === 'prompt' && s.prompt.answerSeconds > 0) || s.kind === 'talk').length
  const showCueCard = part === 2 && (step.kind !== 'prompt' || step.prompt.id !== section.part2.followUp?.id)

  return (
    <ExamFrame skill="speaking" candidate={props.candidate} mode={props.mode} timer={props.timer} settings={props.settings} updateSettings={props.updateSettings}>
      <div className="exam-scroll h-full">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-8 text-center">
          <ol className="mb-8 flex gap-2 text-[13px]" aria-label="Speaking test progress">
            {[1, 2, 3].map((p) => (
              <li
                key={p}
                aria-current={p === part ? 'step' : undefined}
                className="rounded-full border px-3 py-1 font-bold"
                style={{
                  borderColor: p === part ? 'var(--ex-accent)' : 'var(--ex-border)',
                  background: p === part ? 'var(--ex-accent)' : 'transparent',
                  color: p === part ? 'var(--ex-accent-fg)' : 'var(--ex-muted)',
                }}
              >
                Part {p}
              </li>
            ))}
          </ol>

          <div
            className="mb-4 flex h-24 w-24 items-center justify-center rounded-full text-[2em] font-black"
            style={{
              background: 'var(--ex-panel-2)',
              boxShadow: phase === 'examiner' ? '0 0 0 6px var(--ex-accent)' : '0 0 0 1px var(--ex-border)',
              transition: 'box-shadow .3s',
            }}
            aria-hidden
          >
            {section.examiner.name[0]}
          </div>
          <p className="mb-1 font-bold">{section.examiner.name} · Examiner</p>
          <p className="mb-6 text-[0.9em]" style={{ color: 'var(--ex-muted)' }}>
            {step.kind === 'prompt' ? step.label : 'Long turn'} · Question {Math.max(1, Math.min(questionNumber, totalQuestions))} of {totalQuestions}
          </p>

          <div className="mb-6 min-h-[3.5em] max-w-xl" aria-live="polite">
            {phase === 'examiner' && <p className="font-semibold">The examiner is speaking…</p>}
            {step.kind === 'prompt' && showText && <p className="mt-2 text-[1.1em]">“{step.prompt.text}”</p>}
            {phase === 'prep' && (
              <p className="text-[1.1em] font-bold">
                Preparation time: <span className="tabular-nums">{formatClock(remaining)}</span>
              </p>
            )}
          </div>

          {showCueCard && (
            <div className="mb-6 w-full max-w-xl rounded border-2 p-5 text-left" style={{ borderColor: 'var(--ex-fg)' }}>
              <p className="mb-2 font-bold">{section.part2.cueCard.topic}</p>
              <p className="mb-1">{section.part2.cueCard.intro}</p>
              <ul className="mb-2 list-disc pl-6">
                {section.part2.cueCard.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <p>{section.part2.cueCard.closing}</p>
            </div>
          )}
          {(step.kind === 'prep' || step.kind === 'talk') && (
            <label className="mb-6 block w-full max-w-xl text-left">
              <span className="mb-1 block text-[0.9em] font-bold">Your notes</span>
              <textarea
                value={props.state.notes ?? ''}
                onChange={(e) => update((s) => ({ ...s, notes: e.target.value }))}
                spellCheck={false}
                rows={4}
                className="exam-input w-full resize-none p-2"
                placeholder="Write key words to help you speak…"
              />
            </label>
          )}

          {answering && (
            <div className="mb-6 flex flex-col items-center gap-3">
              <div className="flex items-center gap-3 rounded-full border px-4 py-2" style={{ borderColor: '#dc2626' }}>
                <span className="rec-dot h-3 w-3 rounded-full bg-red-600" aria-hidden />
                <span className="font-bold">Recording</span>
                <span className="tabular-nums">{formatClock(remaining)}</span>
                <LevelMeter />
              </div>
              {phase === 'talk' && <p className="text-[0.9em]">Speak for one to two minutes. The examiner will stop you when the time is up.</p>}
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-2">
            {step.kind === 'prompt' && phase === 'answer' && (practice || repeats === 0) && (
              <ExamButton variant="secondary" onClick={repeat}>
                <RotateCcw size={16} /> Could you repeat that?
              </ExamButton>
            )}
            {answering && (
              <ExamButton onClick={() => advance(index + 1)}>
                {phase === 'talk' ? <Check size={16} /> : <SkipForward size={16} />}
                {phase === 'talk' ? 'I have finished' : 'Next question'}
              </ExamButton>
            )}
            {phase === 'prep' && (
              <ExamButton onClick={() => advance(index + 1)}>
                <Mic size={16} /> I am ready to speak
              </ExamButton>
            )}
            <ExamButton variant="secondary" onClick={() => setShowText((v) => !v)}>
              {showText ? <EyeOff size={16} /> : <Eye size={16} />}
              {showText ? 'Hide question text' : 'Show question text'}
            </ExamButton>
          </div>
        </div>
      </div>

      {phase === 'blocked' && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center bg-black/60 p-6 text-center">
          <div className="max-w-md rounded border p-6" style={{ background: 'var(--ex-bg)', borderColor: 'var(--ex-strong-border)' }}>
            <p className="mb-2 text-[1.1em] font-bold">Continue your speaking test</p>
            <p className="mb-5">Your browser needs your permission to use the microphone and play the examiner's voice.</p>
            {micError && (
              <p className="mb-4 font-bold" style={{ color: 'var(--ex-wrong)' }}>
                {micError}
              </p>
            )}
            <ExamButton onClick={resumeAfterBlock}>
              <Mic size={16} /> Continue
            </ExamButton>
          </div>
        </div>
      )}
    </ExamFrame>
  )
}
