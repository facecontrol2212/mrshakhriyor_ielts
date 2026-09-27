import type { Highlight } from '@/types/attempt'

let counter = 0
export function newHighlightId(): string {
  counter += 1
  return `h${Date.now().toString(36)}${counter}`
}

/** Add a highlighted range, merging it with any ranges it touches or overlaps. */
export function addHighlight(list: Highlight[], start: number, end: number, note?: string): Highlight[] {
  if (end <= start) return list
  let mergedStart = start
  let mergedEnd = end
  const notes: string[] = []
  const kept: Highlight[] = []
  for (const h of list) {
    if (h.end >= mergedStart && h.start <= mergedEnd) {
      mergedStart = Math.min(mergedStart, h.start)
      mergedEnd = Math.max(mergedEnd, h.end)
      if (h.note) notes.push(h.note)
    } else {
      kept.push(h)
    }
  }
  if (note) notes.push(note)
  const merged: Highlight = { id: newHighlightId(), start: mergedStart, end: mergedEnd }
  if (notes.length) merged.note = notes.join('\n')
  return [...kept, merged].sort((a, b) => a.start - b.start)
}

/** Remove highlighting from a range, splitting ranges that extend beyond it. */
export function removeHighlight(list: Highlight[], start: number, end: number): Highlight[] {
  const out: Highlight[] = []
  for (const h of list) {
    if (h.end <= start || h.start >= end) {
      out.push(h)
      continue
    }
    if (h.start < start) out.push({ ...h, id: newHighlightId(), end: start })
    if (h.end > end) out.push({ ...h, id: newHighlightId(), start: end })
  }
  return out.sort((a, b) => a.start - b.start)
}

export function overlapsHighlight(list: Highlight[], start: number, end: number): boolean {
  return list.some((h) => h.start < end && h.end > start)
}

export interface Span {
  start: number
  end: number
}

/**
 * Split [0, length) at every boundary of the given layers so each piece has a
 * uniform style — used to render highlights, notes and evidence together.
 */
export function segmentBoundaries(length: number, layers: Span[][]): Span[] {
  const cuts = new Set<number>([0, length])
  for (const layer of layers)
    for (const span of layer) {
      if (span.start > 0 && span.start < length) cuts.add(span.start)
      if (span.end > 0 && span.end < length) cuts.add(span.end)
    }
  const sorted = [...cuts].sort((a, b) => a - b)
  const pieces: Span[] = []
  for (let i = 0; i < sorted.length - 1; i++) pieces.push({ start: sorted[i], end: sorted[i + 1] })
  return pieces
}

/** Locate every occurrence of `needle` in `haystack` (case-insensitive). */
export function findSpans(haystack: string, needle: string): Span[] {
  const spans: Span[] = []
  if (!needle) return spans
  const h = haystack.toLowerCase()
  const n = needle.toLowerCase()
  let from = 0
  for (;;) {
    const index = h.indexOf(n, from)
    if (index === -1) break
    spans.push({ start: index, end: index + n.length })
    from = index + n.length
  }
  return spans
}
