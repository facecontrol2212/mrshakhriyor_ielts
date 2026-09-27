/**
 * Content model for tests. Everything a test needs — passages, audio scripts,
 * questions and answer keys — is plain data so new tests can be added without
 * touching any UI code.
 *
 * Inline markup used in `Markup` strings:
 *   **bold**   *italic*   {{12}} → answer gap for question 12
 */
export type Markup = string

export type Module = 'academic' | 'general'
export type Skill = 'listening' | 'reading' | 'writing' | 'speaking'

export const SKILLS: Skill[] = ['listening', 'reading', 'writing', 'speaking']

export interface Option {
  key: string
  text: Markup
}

/** Word limit printed in the instructions, e.g. NO MORE THAN TWO WORDS AND/OR A NUMBER. */
export interface WordLimit {
  words: number
  /** true when "AND/OR A NUMBER" is allowed in addition to the words */
  number?: boolean
}

export interface AnswerSpec {
  /**
   * Accepted answers. For text answers every variant is listed explicitly;
   * parts in round brackets are optional, e.g. "(the) town hall".
   * For choice questions this is the option key(s).
   */
  accept: string[]
  /** Why this is the answer — shown in the review screen. */
  explanation?: string
  /** Exact quote from the passage or transcript that contains the answer. */
  evidence?: string
}

interface GroupBase {
  id: string
  /** First and last question numbers covered by this group (inclusive). */
  from: number
  to: number
  /** Paragraphs of instructions shown above the questions. */
  instructions: Markup[]
}

export interface StemQuestion {
  n: number
  text: Markup
}

export interface McqQuestion extends StemQuestion {
  options: Option[]
}

export interface TableBody {
  columns: Markup[]
  rows: Markup[][]
}

/** True/False/Not Given or Yes/No/Not Given. */
export interface JudgementGroup extends GroupBase {
  type: 'tfng' | 'ynng'
  questions: StemQuestion[]
}

/** Multiple choice with a single answer per question. */
export interface McqGroup extends GroupBase {
  type: 'mcq'
  questions: McqQuestion[]
}

/** "Choose TWO letters, A–E" — one stem, several question numbers. */
export interface McqMultiGroup extends GroupBase {
  type: 'mcq-multi'
  stem: Markup
  options: Option[]
}

/** Typed-answer gaps inside notes, a form, sentences, a table or a flow chart. */
export interface GapGroup extends GroupBase {
  type: 'gap'
  layout: 'notes' | 'form' | 'sentences' | 'summary' | 'table' | 'flowchart'
  title?: Markup
  wordLimit: WordLimit
  /** Lines of markup (notes/form/sentences/summary/flowchart) … */
  lines?: Markup[]
  /** … or a table. */
  table?: TableBody
}

/** Gaps completed by dragging words from a box (summary/sentence with word bank). */
export interface GapBankGroup extends GroupBase {
  type: 'gap-bank'
  title?: Markup
  lines: Markup[]
  options: Option[]
}

/** Match headings (i–x) to paragraphs; drop zones appear inside the passage. */
export interface HeadingsGroup extends GroupBase {
  type: 'headings'
  options: Option[]
  questions: { n: number; paragraph: string }[]
  /** Worked example shown in the passage; its heading cannot be dragged. */
  example?: { paragraph: string; key: string }
}

/**
 * Match each item to one option: matching information (which paragraph),
 * matching features (which person), sentence endings, listening matching.
 */
export interface MatchingGroup extends GroupBase {
  type: 'matching'
  optionsTitle?: Markup
  options: Option[]
  questions: StemQuestion[]
  /** "You may use any letter more than once" */
  reuse?: boolean
  /** drag = drag options onto questions; select = dropdown per question */
  display: 'drag' | 'select'
}

/** Label a map / plan / diagram by choosing a letter for each question. */
export interface MapGroup extends GroupBase {
  type: 'map'
  /** Key of a visual registered in src/content/visuals. */
  visual: string
  letters: string[]
  questions: StemQuestion[]
}

/** Short-answer questions with a typed answer. */
export interface ShortAnswerGroup extends GroupBase {
  type: 'short'
  wordLimit: WordLimit
  questions: StemQuestion[]
}

export type QuestionGroup =
  | JudgementGroup
  | McqGroup
  | McqMultiGroup
  | GapGroup
  | GapBankGroup
  | HeadingsGroup
  | MatchingGroup
  | MapGroup
  | ShortAnswerGroup

export type QuestionType = QuestionGroup['type']

// ─── Reading ────────────────────────────────────────────────────────────────

export interface Paragraph {
  /** Paragraph letter (A, B, C …) when questions refer to paragraphs. */
  label?: string
  text: Markup
}

export interface Passage {
  title: string
  subtitle?: Markup
  paragraphs: Paragraph[]
}

export interface ReadingPart {
  id: string
  /** e.g. "Read the text below and answer Questions 1–13." */
  intro: Markup
  passage: Passage
  groups: QuestionGroup[]
}

export interface ReadingSection {
  durationMinutes: number
  parts: ReadingPart[]
  answers: Record<number, AnswerSpec>
}

// ─── Listening ──────────────────────────────────────────────────────────────

export interface Speaker {
  name: string
  /** Kokoro voice id used by scripts/generate_audio.py, e.g. bf_emma. */
  voice: string
}

export type ScriptSegment =
  | { type: 'narrator'; text: string; say?: string }
  | { type: 'line'; speaker: string; text: string; say?: string }
  | { type: 'pause'; seconds: number }

export interface ListeningPart {
  id: string
  /** Shown above the questions, e.g. "Questions 1–10". */
  intro: Markup
  /** One-line description of the recording for the review screen. */
  context: string
  speakers: Record<string, Speaker>
  script: ScriptSegment[]
  groups: QuestionGroup[]
}

export interface ListeningSection {
  parts: ListeningPart[]
  answers: Record<number, AnswerSpec>
  /** Time at the end of the test to check answers (CD IELTS: 2 minutes). */
  reviewSeconds: number
}

// ─── Writing ────────────────────────────────────────────────────────────────

export interface ChartSeries {
  name: string
  /** null = no data for that point (e.g. before a product existed). */
  values: (number | null)[]
}

export interface ChartVisual {
  kind: 'line' | 'bar'
  title: string
  xLabels: string[]
  yLabel: string
  yMax: number
  yStep: number
  unit?: string
  series: ChartSeries[]
}

export type WritingVisual = ChartVisual | { kind: 'custom'; key: string }

export interface ModelAnswer {
  band: number
  text: string
  /** Short notes on why the answer works. */
  notes: string[]
}

export interface WritingTask {
  id: string
  number: 1 | 2
  minWords: number
  suggestedMinutes: number
  prompt: Markup[]
  visual?: WritingVisual
  modelAnswer?: ModelAnswer
}

export interface WritingSection {
  durationMinutes: number
  tasks: WritingTask[]
}

// ─── Speaking ───────────────────────────────────────────────────────────────

export interface SpeakingPrompt {
  id: string
  text: string
  say?: string
  /** Maximum answer time before the examiner moves on; 0 = no answer expected. */
  answerSeconds: number
}

export interface CueCard {
  topic: string
  intro: string
  points: string[]
  closing: string
}

export interface SpeakingSection {
  examiner: Speaker
  part1: { intro: SpeakingPrompt[]; topics: { title: string; questions: SpeakingPrompt[] }[] }
  part2: {
    intro: SpeakingPrompt
    cueCard: CueCard
    start: SpeakingPrompt
    prepSeconds: number
    talkSeconds: number
    followUp?: SpeakingPrompt
  }
  part3: { intro: SpeakingPrompt; questions: SpeakingPrompt[] }
  closing: SpeakingPrompt
}

// ─── Test ───────────────────────────────────────────────────────────────────

export interface TestDef {
  id: string
  title: string
  module: Module
  /** Short marketing blurb for the library card. */
  summary: string
  difficulty: 'foundation' | 'intermediate' | 'advanced'
  /** Topics covered, shown as tags. */
  topics: string[]
  listening?: ListeningSection
  reading?: ReadingSection
  writing?: WritingSection
  speaking?: SpeakingSection
  /** Reading-only practice sets shorter than a full test. */
  kind: 'full' | 'practice'
}
