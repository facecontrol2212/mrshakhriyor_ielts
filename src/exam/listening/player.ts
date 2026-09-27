import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * One shared <audio> element for the whole listening test. Browsers only allow
 * sound after a user gesture, so playback is started from the "Start test"
 * click and the same element is reused for every part afterwards.
 */
let element: HTMLAudioElement | null = null

export function getAudio(): HTMLAudioElement {
  if (!element) {
    element = new Audio()
    element.preload = 'auto'
  }
  return element
}

export function playPart(url: string, part: number, offset = 0): Promise<void> {
  const audio = getAudio()
  audio.dataset.part = String(part)
  const absolute = new URL(url, window.location.href).href
  if (audio.src !== absolute) audio.src = url
  if (offset > 0.3) {
    if (audio.readyState >= 1) audio.currentTime = offset
    else audio.addEventListener('loadedmetadata', () => (audio.currentTime = offset), { once: true })
  } else if (audio.currentTime > 0.3) {
    audio.currentTime = 0
  }
  return audio.play()
}

export function stopAudio() {
  if (!element) return
  element.pause()
  element.removeAttribute('src')
  element.load()
}

/** Where the recording should be now: part index and offset in seconds, or null when it has ended. */
export function locate(elapsed: number, durations: number[]): { part: number; offset: number } | null {
  let start = 0
  for (let i = 0; i < durations.length; i++) {
    if (elapsed < start + durations[i]) return { part: i, offset: elapsed - start }
    start += durations[i]
  }
  return null
}

/** The part the recording should be on for a section started at `startedAt`. */
export function partForClock(startedAt: number | undefined, durations: number[]): number {
  if (!startedAt) return 0
  return locate((Date.now() - startedAt) / 1000, durations)?.part ?? durations.length - 1
}

export interface ListeningPlayer {
  part: number
  playing: boolean
  position: number
  finished: boolean
  needsResume: boolean
  resume: () => void
  toggle: () => void
  seek: (seconds: number) => void
  selectPart: (part: number, autoplay?: boolean) => void
}

export function useListeningPlayer({
  urls,
  durations,
  strict,
  startedAt,
  volume,
  onPartStart,
  onComplete,
}: {
  urls: string[]
  durations: number[]
  /** Exam conditions: no pausing or seeking, playback follows the clock. */
  strict: boolean
  startedAt?: number
  volume: number
  onPartStart: (part: number) => void
  onComplete?: () => void
}): ListeningPlayer {
  const clockBased = strict && Boolean(startedAt)
  const [part, setPart] = useState(() => (clockBased ? partForClock(startedAt, durations) : Number(getAudio().dataset.part ?? 0)))
  const [playing, setPlaying] = useState(() => !getAudio().paused)
  const [position, setPosition] = useState(0)
  const [finished, setFinished] = useState(() => clockBased && !locate((Date.now() - (startedAt ?? 0)) / 1000, durations))
  // After a reload the recording is silent until the candidate clicks — browsers block autoplay.
  const [needsResume, setNeedsResume] = useState(() => clockBased && Boolean(locate((Date.now() - (startedAt ?? 0)) / 1000, durations)) && getAudio().paused)
  const callbacks = useRef({ onPartStart, onComplete })
  useEffect(() => {
    callbacks.current = { onPartStart, onComplete }
  })

  useEffect(() => {
    getAudio().volume = Math.max(0, Math.min(1, volume))
  }, [volume])

  useEffect(() => {
    const audio = getAudio()
    const onEnded = () => {
      const current = Number(audio.dataset.part ?? 0)
      if (current + 1 < urls.length) {
        setPart(current + 1)
        callbacks.current.onPartStart(current + 1)
        playPart(urls[current + 1], current + 1).catch(() => setNeedsResume(true))
      } else {
        setFinished(true)
        setPlaying(false)
        callbacks.current.onComplete?.()
      }
    }
    const onPlay = () => {
      setPlaying(true)
      setNeedsResume(false)
    }
    const onPause = () => setPlaying(false)
    const onTime = () => setPosition(audio.currentTime)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('timeupdate', onTime)
    return () => {
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('timeupdate', onTime)
    }
  }, [urls])

  // Watchdog: if the browser refused to start the recording, ask for a click.
  useEffect(() => {
    if (!clockBased) return
    const id = window.setTimeout(() => {
      const audio = getAudio()
      if (audio.paused && locate((Date.now() - (startedAt ?? 0)) / 1000, durations)) setNeedsResume(true)
    }, 2500)
    return () => window.clearTimeout(id)
  }, [clockBased, startedAt, durations])

  // Leaving the section always silences the recording. The check is deferred
  // so React's development double-mount does not stop audio that just started.
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      window.setTimeout(() => {
        if (!mounted.current) stopAudio()
      }, 0)
    }
  }, [])

  const resume = useCallback(() => {
    if (clockBased) {
      const where = locate((Date.now() - (startedAt ?? 0)) / 1000, durations)
      if (!where) {
        setFinished(true)
        setNeedsResume(false)
        return
      }
      setPart(where.part)
      callbacks.current.onPartStart(where.part)
      playPart(urls[where.part], where.part, where.offset).catch(() => setNeedsResume(true))
    } else {
      playPart(urls[part], part, getAudio().currentTime).catch(() => setNeedsResume(true))
    }
  }, [clockBased, startedAt, durations, urls, part])

  const toggle = useCallback(() => {
    if (strict) return
    const audio = getAudio()
    if (audio.paused) {
      if (!audio.src) playPart(urls[part], part).catch(() => setNeedsResume(true))
      else audio.play().catch(() => setNeedsResume(true))
    } else audio.pause()
  }, [strict, urls, part])

  const seek = useCallback(
    (seconds: number) => {
      if (strict) return
      const audio = getAudio()
      if (!audio.src) {
        playPart(urls[part], part, seconds).catch(() => setNeedsResume(true))
        return
      }
      audio.currentTime = Math.max(0, Math.min(durations[part] ?? seconds, seconds))
      setPosition(audio.currentTime)
    },
    [strict, urls, part, durations],
  )

  const selectPart = useCallback(
    (next: number, autoplay = false) => {
      if (strict) return
      setPart(next)
      setPosition(0)
      const audio = getAudio()
      audio.pause()
      audio.dataset.part = String(next)
      audio.src = urls[next]
      if (autoplay) audio.play().catch(() => setNeedsResume(true))
    },
    [strict, urls],
  )

  return { part, playing, position, finished, needsResume, resume, toggle, seek, selectPart }
}
