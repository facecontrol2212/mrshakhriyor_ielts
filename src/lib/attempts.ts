import { partDurations } from '@/content/audio'
import type { Attempt, ExamMode, SectionState } from '@/types/attempt'
import type { Skill, TestDef } from '@/types/content'
import { criteriaBand, overallBand, writingBand } from './bands'
import { scoreObjective } from './scoring'

export function newSectionState(): SectionState {
  return { phase: 'intro', answers: {}, flagged: [], highlights: {} }
}

function randomDigits(length: number): string {
  let out = ''
  for (let i = 0; i < length; i++) out += Math.floor(Math.random() * 10)
  return out
}

export function createAttempt(test: TestDef, skills: Skill[], mode: ExamMode, name: string): Attempt {
  return {
    id: `${Date.now().toString(36)}${randomDigits(4)}`,
    testId: test.id,
    mode,
    skills,
    current: 0,
    candidate: { name: name.trim() || 'Candidate', number: randomDigits(6) },
    createdAt: Date.now(),
    status: 'in-progress',
    sections: Object.fromEntries(skills.map((s) => [s, newSectionState()])),
  }
}

/** Time allowed for a section in exam mode, in seconds; null when the section has no overall clock. */
export function sectionSeconds(test: TestDef, skill: Skill): number | null {
  if (skill === 'reading' && test.reading) return test.reading.durationMinutes * 60
  if (skill === 'writing' && test.writing) return test.writing.durationMinutes * 60
  if (skill === 'listening' && test.listening) {
    const audio = partDurations(test.id, test.listening).reduce((a, b) => a + b, 0)
    return Math.ceil(audio + test.listening.reviewSeconds)
  }
  return null
}

export function updateSection(attempt: Attempt, skill: Skill, patch: (s: SectionState) => SectionState): Attempt {
  const current = attempt.sections[skill] ?? newSectionState()
  return { ...attempt, sections: { ...attempt.sections, [skill]: patch(current) } }
}

export function startSection(attempt: Attempt, test: TestDef, skill: Skill, now = Date.now()): Attempt {
  const seconds = sectionSeconds(test, skill)
  return updateSection(attempt, skill, (s) => ({
    ...s,
    phase: 'running',
    startedAt: now,
    endsAt: attempt.mode === 'exam' && seconds ? now + seconds * 1000 : undefined,
  }))
}

/** Submit a section and move on to the next one (or complete the attempt). */
export function finishSection(attempt: Attempt, skill: Skill, now = Date.now()): Attempt {
  const next = updateSection(attempt, skill, (s) => ({ ...s, phase: 'done', finishedAt: now }))
  const index = attempt.skills.indexOf(skill)
  if (index >= attempt.skills.length - 1) return { ...next, status: 'completed', completedAt: now, current: index }
  return { ...next, current: index + 1 }
}

export const WRITING_CRITERIA = {
  w1: [
    { key: 'ta', label: 'Task Achievement' },
    { key: 'cc', label: 'Coherence & Cohesion' },
    { key: 'lr', label: 'Lexical Resource' },
    { key: 'gra', label: 'Grammatical Range & Accuracy' },
  ],
  w2: [
    { key: 'tr', label: 'Task Response' },
    { key: 'cc', label: 'Coherence & Cohesion' },
    { key: 'lr', label: 'Lexical Resource' },
    { key: 'gra', label: 'Grammatical Range & Accuracy' },
  ],
} as const

export const SPEAKING_CRITERIA = [
  { key: 'fc', label: 'Fluency & Coherence' },
  { key: 'lr', label: 'Lexical Resource' },
  { key: 'gra', label: 'Grammatical Range & Accuracy' },
  { key: 'p', label: 'Pronunciation' },
] as const

export function writingEstimate(state?: SectionState): number | null {
  const sa = state?.selfAssessment
  if (!sa) return null
  const t1 = WRITING_CRITERIA.w1.map((c) => sa[`w1.${c.key}`])
  const t2 = WRITING_CRITERIA.w2.map((c) => sa[`w2.${c.key}`])
  if ([...t1, ...t2].some((v) => typeof v !== 'number')) return null
  return writingBand(criteriaBand(t1 as number[]), criteriaBand(t2 as number[]))
}

export function speakingEstimate(state?: SectionState): number | null {
  const sa = state?.selfAssessment
  if (!sa) return null
  const scores = SPEAKING_CRITERIA.map((c) => sa[c.key])
  if (scores.some((v) => typeof v !== 'number')) return null
  return criteriaBand(scores as number[])
}

export interface AttemptSummary {
  bands: Partial<Record<Skill, number | null>>
  raw: Partial<Record<'listening' | 'reading', { raw: number; total: number }>>
  overall: number | null
}

/** Section bands for an attempt. Writing and speaking need a self-assessment first. */
export function summarize(attempt: Attempt, test: TestDef): AttemptSummary {
  const bands: AttemptSummary['bands'] = {}
  const raw: AttemptSummary['raw'] = {}
  for (const skill of attempt.skills) {
    const state = attempt.sections[skill]
    if (!state || state.phase !== 'done') {
      bands[skill] = null
      continue
    }
    if (skill === 'listening' && test.listening) {
      const s = scoreObjective('listening', test.listening, state.answers, test.module)
      bands.listening = s.band
      raw.listening = { raw: s.raw, total: s.total }
    } else if (skill === 'reading' && test.reading) {
      const s = scoreObjective('reading', test.reading, state.answers, test.module)
      bands.reading = s.band
      raw.reading = { raw: s.raw, total: s.total }
    } else if (skill === 'writing') bands.writing = writingEstimate(state)
    else if (skill === 'speaking') bands.speaking = speakingEstimate(state)
  }
  const all = (['listening', 'reading', 'writing', 'speaking'] as const).map((s) => bands[s])
  const overall = all.every((b) => typeof b === 'number') ? overallBand(all as number[]) : null
  return { bands, raw, overall }
}
