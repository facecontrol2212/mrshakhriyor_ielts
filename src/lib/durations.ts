import { partDurations } from '@/content/audio'
import type { Skill, TestDef } from '@/types/content'

/** Approximate length of a section in minutes, for display. */
export function skillMinutes(test: TestDef, skill: Skill): number {
  if (skill === 'listening' && test.listening) {
    const audio = partDurations(test.id, test.listening).reduce((a, b) => a + b, 0)
    return Math.round((audio + test.listening.reviewSeconds) / 60) || 30
  }
  if (skill === 'reading') return test.reading?.durationMinutes ?? 60
  if (skill === 'writing') return test.writing?.durationMinutes ?? 60
  return 14
}
