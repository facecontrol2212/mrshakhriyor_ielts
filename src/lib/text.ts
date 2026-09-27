import type { Markup, WordLimit } from '@/types/content'

// ─── Inline markup ──────────────────────────────────────────────────────────

export type InlineToken =
  | { type: 'text'; text: string; bold?: boolean; italic?: boolean }
  | { type: 'gap'; n: number }

const INLINE = /(\{\{\d+\}\}|\*\*[^*]+\*\*|\*[^*]+\*)/g

/** Split a markup string into text runs and answer gaps. */
export function parseInline(markup: Markup): InlineToken[] {
  const tokens: InlineToken[] = []
  for (const part of markup.split(INLINE)) {
    if (!part) continue
    const gap = /^\{\{(\d+)\}\}$/.exec(part)
    if (gap) tokens.push({ type: 'gap', n: Number(gap[1]) })
    else if (part.startsWith('**') && part.endsWith('**') && part.length > 4)
      tokens.push({ type: 'text', text: part.slice(2, -2), bold: true })
    else if (part.startsWith('*') && part.endsWith('*') && part.length > 2)
      tokens.push({ type: 'text', text: part.slice(1, -1), italic: true })
    else tokens.push({ type: 'text', text: part })
  }
  return tokens
}

/** Markup without formatting characters — what the reader actually sees. */
export function plainText(markup: Markup): string {
  return parseInline(markup)
    .map((t) => (t.type === 'text' ? t.text : '_____'))
    .join('')
}

/** Question numbers of every gap in a markup string, in order. */
export function gapNumbers(markup: Markup): number[] {
  return parseInline(markup).flatMap((t) => (t.type === 'gap' ? [t.n] : []))
}

export type LineKind = 'heading' | 'bullet' | 'subbullet' | 'text' | 'blank'

/** Classify a line of notes/form markup by its prefix. */
export function parseLine(line: Markup): { kind: LineKind; content: Markup } {
  if (line.trim() === '') return { kind: 'blank', content: '' }
  if (line.startsWith('# ')) return { kind: 'heading', content: line.slice(2) }
  if (line.startsWith('-- ')) return { kind: 'subbullet', content: line.slice(3) }
  if (line.startsWith('- ')) return { kind: 'bullet', content: line.slice(2) }
  return { kind: 'text', content: line }
}

// ─── Answer normalisation ───────────────────────────────────────────────────

/**
 * Normalise an answer for comparison: case, curly quotes, dash variants,
 * repeated spaces, trailing full stops and currency symbols are ignored.
 * Hyphens and spaces are treated alike ("part-time" = "part time").
 */
export function normalizeAnswer(raw: string): string {
  return raw
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[‐‑‒–—-]/g, ' ')
    .replace(/[£$€]/g, '')
    .replace(/^["'\s]+|["'\s]+$/g, '')
    .replace(/[.,;:!?]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Expand optional parts written in round brackets:
 * "(the) town hall" → ["the town hall", "town hall"].
 */
export function expandOptional(pattern: string): string[] {
  const match = /\(([^()]+)\)/.exec(pattern)
  if (!match) return [pattern.replace(/\s+/g, ' ').trim()]
  const before = pattern.slice(0, match.index)
  const after = pattern.slice(match.index + match[0].length)
  return [...expandOptional(before + match[1] + after), ...expandOptional(before + after)]
}

/** Phone numbers and codes: "07946 218530" = "07946218530". */
function digitsOnly(value: string): string | null {
  return /^[\d ]+$/.test(value) ? value.replace(/ /g, '') : null
}

export function matchesAccepted(answer: string, accepted: string[]): boolean {
  const given = normalizeAnswer(answer)
  if (!given) return false
  const givenDigits = digitsOnly(given)
  return accepted.some((pattern) =>
    expandOptional(pattern).some((variant) => {
      const expected = normalizeAnswer(variant)
      if (expected === given) return true
      return givenDigits !== null && givenDigits === digitsOnly(expected)
    }),
  )
}

// ─── Word counting ──────────────────────────────────────────────────────────

const NUMBER_TOKEN = /^[£$€]?\d[\d.,:/]*(st|nd|rd|th|s|am|pm|%)?$/i

/** Count words and numbers in a short answer, the way IELTS word limits do. */
export function countAnswerTokens(answer: string): { words: number; numbers: number } {
  const tokens = answer.trim().split(/\s+/).filter(Boolean)
  let words = 0
  let numbers = 0
  let previousWasNumber = false
  for (const token of tokens) {
    const isNumber = NUMBER_TOKEN.test(token)
    // Digit groups written with spaces ("07946 218530") are one number.
    if (isNumber && !previousWasNumber) numbers++
    if (!isNumber) words++
    previousWasNumber = isNumber
  }
  return { words, numbers }
}

export function exceedsWordLimit(answer: string, limit: WordLimit): boolean {
  const { words, numbers } = countAnswerTokens(answer)
  // "AND/OR A NUMBER" allows one number on top of the words.
  if (limit.number) return words > limit.words || numbers > 1
  return words + numbers > limit.words
}

/** Words in an essay: hyphenated words and numbers count once each. */
export function countWords(text: string): number {
  const matches = text.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu)
  return matches ? matches.length : 0
}

export function describeWordLimit(limit: WordLimit): string {
  const words = ['', 'ONE WORD', 'TWO WORDS', 'THREE WORDS', 'FOUR WORDS'][limit.words] ?? `${limit.words} WORDS`
  if (limit.words === 1 && !limit.number) return 'ONE WORD ONLY'
  return `NO MORE THAN ${words}${limit.number ? ' AND/OR A NUMBER' : ''}`
}
