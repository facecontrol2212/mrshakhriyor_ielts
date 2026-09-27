import { Pause, Play, RotateCcw, RotateCw, Volume2 } from 'lucide-react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { audioUrl, listeningAudio } from '@/content/audio'
import { buildQuestionIndex, isAnswered, partRange } from '@/lib/questions'
import type { ListeningPart, ListeningSection } from '@/types/content'
import { ExamContext, useExam } from '../ExamContext'
import { HighlightMenu } from '../highlight/HighlightMenu'
import { Highlightable } from '../highlight/Highlightable'
import { QuestionGroupView } from '../questions/QuestionGroups'
import { PartHeader, type RunnerProps } from '../reading/ReadingRunner'
import { BottomNav } from '../shell/BottomNav'
import { ExamFrame } from '../shell/ExamFrame'
import { ExamButton } from '../shell/primitives'
import { formatClock } from '../shell/time'
import { SplitPane } from '../shell/SplitPane'
import { useExamApi } from '../useExamApi'
import { partForClock, useListeningPlayer, type ListeningPlayer } from './player'

function PracticeControls({ player, durations, partCount }: { player: ListeningPlayer; durations: number[]; partCount: number }) {
  const duration = durations[player.part] || 1
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2 border-b px-4 py-2" style={{ borderColor: 'var(--ex-border)' }}>
      <button type="button" onClick={() => player.seek(player.position - 10)} aria-label="Back 10 seconds" className="rounded border p-1.5" style={{ borderColor: 'var(--ex-strong-border)' }}>
        <RotateCcw size={16} />
      </button>
      <button
        type="button"
        onClick={player.toggle}
        aria-label={player.playing ? 'Pause' : 'Play'}
        className="rounded-full p-2"
        style={{ background: 'var(--ex-accent)', color: 'var(--ex-accent-fg)' }}
      >
        {player.playing ? <Pause size={16} /> : <Play size={16} />}
      </button>
      <button type="button" onClick={() => player.seek(player.position + 10)} aria-label="Forward 10 seconds" className="rounded border p-1.5" style={{ borderColor: 'var(--ex-strong-border)' }}>
        <RotateCw size={16} />
      </button>
      <select
        value={player.part}
        onChange={(e) => player.selectPart(Number(e.target.value))}
        aria-label="Recording part"
        className="exam-input"
      >
        {Array.from({ length: partCount }, (_, i) => (
          <option key={i} value={i}>
            Part {i + 1}
          </option>
        ))}
      </select>
      <input
        type="range"
        min={0}
        max={duration}
        step={0.5}
        value={Math.min(player.position, duration)}
        onChange={(e) => player.seek(Number(e.target.value))}
        aria-label="Position in recording"
        className="min-w-[8rem] flex-1"
        style={{ accentColor: 'var(--ex-accent)' }}
      />
      <span className="text-[13px] tabular-nums">
        {formatClock(player.position * 1000)} / {formatClock(duration * 1000)}
      </span>
    </div>
  )
}

function Transcript({ testId, part, player, partIndex }: { testId: string; part: ListeningPart; player: ListeningPlayer; partIndex: number }) {
  const { results } = useExam()
  const timing = listeningAudio(testId, part.id)?.segments
  const evidence = useMemo(() => {
    const { from, to } = partRange(part)
    const out: { quote: string; n: number }[] = []
    for (let n = from; n <= to; n++) {
      const quote = results?.get(n)?.spec.evidence
      if (quote) out.push({ quote, n })
    }
    return out
  }, [part, results])
  const playingHere = player.part === partIndex
  return (
    <div className="mx-auto max-w-[46em] px-4 py-5 sm:px-6">
      <h3 className="mb-1 font-bold">Transcript — Part {partIndex + 1}</h3>
      <p className="mb-4 text-[0.9em]" style={{ color: 'var(--ex-muted)' }}>
        {part.context} Click a line to hear it again.
      </p>
      <div className="space-y-2">
        {part.script.map((seg, i) => {
          if (seg.type === 'pause') return null
          const t = timing?.[i]
          const current = playingHere && (player.playing || player.position > 0) && t && player.position >= t.start && player.position < t.end + 0.5
          const speaker = seg.type === 'narrator' ? 'Narrator' : (part.speakers[seg.speaker]?.name ?? seg.speaker)
          return (
            <button
              key={i}
              type="button"
              onClick={() => {
                if (!t) return
                if (player.part !== partIndex) player.selectPart(partIndex)
                window.setTimeout(() => {
                  player.seek(t.start)
                  if (!player.playing) player.toggle()
                }, 50)
              }}
              className="block w-full rounded-[3px] px-2 py-1.5 text-left"
              style={{ background: current ? 'var(--ex-panel-2)' : 'transparent', fontStyle: seg.type === 'narrator' ? 'italic' : undefined }}
            >
              <span className="mr-2 font-bold">{speaker}:</span>
              <Highlightable blockId={`${part.id}-t${i}`} text={seg.text} evidence={evidence} />
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function ListeningRunner({ section, testId, onAudioComplete, ...props }: RunnerProps & { section: ListeningSection; onAudioComplete?: () => void }) {
  const refs = useMemo(() => buildQuestionIndex(section.parts), [section])
  const durations = useMemo(() => section.parts.map((p) => listeningAudio(testId, p.id)?.duration ?? 0), [section, testId])
  const [partIndex, setPartIndex] = useState(() => (props.mode === 'exam' && !props.readOnly ? partForClock(props.state.startedAt, durations) : 0))
  const api = useExamApi({ mode: props.mode, state: props.state, update: props.update, refs, onPartChange: setPartIndex, readOnly: props.readOnly, results: props.results })
  const containerRef = useRef<HTMLDivElement>(null)
  const strict = props.mode === 'exam' && !props.readOnly

  const urls = useMemo(() => section.parts.map((p) => audioUrl(listeningAudio(testId, p.id)?.src ?? '')), [section, testId])
  const onPartStart = useCallback(
    (i: number) => {
      setPartIndex(i)
      const { from } = partRange(section.parts[i])
      api.setActive(from)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [section],
  )
  const player = useListeningPlayer({
    urls,
    durations,
    strict,
    startedAt: props.state.startedAt,
    volume: props.settings.volume,
    onPartStart,
    onComplete: onAudioComplete,
  })

  const part = section.parts[partIndex]
  const { from, to } = partRange(part)
  const parts = section.parts.map((p, i) => {
    const r = partRange(p)
    return { label: `Part ${i + 1}`, numbers: Array.from({ length: r.to - r.from + 1 }, (_, k) => r.from + k), index: i }
  })
  const answered = refs.filter((r) => r.partIndex === partIndex && isAnswered(props.state.answers, r)).length

  const questions = (
    <div className="mx-auto max-w-[52em] px-4 py-5 sm:px-6">
      {part.groups.map((g) => (
        <QuestionGroupView key={g.id} group={g} />
      ))}
    </div>
  )

  return (
    <ExamContext.Provider value={api}>
      <ExamFrame
        skill="listening"
        candidate={props.candidate}
        mode={props.mode}
        timer={props.timer}
        onTimeUp={props.onTimeUp}
        settings={props.settings}
        updateSettings={props.updateSettings}
        readOnly={props.readOnly}
        showVolume
        nav={
          <BottomNav
            parts={parts}
            currentPart={partIndex}
            onPart={(i) => api.goToQuestion(parts[i].numbers[0])}
            refs={refs}
            onSubmit={props.onSubmit}
            submitLabel={props.readOnly ? 'Close' : 'Submit'}
          />
        }
      >
        <div ref={containerRef} className="flex h-full flex-col">
          <PartHeader label={`Part ${partIndex + 1}`} intro={`Listen and answer questions ${from}–${to}.`} />
          {strict && (
            <div className="flex shrink-0 items-center gap-2 border-b px-4 py-1.5 text-[13px]" style={{ borderColor: 'var(--ex-border)' }} aria-live="polite">
              <Volume2 size={15} aria-hidden />
              {player.finished || (props.state.startedAt && player.part === section.parts.length - 1 && !player.playing && !player.needsResume) ? (
                <strong>The recording has finished. You have 2 minutes to check your answers.</strong>
              ) : player.playing ? (
                <span>
                  Recording playing — Part {player.part + 1}. You will hear the recording <strong>once only</strong>.
                </span>
              ) : (
                <span>Recording paused.</span>
              )}
            </div>
          )}
          {!strict && <PracticeControls player={player} durations={durations} partCount={section.parts.length} />}
          <div className="min-h-0 flex-1">
            {props.readOnly ? (
              <SplitPane
                key={part.id}
                leftLabel={`Questions (${answered}/${to - from + 1})`}
                rightLabel="Transcript"
                left={questions}
                right={<Transcript testId={testId} part={part} player={player} partIndex={partIndex} />}
              />
            ) : (
              <div key={part.id} className="exam-scroll h-full">
                {questions}
              </div>
            )}
          </div>
        </div>
        <HighlightMenu containerRef={containerRef} />
        {strict && player.needsResume && !player.finished && (
          <div className="fixed inset-0 z-[55] flex flex-col items-center justify-center gap-4 bg-black/60 p-6 text-center">
            <div className="max-w-md rounded border p-6" style={{ background: 'var(--ex-bg)', borderColor: 'var(--ex-strong-border)' }}>
              <p className="mb-2 text-[1.1em] font-bold">Your listening test is in progress</p>
              <p className="mb-5">The recording continues from where the test clock is now — exactly as it would in the exam room.</p>
              <ExamButton onClick={player.resume}>
                <Play size={16} /> Resume the recording
              </ExamButton>
            </div>
          </div>
        )}
      </ExamFrame>
    </ExamContext.Provider>
  )
}
