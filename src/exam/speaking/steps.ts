import type { SpeakingPrompt, SpeakingSection } from '@/types/content'

export type SpeakingStep =
  | { kind: 'prompt'; part: 1 | 2 | 3; prompt: SpeakingPrompt; label: string }
  | { kind: 'prep' }
  | { kind: 'talk' }
  | { kind: 'end' }

/** The interview as a flat sequence: examiner prompts, Part 2 preparation and long turn. */
export function buildSpeakingSteps(s: SpeakingSection): SpeakingStep[] {
  const steps: SpeakingStep[] = []
  for (const p of s.part1.intro) steps.push({ kind: 'prompt', part: 1, prompt: p, label: 'Introduction' })
  for (const t of s.part1.topics) for (const q of t.questions) steps.push({ kind: 'prompt', part: 1, prompt: q, label: t.title })
  steps.push({ kind: 'prompt', part: 2, prompt: s.part2.intro, label: 'Long turn' })
  steps.push({ kind: 'prep' })
  steps.push({ kind: 'prompt', part: 2, prompt: s.part2.start, label: 'Long turn' })
  steps.push({ kind: 'talk' })
  if (s.part2.followUp) steps.push({ kind: 'prompt', part: 2, prompt: s.part2.followUp, label: 'Long turn' })
  steps.push({ kind: 'prompt', part: 3, prompt: s.part3.intro, label: 'Discussion' })
  for (const q of s.part3.questions) steps.push({ kind: 'prompt', part: 3, prompt: q, label: 'Discussion' })
  steps.push({ kind: 'prompt', part: 3, prompt: s.closing, label: 'End of test' })
  steps.push({ kind: 'end' })
  return steps
}

export function stepPart(step: SpeakingStep): 1 | 2 | 3 {
  if (step.kind === 'prompt') return step.part
  if (step.kind === 'prep' || step.kind === 'talk') return 2
  return 3
}

/** Every prompt the candidate answers, in order — used to label recordings. */
export function answeredPrompts(s: SpeakingSection): { id: string; part: 1 | 2 | 3; text: string }[] {
  return buildSpeakingSteps(s).flatMap((step) => {
    if (step.kind === 'talk') return [{ id: 'p2-talk', part: 2 as const, text: s.part2.cueCard.topic }]
    if (step.kind === 'prompt' && step.prompt.answerSeconds > 0) return [{ id: step.prompt.id, part: step.part, text: step.prompt.text }]
    return []
  })
}
