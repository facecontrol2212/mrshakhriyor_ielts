import type { Skill } from './content'

export type ExamMode = 'exam' | 'practice'

/** A typed answer, a chosen option key, or several keys for multi-answer questions. */
export type AnswerValue = string | string[]

export interface Highlight {
  id: string
  start: number
  end: number
  note?: string
}

export interface RecordingMeta {
  /** IndexedDB key of the audio blob. */
  key: string
  promptId: string
  part: 1 | 2 | 3
  question: string
  durationMs: number
  mimeType: string
}

export type SectionPhase = 'intro' | 'running' | 'checking' | 'done'

export interface SectionState {
  phase: SectionPhase
  startedAt?: number
  /** Exam-mode deadline (epoch ms). Survives page reloads. */
  endsAt?: number
  finishedAt?: number
  /** Keyed by question number; multi-answer groups use "from-to". */
  answers: Record<string, AnswerValue>
  flagged: number[]
  /** Keyed by highlightable block id (passage paragraph, question stem …). */
  highlights: Record<string, Highlight[]>
  /** Writing: task id → essay text. */
  essays?: Record<string, string>
  /** Speaking: recorded answers. */
  recordings?: RecordingMeta[]
  /** Speaking Part 2 notes. */
  notes?: string
  /** Speaking: index of the current step, so a reload resumes at the same question. */
  speakingStep?: number
  /** Self-assessed criterion bands for writing/speaking, keyed "task1.ta" etc. */
  selfAssessment?: Record<string, number>
}

export interface Candidate {
  name: string
  number: string
}

export interface Attempt {
  id: string
  testId: string
  mode: ExamMode
  /** Skills in the order they are taken. */
  skills: Skill[]
  /** Index into `skills` of the section in progress. */
  current: number
  candidate: Candidate
  createdAt: number
  /** When the candidate confirmed their details on the first screen. */
  confirmedAt?: number
  completedAt?: number
  status: 'in-progress' | 'completed'
  sections: Partial<Record<Skill, SectionState>>
}

export interface Profile {
  name: string
  targetBand: number
  examDate?: string
  module: 'academic' | 'general'
}
