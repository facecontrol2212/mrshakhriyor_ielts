import { Download } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SPEAKING_DESCRIPTORS } from '@/content/descriptors'
import { answeredPrompts } from '@/exam/speaking/steps'
import { useI18n } from '@/i18n'
import { SPEAKING_CRITERIA, speakingEstimate } from '@/lib/attempts'
import { formatBand } from '@/lib/bands'
import { getRecording } from '@/lib/recordings'
import type { SectionState } from '@/types/attempt'
import type { SpeakingSection } from '@/types/content'
import { BandPicker } from './BandPicker'

function useRecordingUrls(keys: string[]): Record<string, string> {
  const [urls, setUrls] = useState<Record<string, string>>({})
  const signature = keys.join('|')
  useEffect(() => {
    let alive = true
    const created: string[] = []
    Promise.all(signature.split('|').filter(Boolean).map(async (k) => [k, await getRecording(k).catch(() => undefined)] as const)).then((entries) => {
      if (!alive) return
      const map: Record<string, string> = {}
      for (const [k, blob] of entries) {
        if (!blob) continue
        const url = URL.createObjectURL(blob)
        created.push(url)
        map[k] = url
      }
      setUrls(map)
    })
    return () => {
      alive = false
      created.forEach((u) => URL.revokeObjectURL(u))
    }
  }, [signature])
  return urls
}

const extension = (mime: string) => (mime.includes('mp4') ? 'm4a' : mime.includes('ogg') ? 'ogg' : 'webm')

export function SpeakingReport({ section, state, onAssess }: { section: SpeakingSection; state: SectionState; onAssess: (key: string, band: number) => void }) {
  const { t } = useI18n()
  const recordings = state.recordings ?? []
  const urls = useRecordingUrls(recordings.map((r) => r.key))
  const estimate = speakingEstimate(state)
  const prompts = answeredPrompts(section)

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-ink-900/5 sm:p-8">
        <h3 className="mb-5 font-display text-2xl font-semibold">{t.results.recordings}</h3>
        {recordings.length === 0 ? (
          <p className="text-ink-600">{t.results.noRecordings}</p>
        ) : (
          [1, 2, 3].map((part) => {
            const items = prompts.filter((p) => p.part === part)
            return (
              <div key={part} className="mb-6 last:mb-0">
                <h4 className="mb-2 text-xs font-bold tracking-widest text-ink-500 uppercase">Part {part}</h4>
                <ol className="divide-y divide-ink-900/8">
                  {items.map((p) => {
                    const rec = recordings.find((r) => r.promptId === p.id)
                    const url = rec && urls[rec.key]
                    return (
                      <li key={p.id} className="grid gap-2 py-3 md:grid-cols-[1fr_auto] md:items-center">
                        <p className="text-sm text-ink-800">{p.text}</p>
                        {url && rec ? (
                          <span className="flex items-center gap-2">
                            <audio controls preload="none" src={url} className="h-9 w-full max-w-72" />
                            <a href={url} download={`speaking-${p.id}.${extension(rec.mimeType)}`} className="rounded-full p-2 text-ink-600 ring-1 ring-ink-900/10 hover:text-ink-950" aria-label="Download recording">
                              <Download size={16} />
                            </a>
                          </span>
                        ) : (
                          <span className="text-sm text-ink-400">—</span>
                        )}
                      </li>
                    )
                  })}
                </ol>
              </div>
            )
          })
        )}
        {state.notes && (
          <div className="mt-4 rounded-2xl bg-paper-2 p-4 text-sm">
            <p className="mb-1 font-semibold">{t.results.partNotes}</p>
            <p className="whitespace-pre-wrap text-ink-700">{state.notes}</p>
          </div>
        )}
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-ink-900/5 sm:p-8">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
          <h3 className="font-display text-2xl font-semibold">{t.results.selfAssess}</h3>
          {estimate !== null && (
            <span className="rounded-full bg-ink-950 px-3 py-1 text-sm font-semibold text-paper">
              {t.common.band} {formatBand(estimate)}
            </span>
          )}
        </div>
        <p className="mb-4 text-sm text-ink-600">{t.results.listenFirst}</p>
        <div className="grid gap-3 md:grid-cols-2">
          {SPEAKING_CRITERIA.map((c) => (
            <BandPicker key={c.key} label={c.label} descriptors={SPEAKING_DESCRIPTORS[c.key]} value={state.selfAssessment?.[c.key]} onChange={(band) => onAssess(c.key, band)} />
          ))}
        </div>
      </section>
    </div>
  )
}
