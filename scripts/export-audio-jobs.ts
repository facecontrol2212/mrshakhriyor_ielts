/**
 * Turns the listening scripts and speaking prompts in src/content into a list
 * of audio jobs for scripts/generate_audio.py.
 *
 *   npm run audio:export && npm run audio:generate
 */
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { TESTS } from '../src/content/tests'
import type { SpeakingPrompt } from '../src/types/content'

export interface SpeechSegment {
  type: 'speech'
  voice: string
  lang: 'en-us' | 'en-gb'
  text: string
  speed: number
  /** Silence after this segment, in seconds. */
  gapAfter: number
}

export interface PauseSegment {
  type: 'pause'
  seconds: number
}

export interface AudioJob {
  id: string
  /** Output path relative to public/. */
  out: string
  segments: (SpeechSegment | PauseSegment)[]
}

const langFor = (voice: string): 'en-us' | 'en-gb' => (voice.startsWith('b') ? 'en-gb' : 'en-us')

/** Respellings that make the TTS say names and loanwords the way people do. */
const PRONOUNCE: [RegExp, string][] = [
  [/\bkakapo\b/gi, 'kaka-po'],
  [/\brimu\b/gi, 'ree-moo'],
  [/\bDr\b\.?/g, 'Doctor'],
  [/café/g, 'cafe'],
  [/Māori/g, 'Maori'],
  [/[—–]/g, ','],
]

function speakable(text: string): string {
  return PRONOUNCE.reduce((out, [pattern, replacement]) => out.replace(pattern, replacement), text)
}

/**
 * Kokoro voices speak at different natural rates; these factors bring each one
 * to roughly 155–165 words per minute, the pace of real IELTS recordings.
 */
const VOICE_SPEED: Record<string, number> = {
  bf_isabella: 0.76,
  bf_emma: 0.79,
  bm_george: 0.86,
  bm_fable: 0.8,
  af_bella: 0.85,
  af_heart: 0.87,
}

/** Spelled-out letters and long digit strings are read a little more slowly. */
function speedFor(text: string, voice: string): number {
  const base = VOICE_SPEED[voice] ?? 0.88
  if (/(?:\b[A-Z], ){3,}/.test(text)) return Math.round(base * 0.85 * 100) / 100
  if (/\b(?:oh|zero|one|two|three|four|five|six|seven|eight|nine)(?:,? (?:oh|zero|one|two|three|four|five|six|seven|eight|nine)\b){4,}/i.test(text))
    return Math.round(base * 0.9 * 100) / 100
  return base
}

const jobs: AudioJob[] = [
  {
    id: 'common/sound-check',
    out: 'audio/common/sound-check.mp3',
    segments: [
      {
        type: 'speech',
        voice: 'bm_fable',
        lang: 'en-gb',
        text: 'This is a sound check. You should be able to hear this voice clearly. If you cannot, please adjust the volume now, or check that your headphones are connected.',
        speed: 0.88,
        gapAfter: 0,
      },
    ],
  },
]

for (const test of TESTS) {
  if (test.listening) {
    for (const part of test.listening.parts) {
      const segments: AudioJob['segments'] = part.script.map((seg, i) => {
        if (seg.type === 'pause') return { type: 'pause', seconds: seg.seconds }
        const speaker = seg.type === 'narrator' ? (part.speakers.N ?? { name: 'Narrator', voice: 'bm_fable' }) : part.speakers[seg.speaker]
        if (!speaker) throw new Error(`${test.id}/${part.id}: unknown speaker in segment ${i}`)
        const next = part.script[i + 1]
        const sameSpeaker = seg.type === 'line' && next?.type === 'line' && next.speaker === seg.speaker
        const text = speakable(seg.say ?? seg.text)
        return {
          type: 'speech',
          voice: speaker.voice,
          lang: langFor(speaker.voice),
          text,
          speed: speedFor(text, speaker.voice),
          gapAfter: next?.type === 'pause' || !next ? 0 : seg.type === 'narrator' ? 0.9 : sameSpeaker ? 0.45 : 0.6,
        }
      })
      jobs.push({ id: `${test.id}/listening/${part.id}`, out: `audio/${test.id}/listening-${part.id}.mp3`, segments })
    }
  }

  if (test.speaking) {
    const s = test.speaking
    const prompts: SpeakingPrompt[] = [
      ...s.part1.intro,
      ...s.part1.topics.flatMap((t) => t.questions),
      s.part2.intro,
      s.part2.start,
      ...(s.part2.followUp ? [s.part2.followUp] : []),
      s.part3.intro,
      ...s.part3.questions,
      s.closing,
    ]
    for (const prompt of prompts) {
      const text = speakable(prompt.say ?? prompt.text)
      jobs.push({
        id: `${test.id}/speaking/${prompt.id}`,
        out: `audio/${test.id}/speaking/${prompt.id}.mp3`,
        segments: [{ type: 'speech', voice: s.examiner.voice, lang: langFor(s.examiner.voice), text, speed: speedFor(text, s.examiner.voice), gapAfter: 0 }],
      })
    }
  }
}

const target = resolve(import.meta.dirname, '.audio-jobs.json')
writeFileSync(target, JSON.stringify({ version: 1, jobs }, null, 2))
console.log(`Wrote ${jobs.length} audio jobs to ${target}`)
