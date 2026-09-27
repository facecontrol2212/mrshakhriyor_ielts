import { Clock, EyeOff, HelpCircle, Settings, Volume1, Volume2, VolumeX } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { site } from '@/site.config'
import type { Candidate, ExamMode } from '@/types/attempt'
import type { Skill } from '@/types/content'
import type { Contrast, ExamSettings, TextSize } from '../settings'
import { ExamButton, ExamDialog, Toast } from './primitives'
import { formatClock, useNow } from './time'

export type TimerSpec = { kind: 'countdown'; endsAt: number } | { kind: 'elapsed'; startedAt: number } | { kind: 'none' }

const SKILL_TITLE: Record<Skill, string> = {
  listening: 'Listening',
  reading: 'Reading',
  writing: 'Writing',
  speaking: 'Speaking',
}

function TimerDisplay({ timer, mode, onTimeUp, onWarning }: { timer: TimerSpec; mode: ExamMode; onTimeUp?: () => void; onWarning: (m: string) => void }) {
  const now = useNow(500)
  const fired = useRef(false)
  const lastRemaining = useRef<number | null>(null)
  const remaining = timer.kind === 'countdown' ? timer.endsAt - now : 0

  useEffect(() => {
    if (timer.kind !== 'countdown') return
    const prev = lastRemaining.current
    lastRemaining.current = remaining
    if (prev !== null) {
      for (const minutes of [10, 5, 1]) {
        const t = minutes * 60_000
        if (prev > t && remaining <= t) onWarning(minutes === 1 ? '1 minute remaining' : `${minutes} minutes remaining`)
      }
    }
    if (remaining <= 0 && !fired.current) {
      fired.current = true
      onTimeUp?.()
    }
  }, [remaining, timer.kind, onTimeUp, onWarning])

  if (timer.kind === 'none') return null
  if (timer.kind === 'elapsed')
    return (
      <div className="flex items-center gap-2 font-bold" aria-label="Time elapsed">
        <Clock size={18} aria-hidden />
        <span className="tabular-nums">{formatClock(now - timer.startedAt)}</span>
        <span className="hidden text-[0.85em] font-normal sm:inline" style={{ color: 'var(--ex-muted)' }}>
          elapsed{mode === 'practice' ? ' · practice mode' : ''}
        </span>
      </div>
    )

  const critical = remaining <= 5 * 60_000
  const warning = remaining <= 10 * 60_000
  return (
    <div
      className="flex items-center gap-2 rounded px-2.5 py-1 font-bold"
      role="timer"
      aria-label={`${Math.ceil(remaining / 60_000)} minutes left`}
      style={{
        color: critical ? '#fff' : warning ? '#92400e' : 'var(--ex-fg)',
        background: critical ? '#b91c1c' : warning ? '#fde68a' : 'transparent',
      }}
    >
      <Clock size={18} aria-hidden />
      <span className="text-[1.05em] tabular-nums">{formatClock(remaining)}</span>
      <span className="hidden text-[0.85em] font-normal sm:inline">left</span>
    </div>
  )
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex items-center gap-1.5 rounded px-2 py-1.5 text-[13px] font-semibold hover:bg-[var(--ex-panel-2)]"
    >
      {children}
      <span className="hidden md:inline">{label}</span>
    </button>
  )
}

function SettingsDialog({ settings, update, onClose, showVolume }: { settings: ExamSettings; update: (p: Partial<ExamSettings>) => void; onClose: () => void; showVolume?: boolean }) {
  const sizes: [TextSize, string][] = [
    ['standard', 'Standard'],
    ['large', 'Large'],
    ['xlarge', 'Extra large'],
  ]
  const contrasts: [Contrast, string, string, string][] = [
    ['black-on-white', 'Black on white', '#fff', '#111'],
    ['white-on-black', 'White on black', '#000', '#fff'],
    ['yellow-on-black', 'Yellow on black', '#000', '#ff0'],
  ]
  return (
    <ExamDialog title="Settings" onClose={onClose} footer={<ExamButton onClick={onClose}>Done</ExamButton>}>
      <fieldset className="mb-5">
        <legend className="mb-2 font-bold">Text size</legend>
        <div className="flex flex-wrap gap-2">
          {sizes.map(([value, label]) => (
            <label key={value} className="flex cursor-pointer items-center gap-2 rounded border px-3 py-2" style={{ borderColor: settings.textSize === value ? 'var(--ex-accent)' : 'var(--ex-border)' }}>
              <input type="radio" name="text-size" checked={settings.textSize === value} onChange={() => update({ textSize: value })} style={{ accentColor: 'var(--ex-accent)' }} />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="mb-5">
        <legend className="mb-2 font-bold">Colour</legend>
        <div className="flex flex-wrap gap-2">
          {contrasts.map(([value, label, bg, fg]) => (
            <label key={value} className="flex cursor-pointer items-center gap-2 rounded border px-3 py-2" style={{ borderColor: settings.contrast === value ? 'var(--ex-accent)' : 'var(--ex-border)' }}>
              <input type="radio" name="contrast" checked={settings.contrast === value} onChange={() => update({ contrast: value })} style={{ accentColor: 'var(--ex-accent)' }} />
              <span className="rounded px-2 py-0.5 text-[13px] font-bold" style={{ background: bg, color: fg, border: '1px solid #888' }}>
                Aa
              </span>
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      {showVolume && (
        <fieldset>
          <legend className="mb-2 font-bold">Volume</legend>
          <input type="range" min={0} max={1} step={0.05} value={settings.volume} onChange={(e) => update({ volume: Number(e.target.value) })} className="w-full" style={{ accentColor: 'var(--ex-accent)' }} />
        </fieldset>
      )}
    </ExamDialog>
  )
}

const HELP: Record<Skill, string[]> = {
  listening: [
    'The recording plays once only. You cannot pause or replay it — just like the real test.',
    'Answer the questions as you listen. When the recording ends you have 2 minutes to check your answers.',
    'Use the numbers at the bottom of the screen to move between questions and parts. Answered questions are shaded.',
    'Tick "Review" to flag a question you want to come back to.',
  ],
  reading: [
    'The passage is on the left and the questions are on the right. Drag the divider to resize them.',
    'Select any text to highlight it or add a note. Right-click a highlight to clear it.',
    'For matching tasks, drag an option into a gap — or tap the option and then tap the gap.',
    'Use the numbers at the bottom of the screen to move between questions. Tick "Review" to flag a question.',
    'You will see a warning when 10 minutes and 5 minutes remain. Your answers are submitted automatically when time runs out.',
  ],
  writing: [
    'Use the Part 1 and Part 2 buttons at the bottom to switch between the two tasks. You can move between them at any time.',
    'The word count below the answer box updates as you type. Spell-check is switched off, as in the real test.',
    'Task 2 is worth twice as much as Task 1. Aim for about 20 minutes on Task 1 and 40 minutes on Task 2.',
  ],
  speaking: [
    'The examiner asks each question aloud; your answer is recorded automatically after the question.',
    'Press "Next question" when you have finished answering, or wait for the examiner to move on.',
    'In Part 2 you have one minute to prepare, then speak for up to two minutes.',
  ],
}

export interface ExamFrameProps {
  skill: Skill
  candidate: Candidate
  mode: ExamMode
  timer: TimerSpec
  onTimeUp?: () => void
  settings: ExamSettings
  updateSettings: (patch: Partial<ExamSettings>) => void
  showVolume?: boolean
  /** Answer review: no clock, marking shown. */
  readOnly?: boolean
  nav?: ReactNode
  children: ReactNode
}

/** The full-screen test window: header with candidate details and clock, content, navigation bar. */
export function ExamFrame({ skill, candidate, mode, timer, onTimeUp, settings, updateSettings, showVolume, readOnly, nav, children }: ExamFrameProps) {
  const [dialog, setDialog] = useState<'settings' | 'help' | null>(null)
  const [hidden, setHidden] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const VolumeIcon = settings.volume === 0 ? VolumeX : settings.volume < 0.5 ? Volume1 : Volume2

  return (
    <div className="exam fixed inset-0 flex flex-col" data-text={settings.textSize} data-contrast={settings.contrast}>
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b px-3 sm:px-4" style={{ borderColor: 'var(--ex-strong-border)', background: 'var(--ex-bg)' }}>
        <div className="flex min-w-0 items-center gap-3">
          <span className="rounded-[3px] px-1.5 py-0.5 text-[12px] font-black tracking-wide" style={{ background: 'var(--ex-fg)', color: 'var(--ex-bg)' }}>
            {site.shortName}
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-[13px] font-bold">{candidate.name}</p>
            <p className="truncate text-[12px]" style={{ color: 'var(--ex-muted)' }}>
              {SKILL_TITLE[skill]} · Candidate {candidate.number}
              {readOnly ? ' · Answer review' : mode === 'practice' ? ' · Practice' : ''}
            </p>
          </div>
        </div>
        <TimerDisplay timer={timer} mode={mode} onTimeUp={onTimeUp} onWarning={setToast} />
        <div className="flex items-center gap-0.5">
          {showVolume && (
            <label className="hidden items-center gap-1.5 rounded px-2 py-1.5 sm:flex" title="Volume">
              <VolumeIcon size={18} aria-hidden />
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={settings.volume}
                aria-label="Volume"
                onChange={(e) => updateSettings({ volume: Number(e.target.value) })}
                className="w-20"
                style={{ accentColor: 'var(--ex-accent)' }}
              />
            </label>
          )}
          <IconButton label="Settings" onClick={() => setDialog('settings')}>
            <Settings size={18} aria-hidden />
          </IconButton>
          <IconButton label="Help" onClick={() => setDialog('help')}>
            <HelpCircle size={18} aria-hidden />
          </IconButton>
          <IconButton label="Hide" onClick={() => setHidden(true)}>
            <EyeOff size={18} aria-hidden />
          </IconButton>
        </div>
      </header>

      <main className="relative min-h-0 flex-1">{children}</main>

      {nav}

      {hidden && (
        <div className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-4" style={{ background: 'var(--ex-panel)' }}>
          <EyeOff size={40} aria-hidden />
          <p className="text-[1.1em] font-bold">Your screen is hidden. The clock is still running.</p>
          <ExamButton onClick={() => setHidden(false)}>Show my test</ExamButton>
        </div>
      )}
      {dialog === 'settings' && <SettingsDialog settings={settings} update={updateSettings} onClose={() => setDialog(null)} showVolume={showVolume} />}
      {dialog === 'help' && (
        <ExamDialog title={`Help — ${SKILL_TITLE[skill]}`} onClose={() => setDialog(null)} footer={<ExamButton onClick={() => setDialog(null)}>Close</ExamButton>}>
          <ul className="list-disc space-y-2 pl-5">
            {HELP[skill].map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </ExamDialog>
      )}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  )
}
