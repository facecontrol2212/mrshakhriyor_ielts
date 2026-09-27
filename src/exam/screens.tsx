import { Headphones, Mic, Play, Square, UserCheck } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { audioUrl, soundCheckAudio } from '@/content/audio'
import type { Attempt, ExamMode } from '@/types/attempt'
import type { Skill, TestDef } from '@/types/content'
import { getAudio, playPart, stopAudio } from './listening/player'
import type { ExamSettings } from './settings'
import { ExamButton } from './shell/primitives'
import { createLevelMeter, getMicStream, recorderMimeType } from './speaking/mic'

function Screen({ children, settings }: { children: ReactNode; settings: ExamSettings }) {
  return (
    <div className="exam fixed inset-0 overflow-y-auto" data-text={settings.textSize} data-contrast={settings.contrast}>
      <div className="mx-auto flex min-h-full max-w-2xl flex-col justify-center px-4 py-10">{children}</div>
    </div>
  )
}

function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="rounded border p-6 sm:p-8" style={{ borderColor: 'var(--ex-strong-border)', background: 'var(--ex-bg)' }}>
      {children}
    </div>
  )
}

export function CandidateCheck({ attempt, test, settings, onConfirm }: { attempt: Attempt; test: TestDef; settings: ExamSettings; onConfirm: (name: string) => void }) {
  const [name, setName] = useState(attempt.candidate.name)
  const [editing, setEditing] = useState(false)
  const rows: [string, ReactNode][] = [
    [
      'Name',
      editing ? (
        <input autoFocus value={name} onChange={(e) => setName(e.target.value)} className="exam-input w-full" aria-label="Your name" />
      ) : (
        name
      ),
    ],
    ['Candidate number', attempt.candidate.number],
    ['Test', `${test.title} (${test.module === 'academic' ? 'Academic' : 'General Training'})`],
    ['Sections', attempt.skills.map((s) => s[0].toUpperCase() + s.slice(1)).join(', ')],
    ['Conditions', attempt.mode === 'exam' ? 'Exam conditions — timed, audio plays once' : 'Practice mode — untimed, audio can be paused'],
    ['Date', new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })],
  ]
  return (
    <Screen settings={settings}>
      <Panel>
        <div className="mb-5 flex items-center gap-3">
          <UserCheck size={28} aria-hidden />
          <h1 className="text-[1.4em] font-bold">Confirm your details</h1>
        </div>
        <p className="mb-5">Please check that the details below are correct before your test begins.</p>
        <dl className="mb-6 divide-y rounded border" style={{ borderColor: 'var(--ex-border)' }}>
          {rows.map(([label, value]) => (
            <div key={label} className="grid grid-cols-[10em_1fr] gap-3 px-4 py-2.5" style={{ borderColor: 'var(--ex-border)' }}>
              <dt className="font-bold">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-wrap justify-end gap-2">
          {!editing && (
            <ExamButton variant="secondary" onClick={() => setEditing(true)}>
              Change my name
            </ExamButton>
          )}
          <ExamButton onClick={() => onConfirm(name.trim() || attempt.candidate.name)}>My details are correct</ExamButton>
        </div>
      </Panel>
    </Screen>
  )
}

function SoundCheck({ settings, updateSettings, onDone }: { settings: ExamSettings; updateSettings: (p: Partial<ExamSettings>) => void; onDone: () => void }) {
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    getAudio().volume = settings.volume
  }, [settings.volume])
  useEffect(() => {
    const audio = getAudio()
    const onEnd = () => setPlaying(false)
    audio.addEventListener('ended', onEnd)
    return () => audio.removeEventListener('ended', onEnd)
  }, [])
  const play = () => {
    const entry = soundCheckAudio()
    if (!entry) return
    if (playing) {
      stopAudio()
      setPlaying(false)
      return
    }
    setPlaying(true)
    playPart(audioUrl(entry.src), 0).catch(() => setPlaying(false))
  }
  return (
    <Panel>
      <div className="mb-4 flex items-center gap-3">
        <Headphones size={28} aria-hidden />
        <h1 className="text-[1.4em] font-bold">Sound check</h1>
      </div>
      <p className="mb-2">Put on your headphones and click <strong>Play sound</strong>.</p>
      <p className="mb-6">If you cannot hear the sound clearly, adjust the volume. You can also change the volume during the test.</p>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <ExamButton variant="secondary" onClick={play}>
          {playing ? <Square size={16} /> : <Play size={16} />}
          {playing ? 'Stop' : 'Play sound'}
        </ExamButton>
        <label className="flex flex-1 items-center gap-3">
          <span className="font-bold">Volume</span>
          <input type="range" min={0} max={1} step={0.05} value={settings.volume} onChange={(e) => updateSettings({ volume: Number(e.target.value) })} className="flex-1" style={{ accentColor: 'var(--ex-accent)' }} />
        </label>
      </div>
      <div className="flex justify-end">
        <ExamButton
          onClick={() => {
            stopAudio()
            onDone()
          }}
        >
          Continue
        </ExamButton>
      </div>
    </Panel>
  )
}

function MicCheck({ onDone }: { onDone: () => void }) {
  const [status, setStatus] = useState<'idle' | 'ready' | 'recording' | 'recorded' | 'error'>('idle')
  const [error, setError] = useState('')
  const [sample, setSample] = useState<string | null>(null)
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'idle' || status === 'error') return
    let frame = 0
    let meter: ReturnType<typeof createLevelMeter> | null = null
    getMicStream().then((stream) => {
      meter = createLevelMeter(stream)
      const loop = () => {
        if (bar.current && meter) bar.current.style.transform = `scaleX(${Math.max(0.03, meter.read())})`
        frame = requestAnimationFrame(loop)
      }
      loop()
    })
    return () => {
      cancelAnimationFrame(frame)
      meter?.close()
    }
  }, [status])

  useEffect(() => () => void (sample && URL.revokeObjectURL(sample)), [sample])

  const allow = async () => {
    try {
      await getMicStream()
      setStatus('ready')
    } catch {
      setStatus('error')
      setError('We could not use your microphone. Allow microphone access in your browser (look for the camera/microphone icon in the address bar) and try again.')
    }
  }

  const recordSample = async () => {
    const stream = await getMicStream()
    const mimeType = recorderMimeType()
    const rec = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
    const chunks: Blob[] = []
    rec.ondataavailable = (e) => chunks.push(e.data)
    rec.onstop = () => {
      setSample(URL.createObjectURL(new Blob(chunks, { type: rec.mimeType })))
      setStatus('recorded')
    }
    setStatus('recording')
    rec.start()
    window.setTimeout(() => rec.state !== 'inactive' && rec.stop(), 4000)
  }

  return (
    <Panel>
      <div className="mb-4 flex items-center gap-3">
        <Mic size={28} aria-hidden />
        <h1 className="text-[1.4em] font-bold">Microphone check</h1>
      </div>
      <p className="mb-2">The speaking test is recorded so you can listen to your answers afterwards. Recordings stay on this device.</p>
      <p className="mb-6">Use headphones if you can, and find a quiet place.</p>
      {status === 'idle' || status === 'error' ? (
        <>
          {error && (
            <p className="mb-4 font-bold" style={{ color: 'var(--ex-wrong)' }}>
              {error}
            </p>
          )}
          <ExamButton onClick={allow}>
            <Mic size={16} /> Allow microphone
          </ExamButton>
        </>
      ) : (
        <>
          <div className="mb-2 font-bold">Input level — say a few words</div>
          <div className="mb-6 h-3 w-full overflow-hidden rounded-full" style={{ background: 'var(--ex-panel-2)' }}>
            <div ref={bar} className="h-full origin-left rounded-full" style={{ background: '#16a34a', transform: 'scaleX(0.03)' }} />
          </div>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <ExamButton variant="secondary" onClick={recordSample} disabled={status === 'recording'}>
              {status === 'recording' ? 'Recording… (4 s)' : 'Record a test sample'}
            </ExamButton>
            {sample && <audio controls src={sample} className="h-10" />}
          </div>
          <div className="flex justify-end">
            <ExamButton onClick={onDone}>Continue</ExamButton>
          </div>
        </>
      )}
    </Panel>
  )
}

const INFO: Record<Skill, { time: (test: TestDef, minutes: number | null) => string; instructions: string[]; information: (test: TestDef) => string[] }> = {
  listening: {
    time: (_t, m) => `Approximately ${m ?? 30} minutes`,
    instructions: ['Answer all the questions.', 'You can change your answers at any time during the test.'],
    information: (t) => [
      `There are ${countQuestions(t, 'listening')} questions in this test.`,
      'Each question carries one mark.',
      `There are ${t.listening?.parts.length ?? 4} parts to the test.`,
      'Please note you will only hear each part once.',
      'For each part of the test there will be time for you to look through the questions and time for you to check your answers.',
    ],
  },
  reading: {
    time: (t) => (t.reading && t.reading.durationMinutes === 60 ? '1 hour' : `${t.reading?.durationMinutes ?? 60} minutes`),
    instructions: ['Answer all the questions.', 'You can change your answers at any time during the test.'],
    information: (t) => [
      `There are ${countQuestions(t, 'reading')} questions in this test.`,
      'Each question carries one mark.',
      `There ${t.reading?.parts.length === 1 ? 'is one part' : `are ${t.reading?.parts.length ?? 3} parts`} to the test.`,
      'The test clock will show you when there are 10 minutes and 5 minutes remaining.',
    ],
  },
  writing: {
    time: () => '1 hour',
    instructions: ['Answer both parts.', 'You can change your answers at any time during the test.'],
    information: () => [
      'There are two parts in this test.',
      'Part 2 contributes twice as much as Part 1 to the writing score.',
      'The test clock will show you when there are 10 minutes and 5 minutes remaining.',
    ],
  },
  speaking: {
    time: () => '11–14 minutes',
    instructions: ['Listen to the examiner and answer each question as fully as you can.', 'Your answers are recorded automatically.'],
    information: () => [
      'Part 1 (4–5 minutes): questions about yourself and familiar topics.',
      'Part 2 (3–4 minutes): one minute to prepare, then speak for up to two minutes on a topic.',
      'Part 3 (4–5 minutes): a discussion of more general questions linked to Part 2.',
    ],
  },
}

function countQuestions(test: TestDef, skill: 'listening' | 'reading'): number {
  const section = test[skill]
  if (!section) return 40
  return Math.max(...section.parts.flatMap((p) => p.groups.map((g) => g.to))) - Math.min(...section.parts.flatMap((p) => p.groups.map((g) => g.from))) + 1
}

const TITLES: Record<Skill, string> = { listening: 'Listening', reading: 'Reading', writing: 'Writing', speaking: 'Speaking' }

export function SectionIntro({
  skill,
  test,
  mode,
  minutes,
  notice,
  settings,
  updateSettings,
  onStart,
}: {
  skill: Skill
  test: TestDef
  mode: ExamMode
  minutes: number | null
  notice?: string | null
  settings: ExamSettings
  updateSettings: (p: Partial<ExamSettings>) => void
  onStart: () => void
}) {
  const [step, setStep] = useState<'check' | 'info'>(skill === 'listening' || skill === 'speaking' ? 'check' : 'info')
  const info = INFO[skill]
  return (
    <Screen settings={settings}>
      {notice && (
        <p className="mb-4 rounded border-2 px-4 py-3 font-bold" style={{ borderColor: 'var(--ex-correct)' }} role="status">
          {notice}
        </p>
      )}
      {step === 'check' && skill === 'listening' && <SoundCheck settings={settings} updateSettings={updateSettings} onDone={() => setStep('info')} />}
      {step === 'check' && skill === 'speaking' && <MicCheck onDone={() => setStep('info')} />}
      {step === 'info' && (
        <Panel>
          <p className="mb-1 text-[0.9em] font-bold tracking-wide uppercase" style={{ color: 'var(--ex-muted)' }}>
            {test.title} · {test.module === 'academic' ? 'Academic' : 'General Training'}
          </p>
          <h1 className="mb-1 text-[1.6em] font-bold">{TITLES[skill]}</h1>
          <p className="mb-6">
            <strong>Time:</strong> {mode === 'practice' && skill !== 'speaking' ? 'untimed (practice mode)' : info.time(test, minutes)}
          </p>
          <h2 className="mb-2 font-bold tracking-wide uppercase">Instructions to candidates</h2>
          <ul className="mb-5 list-disc space-y-1 pl-6">
            {info.instructions.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <h2 className="mb-2 font-bold tracking-wide uppercase">Information for candidates</h2>
          <ul className="mb-6 list-disc space-y-1 pl-6">
            {info.information(test).map((line) => (
              <li key={line}>{line}</li>
            ))}
            {mode === 'practice' && skill === 'listening' && <li>Practice mode: you can pause, rewind and replay the recording.</li>}
          </ul>
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.9em]" style={{ color: 'var(--ex-muted)' }}>
              {mode === 'exam' ? 'The clock starts when you press Start test.' : 'Take your time — nothing is timed in practice mode.'}
            </p>
            <ExamButton onClick={onStart}>Start test</ExamButton>
          </div>
        </Panel>
      )}
    </Screen>
  )
}
