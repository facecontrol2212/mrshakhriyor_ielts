import type { ListeningSection } from '@/types/content'
import manifest from './audio-manifest.json'

export interface AudioEntry {
  src: string
  duration: number
  hash: string
  /** Start/end (seconds) of every script segment — lets the review screen sync the transcript. */
  segments?: { start: number; end: number }[]
}

const entries = manifest as Record<string, AudioEntry>

export function audioUrl(src: string): string {
  return `${import.meta.env.BASE_URL}${src}`
}

export function listeningAudio(testId: string, partId: string): AudioEntry | undefined {
  return entries[`${testId}/listening/${partId}`]
}

export function speakingAudio(testId: string, promptId: string): AudioEntry | undefined {
  return entries[`${testId}/speaking/${promptId}`]
}

export function soundCheckAudio(): AudioEntry | undefined {
  return entries['common/sound-check']
}

/** Length of each listening part's recording, in seconds. */
export function partDurations(testId: string, section: ListeningSection): number[] {
  return section.parts.map((part) => listeningAudio(testId, part.id)?.duration ?? 0)
}
